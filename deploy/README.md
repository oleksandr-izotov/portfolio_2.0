# izotov.dev deploy

Static SPA hosted on the cp-binom VPS (95.174.92.126) behind Cloudflare proxy.

## Files
- `nginx-host/izotov.dev.bootstrap.conf` — HTTP-only, used once to obtain the cert
- `nginx-host/izotov.dev.conf` — final config with HTTPS, security headers, asset caching
- `deploy-static.sh` — builds and rsyncs `dist/` to the server (atomic swap)
- `deploy-nginx.sh [bootstrap|final]` — syncs the nginx config and reloads
- `issue-cert.sh` — runs certbot on the server to get the Let's Encrypt cert

## First-time setup

The order matters because the cert needs the domain to point at the server,
but Cloudflare proxy must be OFF until the cert is issued (otherwise LE's
HTTP-01 challenge gets intercepted by CF).

```bash
# 1. Push static files + bootstrap nginx config (HTTP-only).
./deploy/deploy-static.sh
./deploy/deploy-nginx.sh bootstrap

# 2. In Cloudflare DNS for izotov.dev:
#      - Delete the existing CNAME pointing to vercel
#      - Add A record:  izotov.dev   →  95.174.92.126   (Proxy: DNS only, GREY cloud)
#      - Add A record:  www          →  95.174.92.126   (Proxy: DNS only, GREY cloud)
#    Wait ~30s for propagation, verify:  dig +short izotov.dev @1.1.1.1

# 3. Issue the cert.
./deploy/issue-cert.sh

# 4. Replace bootstrap with the final HTTPS config.
./deploy/deploy-nginx.sh

# 5. In Cloudflare:
#      - Flip both A records to Proxied (ORANGE cloud)
#      - SSL/TLS → Overview → set encryption mode to "Full (strict)"
#      - SSL/TLS → Edge Certificates → Always Use HTTPS = On
#      - Caching → Configuration → Browser Cache TTL = "Respect Existing Headers"
#      - Speed → Optimization → Brotli = On (free)

# 6. Smoke test from a phone on RU mobile network or a Russian IP.
```

## Contact form backend

The contact form (`POST /api/contact`) is served by a tiny zero-dependency
Node container (`deploy/contact-api/`) that relays submissions to Telegram.
It listens on `127.0.0.1:3002`; nginx reverse-proxies `/api/contact` to it
(see the `location = /api/contact` block in `nginx-host/izotov.dev.conf`).

Secrets live in `deploy/contact-api/.env` (gitignored — NOT committed):

```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
PORT=3002
```

Build + (re)deploy the container:

```bash
./deploy/deploy-contact-api.sh        # builds image, restarts container, smoke-tests /healthz
```

If you change the nginx proxy block, re-run `./deploy/deploy-nginx.sh`.

## Subsequent deploys

Just push new static files. Nginx config rarely changes.

```bash
./deploy/deploy-static.sh
```

After deploy, Cloudflare's edge cache still serves the old `index.html` for ~30
seconds (it respects `no-cache` on the file but takes a moment to re-validate).
For an immediate refresh: Cloudflare → Caching → Purge Cache → Custom Purge →
purge `https://izotov.dev/index.html`.

Hashed assets under `/assets/*` are content-addressed, so old/new can coexist
during the cutover — no purge needed for them.

## Vercel decommission

Once the site is verified working through CF + the VPS:
1. Remove the production domain from the Vercel project
2. Either delete the Vercel project or keep it as a deploy-preview backup

The package.json still has `@vercel/analytics` and `@vercel/speed-insights` —
they will keep sending beacons to Vercel even off-platform. Either:
- Remove them from `src/` imports and `package.json` (recommended)
- Or replace with a self-hosted alternative (Plausible, Umami)
