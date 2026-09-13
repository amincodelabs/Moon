import { useState } from "react";
import {
  UserRound,
  Package,
  Heart,
  MapPin,
  RotateCcw,
  Coins,
  LogOut,
} from "lucide-react";
import { useShop } from "./context";
import {
  type Address,
  type Order,
  type Line,
  catalog,
  productById,
  fulfillmentLabel,
  advanceShipment,
  resolveReturn,
  returnOutcome,
} from "./model";
import { ShopLink, Empty, ProductTile, Breakdown } from "./ui";

export function Auth({
  mode = "login",
  next = "/store/account",
}: {
  mode?: string;
  next?: string;
}) {
  const { tr, state, update, navigate, notify } = useShop();
  const [error, setError] = useState("");
  const [recovered, setRecovered] = useState(false);
  const register = mode === "register";
  const recovery = mode === "recovery";
  return (
    <div className="shop-auth">
      <div className="shop-auth-art">
        <p className="shop-overline">
          AVASTAR / {tr("YOUR OWN ORBIT", "مدار شخصی شما")}
        </p>
        <h1>
          {tr(
            "A world of discovery.\nA space of your own.",
            "دنیایی برای کشف.\nفضایی برای شما.",
          )}
        </h1>
        <p>
          {tr(
            "Save your favourites, follow your orders and make your next night under the stars a little more special.",
            "علاقه‌مندی‌های خود را ذخیره کنید، سفارش‌ها را دنبال کنید و شب بعدی زیر ستاره‌ها را ویژه‌تر بسازید.",
          )}
        </p>
      </div>
      <section className="shop-panel">
        <UserRound size={28} />
        <h2>
          {recovery
            ? tr("Recover your account", "بازیابی حساب")
            : register
              ? tr("Join AvaStar", "به آوااستار بپیوندید")
              : tr("Welcome back", "خوش آمدید")}
        </h2>
        <p className="shop-muted">
          {tr(
            "Local demo account. No password, email or SMS is sent. Use sample details; do not enter sensitive information.",
            "حساب نمایشی محلی. رمز عبور، ایمیل یا پیامک ارسال نمی‌شود. از مشخصات نمونه استفاده کنید و اطلاعات حساس وارد نکنید.",
          )}
        </p>
        {error && (
          <p className="shop-error" role="alert">
            {error}
          </p>
        )}
        {recovered ? (
          <div role="status">
            <p>
              {tr(
                "Demo recovery complete. You can now sign in with your saved email.",
                "بازیابی نمایشی انجام شد. با ایمیل ذخیره‌شده وارد شوید.",
              )}
            </p>
            <ShopLink
              className="shop-button"
              to={`/store/login?next=${encodeURIComponent(next)}`}
            >
              {tr("Back to sign in", "بازگشت به ورود")}
            </ShopLink>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              const email = String(d.get("email")).trim().toLowerCase();
              if (register && state.profile) {
                setError(
                  tr(
                    "This browser already has a demo account. Sign in or recover your saved account.",
                    "این مرورگر از قبل حساب نمایشی دارد. وارد شوید یا حساب ذخیره‌شده را بازیابی کنید.",
                  ),
                );
                return;
              }
              if (
                !register &&
                (!state.profile || state.profile.email.toLowerCase() !== email)
              ) {
                setError(
                  tr(
                    "No local account matches this email. Create a demo account first.",
                    "حساب محلی با این ایمیل وجود ندارد. ابتدا حساب نمایشی بسازید.",
                  ),
                );
                return;
              }
              if (recovery) {
                setRecovered(true);
                return;
              }
              update((s) => ({
                ...s,
                signedIn: true,
                profile: register
                  ? {
                      name: String(d.get("name")).trim(),
                      email,
                      phone: String(d.get("phone")),
                    }
                  : s.profile,
              }));
              notify(
                "Welcome to your AvaStar account",
                "به حساب آوااستار خوش آمدید",
              );
              navigate(next.startsWith("/store") ? next : "/store/account");
            }}
          >
            {register && (
              <>
                <label>
                  {tr("Full name", "نام و نام خانوادگی")}
                  <input
                    name="name"
                    required
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                  />
                </label>
                <label>
                  {tr("Mobile number", "شماره موبایل")}
                  <input
                    name="phone"
                    required
                    pattern="09[0-9]{9}"
                    placeholder="09123456789"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </label>
              </>
            )}
            <label>
              {tr("Email", "ایمیل")}
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <button className="shop-button">
              {recovery
                ? tr("Simulate account recovery", "بازیابی نمایشی حساب")
                : register
                  ? tr("Create demo account", "ساخت حساب نمایشی")
                  : tr("Sign in to demo", "ورود به حساب نمایشی")}
            </button>
          </form>
        )}
        <div className="shop-auth-links">
          <ShopLink
            to={`/store/${register ? "login" : "register"}?next=${encodeURIComponent(next)}`}
          >
            {register
              ? tr("Already a member? Sign in", "حساب دارید؟ وارد شوید")
              : tr("New here? Create an account", "تازه‌واردید؟ حساب بسازید")}
          </ShopLink>
          {!recovery && (
            <ShopLink to={`/store/recovery?next=${encodeURIComponent(next)}`}>
              {tr("Recover account", "بازیابی حساب")}
            </ShopLink>
          )}
        </div>
      </section>
    </div>
  );
}

export function AddressForm({
  address,
  done,
}: {
  address?: Address;
  done: (id?: string) => void;
}) {
  const { tr, update, state } = useShop();
  return (
    <form
      className="shop-address-form"
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        const id = address?.id ?? crypto.randomUUID();
        const value: Address = {
          id,
          label: String(d.get("label")).trim(),
          recipient: String(d.get("recipient")).trim(),
          phone: String(d.get("phone")),
          city: String(d.get("city")).trim(),
          street: String(d.get("street")).trim(),
          postal: String(d.get("postal")),
        };
        update((s) => ({
          ...s,
          addresses: address
            ? s.addresses.map((a) => (a.id === id ? value : a))
            : [...s.addresses, value],
        }));
        done(id);
      }}
    >
      <label>
        {tr("Address label", "عنوان آدرس")}
        <input
          name="label"
          defaultValue={address?.label}
          placeholder={tr("Home", "خانه")}
          required
          maxLength={40}
        />
      </label>
      <div className="shop-form-grid">
        <label>
          {tr("Recipient name", "نام گیرنده")}
          <input
            name="recipient"
            defaultValue={address?.recipient ?? state.profile?.name}
            required
            minLength={2}
            maxLength={80}
          />
        </label>
        <label>
          {tr("Recipient mobile", "موبایل گیرنده")}
          <input
            name="phone"
            defaultValue={address?.phone ?? state.profile?.phone}
            required
            pattern="09[0-9]{9}"
            placeholder="09123456789"
            inputMode="tel"
          />
        </label>
        <label>
          {tr("City in Iran", "شهر در ایران")}
          <input
            name="city"
            defaultValue={address?.city}
            required
            minLength={2}
            maxLength={80}
          />
        </label>
        <label>
          {tr("Postal code (10 digits)", "کد پستی (۱۰ رقم)")}
          <input
            name="postal"
            defaultValue={address?.postal}
            required
            pattern="[0-9]{10}"
            inputMode="numeric"
          />
        </label>
      </div>
      <label>
        {tr("Street, building and unit", "خیابان، پلاک و واحد")}
        <textarea
          name="street"
          defaultValue={address?.street}
          required
          minLength={5}
          maxLength={500}
        />
      </label>
      <div className="shop-inline">
        <button className="shop-button">
          {tr("Save address", "ذخیره آدرس")}
        </button>
        <button type="button" className="shop-secondary" onClick={() => done()}>
          {tr("Cancel", "انصراف")}
        </button>
      </div>
    </form>
  );
}
export function Addresses() {
  const { tr, state, update } = useShop();
  const [editing, setEditing] = useState<Address | "new" | null>(null);
  const [removing, setRemoving] = useState("");
  return (
    <>
      <div className="shop-section-heading">
        <h1>{tr("My addresses", "آدرس‌های من")}</h1>
        <button className="shop-button" onClick={() => setEditing("new")}>
          {tr("Add address", "افزودن آدرس")}
        </button>
      </div>
      {editing ? (
        <section className="shop-panel">
          <AddressForm
            key={typeof editing === "string" ? editing : editing.id}
            address={editing === "new" ? undefined : editing}
            done={() => setEditing(null)}
          />
        </section>
      ) : (
        <div className="shop-address-grid">
          {state.addresses.map((a) => (
            <article className="shop-panel" key={a.id}>
              <MapPin size={20} />
              <h2>{a.label}</h2>
              <p>
                {a.recipient} · <bdi>{a.phone}</bdi>
              </p>
              <p>
                {a.city} — {a.street}
                <br />
                <bdi>{a.postal}</bdi>
              </p>
              <div className="shop-inline">
                <button
                  className="shop-text-link"
                  onClick={() => setEditing(a)}
                >
                  {tr("Edit", "ویرایش")}
                </button>
                <button
                  className="shop-text-link"
                  onClick={() => setRemoving(a.id)}
                >
                  {tr("Remove", "حذف")}
                </button>
              </div>
              {removing === a.id && (
                <div className="shop-notice">
                  <p>
                    {tr(
                      "Remove this saved address? Previous orders will keep their delivery details.",
                      "این آدرس حذف شود؟ اطلاعات ارسال سفارش‌های قبلی باقی می‌ماند.",
                    )}
                  </p>
                  <button
                    className="shop-secondary"
                    onClick={() => {
                      update((s) => ({
                        ...s,
                        addresses: s.addresses.filter((v) => v.id !== a.id),
                      }));
                      setRemoving("");
                    }}
                  >
                    {tr("Confirm removal", "تأیید حذف")}
                  </button>
                  <button
                    className="shop-secondary"
                    onClick={() => setRemoving("")}
                  >
                    {tr("Cancel", "انصراف")}
                  </button>
                </div>
              )}
            </article>
          ))}
          {!state.addresses.length && (
            <p className="shop-muted">
              {tr(
                "Add your first delivery address to make checkout easier.",
                "اولین آدرس ارسال را برای خرید آسان‌تر اضافه کنید.",
              )}
            </p>
          )}
        </div>
      )}
    </>
  );
}
export function Receipt({ order }: { order: Order }) {
  const { tr, text, money } = useShop();
  const body = `${tr("AVASTAR — DEMO RECEIPT", "آوااستار — رسید نمایشی")}\n${order.id}\n${order.date}\n${order.address.recipient}\n${order.address.city} — ${order.address.street}\n\n${order.items.map((l) => `${text(productById(l.productId).name)} / ${text(productById(l.productId).variants[l.variant])} × ${l.quantity}: ${money(productById(l.productId).price * l.quantity)}`).join("\n")}\n${tr("Product savings", "تخفیف کالا")}: ${money(order.totals.productDiscount)}\n${tr("Voucher", "کد تخفیف")}: ${money(order.totals.voucherDiscount)}\n${tr("Coins", "سکه")}: ${money(order.totals.coinDeduction)}\n${tr("Shipping", "ارسال")}: ${money(order.totals.shipping)}\n${tr("Total paid", "مبلغ پرداختی")}: ${money(order.totals.total)}\n${tr("Payment method", "روش پرداخت")}: ${order.method}\n${tr("No real payment was made.", "هیچ پرداخت واقعی انجام نشده است.")}`;
  return (
    <a
      className="shop-secondary"
      download={`${order.id}-receipt.txt`}
      href={`data:text/plain;charset=utf-8,${encodeURIComponent(body)}`}
    >
      {tr("Download receipt", "دانلود رسید")}
    </a>
  );
}
export function OrderDetails({ order }: { order: Order }) {
  const { tr, text, money, state, update } = useShop();
  return (
    <>
      <div className="shop-section-heading">
        <div>
          <p className="shop-overline">{tr("YOUR ORDER", "سفارش شما")}</p>
          <h1>{order.id}</h1>
        </div>
        <span className="shop-tag">{text(fulfillmentLabel(order))}</span>
      </div>
      <div className="shop-checkout-layout">
        <section className="shop-panel">
          {order.items.map((l) => (
            <div
              className="shop-order-line"
              key={`${l.productId}-${l.variant}`}
            >
              <img
                src={`/images/${productById(l.productId).images[0]}-400.webp`}
                alt=""
                width="80"
                height="80"
              />
              <div>
                <ShopLink to={`/store/product/${l.productId}`}>
                  {text(productById(l.productId).name)}
                </ShopLink>
                <p>
                  {text(productById(l.productId).variants[l.variant])} ×{" "}
                  {l.quantity}
                </p>
                <strong>
                  {money(productById(l.productId).price * l.quantity)}
                </strong>
              </div>
            </div>
          ))}
          <h3>{tr("Delivery address", "آدرس ارسال")}</h3>
          <p>
            {order.address.recipient} · {order.address.phone}
            <br />
            {order.address.city} — {order.address.street}
            <br />
            {order.address.postal}
          </p>
          <h3>{tr("Shipment tracking", "پیگیری ارسال")}</h3>
          {order.status === "paid" && (
            <ol className="shop-shipment-steps">
              {(["preparing", "shipped", "delivered"] as const).map(
                (step, index) => (
                  <li
                    key={step}
                    aria-current={
                      (order.fulfillment ?? "preparing") === step
                        ? "step"
                        : undefined
                    }
                  >
                    {index + 1} ·{" "}
                    {tr(
                      ["Preparing", "Shipped", "Delivered"][index],
                      ["آماده‌سازی", "ارسال‌شده", "تحویل‌شده"][index],
                    )}
                  </li>
                ),
              )}
            </ol>
          )}
          <p>
            {order.status !== "paid"
              ? tr(
                  "Shipment begins after payment.",
                  "ارسال پس از پرداخت آغاز می‌شود.",
                )
              : (order.tracking ??
                tr(
                  "Your order is being prepared. A tracking number will appear when dispatched; no real shipment is created in this demo.",
                  "سفارش در حال آماده‌سازی است. کد رهگیری پس از ارسال نمایش داده می‌شود؛ در نسخه نمایشی ارسال واقعی انجام نمی‌شود.",
                ))}
          </p>
          {order.shippedAt && (
            <p>
              {tr("Dispatched", "تاریخ ارسال")}:{" "}
              {new Date(order.shippedAt).toLocaleDateString(
                tr("en-US", "fa-IR"),
              )}
            </p>
          )}
          {order.deliveredAt && (
            <p>
              {tr("Delivered", "تاریخ تحویل")}:{" "}
              {new Date(order.deliveredAt).toLocaleDateString(
                tr("en-US", "fa-IR"),
              )}
            </p>
          )}
          {order.status === "paid" && order.fulfillment !== "delivered" && (
            <details className="shop-demo-scenarios">
              <summary>
                {tr("Demo shipment scenario", "سناریوی نمایشی ارسال")}
              </summary>
              <p>
                {tr(
                  "Preview the next shipment stage. Tracking is a sample; no parcel is sent.",
                  "مرحله بعدی ارسال را ببینید. رهگیری نمونه است؛ بسته‌ای ارسال نمی‌شود.",
                )}
              </p>
              <button
                type="button"
                className="shop-secondary"
                onClick={() =>
                  update((s) => ({
                    ...s,
                    orders: s.orders.map((o) =>
                      o.id === order.id ? advanceShipment(o) : o,
                    ),
                  }))
                }
              >
                {order.fulfillment === "shipped"
                  ? tr("Simulate delivery", "شبیه‌سازی تحویل")
                  : tr("Simulate dispatch", "شبیه‌سازی ارسال")}
              </button>
            </details>
          )}
          {state.returns
            .filter((r) => r.orderId === order.id)
            .map((r) => (
              <section key={r.id} className="shop-order-return">
                <h3>
                  {tr("Return request", "درخواست مرجوعی")} · {r.id}
                </h3>
                <p>{text(returnOutcome(r))}</p>
                <ShopLink to={`/store/account/returns?order=${order.id}`}>
                  {tr("View return and refund", "مشاهده مرجوعی و بازپرداخت")}
                </ShopLink>
              </section>
            ))}
          <p>
            {order.delivery === "express"
              ? tr("Express · 1–2 business days", "سریع · ۱ تا ۲ روز کاری")
              : tr("Standard · 3–5 business days", "عادی · ۳ تا ۵ روز کاری")}
          </p>
          <div className="shop-inline">
            {order.status === "paid" ? (
              <>
                <Receipt order={order} />
                <ShopLink
                  className="shop-secondary"
                  to={`/store/account/returns?order=${order.id}`}
                >
                  {tr("Request a return", "درخواست مرجوعی")}
                </ShopLink>
              </>
            ) : (
              <ShopLink
                className="shop-button"
                to={`/store/payment/${order.id}`}
              >
                {tr("Retry payment", "تلاش دوباره برای پرداخت")}
              </ShopLink>
            )}
          </div>
        </section>
        <aside className="shop-panel">
          <h2>{tr("Payment breakdown", "جزئیات پرداخت")}</h2>
          <p>
            {order.method === "snapp"
              ? "SnappPay"
              : tr("Online gateway", "درگاه آنلاین")}{" "}
            · {tr("Demo", "نمایشی")}
          </p>
          <Breakdown totals={order.totals} shippingKnown />
        </aside>
      </div>
    </>
  );
}
export function Returns() {
  const { tr, state, update, text, path, notify } = useShop();
  const [orderId, setOrderId] = useState(
    new URLSearchParams(path.split("?")[1]).get("order") ?? "",
  );
  const order = state.orders.find(
    (o) => o.id === orderId && o.status === "paid",
  );
  return (
    <>
      <h1>{tr("Returns & refunds", "مرجوعی و بازپرداخت")}</h1>
      <section className="shop-panel">
        <h2>{tr("Start a return", "ثبت مرجوعی")}</h2>
        <p className="shop-muted">
          {tr(
            "Unused, eligible products may be returned within 7 days of delivery. This demo records requests; no real refund is issued.",
            "کالاهای مشمول و استفاده‌نشده تا ۷ روز پس از تحویل قابل مرجوعی‌اند. در نسخه نمایشی درخواست ثبت می‌شود؛ بازپرداخت واقعی انجام نمی‌شود.",
          )}
        </p>
        <label>
          {tr("Select order", "انتخاب سفارش")}
          <select value={orderId} onChange={(e) => setOrderId(e.target.value)}>
            <option value="">
              {tr("Choose a paid order", "یک سفارش پرداخت‌شده انتخاب کنید")}
            </option>
            {state.orders
              .filter((o) => o.status === "paid")
              .map((o) => (
                <option key={o.id}>{o.id}</option>
              ))}
          </select>
        </label>
        {order && (
          <form
            key={order.id}
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              const items: Line[] = order.items
                .filter((l) => productById(l.productId).returnable)
                .map((l) => ({
                  ...l,
                  quantity: Number(d.get(`${l.productId}-${l.variant}`) ?? 0),
                }))
                .filter((l) => l.quantity > 0);
              if (!items.length) {
                notify(
                  "Select a quantity for at least one eligible item",
                  "تعداد حداقل یک کالای مشمول را انتخاب کنید",
                );
                return;
              }
              update((s) => ({
                ...s,
                returns: [
                  ...s.returns,
                  {
                    id: `RET-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
                    orderId: order.id,
                    items,
                    reason:
                      String(d.get("reason")) +
                      " — " +
                      String(d.get("details")),
                    status: "submitted",
                    refund: "pending",
                  },
                ],
              }));
              notify("Return request submitted", "درخواست مرجوعی ثبت شد");
            }}
          >
            {order.items.map((l) => {
              const used = state.returns
                .filter(
                  (r) => r.orderId === order.id && r.status !== "declined",
                )
                .flatMap((r) => r.items)
                .filter(
                  (v) => v.productId === l.productId && v.variant === l.variant,
                )
                .reduce((n, v) => n + v.quantity, 0);
              const max = productById(l.productId).returnable
                ? l.quantity - used
                : 0;
              return (
                <label key={`${l.productId}-${l.variant}`}>
                  {text(productById(l.productId).name)} ·{" "}
                  {text(productById(l.productId).variants[l.variant])}
                  <select
                    name={`${l.productId}-${l.variant}`}
                    disabled={max <= 0}
                  >
                    {Array.from({ length: Math.max(0, max) + 1 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                  {max <= 0 && (
                    <small>
                      {tr(
                        "Not eligible or already requested",
                        "غیرمشمول یا قبلاً درخواست شده",
                      )}
                    </small>
                  )}
                </label>
              );
            })}
            <label>
              {tr("Reason", "دلیل")}
              <select name="reason" required>
                <option value="">
                  {tr("Choose a reason", "دلیل را انتخاب کنید")}
                </option>
                {[
                  ["damaged", tr("Arrived damaged", "آسیب‌دیده دریافت شد")],
                  ["incorrect", tr("Incorrect item", "کالای اشتباه")],
                  ["changed", tr("Changed my mind", "تغییر تصمیم")],
                  ["other", tr("Other", "سایر")],
                ].map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {tr("Additional details", "توضیحات بیشتر")}
              <textarea name="details" maxLength={1000} />
            </label>
            <button className="shop-button">
              {tr("Submit return request", "ارسال درخواست مرجوعی")}
            </button>
          </form>
        )}
      </section>
      <section className="shop-section">
        <h2>{tr("Your requests", "درخواست‌های شما")}</h2>
        {state.returns.map((r) => (
          <article className="shop-panel" key={r.id}>
            <strong>{r.id}</strong>
            <p>{r.orderId}</p>
            {r.items.map((l) => (
              <p key={`${l.productId}-${l.variant}`}>
                {text(productById(l.productId).name)} × {l.quantity}
              </p>
            ))}
            <p>
              {tr("Request status", "وضعیت درخواست")}:{" "}
              {r.status === "submitted"
                ? tr("Submitted · awaiting review", "ثبت‌شده · در انتظار بررسی")
                : r.status === "approved"
                  ? tr("Approved", "تأیید‌شده")
                  : tr("Declined", "ردشده")}
            </p>
            <p>
              {tr("Refund status", "وضعیت بازپرداخت")}:{" "}
              {r.refund === "pending"
                ? tr("Pending assessment", "در انتظار ارزیابی")
                : r.refund === "completed"
                  ? tr("Completed", "انجام‌شده")
                  : tr("Not applicable", "ندارد")}
            </p>
            <p>
              {tr("Outcome", "نتیجه")}: {text(returnOutcome(r))}
            </p>
            {(r.status === "submitted" ||
              (r.status === "approved" && r.refund === "pending")) && (
              <details className="shop-demo-scenarios">
                <summary>
                  {tr("Demo return scenario", "سناریوی نمایشی مرجوعی")}
                </summary>
                <p>
                  {tr(
                    "Preview a review outcome. No real refund is issued.",
                    "نتیجه بررسی را شبیه‌سازی کنید. بازپرداخت واقعی انجام نمی‌شود.",
                  )}
                </p>
                <div className="shop-inline">
                  {(r.status === "submitted"
                    ? (["approve", "decline"] as const)
                    : (["refund"] as const)
                  ).map((action) => (
                    <button
                      type="button"
                      key={action}
                      className="shop-secondary"
                      onClick={() =>
                        update((s) => ({
                          ...s,
                          returns: s.returns.map((request) =>
                            request.id === r.id
                              ? resolveReturn(request, action)
                              : request,
                          ),
                        }))
                      }
                    >
                      {action === "approve"
                        ? tr("Simulate approval", "شبیه‌سازی تأیید")
                        : action === "decline"
                          ? tr("Simulate decline", "شبیه‌سازی رد")
                          : tr(
                              "Simulate refund completion",
                              "شبیه‌سازی تکمیل بازپرداخت",
                            )}
                    </button>
                  ))}
                </div>
              </details>
            )}
          </article>
        ))}
        {!state.returns.length && (
          <p className="shop-muted">
            {tr("No return requests yet.", "هنوز درخواست مرجوعی ندارید.")}
          </p>
        )}
      </section>
    </>
  );
}
export function Account({
  tab = "overview",
  orderId,
}: {
  tab?: string;
  orderId?: string;
}) {
  const { tr, text, state, update, navigate, notify } = useShop();
  if (!state.signedIn)
    return (
      <Auth next={`/store/account${tab !== "overview" ? `/${tab}` : ""}`} />
    );
  const nav = [
    ["overview", tr("Overview", "نمای کلی"), UserRound],
    ["orders", tr("My orders", "سفارش‌های من"), Package],
    ["wishlist", tr("Wishlist", "علاقه‌مندی‌ها"), Heart],
    ["addresses", tr("Addresses", "آدرس‌ها"), MapPin],
    ["returns", tr("Returns", "مرجوعی‌ها"), RotateCcw],
    ["profile", tr("Profile", "پروفایل"), UserRound],
  ] as const;
  const order = state.orders.find((o) => o.id === orderId);
  return (
    <div className="shop-account-layout">
      <aside className="shop-account-nav">
        <div className="shop-avatar">{state.profile?.name.slice(0, 1)}</div>
        <strong>{state.profile?.name}</strong>
        <p className="shop-muted">
          {tr("YOUR AVASTAR SPACE", "فضای آوااستار شما")}
        </p>
        <nav aria-label={tr("Account navigation", "منوی حساب")}>
          {nav.map(([key, label, Icon]) => (
            <ShopLink
              to={`/store/account/${key}`}
              aria-current={tab === key ? "page" : undefined}
              key={key}
            >
              <Icon size={18} />
              {label}
            </ShopLink>
          ))}
        </nav>
        <button
          className="shop-logout"
          onClick={() => {
            update((s) => ({ ...s, signedIn: false, useCoins: false }));
            navigate("/store");
          }}
        >
          <LogOut size={18} />
          {tr("Sign out", "خروج")}
        </button>
      </aside>
      <div className="shop-account-content">
        {tab === "overview" && (
          <>
            <div className="shop-account-welcome">
              <p className="shop-overline">
                {tr("GOOD TO SEE YOU", "از دیدارتان خوشحالیم")}
              </p>
              <h1>
                {tr("Hello", "سلام")}, {state.profile?.name}
              </h1>
              <p>
                {tr(
                  "Your discoveries, all in one place.",
                  "همه کشف‌های شما در یک جا.",
                )}
              </p>
            </div>
            <div className="shop-stats">
              <ShopLink to="/store/account/orders">
                <Package />
                <strong>{state.orders.length}</strong>
                <span>{tr("Orders", "سفارش‌ها")}</span>
              </ShopLink>
              <ShopLink to="/store/account/wishlist">
                <Heart />
                <strong>{state.wishlist.length}</strong>
                <span>{tr("Saved discoveries", "کشف‌های ذخیره‌شده")}</span>
              </ShopLink>
              <div>
                <Coins />
                <strong>{state.coins}</strong>
                <span>{tr("AvaStar coins", "سکه آوااستار")}</span>
              </div>
            </div>
            <h2>{tr("Your latest order", "آخرین سفارش شما")}</h2>
            {state.orders.length ? (
              <ShopLink
                className="shop-panel shop-order-summary"
                to={`/store/account/orders/${state.orders[0].id}`}
              >
                <strong>{state.orders[0].id}</strong>
                <span>{tr("View order", "مشاهده سفارش")} ↗</span>
              </ShopLink>
            ) : (
              <Empty
                title={tr(
                  "Your story is just beginning",
                  "داستان شما تازه شروع شده",
                )}
                body={tr(
                  "Your first order will appear here.",
                  "اولین سفارش شما اینجا نمایش داده می‌شود.",
                )}
              />
            )}
          </>
        )}
        {tab === "orders" &&
          (orderId ? (
            order ? (
              <OrderDetails order={order} />
            ) : (
              <Empty
                title={tr("Order not found", "سفارش پیدا نشد")}
                body={tr(
                  "Check your order history.",
                  "تاریخچه سفارش‌ها را بررسی کنید.",
                )}
              />
            )
          ) : (
            <>
              <h1>{tr("My orders", "سفارش‌های من")}</h1>
              {state.orders.map((o) => (
                <ShopLink
                  className="shop-panel shop-order-summary"
                  key={o.id}
                  to={`/store/account/orders/${o.id}`}
                >
                  <div>
                    <strong>{o.id}</strong>
                    <p>
                      {new Date(o.date).toLocaleDateString(
                        tr("en-US", "fa-IR"),
                      )}
                    </p>
                  </div>
                  <span>
                    {o.items.reduce((n, l) => n + l.quantity, 0)}{" "}
                    {tr("items", "کالا")}
                  </span>
                  <span>{text(fulfillmentLabel(o))}</span>
                  <span>↗</span>
                </ShopLink>
              ))}
              {!state.orders.length && (
                <Empty
                  title={tr("No orders yet", "هنوز سفارشی ندارید")}
                  body={tr(
                    "Your purchases will appear here.",
                    "خریدهای شما اینجا نمایش داده می‌شود.",
                  )}
                />
              )}
            </>
          ))}
        {tab === "wishlist" && (
          <>
            <h1>{tr("Your wishlist", "علاقه‌مندی‌های شما")}</h1>
            {state.wishlist.length ? (
              <div className="shop-product-grid">
                {catalog
                  .filter((p) => state.wishlist.includes(p.id))
                  .map((p) => (
                    <ProductTile key={p.id} product={p} />
                  ))}
              </div>
            ) : (
              <Empty
                title={tr("Make room for wonder", "جایی برای شگفتی‌ها")}
                body={tr(
                  "Save a product using its heart button.",
                  "با دکمه قلب، محصول دلخواه را ذخیره کنید.",
                )}
              />
            )}
          </>
        )}
        {tab === "addresses" && <Addresses />}
        {tab === "returns" && <Returns />}
        {tab === "profile" && (
          <section className="shop-panel">
            <h1>{tr("My profile", "پروفایل من")}</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const d = new FormData(e.currentTarget);
                update((s) => ({
                  ...s,
                  profile: {
                    name: String(d.get("name")).trim(),
                    email: String(d.get("email")).trim().toLowerCase(),
                    phone: String(d.get("phone")),
                  },
                }));
                notify("Profile updated", "پروفایل به‌روز شد");
              }}
            >
              <label>
                {tr("Full name", "نام و نام خانوادگی")}
                <input
                  name="name"
                  defaultValue={state.profile?.name}
                  required
                  minLength={2}
                  maxLength={80}
                />
              </label>
              <label>
                {tr("Email", "ایمیل")}
                <input
                  name="email"
                  type="email"
                  defaultValue={state.profile?.email}
                  required
                />
              </label>
              <label>
                {tr("Mobile number", "شماره موبایل")}
                <input
                  name="phone"
                  defaultValue={state.profile?.phone}
                  pattern="09[0-9]{9}"
                  required
                />
              </label>
              <button className="shop-button">
                {tr("Save profile", "ذخیره پروفایل")}
              </button>
            </form>
            <p className="shop-muted">
              {text({
                en: "Use the language and theme controls in the header to personalise your space.",
                fa: "با کنترل‌های زبان و ظاهر در سربرگ، فضای خود را شخصی‌سازی کنید.",
              })}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
