import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Star,
  ShoppingBag,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useShop } from "./context";
import { type Product, type Totals } from "./model";
import { useImageSwipe } from "../useImageSwipe";
import { siteAsset, sitePath } from "../site";

export function ShopLink({
  to,
  children,
  className = "",
  ...props
}: {
  to: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-current"?: "page";
}) {
  const { navigate } = useShop();
  return (
    <a
      {...props}
      href={sitePath(to)}
      className={className}
      onClick={(e) => {
        if (
          e.button === 0 &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.shiftKey &&
          !e.altKey
        ) {
          e.preventDefault();
          navigate(to);
        }
      }}
    >
      {children}
    </a>
  );
}
export function Empty({ title, body }: { title: string; body: string }) {
  const { tr } = useShop();
  return (
    <div className="shop-empty">
      <ShoppingBag size={40} />
      <h2>{title}</h2>
      <p>{body}</p>
      <ShopLink className="shop-button" to="/store">
        {tr("Explore equipment", "کاوش تجهیزات")}
      </ShopLink>
    </div>
  );
}
export function Gallery({
  product,
  large = false,
}: {
  product: Product;
  large?: boolean;
}) {
  const { text, tr, language } = useShop();
  const [index, setIndex] = useState(0);
  const move = (step: number) =>
    setIndex((i) => (i + step + product.images.length) % product.images.length);
  const swipe = useImageSwipe(language, move);
  return (
    <div className={`shop-gallery ${large ? "large" : ""}`} {...swipe}>
      <img
        src={siteAsset(`/images/${product.images[index]}-800.webp`)}
        alt={`${text(product.name)} — ${index + 1}`}
        width="800"
        height="600"
        loading={large ? "eager" : "lazy"}
      />
      <div className="shop-gallery-controls">
        <button
          aria-label={`${tr("Previous image", "تصویر قبلی")}: ${text(product.name)}`}
          onClick={(event) => {
            event.stopPropagation();
            move(-1);
          }}
        >
          <ChevronLeft size={17} />
        </button>
        <span>
          {index + 1} / {product.images.length}
        </span>
        <button
          aria-label={`${tr("Next image", "تصویر بعدی")}: ${text(product.name)}`}
          onClick={(event) => {
            event.stopPropagation();
            move(1);
          }}
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}
export function WishButton({ id }: { id: string }) {
  const { state, wish, tr } = useShop();
  const saved = state.wishlist.includes(id);
  return (
    <button
      className={`shop-icon ${saved ? "saved" : ""}`}
      aria-label={tr("Save to wishlist", "ذخیره در علاقه‌مندی‌ها")}
      aria-pressed={saved}
      onClick={(event) => {
        event.stopPropagation();
        wish(id);
      }}
    >
      <Heart size={19} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
export function AddButton({
  product,
  variant = 0,
}: {
  product: Product;
  variant?: number;
}) {
  const { state, add, quantity, tr, notify, text } = useShop();
  const line = state.cart.find(
    (item) => item.productId === product.id && item.variant === variant,
  );
  const count = line?.quantity ?? 0;
  const limit =
    state.cart
      .filter((l) => l.productId === product.id)
      .reduce((n, l) => n + l.quantity, 0) >= product.stock;
  if (count > 0) {
    return (
      <div
        className="shop-cart-stepper"
        aria-label={`${tr("Quantity in basket", "تعداد در سبد")}: ${text(product.name)}`}
      >
        <button
          type="button"
          aria-label={`${tr("Decrease quantity", "کاهش تعداد")}: ${text(product.name)}`}
          onClick={(event) => {
            event.stopPropagation();
            quantity(product.id, variant, count - 1);
          }}
        >
          <Minus size={16} />
        </button>
        <output aria-live="polite" aria-label={tr("Quantity", "تعداد")}>
          {count}
        </output>
        <button
          type="button"
          disabled={limit}
          aria-label={`${tr("Increase quantity", "افزایش تعداد")}: ${text(product.name)}`}
          onClick={(event) => {
            event.stopPropagation();
            quantity(product.id, variant, count + 1);
          }}
        >
          <Plus size={16} />
        </button>
      </div>
    );
  }
  return (
    <button
      type="button"
      className="shop-button"
      disabled={limit}
      onClick={(event) => {
        event.stopPropagation();
        add(product.id, variant);
        notify("Added to your bag", "به سبد خرید اضافه شد");
      }}
    >
      <Plus size={17} />
      {!product.stock
        ? tr("Out of stock", "ناموجود")
        : limit
          ? tr("Stock limit reached", "حد موجودی")
          : tr("Add to cart", "افزودن به سبد خرید")}
    </button>
  );
}
export function ProductTile({ product }: { product: Product }) {
  const { text, money, tr, state, navigate } = useShop();
  const reviews = state.reviews.filter((r) => r.productId === product.id);
  const rating = (
    (5 + reviews.reduce((n, r) => n + r.rating, 0)) /
    (reviews.length + 1)
  ).toFixed(1);
  return (
    <article
      className="shop-product"
      role="link"
      tabIndex={0}
      aria-label={text(product.name)}
      onClick={() => navigate(`/store/product/${product.id}`)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/store/product/${product.id}`);
        }
      }}
    >
      <div className="shop-product-media">
        <Gallery product={product} />
        <div className="shop-product-badges">
          <span className="shop-tag">
            {product.oldPrice
              ? `−${Math.round((1 - product.price / product.oldPrice) * 100)}%`
              : tr("Selected", "منتخب")}
          </span>
          <WishButton id={product.id} />
        </div>
      </div>
      <div className="shop-product-copy">
        <span className="shop-overline">
          {product.brand}{" "}
          {!product.stock && (
            <span className="shop-stock shop-stock-out">
              {tr("Out of stock", "ناموجود")}
            </span>
          )}
        </span>
        <h3>{text(product.name)}</h3>
        <div className="shop-price">
          {product.oldPrice && <del>{money(product.oldPrice)}</del>}
          <strong>{money(product.price)}</strong>
        </div>
        <div className="shop-product-bottom">
          <span className="shop-rating">
            <Star size={13} fill="currentColor" />
            {rating} <small>{tr("Demo rating", "امتیاز نمایشی")}</small>
          </span>
        </div>
        <AddButton product={product} />
      </div>
    </article>
  );
}
export function Breakdown({
  totals,
  shippingKnown = false,
}: {
  totals: Totals;
  shippingKnown?: boolean;
}) {
  const { tr, money } = useShop();
  return (
    <dl className="shop-breakdown">
      <div>
        <dt>{tr("Subtotal (before offers)", "جمع قبل از تخفیف")}</dt>
        <dd>{money(totals.subtotal + totals.productDiscount)}</dd>
      </div>
      <div>
        <dt>{tr("Product savings", "تخفیف کالا")}</dt>
        <dd>− {money(totals.productDiscount)}</dd>
      </div>
      <div>
        <dt>{tr("Voucher", "کد تخفیف")}</dt>
        <dd>− {money(totals.voucherDiscount)}</dd>
      </div>
      <div>
        <dt>{tr("AvaStar coins", "سکه آوااستار")}</dt>
        <dd>− {money(totals.coinDeduction)}</dd>
      </div>
      <div>
        <dt>{tr("Delivery", "ارسال")}</dt>
        <dd>
          {shippingKnown
            ? money(totals.shipping)
            : tr("Calculated at checkout", "در تسویه‌حساب محاسبه می‌شود")}
        </dd>
      </div>
      <div className="shop-payable">
        <dt>{tr("Payable total", "مبلغ قابل پرداخت")}</dt>
        <dd>{money(totals.total)}</dd>
      </div>
    </dl>
  );
}
