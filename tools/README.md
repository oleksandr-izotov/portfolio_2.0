# Checks

Six scripts that verify the things the build itself cannot: that the
prerendered HTML actually hydrates, that metadata follows client-side
navigation, and that the contact relay rejects what it should.

They need a headless Chrome. If none is installed:

```bash
npx puppeteer browsers install chrome
export CHROME_PATH=$(ls -d ~/.cache/puppeteer/chrome/*/chrome-linux64/chrome | head -1)
npm install --no-save puppeteer-core
```

## check-hydration.mjs

Loads every route and reports React errors. A hydration mismatch means the
prerendered markup was thrown away and re-rendered from scratch — the page still
works, but the prerender bought nothing for the visitor.

```bash
npm run build
npx serve dist -l 4173      # NOT `serve -s`: the -s flag rewrites every path to
                            # index.html and would mask exactly what we test
node tools/check-hydration.mjs
```

Expected: `200` on all six routes, `404` on an unknown path, no console output
beyond that 404.

## check-navigation.mjs

Clicks through the site and prints `<title>`, description and canonical after
each step. Catches the case where two mechanisms fight over the document title.

```bash
node tools/check-navigation.mjs
```

## check-contact-api.mjs

Runs against a local instance of the relay with a deliberately invalid token —
anything that reaches Telegram comes back HTTP 500, which is how you tell
validation let a request through.

```bash
PORT=3999 TELEGRAM_BOT_TOKEN=000000:FAKE TELEGRAM_CHAT_ID=1 \
  node deploy/contact-api/server.js &
node tools/check-contact-api.mjs
```

Expected: honeypot → 200 with nothing sent, non-string fields → 400, fourth
request from one IP → 429, and a forged `X-Forwarded-For` **not** resetting the
limit.

## check-live.mjs

Loads the deployed site in a real browser and reports console errors, failed
requests and how much text each page actually rendered. Run it after a deploy —
it is the check that catches a Content-Security-Policy blocking something that
worked fine locally.

```bash
node tools/check-live.mjs
```

Expected: five routes, the last one 404, every page with real text content, and
no console output beyond that 404.

## check-pulse.mjs

Scrolls the System Pulse panel into view on the deployed site and prints what it
reports. The panel shows live figures, so this is how you confirm the endpoint
is reachable and no metric has fallen back to a dash.

```bash
node tools/check-pulse.mjs                    # against izotov.dev
SITE_URL=http://127.0.0.1:4173 node tools/check-pulse.mjs   # against a local build
```

Expected: `● Live`, four metrics with values, clean console. A dash means
`/api/status` did not answer; `○ Offline` means the relay is down.

## check-hero-video.mjs

Checks the hero backdrop video across three conditions: a desktop viewport
(should play), a phone viewport and `prefers-reduced-motion` (should not even be
requested). The still image must be present in all three.

```bash
node tools/check-hero-video.mjs
```

Expected: video plays only on desktop, one `.webm` request with status 206,
zero video requests in the other two, still image always there.
