import React, { createContext, useContext, useEffect, useState } from "react";
import { ar } from "@/i18n/ar";
import { en } from "@/i18n/en";

export type Language = "en" | "ar";

const STORAGE_KEY = "medpath-language";

const DICTIONARIES = { en, ar } as const;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  isRTL: boolean;
  /**
   * Look up a translated string by dotted key.
   *
   * Falls back to English when Arabic is missing rather than rendering the key
   * itself, because a doctor reading a screen of `dashboard.title` learns
   * nothing, while an English sentence at least still says something true.
   */
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

function lookup(dict: unknown, key: string): string | undefined {
  const value = key
    .split(".")
    .reduce<unknown>(
      (node, part) =>
        node && typeof node === "object"
          ? (node as Record<string, unknown>)[part]
          : undefined,
      dict
    );
  return typeof value === "string" ? value : undefined;
}

function readStored(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ar" || stored === "en") return stored;
  } catch {
    // Private browsing can make localStorage throw on read.
  }
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readStored);
  const isRTL = language === "ar";

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = isRTL ? "rtl" : "ltr";
    // Lets stylesheets target the language without reading the context.
    root.classList.toggle("lang-ar", isRTL);
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Not being able to remember the choice is survivable; failing is not.
    }
  }, [language, isRTL]);

  const setLanguage = (next: Language) => setLanguageState(next);

  const t = (key: string, vars?: Record<string, string | number>) => {
    const text =
      lookup(DICTIONARIES[language], key) ?? lookup(DICTIONARIES.en, key) ?? key;

    if (import.meta.env.DEV && !lookup(DICTIONARIES[language], key)) {
      console.warn(`[i18n] Missing ${language} translation: ${key}`);
    }

    if (!vars) return text;
    return Object.entries(vars).reduce(
      (out, [name, value]) => out.replaceAll(`{${name}}`, String(value)),
      text
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside a LanguageProvider");
  }
  return context;
}

/** Shorthand for components that only need the translate function. */
export function useT() {
  return useLanguage().t;
}
