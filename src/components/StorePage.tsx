import { ShoppingBag, Sparkles } from "lucide-react";
import { products } from "../data";
import type { Copy, Language } from "../locales";
import { ProductCard } from "./Products";
import { type Navigate } from "./Primitives";

export function StorePage({
  t,
  language,
  go,
}: {
  t: Copy;
  language: Language;
  go: Navigate;
}) {
  return (
    <main id="main" className="store-page" tabIndex={-1}>
      <section className="store-hero container">
        <div>
          <p className="eyebrow">{t.store}</p>
          <h1>{t.selectedTitle}</h1>
          <p>{t.storeDesc}</p>
        </div>
        <div className="store-hero-orbit" aria-hidden="true">
          <Sparkles size={92} strokeWidth={0.8} />
        </div>
      </section>
      <section
        className="section container store-catalog"
        aria-labelledby="catalog-title"
      >
        <div className="store-toolbar">
          <div>
            <p className="eyebrow">{t.storeAction}</p>
            <h2 id="catalog-title">{t.allProducts}</h2>
          </div>
          <button className="store-cart" type="button" aria-label={t.cart}>
            <ShoppingBag size={18} />
            <span>{t.cart}</span>
            <b>0</b>
          </button>
        </div>
        <div className="store-filters" role="group" aria-label={t.search}>
          <button className="store-filter is-active" type="button">
            {t.allProducts}
          </button>
          <button className="store-filter" type="button">
            {t.telescopeName}
          </button>
          <button className="store-filter" type="button">
            {t.binocularsName}
          </button>
          <button className="store-filter" type="button">
            {t.eyepieceName}
          </button>
        </div>
        <div className="product-grid store-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              t={t}
              language={language}
              go={go}
            />
          ))}
        </div>
        <p className="sample-note">{t.sampleLabel}</p>
      </section>
    </main>
  );
}
