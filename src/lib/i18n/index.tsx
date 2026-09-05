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
import cs from "./messages/cs";
import da from "./messages/da";
import de from "./messages/de";
import es from "./messages/es";
import fi from "./messages/fi";
import fr from "./messages/fr";
import he from "./messages/he";
import hu from "./messages/hu";
import it from "./messages/it";
import pl from "./messages/pl";
import ru from "./messages/ru";
import uk from "./messages/uk";
import zh from "./messages/zh";

/*
 * All fourteen catalogues are bundled rather than fetched per locale: they
 * are short UI strings, about 3 KB gzipped for the whole set, which is less
 * than one round trip would cost — and switching language stays instant.
 */
const CATALOGUES: Record<Locale, Partial<Messages>> = {
  en,
  pl,
  fr,
  ru,
  de,
  cs,
  uk,
  fi,
  it,
  es,
  da,
  hu,
  zh,
  he,
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

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY);
    setLocaleState(isLocale(stored) ? stored : detectLocale(navigator.languages ?? []));
  }, []);

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
      const template = CATALOGUES[locale][key] ?? en[key];
      if (!vars) return template;
      return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
        name in vars ? String(vars[name]) : whole,
      );
    },
    [locale],
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
