import React from 'react';

const TILE_W = 280;

// ECG tile: 280px wide, Y-center = 36 (in 72px SVG). Starts/ends at y=36 → tiles seamlessly.
const ECG_TILE =
  'M0,36 L44,36 L48,33 L51,40 L53,8 L55,62 L57,40 L60,36 ' +
  'L95,36 L99,28 L103,36 ' +
  'L138,36 L142,33 L145,40 L147,8 L149,62 L151,40 L154,36 ' +
  'L190,36 L194,28 L198,36 ' +
  'L240,36 L244,33 L247,40 L249,8 L251,62 L253,40 L256,36 ' +
  'L280,36';

const metrics = [
  { label: 'API_LATENCY', value: '12ms',  color: '#22c55e' },
  { label: 'BUILD_TIME',  value: '1.2s',  color: '#60a5fa' },
  { label: 'MEMORY',      value: '68%',   color: '#facc15' },
  { label: 'UPTIME',      value: '99.9%', color: '#4ade80' },
];

export const SystemPulse: React.FC = () => {
  return (
    <div className="border border-white/[0.08] rounded-2xl bg-white/[0.02] overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-zinc-500">
            System_Pulse
          </span>
        </div>
        <span
          className="text-[8px] font-mono uppercase tracking-widest text-red-400"
          style={{ animation: 'metric-blink 1.4s ease-in-out infinite' }}
        >
          ● Live
        </span>
      </div>

      {/* ECG Display — SVG pattern tiles infinitely, no clipping */}
      <div className="relative" style={{ height: '80px', background: 'rgba(0,0,0,0.25)' }}>
        <svg
          width="100%"
          height="80"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
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
            <span className="text-[7px] font-mono uppercase tracking-[0.25em] text-zinc-600">
              {label}
            </span>
            <span className="text-[12px] font-mono font-bold" style={{ color }}>
              {value}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};
