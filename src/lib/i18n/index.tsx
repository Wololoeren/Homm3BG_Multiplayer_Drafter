"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { detectLocale, isLocale, RTL_LOCALES, type Locale } from "./locales";
import en, { type MessageKey, type Messages } from "./messages/en";

/*
 * English is bundled; the other thirteen are fetched when somebody picks one.
 *
 * They used to be bundled too, on the grounds that empty stubs cost nothing.
 * Translated, the set runs to tens of kilobytes, which is a lot for a page
 * that is usually one laptop on a kitchen table to pay for twelve languages
 * nobody in the room reads — the same reasoning that keeps Trystero and the
 * QR generator behind a dynamic import.
 *
 * Thunks rather than a template literal, so the bundler can see exactly which
 * files exist and give each one its own chunk.
 */
type Catalogue = { default: Partial<Messages> };

const LOADERS: Record<Exclude<Locale, "en">, () => Promise<Catalogue>> = {
  pl: () => import("./messages/pl"),
  fr: () => import("./messages/fr"),
  ru: () => import("./messages/ru"),
  de: () => import("./messages/de"),
  cs: () => import("./messages/cs"),
  uk: () => import("./messages/uk"),
  fi: () => import("./messages/fi"),
  it: () => import("./messages/it"),
  es: () => import("./messages/es"),
  da: () => import("./messages/da"),
  hu: () => import("./messages/hu"),
  zh: () => import("./messages/zh"),
  he: () => import("./messages/he"),
};

const KEY = "homm3bg-drafter.locale";

export type Translate = (key: MessageKey, vars?: Record<string, string | number>) => string;

interface I18n {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translate;
}

const I18nContext = createContext<I18n>({
  locale: "en",
  setLocale: () => {},
  t: (key) => en[key],
});

export function I18nProvider({ children }: { children: ReactNode }) {
  // Server and first client render both use English; the stored or detected
  // choice lands in an effect so the two markups match.
  const [locale, setLocaleState] = useState<Locale>("en");
  const [messages, setMessages] = useState<Partial<Messages>>(en);

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY);
    setLocaleState(isLocale(stored) ? stored : detectLocale(navigator.languages ?? []));
  }, []);

  // Fetch the chosen catalogue, and show English until it lands. English
  // rather than the language we were showing a moment ago: a key with no
  // translation already falls back to English, so that is what a reader of
  // this page expects to see standing in for a string that is not there yet.
  useEffect(() => {
    if (locale === "en") {
      setMessages(en);
      return;
    }
    let live = true;
    setMessages(en);
    void LOADERS[locale]()
      .then((module) => {
        if (live) setMessages(module.default);
      })
      .catch(() => {
        // Offline, or a chunk that did not ship. English is already up.
      });
    return () => {
      live = false;
    };
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // Private browsing — the choice just won't outlive the tab.
    }
  }, []);

  const t = useCallback<Translate>(
    (key, vars) => {
      const template = messages[key] ?? en[key];
      if (!vars) return template;
      return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
        name in vars ? String(vars[name]) : whole,
      );
    },
    [messages],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  return useContext(I18nContext);
}

/** Shorthand for the common case of needing only the translate function. */
export function useT(): Translate {
  return useContext(I18nContext).t;
}
