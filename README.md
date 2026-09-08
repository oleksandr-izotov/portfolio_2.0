# Portfolio 2.0 — Oleksandr Izotov

The source of [izotov.dev](https://izotov.dev): a dark, blueprint-styled
portfolio with three engineering case studies, a contact form that relays to
Telegram, and German-law imprint and privacy pages.

## Stack

- **Core**: React 18, TypeScript, Vite 6
- **Styling**: Tailwind CSS v4, Motion (Framer Motion)
- **Icons**: Lucide React
- **Rendering**: prerendered at build time — one static HTML file per route
- **Hosting**: nginx on a VPS behind Cloudflare, contact relay in Docker

## How the rendering works

The site is a React SPA that is **prerendered into static HTML at build time**.
`npm run build` runs three steps:

1. `vite build` — the client bundle and the HTML shell.
2. `vite build --ssr src/entry-server.tsx` — the same app compiled for Node.
3. `node scripts/prerender.mjs` — renders every route from `src/seo.ts` and
   writes `dist/<route>/index.html`, each with its own title, description,
   canonical URL and JSON-LD, then regenerates `sitemap.xml`.

Two consequences worth knowing before changing anything:

- **A new route has to be added in two places**: the `<Route>` in `App.tsx` *and*
  the entry in `src/seo.ts`. A route missing from `seo.ts` is never prerendered,
  and nginx answers it with a real 404 instead of quietly serving the home page.
- **Route components are imported eagerly, not with `React.lazy`.** With
  prerendered markup a lazy route hydrates as its Suspense fallback, React finds
  a mismatch and throws the server markup away — which defeats the point. See the
  comment in `App.tsx`.

`npm run build:spa` skips the prerender and produces the plain SPA build.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build + prerender into dist/
npm run lint
```

## Checks

`tools/` holds three scripts that verify hydration, per-route metadata and the
contact relay's validation. See [tools/README.md](tools/README.md) — run them
after touching routing, SEO metadata or the contact form.

## Deployment

Everything lives in `deploy/`, and the scripts take the SSH target from the
environment so they work both from a workstation and from a server with a host
alias:

```bash
# static site: build, upload dist/, atomic swap (keeps the previous build)
./deploy/deploy-static.sh

# nginx vhost + security-headers snippet, validated with nginx -t before reload
./deploy/deploy-nginx.sh

# contact-form relay container
./deploy/deploy-contact-api.sh

# override the target if the default host alias does not apply
IZOTOV_SSH_TARGET=user@host IZOTOV_SSH_KEY=~/.ssh/id_rsa ./deploy/deploy-static.sh
```

`deploy/nginx-host/izotov.dev.security-headers.conf` is included by **every**
location block in the vhost. That repetition is deliberate: nginx drops inherited
`add_header` directives in any block that adds one of its own, so headers written
once at server level silently never ship.

The contact relay needs `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in
`deploy/contact-api/.env` — untracked, and it must stay that way.

See [deploy/README.md](deploy/README.md) for the first-run flow, including the
certbot bootstrap.
