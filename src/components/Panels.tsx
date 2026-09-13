import { useState } from "react";
import { Bot, Headphones, Search, Sparkles, UserRound } from "lucide-react";
import type { Copy } from "../locales";
import type { Language } from "../locales";
import type { Theme } from "../preferences";
import { destinations, type RouteKey } from "../data";
import { Arrow, DestinationLink, Modal, type Navigate } from "./Primitives";
import { UserDashboard } from "./UserDashboard";
export type Panel = "search" | "account" | "menu" | "chat" | "coming" | null;
export function Panels({
  panel,
  target,
  t,
  close,
  go,
  authenticated,
  setAuthenticated,
  language,
  setLanguage,
  theme,
  setTheme,
}: {
  panel: Panel;
  target: RouteKey;
  t: Copy;
  close: () => void;
  go: Navigate;
  authenticated: boolean;
  setAuthenticated: (v: boolean) => void;
  language: Language;
  setLanguage: (value: Language) => void;
  theme: Theme;
  setTheme: (value: Theme) => void;
}) {
  const [query, setQuery] = useState("");
  if (!panel) return null;
  const title =
    panel === "coming"
      ? t.comingSoon
      : panel === "chat"
        ? t.chatTitle
        : panel === "account"
          ? authenticated
            ? t.account
            : t.login
          : t[panel];
  return (
    <Modal key={panel} title={title} t={t} close={close}>
      {panel === "search" && (
        <>
          <p>{t.searchHint}</p>
          <label className="search-field">
            <Search size={20} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.search}
            />
          </label>
          <nav className="panel-destinations" aria-label={t.search}>
            {destinations
              .filter((d) =>
                `${t[d.name]} ${t[d.description]}`
                  .toLowerCase()
                  .includes(query.toLowerCase().trim()),
              )
              .map((d) => (
                <DestinationLink key={d.id} route={d.id} go={go}>
                  <span>
                    <strong>{t[d.name]}</strong>
                    <small>{t[d.description]}</small>
                  </span>
                  <Arrow />
                </DestinationLink>
              ))}
            {!destinations.some((d) =>
              `${t[d.name]} ${t[d.description]}`
                .toLowerCase()
                .includes(query.toLowerCase().trim()),
            ) && <p role="status">{t.noResults}</p>}
          </nav>
        </>
      )}
      {panel === "menu" && (
        <nav className="panel-destinations" aria-label={t.menu}>
          {destinations.map((d) => (
            <DestinationLink key={d.id} go={go} route={d.id}>
              {t[d.name]}
              <Arrow />
            </DestinationLink>
          ))}
        </nav>
      )}
      {panel === "account" &&
        (authenticated ? (
          <UserDashboard
            t={t}
            language={language}
            theme={theme}
            setLanguage={setLanguage}
            setTheme={setTheme}
            logout={() => {
              setAuthenticated(false);
              close();
            }}
          />
        ) : (
          <div className="account-panel">
            <span className="large-icon">
              <UserRound size={32} />
            </span>
            {authenticated && <h3>{t.demoUser}</h3>}
            <p>{t.demoAccount}</p>
            <button
              className="button button-gold"
              onClick={() => {
                setAuthenticated(!authenticated);
                close();
              }}
            >
              {authenticated ? t.logout : t.demoLogin}
            </button>
            {!authenticated && (
              <DestinationLink className="text-link" go={go} route="register">
                {t.register}
                <Arrow />
              </DestinationLink>
            )}
          </div>
        ))}
      {panel === "chat" && (
        <>
          <p>{t.chatBody}</p>
          <div className="chat-options">
            {[
              { label: t.aiGuide, Icon: Bot },
              { label: t.humanSupport, Icon: Headphones },
            ].map(({ label, Icon }) => (
              <div className="chat-option" key={label}>
                <Icon size={27} />
                <span>
                  <strong>{label}</strong>
                  <small>{t.notConnected}</small>
                </span>
              </div>
            ))}
          </div>
          <p className="notice">{t.uiOnly}</p>
        </>
      )}
      {panel === "coming" && (
        <div className="coming-panel">
          <span className="large-icon">
            <Sparkles size={33} />
          </span>
          <p className="eyebrow">{t[target]}</p>
          <p>{t.comingBody}</p>
          <button className="button button-gold" onClick={close}>
            {t.back}
            <Arrow />
          </button>
        </div>
      )}
    </Modal>
  );
}
