// Prerenders every route into a static HTML file.
//
// Without this, izotov.dev ships an empty <div id="root"> and anything that
// does not run JavaScript — link previews in Telegram, Slack, WhatsApp and
// LinkedIn, and the first pass of most crawlers — sees a blank page carrying
// the home page's title on every URL.
//
// Run order (see package.json): vite build → vite build --ssr → this script.
// The client bundle's index.html is the shell; the SSR bundle renders the
// markup; per-route metadata comes from src/seo.ts so the crawler and the
// visitor are never told two different things.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = join(root, 'dist');
// Vite names the SSR entry .mjs or .js depending on the package type.
const ssrEntry = ['entry-server.mjs', 'entry-server.js']
  .map(name => join(root, 'dist-ssr', name))
  .find(existsSync);

if (!existsSync(join(distDir, 'index.html'))) {
  console.error('prerender: dist/index.html missing — run `vite build` first.');
  process.exit(1);
}
if (!ssrEntry) {
  console.error('prerender: dist-ssr/entry-server.[mjs|js] missing — run `vite build --ssr` first.');
  process.exit(1);
}

const { render, routes, SITE_URL, OG_IMAGE } = await import(pathToFileURL(ssrEntry).href);

let shell = readFileSync(join(distDir, 'index.html'), 'utf8');

// Real build figures for the System Pulse panel. A <meta> tag rather than an
// inline <script>: the site's CSP is script-src 'self', which blocks inline
// script. Absent (a plain `vite build` without scripts/build.mjs), the panel
// shows a dash instead of inventing a number.
const buildDurationMs = Number(process.env.BUILD_DURATION_MS) || null;
const builtAt = process.env.BUILT_AT || new Date().toISOString();
if (buildDurationMs) {
  const info = escapeAttr(JSON.stringify({ durationMs: buildDurationMs, builtAt }));
  shell = shell.replace('</head>', `    <meta name="build-info" content="${info}" />\n  </head>`);
}

/** Replace the content of a meta tag, matching on its name/property. */
function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`, 'i');
  if (re.test(html)) return html.replace(re, `$1${escapeAttr(value)}$2`);
  // Not present in the shell — append it just before </head>.
  return html.replace('</head>', `    <meta ${attr}="${key}" content="${escapeAttr(value)}" />\n  </head>`);
}

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function applySeo(html, seo) {
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttr(seo.title)}</title>`);
  html = setMeta(html, 'name', 'description', seo.description);
  html = setMeta(html, 'name', 'robots', seo.indexable === false ? 'noindex, follow' : 'index, follow');
  html = setMeta(html, 'property', 'og:title', seo.title);
  html = setMeta(html, 'property', 'og:description', seo.description);
  html = setMeta(html, 'property', 'og:url', seo.canonical);
  html = setMeta(html, 'property', 'og:image', OG_IMAGE);
  html = setMeta(html, 'property', 'twitter:title', seo.title);
  html = setMeta(html, 'property', 'twitter:description', seo.description);
  html = setMeta(html, 'property', 'twitter:url', seo.canonical);
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/i,
    `<link rel="canonical" href="${escapeAttr(seo.canonical)}" />`,
  );

  if (seo.jsonLd?.length) {
    const blocks = seo.jsonLd
      .map(obj => `    <script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n    </script>`)
      .join('\n');
    html = html.replace('</head>', `${blocks}\n  </head>`);
  }
  return html;
}

function outPathFor(routePath) {
  if (routePath === '/') return join(distDir, 'index.html');
  return join(distDir, routePath.replace(/^\//, ''), 'index.html');
}

let failures = 0;
for (const seo of routes) {
  const markup = await render(seo.path);

  // A route that rendered nothing but the Suspense fallback would ship a blank
  // page to crawlers — louder to fail the build than to deploy it.
  if (markup.length < 500) {
    console.error(`prerender: ${seo.path} produced only ${markup.length} bytes of markup`);
    failures++;
    continue;
  }

  const html = applySeo(shell, seo).replace(
    '<div id="root"></div>',
    `<div id="root">${markup}</div>`,
  );

  const out = outPathFor(seo.path);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html, 'utf8');
  console.log(`prerender: ${seo.path.padEnd(22)} → ${out.replace(root + '/', '')} (${Math.round(html.length / 1024)} kB)`);
}

// nginx serves this for unknown paths with a real 404 status.
const notFound = readFileSync(join(distDir, '404', 'index.html'), 'utf8');
writeFileSync(join(distDir, '404.html'), notFound, 'utf8');

// Sitemap: generated from the same table, so a new route can never be forgotten.
const today = new Date().toISOString().slice(0, 10);
const priority = p => (p === '/' ? '1.0' : p.includes('case-study') ? '0.8' : '0.5');
const urls = routes
  .filter(r => r.indexable !== false)
  .map(r => `  <url>\n    <loc>${r.canonical}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority(r.path)}</priority>\n  </url>`)
  .join('\n');
writeFileSync(
  join(distDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  'utf8',
);
console.log(`prerender: sitemap.xml with ${routes.filter(r => r.indexable !== false).length} URLs (lastmod ${today})`);

if (failures) {
  console.error(`prerender: ${failures} route(s) failed`);
  process.exit(1);
}
