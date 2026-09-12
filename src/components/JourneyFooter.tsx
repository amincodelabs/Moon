import { useState, type CSSProperties } from "react";
import { BookOpen, Compass, Orbit, Telescope, Sparkles } from "lucide-react";
import { destinations, journey } from "../data";
import type { Copy } from "../locales";
import { Arrow, DestinationLink, type Navigate } from "./Primitives";
import { Brand } from "./Header";
const icons = [BookOpen, Telescope, Compass, Orbit];
export function Journey({ t, go }: { t: Copy; go: Navigate }) {
  const [selected, setSelected] = useState(0);
  return (
    <section className="journey section">
      <div className="container">
        <p className="eyebrow">{t.journeyEyebrow}</p>
        <h2>{t.journeyTitle}</h2>
        <p>{t.journeyBody}</p>
        <div
          className="journey-path"
          role="group"
          aria-label={t.journeyTitle}
          style={{ "--journey-index": selected } as CSSProperties}
        >
          <span className="journey-traveler" aria-hidden="true" />
          {journey.map((step, i) => {
            const Icon = icons[i];
            return (
              <button
                key={step.route}
                className={selected === i ? "active" : ""}
                onClick={() => setSelected(i)}
                aria-pressed={selected === i}
                aria-controls="journey-detail"
              >
                <span className="journey-node">
                  <Icon size={26} strokeWidth={1.3} />
                  <small>0{i + 1}</small>
                </span>
                <strong>{t[step.title]}</strong>
              </button>
            );
          })}
        </div>
        <div id="journey-detail" className="journey-detail" aria-live="polite">
          <p key={selected} className="journey-story">
            {t[journey[selected].detail]}
          </p>
          <DestinationLink
            go={go}
            route={journey[selected].route}
            className="text-link"
          >
            {t.journeyCta}
            <Arrow />
          </DestinationLink>
        </div>
      </div>
    </section>
  );
}
export function Footer({ t, go }: { t: Copy; go: Navigate }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Brand t={t} />
            <p>{t.footerBody}</p>
            <span>
              <Sparkles size={15} />
              {t.tagline}
            </span>
          </div>
          <nav aria-label={t.footerExplore}>
            <h3>{t.footerExplore}</h3>
            {destinations.map((d) => (
              <DestinationLink go={go} route={d.id} key={d.id}>
                {t[d.name]}
              </DestinationLink>
            ))}
          </nav>
          <nav aria-label={t.footerHelp}>
            <h3>{t.footerHelp}</h3>
            {(["account", "support", "contact", "social"] as const).map(
              (key) => (
                <DestinationLink go={go} route={key} key={key}>
                  {t[key]}
                </DestinationLink>
              ),
            )}
          </nav>
          <div className="footer-signoff">
            <Orbit size={55} strokeWidth={0.7} />
            <p>{t.skyNote}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t.copyright}</span>
          <div>
            <DestinationLink route="legal" go={go}>
              {t.legal}
            </DestinationLink>
            <DestinationLink route="privacy" go={go}>
              {t.privacy}
            </DestinationLink>
          </div>
          <span>{t.footerNote}</span>
        </div>
      </div>
    </footer>
  );
}
