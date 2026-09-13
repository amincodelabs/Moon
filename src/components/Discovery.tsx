import { BookOpen, Compass, Orbit, Telescope, ArrowDown } from "lucide-react";
import { destinations } from "../data";
import type { Copy } from "../locales";
import {
  Arrow,
  DestinationLink,
  Photo,
  SectionHeading,
  type Navigate,
} from "./Primitives";
const icons = [Telescope, BookOpen, Compass, Orbit];
export function Hero({ t, go }: { t: Copy; go: Navigate }) {
  return (
    <div className="hero-track">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-depth">
          <Photo name="hero" alt={t.heroAlt} hero className="hero-image" />
        </div>
        <div className="hero-shade" />
        <div className="hero-stars" aria-hidden="true">
          {Array.from({ length: 4 }, (_, i) => (
            <i key={i} className="hero-star" />
          ))}
        </div>
        <div className="hero-orbit" aria-hidden="true" />
        <svg
          className="hero-constellation"
          viewBox="0 0 460 280"
          fill="none"
          aria-hidden="true"
        >
          <path
            className="constellation-trace"
            d="M35 212 124 160 188 182 263 85 349 115 418 34"
          />
          <path
            className="constellation-secondary"
            d="M124 160 148 58 263 85 295 231 349 115"
          />
          {[
            [35, 212],
            [124, 160],
            [188, 182],
            [263, 85],
            [349, 115],
            [418, 34],
            [148, 58],
            [295, 231],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle className="constellation-halo" cx={x} cy={y} r="7" />
              <circle cx={x} cy={y} r={i === 3 ? 3 : 1.8} />
            </g>
          ))}
        </svg>
        <div className="hero-content container">
          <p className="eyebrow">
            <span className="gold-line" />
            {t.heroEyebrow}
          </p>
          <h1 id="hero-title">
            {t.heroFirst}
            <br />
            <span>{t.heroSecond}</span>
          </h1>
          <p className="hero-body">{t.heroBody}</p>
          <div className="hero-buttons">
            <a className="button button-gold" href="#universe">
              {t.explore}
              <Arrow />
            </a>
            <DestinationLink
              className="button button-outline"
              route="store"
              go={go}
            >
              {t.viewStore}
              <Telescope size={19} />
            </DestinationLink>
          </div>
        </div>
        <div className="hero-bottom container">
          <a href="#universe">
            <ArrowDown size={18} />
            {t.scroll}
          </a>
          <p>{t.heroCaption}</p>
        </div>
      </section>
    </div>
  );
}
export function Discovery({ t, go }: { t: Copy; go: Navigate }) {
  return (
    <section id="universe" className="section container">
      <SectionHeading eyebrow={t.universeEyebrow} title={t.universeTitle}>
        <p>{t.universeBody}</p>
      </SectionHeading>
      <div className="destinations">
        {destinations.map((d, i) => {
          const Icon = icons[i];
          return (
            <DestinationLink
              key={d.id}
              route={d.id}
              go={go}
              className={`destination destination-${d.id}`}
            >
              <Photo name={d.image} alt={t[d.alt]} />
              <div className="destination-shade" />
              <div className="destination-top">
                <Icon size={25} strokeWidth={1.3} />
              </div>
              <div className="destination-copy">
                <h3>{t[d.name]}</h3>
                <p>{t[d.description]}</p>
                <span className="destination-action">
                  {t[d.action]}
                  <Arrow />
                </span>
              </div>
            </DestinationLink>
          );
        })}
      </div>
    </section>
  );
}
