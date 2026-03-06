import * as React from "react";

export type Locale = "pt" | "en";
export type LocalePreference = "auto" | Locale;

type I18nContextValue = {
  locale: Locale;
  preference: LocalePreference;
  setPreference: (next: LocalePreference) => void;
  /** Quick inline translator: always pass both strings. */
  tt: (pt: string, en: string) => string;
};

const I18nContext = React.createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "lovable_locale";

function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const lang = (navigator.language || "en").toLowerCase();
  return lang.startsWith("pt") ? "pt" : "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = React.useState<LocalePreference>(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (raw === "pt" || raw === "en" || raw === "auto") return raw;
    return "auto";
  });

  const locale: Locale = React.useMemo(() => {
    return preference === "auto" ? detectBrowserLocale() : preference;
  }, [preference]);

  const setPreference = React.useCallback((next: LocalePreference) => {
    setPreferenceState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value = React.useMemo<I18nContextValue>(
    () => ({
      locale,
      preference,
      setPreference,
      tt: (pt, en) => (locale === "pt" ? pt : en),
    }),
    [locale, preference, setPreference],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
