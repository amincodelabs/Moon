import { useRef, useState } from "react";
import { ArrowUpLeft, MessageCircle, Sparkles, X } from "lucide-react";
import { campaign, routes, type RouteKey } from "./data";
import { readPreference, savePreference, usePreferences } from "./preferences";
import { Header } from "./components/Header";
import { Hero, Discovery } from "./components/Discovery";
import { Products } from "./components/Products";
import { Experiences, Editorial } from "./components/Experiences";
import { Journey, Footer } from "./components/JourneyFooter";
import { Panels, type Panel } from "./components/Panels";
import { useLandingMotion } from "./useLandingMotion";
export default function App() {
  const preferences = usePreferences();
  const { t, language } = preferences;
  const initialRoute = (Object.entries(routes) as [RouteKey, string][]).find(
    ([, path]) => location.pathname === path,
  )?.[0];
  const [panel, setPanel] = useState<Panel>(initialRoute ? "coming" : null);
  const [target, setTarget] = useState<RouteKey>(initialRoute ?? "store");
  const [authenticated, setAuthenticated] = useState(
    () => readPreference("avastar-demo-account", "false") === "true",
  );
  const [announcement, setAnnouncement] = useState(
    () =>
      readPreference(`avastar-campaign-${campaign.id}`, "visible") !==
        "dismissed" && Date.now() < Date.parse(campaign.expires),
  );
  const opener = useRef<HTMLElement | null>(null);
  const openPanel = (next: Panel) => {
    if (!panel) opener.current = document.activeElement as HTMLElement;
    setPanel(next);
  };
  const closePanel = () => {
    setPanel(null);
    requestAnimationFrame(() => {
      if (opener.current?.isConnected) opener.current.focus();
      else document.getElementById("main")?.focus();
    });
  };
  const go = (route: RouteKey) => {
    setTarget(route);
    openPanel(route === "account" || route === "login" ? "account" : "coming");
  };
  const masthead = useRef<HTMLDivElement>(null);
  useLandingMotion(masthead);
  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <div className="masthead" ref={masthead}>
        {announcement && (
          <aside className="campaign">
            <div>
              <Sparkles size={14} />
              <span>{t.campaign}</span>
              <button onClick={() => go(campaign.destination)}>
                {t.campaignCta}
                <ArrowUpLeft size={14} />
              </button>
            </div>
            <button
              className="campaign-dismiss"
              aria-label={t.dismiss}
              onClick={() => {
                setAnnouncement(false);
                savePreference(`avastar-campaign-${campaign.id}`, "dismissed");
              }}
            >
              <X size={16} />
            </button>
          </aside>
        )}
        <Header
          {...preferences}
          go={go}
          open={openPanel}
          authenticated={authenticated}
        />
        <div className="reading-progress" aria-hidden="true" />
      </div>
      <main id="main" tabIndex={-1}>
        <Hero t={t} go={go} />
        <Discovery t={t} go={go} />
        <Products t={t} language={language} go={go} />
        <Experiences t={t} go={go} />
        <Editorial t={t} go={go} />
        <Journey t={t} go={go} />
      </main>
      <Footer t={t} go={go} />
      <button
        className="chat-launcher"
        aria-label={t.chat}
        aria-haspopup="dialog"
        onClick={() => openPanel("chat")}
      >
        <MessageCircle size={23} />
        <span>{t.chat}</span>
        <i />
      </button>
      <Panels
        panel={panel}
        target={target}
        t={t}
        close={closePanel}
        go={go}
        authenticated={authenticated}
        setAuthenticated={(v) => {
          setAuthenticated(v);
          savePreference("avastar-demo-account", String(v));
        }}
        language={preferences.language}
        setLanguage={preferences.setLanguage}
        theme={preferences.theme}
        setTheme={preferences.setTheme}
      />
    </>
  );
}
