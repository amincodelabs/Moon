import { BookOpen, CalendarDays, Clock3, MapPin } from "lucide-react";
import type { Copy } from "../locales";
import {
  Arrow,
  DestinationLink,
  Photo,
  SectionHeading,
  type Navigate,
} from "./Primitives";
export function Experiences({ t, go }: { t: Copy; go: Navigate }) {
  return (
    <section className="section container">
      <SectionHeading eyebrow={t.experienceEyebrow} title={t.experienceTitle} />
      <div className="experience-grid">
        <article className="course-feature">
          <div className="course-art">
            <Photo name="sky" alt={t.skyAlt} />
            <div className="star-chart" aria-hidden="true">
              <div />
              <span>✦</span>
              <div />
            </div>
            <span className="feature-label">{t.courseLabel}</span>
          </div>
          <div className="experience-copy">
            <span className="pill">{t.level}</span>
            <h3>{t.courseTitle}</h3>
            <p>{t.courseBody}</p>
            <div className="feature-meta">
              <span>
                <Clock3 size={16} />
                {t.duration}
              </span>
              <span>
                <BookOpen size={16} />
                {t.instructor}
              </span>
            </div>
            <DestinationLink go={go} route="education" className="text-link">
              {t.courseCta}
              <Arrow />
            </DestinationLink>
          </div>
        </article>
        <article className="tour-feature">
          <Photo name="tour" alt={t.tourAlt} />
          <div className="tour-shade" />
          <div className="tour-copy">
            <p className="eyebrow">{t.tourLabel}</p>
            <h3>{t.tourTitle}</h3>
            <p>{t.tourBody}</p>
            <div className="feature-meta">
              <span>
                <MapPin size={16} />
                {t.tourLocation}
              </span>
              <span>
                <CalendarDays size={16} />
                {t.tourDate}
              </span>
            </div>
            <p className="tour-type">{t.tourType}</p>
            <div className="tour-bottom">
              <DestinationLink
                go={go}
                route="tours"
                className="button button-gold"
              >
                {t.tourCta}
                <Arrow />
              </DestinationLink>
              <small>{t.tourStatus}</small>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
export function Editorial({ t, go }: { t: Copy; go: Navigate }) {
  return (
    <section className="section container editorial-section">
      <SectionHeading eyebrow={t.editorialEyebrow} title={t.editorialTitle} />
      <article className="editorial">
        <div className="editorial-image">
          <Photo name="sky" alt={t.skyAlt} />
          <img
            className="editorial-wide"
            src="/images/hero-800.webp"
            alt=""
            aria-hidden="true"
            width="800"
            height="533"
            loading="lazy"
            decoding="async"
          />
          <span aria-hidden="true">
            THE NIGHT JOURNAL <span>01 —</span>
          </span>
        </div>
        <div className="editorial-copy">
          <p className="eyebrow">{t.editorialTag}</p>
          <h3>{t.articleTitle}</h3>
          <p>{t.articleBody}</p>
          <DestinationLink go={go} route="magazine" className="text-link">
            {t.readArticle}
            <Arrow />
          </DestinationLink>
        </div>
      </article>
    </section>
  );
}
