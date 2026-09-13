import { useEffect, useState } from "react";
import { CollectionRail } from "./CollectionRail";
import {
  ChevronLeft,
  ChevronRight,
  ArrowDownUp,
  SlidersHorizontal,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  Headphones,
} from "lucide-react";
import { useShop } from "./context";
import { SelectMenu } from "./SelectMenu";
import {
  bannerSlides,
  catalog,
  categories,
  productCollections,
  matchesSearch,
} from "./model";
import {
  ProductTile,
  ShopLink,
  Gallery,
  WishButton,
  AddButton,
  Empty,
} from "./ui";

export function Catalog() {
  const { tr, text, money, navigate, path, searchQuery, setSearchQuery } =
    useShop();
  const routeSegments = path.split("?")[0].split("/").filter(Boolean);
  const resultPage = routeSegments[1];
  const isResultsPage = resultPage === "search" || resultPage === "category";
  const categorySlug = routeSegments[2];
  const [category, setCategory] = useState("0");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [price, setPrice] = useState(300000000);
  const [available, setAvailable] = useState(false);
  const [sort, setSort] = useState("selected");
  const [banner, setBanner] = useState(0);
  const [bannerPaused, setBannerPaused] = useState(false);
  const [page, setPage] = useState(1);
  useEffect(() => {
    const params = new URLSearchParams(path.split("?")[1]);
    const slugCategory =
      categorySlug === "telescopes"
        ? "1"
        : categorySlug === "binoculars"
          ? "2"
          : categorySlug === "accessories"
            ? "3"
            : null;
    setCategory(slugCategory ?? params.get("category") ?? "0");
  }, [path, categorySlug]);
  useEffect(() => {
    if (bannerPaused) return;
    const timer = window.setInterval(() => {
      setBanner((current) => (current + 1) % bannerSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [bannerPaused]);
  let items = catalog.filter(
    (p) =>
      (category === "0" || p.category === category) &&
      (!brand || p.brand === brand) &&
      p.price <= price &&
      p.price >= minPrice &&
      (!available || p.stock > 0) &&
      matchesSearch(p, searchQuery),
  );
  if (sort === "low") items = [...items].sort((a, b) => a.price - b.price);
  if (sort === "high") items = [...items].sort((a, b) => b.price - a.price);
  if (sort === "new")
    items = [...items].sort(
      (a, b) => Date.parse(b.arrivedAt) - Date.parse(a.arrivedAt),
    );
  if (sort === "best") items = [...items].sort((a, b) => b.sold - a.sold);
  useEffect(
    () => setPage(1),
    [searchQuery, category, brand, minPrice, price, available, sort],
  );
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pagedItems = items.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      {!isResultsPage && (
        <section
          className="shop-editorial-hero"
          aria-roledescription="carousel"
          aria-label={tr("Store highlights", "ویترین فروشگاه")}
          aria-live="polite"
          onMouseEnter={() => setBannerPaused(true)}
          onMouseLeave={() => setBannerPaused(false)}
          onFocus={() => setBannerPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setBannerPaused(false);
          }}
        >
          {bannerSlides[banner].link.startsWith("/store") ? (
            <ShopLink
              to={bannerSlides[banner].link}
              className="shop-banner-link"
              aria-label={text(bannerSlides[banner].action)}
            >
              {null}
            </ShopLink>
          ) : (
            <a
              href={bannerSlides[banner].link}
              className="shop-banner-link"
              aria-label={text(bannerSlides[banner].action)}
            />
          )}
          <img
            key={bannerSlides[banner].image}
            src={`/images/${bannerSlides[banner].image}-800.webp`}
            alt=""
            width="800"
            height="600"
          />
          <div
            className="shop-hero-copy"
            key={`copy-${bannerSlides[banner].image}`}
          >
            <p className="shop-overline">
              AVASTAR / {text(bannerSlides[banner].eyebrow)}
            </p>
            <h1>{text(bannerSlides[banner].title)}</h1>
            <p>{text(bannerSlides[banner].body)}</p>
          </div>
          <div
            className="shop-hero-controls"
            aria-label={tr("Change store banner", "تغییر بنر فروشگاه")}
          >
            <button
              type="button"
              aria-label={tr("Previous banner", "بنر قبلی")}
              onClick={() =>
                setBanner(
                  (banner - 1 + bannerSlides.length) % bannerSlides.length,
                )
              }
            >
              <ChevronLeft size={18} />
            </button>
            <div className="shop-hero-dots">
              {bannerSlides.map((slide, index) => (
                <button
                  type="button"
                  key={slide.image}
                  className={index === banner ? "active" : ""}
                  aria-label={`${tr("Banner", "بنر")} ${index + 1}`}
                  aria-current={index === banner ? "true" : undefined}
                  onClick={() => setBanner(index)}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label={tr("Next banner", "بنر بعدی")}
              onClick={() => setBanner((banner + 1) % bannerSlides.length)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <span className="shop-hero-caption">
            {String(banner + 1).padStart(2, "0")} /{" "}
            {tr("MADE FOR THE CURIOUS", "برای ذهن‌های کنجکاو")}
          </span>
        </section>
      )}
      {!isResultsPage && (
        <div className="shop-benefits">
          <span>
            <ShieldCheck size={18} />
            {tr("Warranty on every instrument", "ضمانت همه تجهیزات")}
          </span>
          <span>
            <Truck size={18} />
            {tr("Delivery across Iran", "ارسال به سراسر ایران")}
          </span>
          <span>
            <Headphones size={18} />
            {tr("A little guidance goes a long way", "همراه شما در هر انتخاب")}
          </span>
        </div>
      )}
      <section
        id="catalog"
        className={`shop-catalog-section ${isResultsPage ? "shop-results-section" : ""}`}
      >
        <div className="shop-section-heading">
          <div>
            <p className="shop-overline">
              {isResultsPage
                ? tr("PRODUCT RESULTS", "نتایج محصولات")
                : tr("CURATED FOR YOUR JOURNEY", "منتخب برای مسیر شما")}
            </p>
            <h2>
              {isResultsPage
                ? resultPage === "search"
                  ? tr("Search results", "نتایج جست‌وجو")
                  : text(categories[Number(category)] ?? categories[0])
                : tr("Explore the store", "کاوش در فروشگاه")}
            </h2>
          </div>
          {!isResultsPage && (
            <p>
              {tr(
                "From your first glimpse to your next horizon.",
                "از اولین نگاه تا افق بعدی شما.",
              )}
            </p>
          )}
        </div>
        {!isResultsPage && productCollections.length > 0 && (
          <div className="shop-merchandising">
            {productCollections.map((collection) => {
              const collectionProducts = collection.productIds
                .map((id) => catalog.find((product) => product.id === id))
                .filter((product): product is (typeof catalog)[number] =>
                  Boolean(product),
                );
              return (
                <section
                  className="shop-collection"
                  key={collection.id}
                  aria-labelledby={`collection-${collection.id}`}
                >
                  <div className="shop-collection-heading">
                    <div>
                      <p className="shop-overline">
                        {tr("CURATED COLLECTION", "مجموعه منتخب")}
                      </p>
                      <h3 id={`collection-${collection.id}`}>
                        {text(collection.title)}
                      </h3>
                    </div>
                    <p>{text(collection.body)}</p>
                  </div>
                  <CollectionRail title={text(collection.title)}>
                    {collectionProducts.map((product) => (
                      <ProductTile key={product.id} product={product} />
                    ))}
                  </CollectionRail>
                </section>
              );
            })}
          </div>
        )}
        <div className="shop-full-catalog-heading">
          <div>
            <p className="shop-overline">
              {tr("THE FULL CATALOG", "کاتالوگ کامل")}
            </p>
            <h3>{tr("All products", "همه محصولات")}</h3>
          </div>
        </div>
        <div className="shop-catalog-layout">
          <aside className="shop-filter-panel">
            <h3>
              <SlidersHorizontal size={16} />
              {tr("Refine your view", "انتخاب دقیق‌تر")}
            </h3>
            <fieldset>
              <legend>{tr("Category", "دسته‌بندی")}</legend>
              {categories.map((c, i) => (
                <label className="shop-choice" key={i}>
                  <input
                    type="radio"
                    name="category"
                    checked={category === String(i)}
                    onChange={() => setCategory(String(i))}
                  />
                  {text(c)}
                </label>
              ))}
            </fieldset>
            <div className="shop-brand-filter">
              <p>{tr("Brand", "برند")}</p>
              <SelectMenu
                label={tr("Brand", "برند")}
                value={brand}
                onChange={setBrand}
                options={[
                  ["", tr("All brands", "همه برندها")],
                  ["AvaStar", "AvaStar"],
                  ["Atlas", "Atlas"],
                  ["Orbit", "Orbit"],
                ]}
              />
            </div>
            <label className="shop-price-filter">
              <span className="shop-filter-label">
                {tr("Price range", "محدوده قیمت")}
                <output>
                  {money(minPrice)} – {money(price)}
                </output>
              </span>
              <div className="shop-price-slider">
                <input
                  type="range"
                  min="0"
                  max="300000000"
                  step="1000000"
                  aria-label={tr("Minimum price (IRR)", "حداقل قیمت (ریال)")}
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(
                      Math.min(Number(e.target.value), price - 1000000),
                    )
                  }
                />
                <input
                  type="range"
                  min="0"
                  max="300000000"
                  step="1000000"
                  aria-label={tr("Maximum price (IRR)", "حداکثر قیمت (ریال)")}
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      Math.max(Number(e.target.value), minPrice + 1000000),
                    )
                  }
                />
              </div>
              <span className="shop-price-bounds">
                <span>{money(0)}</span>
                <span>{money(300000000)}</span>
              </span>
              <div className="shop-price-presets">
                {[50000000, 150000000, 300000000].map((value) => (
                  <button
                    type="button"
                    key={value}
                    className={
                      minPrice === 0 && price === value ? "active" : ""
                    }
                    onClick={() => {
                      setMinPrice(0);
                      setPrice(value);
                    }}
                  >
                    {value === 300000000
                      ? tr("Any", "همه")
                      : `${tr("Under", "زیر")} ${money(value)}`}
                  </button>
                ))}
              </div>
            </label>
            <label className="shop-choice">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
              />
              {tr("In stock only", "فقط کالاهای موجود")}
            </label>
            <button
              className="shop-text-link"
              onClick={() => {
                setSearchQuery("");
                setCategory("0");
                setBrand("");
                setMinPrice(0);
                setPrice(300000000);
                setAvailable(false);
                setSort("selected");
                navigate("/store");
              }}
            >
              {tr("Reset filters", "حذف فیلترها")}
            </button>
          </aside>
          <div>
            <div className="shop-catalog-tools">
              <SelectMenu
                label={tr("Sort products", "مرتب‌سازی محصولات")}
                value={sort}
                onChange={setSort}
                icon={<ArrowDownUp size={16} aria-hidden="true" />}
                options={[
                  ["selected", tr("Recommended", "پیشنهادی")],
                  ["low", tr("Price: low to high", "قیمت: کم به زیاد")],
                  ["high", tr("Price: high to low", "قیمت: زیاد به کم")],
                  ["new", tr("Newest arrivals", "جدیدترین‌ها")],
                  ["best", tr("Best sellers", "پرفروش‌ترین‌ها")],
                ]}
              />
            </div>
            <p className="shop-results" role="status">
              {items.length} {tr("instruments to explore", "تجهیز برای کاوش")}
            </p>
            {items.length ? (
              <div className="shop-product-grid shop-full-list">
                {pagedItems.map((p) => (
                  <ProductTile key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="shop-empty">
                <h3>{tr("No matches yet", "نتیجه‌ای پیدا نشد")}</h3>
                <p>
                  {tr(
                    "Try a different search or reset your filters.",
                    "عبارت دیگری را جست‌وجو کنید یا فیلترها را حذف کنید.",
                  )}
                </p>
              </div>
            )}
            {items.length > 0 && (
              <nav
                className="shop-pagination"
                aria-label={tr("Product pages", "صفحه‌های محصولات")}
              >
                <button
                  type="button"
                  aria-label={tr("Previous page", "صفحه قبل")}
                  disabled={page === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  ‹
                </button>
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((number) => (
                  <button
                    type="button"
                    key={number}
                    aria-current={number === page ? "page" : undefined}
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label={tr("Next page", "صفحه بعد")}
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                >
                  ›
                </button>
              </nav>
            )}
          </div>
        </div>
      </section>
      <RelatedContent />
    </>
  );
}

export function RelatedContent() {
  const { tr } = useShop();
  return (
    <section className="shop-related-content">
      <div>
        <p className="shop-overline">
          {tr("BEYOND THE EQUIPMENT", "فراتر از تجهیزات")}
        </p>
        <h2>{tr("Keep your curiosity going.", "کنجکاوی را ادامه دهید.")}</h2>
      </div>
      {[
        [
          "education",
          "sky",
          tr("Learn the night sky", "آسمان شب را بشناسید"),
          tr("Education", "آموزش"),
        ],
        [
          "tours",
          "tour",
          tr("Find a darker sky", "آسمانی تاریک‌تر پیدا کنید"),
          tr("Tours", "تورها"),
        ],
        [
          "magazine",
          "galaxy",
          tr("Stories worth looking up for", "داستان‌هایی برای تماشای آسمان"),
          tr("Magazine", "مجله"),
        ],
      ].map(([route, img, title, label]) => (
        <a className="shop-content-card" href={`/${route}`} key={route}>
          <img
            src={`/images/${img}-400.webp`}
            width="400"
            height="300"
            loading="lazy"
            alt=""
          />
          <div>
            <small>{label}</small>
            <h3>{title}</h3>
            <ArrowUpRight size={19} />
          </div>
        </a>
      ))}
    </section>
  );
}

export function ProductDetails({ id }: { id: string }) {
  const { tr, text, money, state, update, notify } = useShop();
  const [variant, setVariant] = useState(0);
  const p = catalog.find((p) => p.id === id);
  if (!p)
    return (
      <Empty
        title={tr("Product not found", "محصول پیدا نشد")}
        body={tr(
          "Explore the collection to find your next instrument.",
          "تجهیزات مجموعه را مرور کنید.",
        )}
      />
    );
  const eligible =
    state.signedIn &&
    state.orders.some(
      (o) => o.status === "paid" && o.items.some((l) => l.productId === id),
    );
  const reviewed = state.reviews.some((r) => r.productId === id);
  const manual = `${text(p.name)}\n\n${tr("DEMO PRODUCT GUIDE — Sample equipment only", "راهنمای محصول نمایشی — تجهیزات نمونه")}\n\n${text(p.description)}\n\n${p.specs.map(([k, v]) => `${text(k)}: ${text(v)}`).join("\n")}\n\n${tr("Set up on a stable surface. Attach the supplied accessories before observing. Never point optics at the Sun without a suitable certified solar filter. Keep optics dry and use a lens-safe cloth.", "روی سطح پایدار نصب کنید. پیش از رصد لوازم همراه را متصل کنید. هرگز بدون فیلتر خورشیدی استاندارد و مناسب، ابزار اپتیکی را به سمت خورشید نگیرید. عدسی‌ها را خشک نگه دارید و از دستمال مخصوص لنز استفاده کنید.")}`;
  return (
    <div className="shop-detail-page">
      <nav
        className="shop-breadcrumb"
        aria-label={tr("Breadcrumb", "مسیر صفحه")}
      >
        <ShopLink to="/store">{tr("Store", "فروشگاه")}</ShopLink>
        <span>/</span>
        <span>{text(p.name)}</span>
      </nav>
      <section className="shop-detail">
        <Gallery key={id} product={p} large />
        <div className="shop-detail-copy">
          <p className="shop-overline">
            {p.brand} / {text(categories[Number(p.category)])}
          </p>
          <h1>{text(p.name)}</h1>
          <a href="#reviews" className="shop-rating">
            ★{" "}
            {(
              (5 +
                state.reviews
                  .filter((r) => r.productId === id)
                  .reduce((n, r) => n + r.rating, 0)) /
              (1 + state.reviews.filter((r) => r.productId === id).length)
            ).toFixed(1)}{" "}
            · {tr("Demo reviews", "نظرات نمایشی")}
          </a>
          <p>{text(p.description)}</p>
          <div className="shop-detail-price">
            {p.oldPrice && <del>{money(p.oldPrice)}</del>}
            <strong>{money(p.price)}</strong>
            {p.oldPrice && (
              <span className="shop-tag">
                {tr("Save", "صرفه‌جویی")} {money(p.oldPrice - p.price)}
              </span>
            )}
          </div>
          {!p.stock && (
            <p className="shop-stock shop-stock-out">
              {tr("Currently unavailable", "فعلاً ناموجود")}
            </p>
          )}
          <label>
            {tr("Model / finish", "مدل / رنگ")}
            <select
              value={variant}
              onChange={(e) => setVariant(Number(e.target.value))}
            >
              {p.variants.map((v, i) => (
                <option key={i} value={i}>
                  {text(v)}
                </option>
              ))}
            </select>
          </label>
          <div className="shop-detail-actions">
            <AddButton product={p} variant={variant} />
            <WishButton id={p.id} />
          </div>
          <p className="shop-muted">
            {tr(
              "Sample catalog · all amounts in Iranian rials",
              "کاتالوگ نمایشی · همه مبالغ به ریال ایران",
            )}
          </p>
        </div>
      </section>
      <div className="shop-detail-info">
        <section className="shop-panel">
          <h2>{tr("In the details", "جزئیات محصول")}</h2>
          <dl className="shop-breakdown">
            {p.specs.map(([label, value]) => (
              <div key={label.en}>
                <dt>{text(label)}</dt>
                <dd>{text(value)}</dd>
              </div>
            ))}
          </dl>
          <h3>{tr("Inside the box", "محتویات جعبه")}</h3>
          <p>{text(p.included)}</p>
          <a
            download={`${p.id}-manual.txt`}
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(manual)}`}
            className="shop-text-link"
          >
            ↓ {tr("Download product manual", "دانلود راهنمای محصول")}
          </a>
        </section>
        <section className="shop-panel">
          <h2>{tr("Peace of mind", "با خیال آسوده")}</h2>
          <h3>{tr("12-month sample warranty", "ضمانت نمایشی ۱۲ ماهه")}</h3>
          <p>
            {tr(
              "Manufacturing defects are covered in this demo policy. Accidental damage and wear are excluded.",
              "طبق سیاست نمایشی، نقص ساخت تحت پوشش است؛ آسیب اتفاقی و استهلاک شامل ضمانت نیست.",
            )}
          </p>
          <h3>{tr("Returns", "مرجوعی")}</h3>
          <p>
            {p.returnable
              ? tr(
                  "Returnable within 7 days of delivery, unused with original packaging and all included items. Submit a request from your order. Demo policy only.",
                  "تا ۷ روز پس از تحویل، بدون استفاده با بسته‌بندی اصلی و همه اقلام همراه قابل مرجوعی است. درخواست را از سفارش ثبت کنید. سیاست نمایشی.",
                )
              : tr(
                  "This optical accessory is not returnable after opening. Defective items remain covered by the sample warranty.",
                  "این قطعه اپتیکی پس از باز شدن قابل مرجوعی نیست. کالای معیوب تحت پوشش ضمانت نمایشی است.",
                )}
          </p>
        </section>
      </div>
      <section id="reviews" className="shop-panel shop-reviews">
        <h2>{tr("From fellow explorers", "از نگاه همراهان آسمان")}</h2>
        <article>
          <strong>★★★★★ · {tr("Sample review", "نظر نمونه")}</strong>
          <p>
            {tr(
              "Easy to set up and a lovely companion for a first night of observing.",
              "راه‌اندازی آسان و همراهی دلپذیر برای اولین شب رصد.",
            )}
          </p>
        </article>
        {state.reviews
          .filter((r) => r.productId === id)
          .map((r, i) => (
            <article key={i}>
              <strong>
                {"★".repeat(r.rating)} · {r.name}
              </strong>
              <p>{r.body}</p>
            </article>
          ))}
        {eligible && !reviewed ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const body = String(data.get("body")).trim();
              if (body.length < 3) return;
              update((s) => ({
                ...s,
                reviews: [
                  ...s.reviews,
                  {
                    productId: id,
                    rating: Number(data.get("rating")),
                    body,
                    date: new Date().toISOString(),
                    name: s.profile?.name ?? "",
                  },
                ],
              }));
              notify(
                "Your review is published in this demo",
                "نظر شما در نسخه نمایشی ثبت شد",
              );
            }}
          >
            <label>
              {tr("Rating", "امتیاز")}
              <select name="rating">
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} / 5
                  </option>
                ))}
              </select>
            </label>
            <label>
              {tr("Your review", "نظر شما")}
              <textarea name="body" required minLength={3} maxLength={2000} />
            </label>
            <button className="shop-button">
              {tr("Publish review", "ثبت نظر")}
            </button>
          </form>
        ) : (
          <p className="shop-muted">
            {reviewed
              ? tr(
                  "Thank you for sharing your experience.",
                  "از اشتراک تجربه شما سپاسگزاریم.",
                )
              : tr(
                  "You can write a review after a successful demo purchase of this product.",
                  "پس از خرید موفق نمایشی این محصول می‌توانید نظر ثبت کنید.",
                )}
          </p>
        )}
      </section>
      <section className="shop-section">
        <h2>{tr("Similar discoveries", "انتخاب‌های مشابه")}</h2>
        <div className="shop-product-grid">
          {catalog
            .filter((q) => q.id !== id && q.category === p.category)
            .map((q) => (
              <ProductTile key={q.id} product={q} />
            ))}
        </div>
      </section>
      <section className="shop-section">
        <h2>{tr("Complete your setup", "تجهیزات خود را کامل کنید")}</h2>
        <p className="shop-muted">
          {tr(
            "Compatible accessories and related equipment for your observing kit.",
            "لوازم جانبی سازگار و تجهیزات مرتبط برای کیت رصد شما.",
          )}
        </p>
        <div className="shop-product-grid">
          {catalog
            .filter((q) => p.compatibleIds.includes(q.id))
            .map((q) => (
              <ProductTile key={q.id} product={q} />
            ))}
        </div>
      </section>
      <RelatedContent />
    </div>
  );
}
