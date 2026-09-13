import { Globe2, Menu, Moon, Search, Sun, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import type { Copy, Language } from "../locales";
import type { Theme } from "../preferences";
import { destinations } from "../data";
import { DestinationLink, type Navigate } from "./Primitives";
export function Brand({ t }: { t: Copy }) {
  return (
    <a href="/" className="brand" aria-label={t.brand}>
      <img src="/avastar-logo.svg" alt={t.brand} width="200" height="84" />
    </a>
  );
}
export function Preferences({
  t,
  language,
  setLanguage,
  theme,
  setTheme,
}: {
  t: Copy;
  language: Language;
  setLanguage: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}) {
  const [systemDark, setSystemDark] = useState(
    () => matchMedia("(prefers-color-scheme: dark)").matches,
  );
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const isDark = theme === "dark" || (theme === "system" && systemDark);
  return (
    <div className="preferences">
      <button
        className="language-button"
        lang={language === "fa" ? "en" : "fa"}
        aria-label={t.languageLabel}
        onClick={() => setLanguage(language === "fa" ? "en" : "fa")}
      >
        <Globe2 size={17} />
        <span>{language === "fa" ? "FA" : "EN"}</span>
      </button>
      <div className="theme-control">
        <button
          type="button"
          className="theme-toggle"
          role="switch"
          aria-checked={isDark}
          aria-label={`${t.theme}: ${isDark ? t.dark : t.light}`}
          onClick={() => {
            setTheme(isDark ? "light" : "dark");
          }}
        >
          {isDark ? (
            <Moon size={17} aria-hidden="true" />
          ) : (
            <Sun size={17} aria-hidden="true" />
          )}
          <span className="sr-only">{t.theme}</span>
        </button>
      </div>
    </div>
  );
}
export function Header({
  t,
  go,
  open,
  authenticated,
  ...preferences
}: {
  t: Copy;
  go: Navigate;
  open: (panel: "search" | "account" | "menu") => void;
  authenticated: boolean;
  language: Language;
  setLanguage: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}) {
  return (
    <header className="header">
      <div className="header-inner">
        <Brand t={t} />
        <nav className="desktop-nav" aria-label={t.menu}>
          {destinations.map((d) => (
            <DestinationLink key={d.id} route={d.id} go={go}>
              {t[d.name]}
            </DestinationLink>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label={t.search}
            title={t.search}
            onClick={() => open("search")}
          >
            <Search size={21} />
          </button>
          <Preferences t={t} {...preferences} />
          <button
            className={`account-button ${authenticated ? "signed-in" : ""}`}
            aria-label={authenticated ? t.account : t.login}
            onClick={() => open("account")}
          >
            <UserRound size={18} />
            <span>{authenticated ? t.demoUser : t.login}</span>
          </button>
          <button
            className="icon-button mobile-toggle"
            aria-label={t.menu}
            aria-haspopup="dialog"
            onClick={() => open("menu")}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
