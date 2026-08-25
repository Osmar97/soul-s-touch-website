import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { en, type Dictionary } from "./en";
import { pt } from "./pt";
import { es } from "./es";

export const LANGUAGES = ["en", "pt", "es"] as const;
export type Language = (typeof LANGUAGES)[number];

export const DICTIONARIES: Record<Language, Dictionary> = { en, pt, es };

const STORAGE_KEY = "st-lang";

function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && (LANGUAGES as readonly string[]).includes(value);
}

type I18nValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dictionary;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Always start at "en" so SSR and hydration match; a stored/browser
  // preference is applied after mount.
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) {
      setLangState(stored);
      return;
    }
    const browser = window.navigator.language.slice(0, 2);
    if (isLanguage(browser)) setLangState(browser);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — language still applies for this visit */
    }
  }, []);

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, t: DICTIONARIES[lang] ?? en }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

/** Shorthand for the active dictionary: const t = useT(); t.nav.about */
export function useT(): Dictionary {
  return useI18n().t;
}

export type { Dictionary };
