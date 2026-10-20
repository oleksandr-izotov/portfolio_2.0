// Language lives in the URL: English at the root, German under /de, Russian
// under /ru. Each language therefore has its own prerendered HTML that a
// crawler can index, instead of one English page that swaps text in the browser.

export type Language = 'en' | 'de' | 'ru';

export const LANGUAGES: Language[] = ['en', 'de', 'ru'];

const PREFIXED: Language[] = ['de', 'ru'];

export function langFromPath(pathname: string): Language {
  const first = pathname.split('/')[1];
  return PREFIXED.find(l => l === first) ?? 'en';
}

/** '/de/lms-case-study' → '/lms-case-study', '/ru' → '/'. */
export function stripLang(pathname: string): string {
  const lang = langFromPath(pathname);
  if (lang === 'en') return pathname || '/';
  return pathname.slice(lang.length + 1) || '/';
}

/** '/lms-case-study' + 'de' → '/de/lms-case-study', '/' + 'de' → '/de'. */
export function localizePath(path: string, lang: Language): string {
  if (lang === 'en') return path;
  return path === '/' ? `/${lang}` : `/${lang}${path}`;
}
