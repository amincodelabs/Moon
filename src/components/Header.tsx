import { Globe2, Menu, Moon, Search, Sparkles, UserRound } from "lucide-react";
import type { Copy, Language } from "../locales";
import type { Theme } from "../preferences";
import { destinations } from "../data";
import { DestinationLink, type Navigate } from "./Primitives";
export function Brand({ t }: { t: Copy }) {
  return (
    <a href="/" className="brand" aria-label={t.brand}>
      <span className="brand-symbol" aria-hidden="true">
        <Sparkles size={31} strokeWidth={1.25} />
      </span>
      <span>
        <strong>{t.brand}</strong>
        <small>AVASTAR</small>
      </span>
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
  return (
    <div className="preferences">
      <button
        className="language-button"
        lang={language === "fa" ? "en" : "fa"}
        aria-label={t.languageLabel}
        onClick={() => setLanguage(language === "fa" ? "en" : "fa")}
      >
        <Globe2 size={17} />
        <span>{t.language}</span>
      </button>
      <label className="theme-control">
        <Moon size={17} aria-hidden="true" />
        <span className="sr-only">{t.theme}</span>
        <select
          aria-label={t.theme}
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
        >
          <option value="dark">{t.dark}</option>
          <option value="light">{t.light}</option>
          <option value="system">{t.system}</option>
        </select>
      </label>
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
