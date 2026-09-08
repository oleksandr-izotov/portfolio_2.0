// Runs the three build steps and times them.
//
// The System Pulse panel on the site reports the real build duration, so it has
// to come from an actual build rather than a constant someone typed once. The
// measured total is handed to the prerender step, which writes it into every
// page as a <meta> tag — an inline <script> would be blocked by the site's
// Content-Security-Policy.

import { spawnSync } from 'node:child_process';

const steps = [
  ['npx', ['vite', 'build']],
  ['npx', ['vite', 'build', '--ssr', 'src/entry-server.tsx', '--outDir', 'dist-ssr']],
];

const startedAt = Date.now();

for (const [cmd, args] of steps) {
  const result = spawnSync(cmd, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`build: "${cmd} ${args.join(' ')}" failed`);
    process.exit(result.status ?? 1);
  }
}

// Compilation only — the prerender pass that follows is bookkeeping, and timing
// it as "build time" would inflate a number the site presents as a fact.
const buildDurationMs = Date.now() - startedAt;

const prerender = spawnSync('node', ['scripts/prerender.mjs'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    BUILD_DURATION_MS: String(buildDurationMs),
    BUILT_AT: new Date().toISOString(),
  },
});

if (prerender.status !== 0) process.exit(prerender.status ?? 1);

console.log(`build: compiled in ${(buildDurationMs / 1000).toFixed(2)}s`);
