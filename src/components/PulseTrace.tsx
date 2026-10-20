import React, { useEffect, useRef } from 'react';
import { bpmFromCpu, latencyColor } from './pulseSignal';

export type PulseState = 'connecting' | 'live' | 'offline';

interface PulseTraceProps {
  state: PulseState;
  latencyMs: number | null;
  cpuLoadPct: number | null;
  /** Goes up by one on every successful /api/status response. */
  pingSeq: number;
  /** False while the panel is off screen — the animation stops. */
  active: boolean;
}

// A patient-monitor trace driven by the real server, not a looped drawing:
// the heart rate follows the server's CPU load, the height of each beat
// follows the round-trip latency measured from this browser, and every real
// response lands on the trace as an extra beat with its latency printed above.

const HEIGHT = 80;
const SPEED = 110;       // px per second the write head moves
const GAP = 26;          // px of erased trace in front of the head
const BASELINE = 0.6;    // baseline as a fraction of the height, leaves room for the R wave

const TRACE = { live: '#60a5fa', offline: '#f87171', connecting: '#71717a' } as const;

/** Tall, sharp beats on a fast connection; flatter ones as latency grows. */
function amplitudeFromLatency(ms: number): number {
  const t = Math.min(1, Math.max(0, Math.log10(ms / 40) / Math.log10(15))); // 40 ms → 1, 600 ms → 0
  return 1 - t * 0.55;
}

const gauss = (x: number, mu: number, sigma: number) => Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma));

/** One PQRST complex, `tau` seconds after the beat started. Roughly 0..1, R peak at amp. */
function beat(tau: number, amp: number): number {
  if (tau < 0 || tau > 0.6) return 0;
  return (
    0.07 * gauss(tau, 0.05, 0.022) -      // P
    0.09 * gauss(tau, 0.125, 0.007) +     // Q
    amp * gauss(tau, 0.145, 0.008) -      // R
    0.2 * amp * gauss(tau, 0.165, 0.009) + // S
    0.13 * gauss(tau, 0.34, 0.04)         // T
  );
}

interface Marker {
  x: number;
  writtenAt: number;
  label: string;
  color: string;
}

export const PulseTrace: React.FC<PulseTraceProps> = ({ state, latencyMs, cpuLoadPct, pingSeq, active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The loop reads the latest signal through a ref, so new data never restarts it.
  const signal = useRef({ state, latencyMs, cpuLoadPct });
  const pendingPing = useRef<number | null>(null);
  // Set while reduced motion is on: redraws the still trace when the data changes.
  const redrawStill = useRef<(() => void) | null>(null);

  useEffect(() => {
    signal.current = { state, latencyMs, cpuLoadPct };
    redrawStill.current?.();
  }, [state, latencyMs, cpuLoadPct]);

  useEffect(() => {
    if (pingSeq > 0 && latencyMs !== null) pendingPing.current = latencyMs;
    // Only a new response counts as a ping, not a re-render with the old figure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pingSeq]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let ys = new Float32Array(0);       // trace value per pixel column, NaN = erased
    let writtenAt = new Float32Array(0); // simulation time each column was written
    let markers: Marker[] = [];
    let head = 0;
    let simTime = 0;
    let lastBeatAt = -10;
    let nextBeatAt = 0.3;
    let beatAmp = 0.8;
    let raf = 0;
    let lastFrame = 0;
    let carry = 0; // fraction of a pixel column the head still owes

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.round(canvas.clientWidth));
      if (w === width) return;
      width = w;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(HEIGHT * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ys = new Float32Array(w).fill(NaN);
      writtenAt = new Float32Array(w);
      markers = [];
      head = 0;
    };

    /** Value of the trace at simulation time t; also schedules beats. */
    const sample = (t: number): number => {
      const { state: s, latencyMs: lat, cpuLoadPct: cpu } = signal.current;
      const noise = (Math.random() - 0.5) * (s === 'live' ? 0.012 : 0.02);
      if (s !== 'live') return noise;

      if (t >= nextBeatAt) {
        lastBeatAt = t;
        beatAmp = amplitudeFromLatency(lat ?? 200);
        nextBeatAt = t + 60 / bpmFromCpu(cpu ?? 0);
      }
      return beat(t - lastBeatAt, beatAmp) + noise;
    };

    /** Writes one pixel column at the head and moves it on. */
    const writeColumn = (t: number) => {
      const x = head;
      ys[x] = sample(t);
      writtenAt[x] = t;
      for (let i = 1; i <= GAP; i++) ys[(x + i) % width] = NaN;
      // A marker goes once the erase gap in front of the head reaches it.
      markers = markers.filter(m => {
        const ahead = (m.x - x + width) % width;
        return ahead === 0 || ahead > GAP;
      });
      head = (head + 1) % width;
    };

    const takePing = (t: number) => {
      const ms = pendingPing.current;
      if (ms === null) return;
      pendingPing.current = null;
      if (signal.current.state !== 'live') return;
      // The response itself becomes a beat, unless one is already in progress.
      if (t - lastBeatAt > 0.4) {
        lastBeatAt = t;
        beatAmp = amplitudeFromLatency(ms);
        nextBeatAt = t + 60 / bpmFromCpu(signal.current.cpuLoadPct ?? 0);
      }
      markers.push({ x: head, writtenAt: t, label: `${ms}ms`, color: latencyColor(ms) });
    };

    const yOf = (v: number) => HEIGHT * BASELINE - v * HEIGHT * 0.5;

    const draw = (showHead: boolean) => {
      ctx.clearRect(0, 0, width, HEIGHT);

      // Oscilloscope grid.
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(59,130,246,0.08)';
      ctx.beginPath();
      for (let x = 0.5; x < width; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, HEIGHT); }
      for (let y = 0.5; y < HEIGHT; y += 20) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
      ctx.stroke();

      const color = TRACE[signal.current.state];
      const sweep = width / SPEED; // seconds for the head to come round again

      // The trace fades with age, like phosphor: drawn in short chunks, each
      // with the opacity of its age, glow pass first, sharp line on top.
      for (const pass of [{ w: 6, a: 0.14 }, { w: 1.6, a: 1 }]) {
        ctx.lineWidth = pass.w;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        for (let start = 0; start < width; start += 6) {
          const end = Math.min(width - 1, start + 6);
          let open = false;
          ctx.beginPath();
          for (let x = start; x <= end; x++) {
            const v = ys[x];
            if (Number.isNaN(v)) { open = false; continue; }
            if (open) ctx.lineTo(x, yOf(v)); else { ctx.moveTo(x, yOf(v)); open = true; }
          }
          const age = simTime - writtenAt[start];
          ctx.globalAlpha = pass.a * Math.max(0.12, 1 - (age / sweep) * 0.85);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // A tick and the latency for every real response.
      ctx.font = '600 8px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textBaseline = 'top';
      for (const m of markers) {
        const fade = Math.max(0, 1 - (simTime - m.writtenAt) / sweep);
        ctx.globalAlpha = 0.25 + 0.75 * fade;
        ctx.fillStyle = m.color;
        ctx.fillRect(m.x, HEIGHT - 8, 1, 8);
        ctx.fillText(m.label, Math.min(m.x + 4, width - 30), 6);
      }
      ctx.globalAlpha = 1;

      if (showHead) {
        const x = (head - 1 + width) % width;
        const v = ys[x];
        if (!Number.isNaN(v)) {
          const y = yOf(v);
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 12);
          glow.addColorStop(0, color);
          glow.addColorStop(1, 'transparent');
          ctx.globalAlpha = 0.45;
          ctx.fillStyle = glow;
          ctx.fillRect(x - 12, y - 12, 24, 24);
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#e0f2fe';
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const frame = (now: number) => {
      // Clamped so a backgrounded tab does not come back and draw a whole sweep at once.
      const dt = Math.min(0.05, lastFrame ? (now - lastFrame) / 1000 : 0);
      lastFrame = now;
      carry += dt * SPEED;
      const n = Math.floor(carry);
      carry -= n;
      takePing(simTime);
      for (let i = 0; i < n; i++) writeColumn(simTime + (dt * i) / n);
      simTime += dt;
      draw(true);
      raf = requestAnimationFrame(frame);
    };

    /** Reduced motion: one full, still sweep of the current signal, no head. */
    const drawStill = () => {
      ys.fill(NaN);
      markers = [];
      head = 0;
      for (let x = 0; x < width - GAP; x++) writeColumn(simTime + x / SPEED);
      simTime += width / SPEED;
      draw(false);
    };

    resize();
    if (reducedMotion) redrawStill.current = drawStill;
    const ro = new ResizeObserver(() => { resize(); if (reducedMotion) drawStill(); });
    ro.observe(canvas);

    const start = () => {
      if (reducedMotion) { drawStill(); return; }
      if (raf || document.hidden) return;
      lastFrame = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    if (active) start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      redrawStill.current = null;
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: `${HEIGHT}px` }}
    />
  );
};
