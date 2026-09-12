import { useLayoutEffect, useState } from "react";
import { transitionPreference } from "./preferenceTransition";
import { locales, type Language } from "./locales";
export type Theme = "dark" | "light" | "system";
export function readPreference(key: string, fallback: string) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}
export function savePreference(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Preferences remain usable when storage is unavailable. */
  }
}
export function usePreferences() {
  const [language, setLanguage] = useState<Language>(() =>
    readPreference("avastar-language", "fa") === "en" ? "en" : "fa",
  );
  const [theme, setTheme] = useState<Theme>(() => {
    const v = readPreference("avastar-theme", "dark");
    return v === "light" || v === "system" ? v : "dark";
  });
  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    savePreference("avastar-language", language);
    document.title = locales[language].title;
    for (const [selector, value] of [
      ['meta[name="description"]', locales[language].description],
      ['meta[property="og:title"]', locales[language].title],
      ['meta[property="og:description"]', locales[language].description],
    ])
      document.querySelector(selector)?.setAttribute("content", value);
  }, [language]);
  useLayoutEffect(() => {
    savePreference("avastar-theme", theme);
    const media = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved =
        theme === "system" ? (media.matches ? "dark" : "light") : theme;
      document.documentElement.dataset.theme = resolved;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", resolved === "dark" ? "#080e1b" : "#f5f2ec");
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
  return {
    language,
    setLanguage: (next: Language) =>
      transitionPreference(() => setLanguage(next)),
    theme,
    setTheme: (next: Theme) => transitionPreference(() => setTheme(next)),
    t: locales[language],
  };
}
