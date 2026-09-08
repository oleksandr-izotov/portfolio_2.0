import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';
import { translations } from './translations';

export type Language = 'en' | 'de' | 'ru';

const SUPPORTED: Language[] = ['en', 'de', 'ru'];

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// The prerendered HTML is always English, so the first client render must be
// English too — otherwise hydration mismatches and React throws the markup away.
// The real language is picked in a layout effect, which runs before paint.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function detectLanguage(): Language {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem('lang');
  } catch {
    // Storage can be unavailable (private mode, blocked cookies) — fall through.
  }
  if (saved && SUPPORTED.includes(saved as Language)) return saved as Language;

  const browser = (navigator.language || 'en').toLowerCase();
  if (browser.startsWith('ru') || browser.startsWith('uk')) return 'ru';
  if (browser.startsWith('de')) return 'de';
  return 'en';
}

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>('en');

  useIsomorphicLayoutEffect(() => {
    const detected = detectLanguage();
    if (detected !== 'en') setLangState(detected);
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    try {
      localStorage.setItem('lang', l);
    } catch {
      // Language just won't persist across visits; not worth failing the click.
    }
  };

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
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};
