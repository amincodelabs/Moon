import { useState } from "react";
import {
  Coins,
  ShieldCheck,
  Minus,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useShop } from "./context";
import { calculate, productById, promotion, type Order } from "./model";
import { Breakdown, Empty, ShopLink } from "./ui";
import { AddressForm, Auth, Receipt } from "./Account";
import { siteAsset } from "../site";

export function CoinVoucher({ delivery }: { delivery?: string }) {
  const { tr, state, update, money } = useShop();
  const [code, setCode] = useState(state.voucher);
  const [error, setError] = useState("");
  const totals = calculate(state, delivery);
  return (
    <>
      <form
        className="shop-voucher"
        onSubmit={(e) => {
          e.preventDefault();
          if (
            code.trim().toUpperCase() !== "SKY10" ||
            Date.now() >= Date.parse(promotion.expires)
          ) {
            setError(
              tr(
                "This voucher is invalid or expired.",
                "کد تخفیف نامعتبر یا منقضی شده است.",
              ),
            );
            return;
          }
          update((s) => ({ ...s, voucher: "SKY10" }));
          setError("");
        }}
      >
        <label>
          {tr("Voucher code", "کد تخفیف")}
          <div className="shop-inline">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="SKY10"
              aria-label={tr("Voucher code", "کد تخفیف")}
            />
            <button className="shop-secondary">{tr("Apply", "اعمال")}</button>
          </div>
        </label>
        {error && (
          <p role="alert" className="shop-error">
            {error}
          </p>
        )}
        {state.voucher && (
          <p>
            {state.voucher}{" "}
            <button
              type="button"
              className="shop-text-link"
              onClick={() => {
                update((s) => ({ ...s, voucher: "" }));
                setCode("");
              }}
            >
              {tr("Remove voucher", "حذف کد تخفیف")}
            </button>
          </p>
        )}
      </form>
      <div className="shop-coins">
        <h3>
          <Coins size={19} />
          {tr("AvaStar coins", "سکه آوااستار")}
        </h3>
        <p>
          {tr("Available balance", "موجودی سکه")}:{" "}
          {state.signedIn ? state.coins : "—"}
        </p>
        <p>
          {tr("Eligible for this purchase", "قابل استفاده در این خرید")}:{" "}
          {totals.eligibleCoins} = {money(totals.eligibleCoins * 10000)}
        </p>
        <p className="shop-muted">
          {tr(
            "1 coin = 10,000 IRR. Redeem up to 10% of your purchase after voucher savings. The demo account starts with 240 coins.",
            "هر سکه ۱۰٬۰۰۰ ریال است. تا ۱۰٪ مبلغ پس از کد تخفیف قابل استفاده است. حساب نمایشی با ۲۴۰ سکه شروع می‌شود.",
          )}
        </p>
        <label className="shop-choice">
          <input
            type="checkbox"
            checked={state.useCoins && state.signedIn}
            disabled={!totals.eligibleCoins}
            onChange={(e) =>
              update((s) => ({ ...s, useCoins: e.target.checked }))
            }
          />
          {tr("Use eligible coins", "استفاده از سکه‌های مجاز")}
        </label>
        {!state.signedIn && (
          <ShopLink
            to="/store/login?next=%2Fstore%2Fcart"
            className="shop-text-link"
          >
            {tr("Sign in to use coins", "برای استفاده از سکه وارد شوید")}
          </ShopLink>
        )}
      </div>
    </>
  );
}
export function Cart() {
  const { tr, text, state, quantity, money } = useShop();
  if (!state.cart.length)
    return (
      <Empty
        title={tr(
          "Your bag is waiting for a discovery",
          "سبد شما منتظر یک کشف تازه است",
        )}
        body={tr(
          "Add something you love. Your bag stays with you when you sign in.",
          "محصول دلخواه را اضافه کنید. سبد هنگام ورود به حساب حفظ می‌شود.",
        )}
      />
    );
  return (
    <>
      <div className="shop-section-heading">
        <div>
          <p className="shop-overline">
            {tr("YOUR NEXT ADVENTURE", "ماجراجویی بعدی شما")}
          </p>
          <h1>{tr("Shopping cart", "سبد خرید")}</h1>
        </div>
        <ShopLink to="/store" className="shop-text-link">
          {tr("Continue exploring", "ادامه کاوش")} ↗
        </ShopLink>
      </div>
      <div className="shop-checkout-layout">
        <div>
          {state.cart.map((l) => {
            const p = productById(l.productId);
            return (
              <article
                className="shop-cart-line shop-panel"
                key={`${l.productId}-${l.variant}`}
              >
                <ShopLink to={`/store/product/${p.id}`}>
                  <img
                    src={siteAsset(`/images/${p.images[0]}-400.webp`)}
                    alt={text(p.name)}
                    width="140"
                    height="140"
                  />
                </ShopLink>
                <div>
                  <h2>
                    <ShopLink to={`/store/product/${p.id}`}>
                      {text(p.name)}
                    </ShopLink>
                  </h2>
                  <p>{text(p.variants[l.variant])}</p>
                  <p>
                    {money(p.price)} {tr("each", "برای هر عدد")}
                  </p>
                  <details>
                    <summary>
                      {p.returnable
                        ? tr(
                            "Returnable · see conditions",
                            "قابل مرجوعی · شرایط",
                          )
                        : tr(
                            "Limited returns · see conditions",
                            "مرجوعی محدود · شرایط",
                          )}
                    </summary>
                    <p>
                      {p.returnable
                        ? tr(
                            "Within 7 days of delivery, unused, in original packaging with all included items. Demo policy.",
                            "تا ۷ روز پس از تحویل، بدون استفاده در بسته‌بندی اصلی با همه اقلام همراه. سیاست نمایشی.",
                          )
                        : tr(
                            "Not returnable once opened. Defects are covered by the demo warranty.",
                            "پس از باز شدن قابل مرجوعی نیست. نقص کالا تحت پوشش ضمانت نمایشی است.",
                          )}
                    </p>
                  </details>
                  <div className="shop-cart-controls">
                    <div className="shop-quantity">
                      <button
                        aria-label={`${tr("Decrease quantity", "کاهش تعداد")}: ${text(p.name)}`}
                        onClick={() =>
                          quantity(p.id, l.variant, l.quantity - 1)
                        }
                      >
                        <Minus size={16} />
                      </button>
                      <output aria-label={tr("Quantity", "تعداد")}>
                        {l.quantity}
                      </output>
                      <button
                        aria-label={`${tr("Increase quantity", "افزایش تعداد")}: ${text(p.name)}`}
                        disabled={
                          state.cart
                            .filter((v) => v.productId === p.id)
                            .reduce((n, v) => n + v.quantity, 0) >= p.stock
                        }
                        onClick={() =>
                          quantity(p.id, l.variant, l.quantity + 1)
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      className="shop-icon"
                      aria-label={`${tr("Remove item", "حذف کالا")}: ${text(p.name)}`}
                      onClick={() => quantity(p.id, l.variant, 0)}
                    >
                      <Trash2 size={17} />
                    </button>
                    <strong>{money(p.price * l.quantity)}</strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <aside className="shop-panel shop-summary">
          <h2>{tr("Order summary", "خلاصه سفارش")}</h2>
          <CoinVoucher />
          <Breakdown totals={calculate(state)} />
          <ShopLink to="/store/checkout" className="shop-button">
            {tr("Continue to checkout", "ادامه و تسویه‌حساب")}
          </ShopLink>
          <p className="shop-muted">
            <ShieldCheck size={15} />{" "}
            {tr(
              "Demo checkout · no real charges",
              "تسویه‌حساب نمایشی · بدون پرداخت واقعی",
            )}
          </p>
        </aside>
      </div>
    </>
  );
}
export function Checkout() {
  const { tr, text, money, state, update, navigate } = useShop();
  const [addressId, setAddressId] = useState(state.addresses[0]?.id ?? "");
  const [adding, setAdding] = useState(!state.addresses.length);
  const [delivery, setDelivery] = useState("standard");
  const [method, setMethod] = useState("online");
  const [review, setReview] = useState(false);
  if (!state.cart.length)
    return (
      <Empty
        title={tr("Your bag is empty", "سبد خرید خالی است")}
        body={tr(
          "Choose your equipment before checking out.",
          "پیش از تسویه‌حساب تجهیزات را انتخاب کنید.",
        )}
      />
    );
  if (!state.signedIn) return <Auth next="/store/checkout" />;
  const address = state.addresses.find((a) => a.id === addressId);
  const totals = calculate(state, delivery);
  return (
    <>
      <div className="shop-section-heading">
        <div>
          <p className="shop-overline">
            {tr("ONE STEP CLOSER", "یک قدم نزدیک‌تر")}
          </p>
          <h1>{tr("Checkout", "تسویه‌حساب")}</h1>
        </div>
        <span className="shop-muted">
          {tr(
            "1 · Address → 2 · Review → 3 · Payment",
            "۱ · آدرس ← ۲ · بازبینی ← ۳ · پرداخت",
          )}
        </span>
      </div>
      <div className="shop-checkout-layout">
        <div>
          {!review ? (
            <>
              <section className="shop-panel">
                <h2>{tr("Where should we send it?", "کجا ارسال کنیم؟")}</h2>
                <div className="shop-address-grid">
                  {state.addresses.map((a) => (
                    <label
                      className={`shop-address-choice ${a.id === addressId ? "selected" : ""}`}
                      key={a.id}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={a.id === addressId}
                        onChange={() => setAddressId(a.id)}
                      />
                      <strong>
                        {a.label} · {a.recipient}
                      </strong>
                      <span>
                        {a.city} — {a.street}
                      </span>
                      <bdi>
                        {a.phone} · {a.postal}
                      </bdi>
                    </label>
                  ))}
                </div>
                {adding ? (
                  <AddressForm
                    done={(id) => {
                      if (id) setAddressId(id);
                      setAdding(false);
                    }}
                  />
                ) : (
                  <button
                    className="shop-secondary"
                    onClick={() => setAdding(true)}
                  >
                    {tr("Add a new address", "افزودن آدرس جدید")}
                  </button>
                )}
              </section>
              <section className="shop-panel">
                <h2>{tr("Delivery method", "روش ارسال")}</h2>
                {[
                  [
                    "standard",
                    tr("Standard delivery", "ارسال عادی"),
                    tr("3–5 business days", "۳ تا ۵ روز کاری"),
                    600000,
                  ],
                  [
                    "express",
                    tr("Express delivery", "ارسال سریع"),
                    tr("1–2 business days", "۱ تا ۲ روز کاری"),
                    1200000,
                  ],
                ].map(([key, label, eta, cost]) => (
                  <label className="shop-option" key={key}>
                    <input
                      type="radio"
                      name="delivery"
                      checked={delivery === key}
                      onChange={() => setDelivery(String(key))}
                    />
                    <span>
                      <strong>{label}</strong>
                      <small>{eta}</small>
                    </span>
                    <b>{money(Number(cost))}</b>
                  </label>
                ))}
              </section>
              <section className="shop-panel">
                <h2>{tr("Payment method", "روش پرداخت")}</h2>
                {[
                  [
                    "online",
                    tr("Online payment gateway", "درگاه پرداخت آنلاین"),
                  ],
                  ["snapp", "SnappPay"],
                ].map(([key, label]) => (
                  <label className="shop-option" key={key}>
                    <input
                      type="radio"
                      name="payment"
                      checked={method === key}
                      onChange={() => setMethod(key)}
                    />
                    <span>
                      {label}
                      <small>
                        {tr("Simulated payment", "پرداخت شبیه‌سازی‌شده")}
                      </small>
                    </span>
                  </label>
                ))}
              </section>
              <button
                className="shop-button"
                disabled={!address}
                onClick={() => {
                  setReview(true);
                  window.scrollTo(0, 0);
                }}
              >
                {tr("Review order", "بازبینی سفارش")}
              </button>
            </>
          ) : (
            <section className="shop-panel">
              <h2>{tr("Everything look right?", "همه‌چیز درست است؟")}</h2>
              {state.cart.map((l) => (
                <div
                  className="shop-order-line"
                  key={`${l.productId}-${l.variant}`}
                >
                  <img
                    src={siteAsset(
                      `/images/${productById(l.productId).images[0]}-400.webp`,
                    )}
                    width="80"
                    height="80"
                    alt=""
                  />
                  <div>
                    <strong>{text(productById(l.productId).name)}</strong>
                    <p>
                      {text(productById(l.productId).variants[l.variant])} ×{" "}
                      {l.quantity} ·{" "}
                      {money(productById(l.productId).price * l.quantity)}
                    </p>
                  </div>
                </div>
              ))}
              <h3>{tr("Recipient & address", "گیرنده و آدرس")}</h3>
              <p>
                {address?.recipient} · {address?.phone}
                <br />
                {address?.city} — {address?.street}
                <br />
                {address?.postal}
              </p>
              <p>
                {delivery === "express"
                  ? tr("Express · 1–2 business days", "سریع · ۱ تا ۲ روز کاری")
                  : tr(
                      "Standard · 3–5 business days",
                      "عادی · ۳ تا ۵ روز کاری",
                    )}
              </p>
              <p>
                {method === "snapp"
                  ? "SnappPay"
                  : tr("Online gateway", "درگاه آنلاین")}
              </p>
              <p className="shop-notice">
                {tr(
                  "This is a demo order. The next screen simulates payment success or failure; no money is transferred.",
                  "این سفارش نمایشی است. صفحه بعد موفقیت یا شکست پرداخت را شبیه‌سازی می‌کند؛ پولی منتقل نمی‌شود.",
                )}
              </p>
              <div className="shop-inline">
                <button
                  className="shop-secondary"
                  onClick={() => setReview(false)}
                >
                  {tr("Edit details", "ویرایش جزئیات")}
                </button>
                <button
                  className="shop-button"
                  disabled={!address}
                  onClick={() => {
                    if (!address || !state.signedIn || !state.cart.length)
                      return;
                    const order: Order = {
                      id: `AV-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
                      date: new Date().toISOString(),
                      items: state.cart.map((l) => ({ ...l })),
                      address: { ...address },
                      delivery,
                      method,
                      status: "pending",
                      totals,
                    };
                    update((s) => ({ ...s, orders: [order, ...s.orders] }));
                    navigate(`/store/payment/${order.id}`);
                  }}
                >
                  {tr("Confirm & proceed to payment", "تأیید و ادامه پرداخت")}
                </button>
              </div>
            </section>
          )}
        </div>
        <aside className="shop-panel shop-summary">
          <h2>{tr("Your order", "سفارش شما")}</h2>
          {!review && <CoinVoucher delivery={delivery} />}
          <Breakdown totals={totals} shippingKnown />
        </aside>
      </div>
    </>
  );
}
export function Payment({ id }: { id: string }) {
  const { tr, state, update, money, navigate } = useShop();
  const [failed, setFailed] = useState(
    () => state.orders.find((o) => o.id === id)?.status === "failed",
  );
  if (!state.signedIn) return <Auth next={`/store/payment/${id}`} />;
  const order = state.orders.find((o) => o.id === id);
  if (!order)
    return (
      <Empty
        title={tr("Order not found", "سفارش پیدا نشد")}
        body={tr(
          "Return to your orders to try again.",
          "برای تلاش دوباره به سفارش‌های خود برگردید.",
        )}
      />
    );
  if (order.status === "paid")
    return (
      <div className="shop-payment shop-panel">
        <CheckCircle2 size={54} />
        <p className="shop-overline">
          {tr("A NEW ADVENTURE AWAITS", "ماجراجویی تازه در انتظار شماست")}
        </p>
        <h1>{tr("You're all set.", "همه‌چیز آماده است.")}</h1>
        <p>
          {tr(
            "Demo payment successful. Your order is confirmed.",
            "پرداخت نمایشی موفق بود. سفارش شما تأیید شد.",
          )}
        </p>
        <strong>{order.id}</strong>
        <p>{money(order.totals.total)}</p>
        <div className="shop-inline">
          <Receipt order={order} />
          <ShopLink className="shop-button" to={`/store/account/orders/${id}`}>
            {tr("View order", "مشاهده سفارش")}
          </ShopLink>
        </div>
      </div>
    );
  const currentTotals = calculate(
    {
      ...state,
      cart: order.items,
      useCoins: order.totals.usedCoins > 0,
      voucher: order.totals.voucherDiscount > 0 ? "SKY10" : "",
    },
    order.delivery,
  );
  return (
    <section className="shop-payment shop-panel">
      {failed ? <XCircle size={52} /> : <ShieldCheck size={52} />}
      <p className="shop-overline">
        {order.method === "snapp"
          ? "SNAPPPAY"
          : tr("ONLINE PAYMENT", "پرداخت آنلاین")}{" "}
        / {tr("SIMULATOR", "شبیه‌ساز")}
      </p>
      <h1>
        {failed
          ? tr("Payment didn't go through", "پرداخت انجام نشد")
          : tr("Complete your demo payment", "پرداخت نمایشی را تکمیل کنید")}
      </h1>
      <p>
        {tr(
          "No bank details are collected. Choose a result to explore the complete shopping flow.",
          "اطلاعات بانکی دریافت نمی‌شود. برای تجربه مسیر کامل خرید یک نتیجه انتخاب کنید.",
        )}
      </p>
      <strong>{money(currentTotals.total)}</strong>
      {currentTotals.total !== order.totals.total && (
        <p role="status">
          {tr(
            "Total updated to reflect your current coin balance and voucher validity.",
            "مبلغ با موجودی فعلی سکه و اعتبار کد تخفیف به‌روز شد.",
          )}
        </p>
      )}
      {failed ? (
        <>
          <p role="alert">
            {tr(
              "Your cart is safe and no coins were deducted. You can retry this order.",
              "سبد محفوظ است و سکه‌ای کسر نشده. می‌توانید دوباره پرداخت کنید.",
            )}
          </p>
          <button className="shop-button" onClick={() => setFailed(false)}>
            {tr("Retry payment", "تلاش دوباره برای پرداخت")}
          </button>
        </>
      ) : (
        <div className="shop-inline">
          <button
            className="shop-button"
            onClick={() => {
              update((s) => {
                const existing = s.orders.find((o) => o.id === id);
                if (!existing || existing.status === "paid" || !s.signedIn)
                  return s;
                const totals = calculate(
                  {
                    ...s,
                    cart: existing.items,
                    useCoins: existing.totals.usedCoins > 0,
                    voucher: existing.totals.voucherDiscount > 0 ? "SKY10" : "",
                  },
                  existing.delivery,
                );
                return {
                  ...s,
                  orders: s.orders.map((o) =>
                    o.id === id ? { ...o, status: "paid", totals } : o,
                  ),
                  coins: s.coins - totals.usedCoins,
                  cart: s.cart
                    .map((l) => ({
                      ...l,
                      quantity:
                        l.quantity -
                        (existing.items.find(
                          (v) =>
                            v.productId === l.productId &&
                            v.variant === l.variant,
                        )?.quantity ?? 0),
                    }))
                    .filter((l) => l.quantity > 0),
                  voucher: "",
                  useCoins: false,
                };
              });
              navigate(`/store/payment/${id}`);
            }}
          >
            {tr("Simulate successful payment", "شبیه‌سازی پرداخت موفق")}
          </button>
          <button
            className="shop-secondary"
            onClick={() => {
              update((s) => ({
                ...s,
                orders: s.orders.map((o) =>
                  o.id === id && o.status !== "paid"
                    ? { ...o, status: "failed" }
                    : o,
                ),
              }));
              setFailed(true);
            }}
          >
            {tr("Simulate failed payment", "شبیه‌سازی پرداخت ناموفق")}
          </button>
        </div>
      )}
      <ShopLink className="shop-text-link" to="/store/cart">
        {tr("Return to cart", "بازگشت به سبد خرید")}
      </ShopLink>
    </section>
  );
}
