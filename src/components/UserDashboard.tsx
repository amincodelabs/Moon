import { useState } from "react";
import {
  Bell,
  ChevronLeft,
  CircleUserRound,
  Coins,
  Heart,
  LogOut,
  MapPin,
  Package,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { Copy, Language } from "../locales";
import type { Theme } from "../preferences";

type Tab =
  "overview" | "orders" | "wishlist" | "addresses" | "returns" | "profile";

const tabs: { id: Tab; label: keyof Copy; Icon: typeof Package }[] = [
  { id: "overview", label: "panelOverview", Icon: CircleUserRound },
  { id: "orders", label: "panelOrders", Icon: Package },
  { id: "wishlist", label: "panelWishlist", Icon: Heart },
  { id: "addresses", label: "panelAddresses", Icon: MapPin },
  { id: "returns", label: "panelReturns", Icon: RotateCcw },
  { id: "profile", label: "panelProfile", Icon: UserRound },
];

export function UserDashboard({
  t,
  language,
  theme,
  setLanguage,
  setTheme,
  logout,
}: {
  t: Copy;
  language: Language;
  theme: Theme;
  setLanguage: (value: Language) => void;
  setTheme: (value: Theme) => void;
  logout: () => void;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const title = tabs.find((item) => item.id === tab)?.label ?? "panelOverview";
  const formatCoins = new Intl.NumberFormat(
    language === "fa" ? "fa-IR" : "en-US",
  ).format(240);
  return (
    <div className="user-dashboard">
      <aside className="account-sidebar">
        <div className="account-profile">
          <span className="account-avatar">
            <Sparkles size={24} />
          </span>
          <div>
            <strong>{t.demoUser}</strong>
            <span>{t.panelDemoBadge}</span>
          </div>
        </div>
        <nav aria-label={t.account} className="account-nav">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
              aria-current={tab === id ? "page" : undefined}
            >
              <Icon size={17} />
              <span>{t[label]}</span>
              {tab === id && (
                <ChevronLeft className="account-nav-arrow" size={15} />
              )}
            </button>
          ))}
        </nav>
        <div className="account-sidebar-bottom">
          <button onClick={logout}>
            <LogOut size={16} />
            {t.logout}
          </button>
          <small>{t.panelHelp}</small>
        </div>
      </aside>
      <section className="account-content" aria-labelledby="account-page-title">
        <div className="account-content-top">
          <div>
            <p className="eyebrow">
              {t.account} <span className="demo-chip">{t.panelDemoBadge}</span>
            </p>
            <h3 id="account-page-title">{t[title]}</h3>
          </div>
          <button
            className="account-notification"
            aria-label={t.panelNotifications}
          >
            <Bell size={19} />
            <i />
          </button>
        </div>
        {tab === "overview" && (
          <Overview t={t} coins={formatCoins} setTab={setTab} />
        )}
        {tab === "orders" && (
          <EmptyState
            Icon={Package}
            title={t.panelOrders}
            body={t.panelOrderSummary}
          />
        )}
        {tab === "wishlist" && (
          <EmptyState
            Icon={Heart}
            title={t.panelSaved}
            body={t.panelEmpty}
            action={t.panelBrowse}
          />
        )}
        {tab === "addresses" && (
          <EmptyState
            Icon={MapPin}
            title={t.panelAddresses}
            body={t.panelEmpty}
            action={t.panelEdit}
          />
        )}
        {tab === "returns" && (
          <EmptyState
            Icon={RotateCcw}
            title={t.panelReturns}
            body={t.panelEmpty}
          />
        )}
        {tab === "profile" && (
          <Profile
            t={t}
            language={language}
            theme={theme}
            setLanguage={setLanguage}
            setTheme={setTheme}
          />
        )}
      </section>
    </div>
  );
}

function Overview({
  t,
  coins,
  setTab,
}: {
  t: Copy;
  coins: string;
  setTab: (tab: Tab) => void;
}) {
  return (
    <div className="account-overview">
      <div className="account-welcome">
        <div>
          <p className="eyebrow">{t.panelWelcome}</p>
          <h4>{t.panelSubtitle}</h4>
          <button className="text-link" onClick={() => setTab("profile")}>
            {t.panelEdit}
            <ChevronLeft size={16} />
          </button>
        </div>
        <div className="welcome-orbit">
          <Sparkles size={31} />
          <span />
        </div>
      </div>
      <div className="account-stat-grid">
        <div className="account-stat">
          <span className="stat-icon coin">
            <Coins size={19} />
          </span>
          <small>{t.panelCoins}</small>
          <strong>{coins}</strong>
          <em>{t.panelCoinHint}</em>
        </div>
        <div className="account-stat">
          <span className="stat-icon order">
            <Package size={19} />
          </span>
          <small>{t.panelOrderSummary}</small>
          <strong>{t.panelOrderId}</strong>
          <em>{t.panelOrderStatus}</em>
        </div>
      </div>
      <div className="latest-order">
        <div className="latest-order-head">
          <div>
            <p className="eyebrow">{t.panelOrderSummary}</p>
            <strong>{t.panelOrderId}</strong>
          </div>
          <button className="text-link" onClick={() => setTab("orders")}>
            {t.panelViewOrder}
            <ChevronLeft size={16} />
          </button>
        </div>
        <div className="order-row">
          <span className="order-product">
            <span className="mini-telescope">
              <span />
            </span>
            <span>
              <strong>{t.telescopeName}</strong>
              <small>{t.panelOrderDate}</small>
            </span>
          </span>
          <span className="order-total">
            <strong>{t.panelOrderTotal}</strong>
            <small>{t.panelOrderStatus}</small>
          </span>
        </div>
      </div>
      <div className="account-settings">
        <div>
          <Settings2 size={18} />
          <span>
            <strong>{t.panelAccountSettings}</strong>
            <small>{t.panelPreferenceHint}</small>
          </span>
        </div>
        <div className="settings-actions">
          <button onClick={() => setTab("profile")}>
            <ShieldCheck size={15} />
            {t.panelSecurity}
          </button>
          <button onClick={() => setTab("profile")}>
            <Bell size={15} />
            {t.panelNotifications}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  Icon,
  title,
  body,
  action,
}: {
  Icon: typeof Package;
  title: string;
  body: string;
  action?: string;
}) {
  return (
    <div className="account-empty">
      <span>
        <Icon size={25} />
      </span>
      <h4>{title}</h4>
      <p>{body}</p>
      {action && (
        <button className="button button-gold">
          {action}
          <ChevronLeft size={17} />
        </button>
      )}
    </div>
  );
}

function Profile({
  t,
  language,
  theme,
  setLanguage,
  setTheme,
}: {
  t: Copy;
  language: Language;
  theme: Theme;
  setLanguage: (value: Language) => void;
  setTheme: (value: Theme) => void;
}) {
  return (
    <div className="account-profile-settings">
      <div className="profile-card">
        <span className="profile-avatar">
          <Sparkles size={30} />
        </span>
        <div>
          <h4>{t.demoUser}</h4>
          <p>{t.demoAccount}</p>
        </div>
        <button className="text-link">
          {t.panelEdit}
          <ChevronLeft size={16} />
        </button>
      </div>
      <div className="preference-card">
        <div>
          <strong>{t.panelAccountSettings}</strong>
          <p>{t.panelPreferenceHint}</p>
        </div>
        <div className="preference-row">
          <label>
            {t.panelLanguage}
            <select
              aria-label={t.panelLanguage}
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
            >
              <option value="fa">فارسی</option>
              <option value="en">English</option>
            </select>
          </label>
          <label>
            {t.theme}
            <select
              aria-label={t.theme}
              value={theme}
              onChange={(event) => setTheme(event.target.value as Theme)}
            >
              <option value="dark">{t.dark}</option>
              <option value="light">{t.light}</option>
              <option value="system">{t.system}</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
