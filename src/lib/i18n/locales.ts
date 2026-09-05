/**
 * The languages the editor speaks, in the order their flags appear in the
 * top bar. Codes are the usual ISO 639-1 ones; `flag` is the country whose
 * flag stands for that language in the picker (a language and a country are
 * not the same thing, but a flag is what reads fastest at 18 pixels).
 */

export const LOCALES = [
  { code: "en", flag: "gb", name: "English" },
  { code: "pl", flag: "pl", name: "polski" },
  { code: "fr", flag: "fr", name: "français" },
  { code: "ru", flag: "ru", name: "русский" },
  { code: "de", flag: "de", name: "deutsch" },
  { code: "cs", flag: "cz", name: "čeština" },
  { code: "uk", flag: "ua", name: "українська" },
  { code: "fi", flag: "fi", name: "suomi" },
  { code: "it", flag: "it", name: "italiano" },
  { code: "es", flag: "es", name: "español" },
  { code: "da", flag: "dk", name: "dansk" },
  { code: "hu", flag: "hu", name: "magyar" },
  { code: "zh", flag: "cn", name: "中文" },
  { code: "he", flag: "il", name: "עברית" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];

/** Hebrew is the only one here that reads right to left. */
export const RTL_LOCALES: Locale[] = ["he"];

export function isLocale(value: unknown): value is Locale {
  return LOCALES.some((locale) => locale.code === value);
}

/** Picks the best match for the browser's own language list, so a first
 * visit lands on something readable without touching the picker. */
export function detectLocale(languages: readonly string[]): Locale {
  for (const tag of languages) {
    const base = tag.toLowerCase().split("-")[0];
    if (isLocale(base)) return base;
  }
  return "en";
}
