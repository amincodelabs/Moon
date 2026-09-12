import { useEffect, useMemo, useRef, useState } from "react";
import {
  ShoppingBag,
  UserRound,
  Sparkles,
  MessageCircle,
  Bot,
  Headphones,
  Send,
  Search,
  ChevronDown,
} from "lucide-react";
import { usePreferences } from "../preferences";
import { Preferences } from "../components/Header";
import { Modal } from "../components/Primitives";
import { StoreContext, useShop } from "./context";
import { promotion, useStore, catalog } from "./model";
import { Catalog, ProductDetails } from "./Catalog";
import { Breadcrumbs } from "./Breadcrumbs";
import { Account, Auth } from "./Account";
import { Cart, Checkout, Payment } from "./Purchase";
import { Empty, ProductTile, ShopLink } from "./ui";
import "./store.css";

function Chat({ close }: { close: () => void }) {
  const { tr } = useShop();
  const { t } = usePreferences();
  const [mode, setMode] = useState("ai");
  const [messages, setMessages] = useState<{ mode: string; body: string }[]>(
    [],
  );
  return (
    <Modal
      title={tr("A little help exploring", "کمی کمک برای کاوش")}
      t={t}
      close={close}
    >
      <div className="shop-chat">
        <div className="shop-collections">
          <button aria-pressed={mode === "ai"} onClick={() => setMode("ai")}>
            <Bot size={16} />
            {tr("AI guide", "راهنمای هوشمند")}
          </button>
          <button
            aria-pressed={mode === "support"}
            onClick={() => setMode("support")}
          >
            <Headphones size={16} />
            {tr("Customer support", "پشتیبانی")}
          </button>
        </div>
        <p className="shop-notice">
          {tr(
            "Chat interface preview. Messages stay on this screen; no AI or support agent is connected.",
            "پیش‌نمایش رابط گفتگو. پیام‌ها در همین صفحه می‌مانند؛ هوش مصنوعی یا پشتیبان متصل نیست.",
          )}
        </p>
        <div className="shop-chat-messages" role="log" aria-live="polite">
          {messages
            .filter((m) => m.mode === mode)
            .map((m, i) => (
              <p key={i}>
                {m.body}
                <small>
                  {tr("Preview only · not sent", "فقط پیش‌نمایش · ارسال نشده")}
                </small>
              </p>
            ))}
        </div>
        <form
          className="shop-inline"
          onSubmit={(e) => {
            e.preventDefault();
            const body = String(
              new FormData(e.currentTarget).get("message"),
            ).trim();
            if (body) setMessages((m) => [...m, { mode, body }]);
            e.currentTarget.reset();
          }}
        >
          <input
            name="message"
            required
            maxLength={1000}
            aria-label={tr("Your message", "پیام شما")}
            placeholder={
              mode === "ai"
                ? tr("Ask about equipment…", "درباره تجهیزات بپرسید…")
                : tr(
                    "Ask about an order or return…",
                    "درباره سفارش یا مرجوعی بپرسید…",
                  )
            }
          />
          <button
            className="shop-icon"
            aria-label={tr("Preview message", "پیش‌نمایش پیام")}
          >
            <Send size={19} />
          </button>
        </form>
      </div>
    </Modal>
  );
}
export default function StoreApp() {
  const preferences = usePreferences();
  const store = useStore();
  const [path, setPath] = useState(location.pathname + location.search);
  const [searchQuery, setSearchQuery] = useState(
    () => new URLSearchParams(location.search).get("q") ?? "",
  );
  const searchHints = useMemo(
    () =>
      preferences.language === "fa"
        ? ["تلسکوپ برای شروع", "چشمی میدان‌باز", "دوربین دوچشمی ۱۰×۵۰"]
        : [
            "a telescope for beginners",
            "a widefield eyepiece",
            "10×50 binoculars",
          ],
    [preferences.language],
  );
  const [searchHintIndex, setSearchHintIndex] = useState(0);
  const [searchHintText, setSearchHintText] = useState("");
  const [searchHintDeleting, setSearchHintDeleting] = useState(false);
  const [toast, setToast] = useState<{ en: string; fa: string } | null>(null);
  const [chat, setChat] = useState(false);
  const categoryMenuRef = useRef<HTMLDetailsElement>(null);
  const tr = (en: string, fa: string) =>
    preferences.language === "fa" ? fa : en;
  const navigate = (next: string) => {
    if (next !== location.pathname + location.search)
      history.pushState(null, "", next);
    setPath(next);
    setSearchQuery(new URLSearchParams(next.split("?")[1]).get("q") ?? "");
  };
  useEffect(() => {
    const pop = () => {
      setPath(location.pathname + location.search);
      setSearchQuery(new URLSearchParams(location.search).get("q") ?? "");
    };
    addEventListener("popstate", pop);
    return () => removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    setSearchHintIndex(0);
    setSearchHintText("");
    setSearchHintDeleting(false);
  }, [preferences.language]);
  useEffect(() => {
    const target = searchHints[searchHintIndex];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSearchHintText(target);
      return;
    }
    const complete = searchHintText === target;
    const empty = searchHintText.length === 0;
    const delay = searchHintDeleting
      ? empty
        ? 320
        : 28
      : complete
        ? 2400
        : 45;
    const timer = window.setTimeout(() => {
      if (searchHintDeleting) {
        setSearchHintText((current) => current.slice(0, -1));
        if (searchHintText.length === 1) {
          setSearchHintDeleting(false);
          setSearchHintIndex((current) => (current + 1) % searchHints.length);
        }
      } else if (complete) {
        setSearchHintDeleting(true);
      } else {
        setSearchHintText(target.slice(0, searchHintText.length + 1));
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [searchHintDeleting, searchHintIndex, searchHintText, searchHints]);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      const menu = categoryMenuRef.current;
      if (
        menu?.open &&
        event.target instanceof Node &&
        !menu.contains(event.target)
      ) {
        menu.open = false;
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.getElementById("shop-main")?.focus({ preventScroll: true });
  }, [path]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    document.title = `${preferences.language === "fa" ? "فروشگاه آوااستار" : "AvaStar Store"} · ${decodeURIComponent(path.split("/").filter(Boolean).at(-1)?.split("?")[0] ?? "")}`;
  }, [path, preferences.language]);
  const segments = path.split("?")[0].split("/").filter(Boolean);
  const page = segments[1] ?? "catalog";
  const params = new URLSearchParams(path.split("?")[1]);
  const count = store.state.cart.reduce((n, l) => n + l.quantity, 0);
  const values = {
    ...store,
    language: preferences.language,
    tr,
    text: (value: { en: string; fa: string }) => value[preferences.language],
    money: (n: number) =>
      `${new Intl.NumberFormat(preferences.language === "fa" ? "fa-IR" : "en-US").format(n)} ${tr("IRR", "ریال")}`,
    navigate,
    notify: (en: string, fa: string) => setToast({ en, fa }),
    path,
    searchQuery,
    setSearchQuery,
  };
  return (
    <StoreContext.Provider value={values}>
      <div className="shop-app">
        <a href="#shop-main" className="skip-link">
          {tr("Skip to content", "رفتن به محتوا")}
        </a>
        <div className="shop-masthead">
          {Date.now() < Date.parse(promotion.expires) && (
            <div className="shop-promotion">
              <Sparkles size={13} />
              <span>
                {values.text(promotion.title)} · {values.text(promotion.body)}
              </span>
              <ShopLink to={promotion.destination}>
                {tr("Explore", "کاوش")} ↗
              </ShopLink>
            </div>
          )}
          <header className="shop-header">
            <a
              href="/"
              className="shop-brand"
              aria-label={tr("AvaStar home", "صفحه اصلی آوااستار")}
            >
              <img src="/avastar-logo.svg" alt="AvaStar" />
            </a>
            <div className="shop-header-search">
              <Search size={17} aria-hidden="true" />
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  navigate(
                    searchQuery.trim()
                      ? `/store/search?q=${encodeURIComponent(searchQuery.trim())}`
                      : "/store",
                  );
                }}
              >
                <input
                  aria-label={tr("Search products", "جست‌وجوی محصولات")}
                  placeholder={searchHintText}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </form>
            </div>
            <details ref={categoryMenuRef} className="shop-category-menu">
              <summary>
                {tr("Shop categories", "دسته‌بندی‌های فروشگاه")}{" "}
                <ChevronDown size={15} />
              </summary>
              <div
                className="shop-category-dropdown"
                onClick={() => {
                  if (categoryMenuRef.current)
                    categoryMenuRef.current.open = false;
                }}
              >
                <div className="shop-category-group">
                  <strong>{tr("Telescopes", "تلسکوپ‌ها")}</strong>
                  <ShopLink to="/store/category/telescopes">
                    {tr("All telescopes", "همه تلسکوپ‌ها")}
                  </ShopLink>
                  <ShopLink to="/store/category/telescopes?q=Refractor">
                    {tr("Refractor telescopes", "تلسکوپ‌های شکستی")}
                  </ShopLink>
                  <ShopLink to="/store/category/telescopes?q=Explorer">
                    {tr("Explorer telescopes", "تلسکوپ‌های اکسپلورر")}
                  </ShopLink>
                  <ShopLink to="/store/category/telescopes?q=kit">
                    {tr("Complete telescope kits", "کیت‌های کامل تلسکوپ")}
                  </ShopLink>
                </div>
                <div className="shop-category-group">
                  <strong>{tr("Binoculars", "دوربین‌های دوچشمی")}</strong>
                  <ShopLink to="/store/category/binoculars">
                    {tr("All binoculars", "همه دوربین‌های دوچشمی")}
                  </ShopLink>
                  <ShopLink to="/store/category/binoculars?q=10%C3%9750">
                    {tr("10×50 binoculars", "دوربین‌های ۱۰×۵۰")}
                  </ShopLink>
                  <ShopLink to="/store/category/binoculars?q=Compact">
                    {tr("Compact binoculars", "دوربین‌های کامپکت")}
                  </ShopLink>
                </div>
                <div className="shop-category-group">
                  <strong>{tr("Accessories", "لوازم جانبی")}</strong>
                  <ShopLink to="/store/category/accessories">
                    {tr("All accessories", "همه لوازم جانبی")}
                  </ShopLink>
                  <ShopLink to="/store/category/accessories?q=Eyepiece">
                    {tr("Eyepieces", "چشمی‌ها")}
                  </ShopLink>
                  <ShopLink to="/store/category/accessories?q=Widefield">
                    {tr("Widefield viewing", "تماشای میدان‌باز")}
                  </ShopLink>
                  <ShopLink to="/store/category/accessories?q=Torch">
                    {tr("Observing essentials", "ملزومات رصد")}
                  </ShopLink>
                </div>
                <div className="shop-category-feature">
                  <span>
                    {tr("Find your next view", "نمای بعدی خود را پیدا کنید")}
                  </span>
                  <ShopLink to="/store">
                    {tr("Browse all products", "مشاهده همه محصولات")} ↗
                  </ShopLink>
                </div>
              </div>
            </details>
            <div className="shop-header-actions">
              <Preferences {...preferences} />
              <ShopLink
                to="/store/account"
                className="shop-icon"
                aria-label={tr("My account", "حساب من")}
              >
                <UserRound size={20} />
              </ShopLink>
              <ShopLink
                to="/store/cart"
                className="shop-bag"
                aria-label={`${tr("Cart", "سبد خرید")} (${count})`}
              >
                <ShoppingBag size={20} />
                <span>{count}</span>
              </ShopLink>
            </div>
          </header>
        </div>
        <main
          id="shop-main"
          tabIndex={-1}
          className={`shop-main ${page === "catalog" || page === "search" || page === "category" ? "shop-main-catalog" : ""} ${page === "search" || page === "category" ? "shop-main-results" : ""}`}
        >
          <Breadcrumbs />
          {page === "catalog" ? (
            <Catalog />
          ) : page === "search" || page === "category" ? (
            <Catalog />
          ) : page === "product" ? (
            <ProductDetails key={segments[2]} id={segments[2]} />
          ) : page === "cart" ? (
            <Cart />
          ) : page === "checkout" ? (
            <Checkout />
          ) : page === "payment" ? (
            <Payment key={segments[2]} id={segments[2]} />
          ) : ["login", "register", "recovery"].includes(page) ? (
            <Auth
              key={page}
              mode={page}
              next={params.get("next") ?? "/store/account"}
            />
          ) : page === "account" ? (
            <Account
              key={segments.slice(2).join("/")}
              tab={segments[2]}
              orderId={segments[3]}
            />
          ) : page === "wishlist" ? (
            <>
              <h1>{tr("Your wishlist", "علاقه‌مندی‌های شما")}</h1>
              {store.state.wishlist.length ? (
                <div className="shop-product-grid">
                  {catalog
                    .filter((p) => store.state.wishlist.includes(p.id))
                    .map((p) => (
                      <ProductTile product={p} key={p.id} />
                    ))}
                </div>
              ) : (
                <Empty
                  title={tr(
                    "Keep a little inspiration",
                    "کمی الهام ذخیره کنید",
                  )}
                  body={tr(
                    "Save products using the heart. They will be here when you return.",
                    "با دکمه قلب محصولات را ذخیره کنید تا هنگام بازگشت اینجا باشند.",
                  )}
                />
              )}
            </>
          ) : (
            <Empty
              title={tr("Page not found", "صفحه پیدا نشد")}
              body={tr(
                "Let's find your way back to the stars.",
                "به مسیر کشف ستاره‌ها برگردیم.",
              )}
            />
          )}
        </main>
        <footer className="shop-footer">
          <div>
            <a href="/" className="shop-brand">
              <img
                src="/avastar-logo.svg"
                alt="AvaStar"
                width="200"
                height="84"
              />
            </a>
            <p>
              {tr("For a lifetime of looking up.", "برای یک عمر تماشای آسمان.")}
            </p>
          </div>
          <nav aria-label={tr("Explore AvaStar", "کاوش آوااستار")}>
            <a href="/">{tr("Home", "خانه")}</a>
            <a href="/tours">{tr("Tours", "تورها")}</a>
            <a href="/education">{tr("Education", "آموزش")}</a>
            <a href="/magazine">{tr("Magazine", "مجله")}</a>
          </nav>
          <p className="shop-muted">
            {tr(
              "Demo store · sample products and policies · prices in Iranian rials · no real payments or shipments.",
              "فروشگاه نمایشی · کالاها و سیاست‌های نمونه · قیمت‌ها به ریال ایران · بدون پرداخت یا ارسال واقعی.",
            )}
          </p>
        </footer>
        <button
          className="shop-chat-launcher"
          aria-label={tr("Open chat", "باز کردن گفتگو")}
          onClick={() => setChat(true)}
        >
          <MessageCircle size={22} />
          <span>{tr("Need a hand?", "کمک می‌خواهید؟")}</span>
        </button>
        {chat && <Chat close={() => setChat(false)} />}
        <div className="shop-toast" role="status" aria-live="polite">
          {toast && <span>{toast[preferences.language]}</span>}
        </div>
      </div>
    </StoreContext.Provider>
  );
}
