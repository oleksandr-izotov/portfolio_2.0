import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoForPath, OG_IMAGE } from './seo';

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Keeps <title>, description, canonical and Open Graph tags in sync with the
 * current route on client-side navigation. The prerender script writes the same
 * values into the static HTML, so a crawler and a visitor always agree.
 */
export function useRouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = seoForPath(pathname);

    document.title = seo.title;
    setMeta('meta[name="description"]', 'name', 'description', seo.description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', seo.canonical);
    setMeta('meta[property="og:image"]', 'property', 'og:image', OG_IMAGE);
    setMeta('meta[property="twitter:title"]', 'property', 'twitter:title', seo.title);
    setMeta('meta[property="twitter:description"]', 'property', 'twitter:description', seo.description);
    setMeta('meta[property="twitter:url"]', 'property', 'twitter:url', seo.canonical);
    setMeta('meta[name="robots"]', 'name', 'robots', seo.indexable === false ? 'noindex, follow' : 'index, follow');

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = seo.canonical;
  }, [pathname]);
}
