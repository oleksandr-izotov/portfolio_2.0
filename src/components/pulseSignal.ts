// How the server's real figures map onto the System Pulse trace. Kept apart
// from the component so the panel's labels and the trace use the same numbers.

export function latencyColor(ms: number): string {
  return ms < 150 ? '#22c55e' : ms < 400 ? '#facc15' : '#f87171';
}

/** 58 bpm on an idle server, up to 140 under full load. */
export function bpmFromCpu(cpuLoadPct: number): number {
  return Math.round(Math.min(140, 58 + cpuLoadPct * 0.82));
}
