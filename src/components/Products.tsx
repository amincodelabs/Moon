import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useImageSwipe } from "../useImageSwipe";
import { products } from "../data";
import type { Copy, Language } from "../locales";
import {
  Arrow,
  DestinationLink,
  Photo,
  SectionHeading,
  type Navigate,
} from "./Primitives";
export function ProductCard({
  product,
  t,
  language,
  go,
}: {
  product: (typeof products)[number];
  t: Copy;
  language: Language;
  go: Navigate;
}) {
  const [index, setIndex] = useState(0);
  const swipe = useImageSwipe(language, (direction) =>
    setIndex(
      (current) =>
        (current + direction + product.images.length) % product.images.length,
    ),
  );
  const format = (n: number) =>
    new Intl.NumberFormat(language === "fa" ? "fa-IR" : "en-US").format(n);
  return (
    <article className="product">
      <div className="product-visual" {...swipe}>
        <Photo
          name={product.images[index]}
          alt={`${t[product.alt]}${index ? ` — ${t.productView}` : ""}`}
        />
        <span className={`stock ${product.available ? "" : "out"}`}>
          <i />
          {product.available ? t.available : t.unavailable}
        </span>
        <div className="image-controls">
          <button
            aria-label={`${t.previous}: ${t[product.name]}`}
            onClick={() =>
              setIndex(
                (index + product.images.length - 1) % product.images.length,
              )
            }
          >
            <ChevronLeft size={16} />
          </button>
          <span aria-live="polite">
            {format(index + 1)} / {format(product.images.length)}
          </span>
          <button
            aria-label={`${t.next}: ${t[product.name]}`}
            onClick={() => setIndex((index + 1) % product.images.length)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="product-info">
        <p>{t[product.detail]}</p>
        <h3>
          <DestinationLink go={go} route="store">
            {t[product.name]}
          </DestinationLink>
        </h3>
        <div className="product-bottom">
          <div className="price">
            {product.oldPrice && <del>{format(product.oldPrice)}</del>}
            <span>
              <bdi>{format(product.price)}</bdi> <small>{t.rial}</small>
            </span>
          </div>
          <DestinationLink className="round-link" go={go} route="store">
            <span className="sr-only">
              {t.viewStore}: {t[product.name]}
            </span>
            <Arrow />
          </DestinationLink>
        </div>
      </div>
    </article>
  );
}
export function Products({
  t,
  language,
  go,
}: {
  t: Copy;
  language: Language;
  go: Navigate;
}) {
  return (
    <section className="section container products-section">
      <SectionHeading eyebrow={t.selectedEyebrow} title={t.selectedTitle}>
        <DestinationLink route="store" go={go} className="text-link">
          {t.allProducts}
          <Arrow />
        </DestinationLink>
      </SectionHeading>
      <p className="section-intro">{t.selectedBody}</p>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            t={t}
            language={language}
            go={go}
          />
        ))}
      </div>
      <p className="sample-note">{t.sampleLabel}</p>
    </section>
  );
}
