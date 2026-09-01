"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translations, type Locale, type Translations } from "@/lib/translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "nb-locale";

/**
 * Language switching is turned off for now — the site stays in Bangla.
 * Flip this to `true` to bring the toggle back (also un-comment
 * <LanguageToggle /> in components/layout/Header.tsx).
 */
export const LANGUAGE_SWITCHING_ENABLED = false;

const DEFAULT_LOCALE: Locale = "bn";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    if (!LANGUAGE_SWITCHING_ENABLED) return;
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "bn" || stored === "en") {
      setLocaleState(stored);
    }
  }, []);

  function setLocale(next: Locale) {
    if (!LANGUAGE_SWITCHING_ENABLED) return;
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    // Update <html lang> attribute live
    document.documentElement.lang = next === "bn" ? "bn" : "en";
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
