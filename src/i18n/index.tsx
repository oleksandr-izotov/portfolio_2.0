import React, { createContext, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { translations } from './translations';
import { langFromPath, localizePath, stripLang, type Language } from './paths';

export type { Language } from './paths';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  /** Turns a language-neutral path like '/impressum' into the current language's URL. */
  localize: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // The URL decides the language, so the server and the first client render
  // always agree and hydration keeps the prerendered markup. Picking a version
  // from the browser's language happens before that, in public/lang-redirect.js.
  const lang = langFromPath(location.pathname);

  const setLang = (l: Language) => {
    try {
      localStorage.setItem('lang', l);
    } catch {
      // Language just won't persist across visits; not worth failing the click.
    }
    if (l === lang) return;
    navigate({ pathname: localizePath(stripLang(location.pathname), l), hash: location.hash });
  };

  const localize = (path: string) => localizePath(path, lang);

  const t = (key: string): string => {
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = translations[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    if (typeof value === 'string') return value;
    // fallback to English
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fallback: any = translations['en'];
    for (const k of keys) {
      fallback = fallback?.[k];
    }
    return typeof fallback === 'string' ? fallback : key;
  };

  // Update <html> lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, localize }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};
