import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';

/**
 * Build-time entry point. `scripts/prerender.mjs` calls this once per route and
 * writes the result into the static HTML shell, so crawlers and link previews
 * get real content instead of an empty <div id="root">.
 */
export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
}

// Re-exported so the prerender script gets the route table from the same
// compiled bundle instead of parsing TypeScript on its own.
export { routes, SITE_URL, OG_IMAGE } from './seo';
