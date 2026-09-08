import React, { useEffect, useRef, useState } from 'react';

const TILE_W = 280;

// ECG tile: 280px wide, Y-center = 36 (in 72px SVG). Starts/ends at y=36 → tiles seamlessly.
const ECG_TILE =
  'M0,36 L44,36 L48,33 L51,40 L53,8 L55,62 L57,40 L60,36 ' +
  'L95,36 L99,28 L103,36 ' +
  'L138,36 L142,33 L145,40 L147,8 L149,62 L151,40 L154,36 ' +
  'L190,36 L194,28 L198,36 ' +
  'L240,36 L244,33 L247,40 L249,8 L251,62 L253,40 L256,36 ' +
  'L280,36';

interface ServerStatus {
  memoryUsedPct: number;
  cpuLoadPct: number;
  uptimeDays: number;
}

/** Build figures, written into the page by scripts/prerender.mjs. */
function readBuildInfo(): { durationMs: number; builtAt: string } | null {
  if (typeof document === 'undefined') return null;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="build-info"]');
  if (!meta?.content) return null;
  try {
    const parsed = JSON.parse(meta.content);
    if (typeof parsed?.durationMs === 'number') return parsed;
  } catch {
    // Malformed metadata is not worth breaking the panel over.
  }
  return null;
}

function formatUptime(days: number): string {
  if (days >= 1) return `${days.toFixed(1)}d`;
  const hours = days * 24;
  if (hours >= 1) return `${Math.round(hours)}h`;
  return `${Math.round(hours * 60)}m`;
}

export const SystemPulse: React.FC = () => {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // Read after mount, not during render: the prerendered HTML has no build
  // metadata to read, so pulling it in the first client render would disagree
  // with the server markup and make React throw the whole tree away.
  const [buildInfo, setBuildInfo] = useState<{ durationMs: number; builtAt: string } | null>(null);

  useEffect(() => {
    setBuildInfo(readBuildInfo());
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const poll = async () => {
      // Round-trip measured from the visitor's own browser — this is the
      // latency figure the panel reports, not a number from the server.
      const startedAt = performance.now();
      try {
        const res = await fetch('/api/status', { cache: 'no-store' });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as ServerStatus;
        if (cancelled) return;
        setLatencyMs(Math.round(performance.now() - startedAt));
        setStatus(data);
        setFailed(false);
      } catch {
        if (cancelled) return;
        // Show dashes rather than stale or invented values.
        setFailed(true);
        setStatus(null);
        setLatencyMs(null);
      }
    };

    // Only poll while the panel is actually on screen: it sits at the bottom of
    // a long page, and most visitors never scroll to it.
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries[0]?.isIntersecting;
        if (visible && !timer) {
          poll();
          timer = setInterval(poll, 10_000);
        } else if (!visible && timer) {
          clearInterval(timer);
          timer = null;
        }
      },
      { rootMargin: '120px' },
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      observer.disconnect();
    };
  }, []);

  const dash = '—';
  const metrics = [
    {
      label: 'API_LATENCY',
      value: latencyMs === null ? dash : `${latencyMs}ms`,
      color: latencyMs === null ? '#71717a' : latencyMs < 150 ? '#22c55e' : latencyMs < 400 ? '#facc15' : '#f87171',
    },
    {
      label: 'BUILD_TIME',
      value: buildInfo ? `${(buildInfo.durationMs / 1000).toFixed(1)}s` : dash,
      color: '#60a5fa',
    },
    {
      label: 'MEMORY',
      value: status ? `${status.memoryUsedPct}%` : dash,
      color: !status ? '#71717a' : status.memoryUsedPct < 70 ? '#4ade80' : status.memoryUsedPct < 90 ? '#facc15' : '#f87171',
    },
    {
      label: 'UPTIME',
      value: status ? formatUptime(status.uptimeDays) : dash,
      color: status ? '#4ade80' : '#71717a',
    },
  ];

  const live = status !== null && !failed;

  return (
    <div ref={containerRef} className="border border-white/[0.08] rounded-2xl bg-white/[0.02] overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-zinc-400">
            System_Pulse
          </span>
        </div>
        <span
          className={`text-[8px] font-mono uppercase tracking-widest ${live ? 'text-red-300' : 'text-zinc-500'}`}
          style={live ? { animation: 'metric-blink 1.4s ease-in-out infinite' } : undefined}
          aria-live="polite"
        >
          {live ? '● Live' : failed ? '○ Offline' : '○ Connecting'}
        </span>
      </div>

      {/* ECG Display — SVG pattern tiles infinitely, no clipping */}
      <div className="relative" style={{ height: '80px', background: 'rgba(0,0,0,0.25)' }}>
        <svg
          width="100%"
          height="80"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
          aria-hidden="true"
        >
          <defs>
            {/* Oscilloscope grid */}
            <pattern id="sp-grid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M40,0 L0,0 0,20" fill="none" stroke="rgba(59,130,246,0.07)" strokeWidth="0.5" />
            </pattern>

            {/* Glow layer — same animation, thick+transparent */}
            <pattern id="sp-glow" width={TILE_W} height="80" patternUnits="userSpaceOnUse">
              <animateTransform
                attributeName="patternTransform"
                type="translate"
                from={`0,0`}
                to={`-${TILE_W},0`}
                dur="5s"
                repeatCount="indefinite"
              />
              <path
                d={ECG_TILE}
                stroke="#3b82f6"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.18"
              />
            </pattern>

            {/* Main line */}
            <pattern id="sp-line" width={TILE_W} height="80" patternUnits="userSpaceOnUse">
              <animateTransform
                attributeName="patternTransform"
                type="translate"
                from={`0,0`}
                to={`-${TILE_W},0`}
                dur="5s"
                repeatCount="indefinite"
              />
              <path
                d={ECG_TILE}
                stroke="#60a5fa"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </pattern>
          </defs>

          {/* Grid background */}
          <rect width="100%" height="80" fill="url(#sp-grid)" />

          {/* Center baseline */}
          <line
            x1="0" y1="40" x2="100%" y2="40"
            stroke="rgba(59,130,246,0.1)"
            strokeWidth="0.5"
            strokeDasharray="3 5"
          />

          {/* ECG glow */}
          <rect width="100%" height="80" fill="url(#sp-glow)" />

          {/* ECG line */}
          <rect width="100%" height="80" fill="url(#sp-line)" />
        </svg>

        {/* Edge fades so line appears/disappears smoothly */}
        <div
          className="absolute inset-y-0 left-0 w-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(10,10,12,0.9), transparent)' }}
        />
        <div
          className="absolute inset-y-0 right-0 w-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, rgba(10,10,12,0.9), transparent)' }}
        />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 border-t border-white/[0.05]">
        {metrics.map(({ label, value, color }, i) => (
          <div
            key={label}
            className={`flex flex-col gap-1 px-4 py-3 ${i < 3 ? 'border-r border-white/[0.05]' : ''}`}
          >
            <span className="text-[7px] font-mono uppercase tracking-[0.25em] text-zinc-400">
              {label}
            </span>
            <span className="text-[12px] font-mono font-bold tabular-nums" style={{ color }}>
              {value}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};
