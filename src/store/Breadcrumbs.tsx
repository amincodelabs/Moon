import { ChevronRight } from "lucide-react";
import { useShop } from "./context";
import { catalog, categories } from "./model";
import { ShopLink } from "./ui";

export function Breadcrumbs() {
  const { path, tr, text } = useShop();
  const [, page, detail, order] = path.split("?")[0].split("/").filter(Boolean);
  const crumbs: { label: string; to?: string }[] = [
    { label: tr("Home", "خانه"), to: "/" },
    { label: tr("Store", "فروشگاه"), to: page ? "/store" : undefined },
  ];
  const slugs = ["", "telescopes", "binoculars", "accessories"];
  const labels: Record<string, string> = {
    search: tr("Search results", "نتایج جست‌وجو"),
    cart: tr("Basket", "سبد خرید"),
    checkout: tr("Checkout", "تکمیل خرید"),
    payment: tr("Payment", "پرداخت"),
    account: tr("My account", "حساب من"),
    login: tr("Sign in", "ورود"),
    register: tr("Create account", "ایجاد حساب"),
    recovery: tr("Password recovery", "بازیابی رمز عبور"),
    wishlist: tr("Wishlist", "علاقه‌مندی‌ها"),
    overview: tr("Overview", "نمای کلی"),
    orders: tr("Orders", "سفارش‌ها"),
    addresses: tr("Addresses", "نشانی‌ها"),
    returns: tr("Returns", "مرجوعی‌ها"),
    profile: tr("Profile", "پروفایل"),
  };
  if (page === "product") {
    const product = catalog.find((p) => p.id === detail);
    if (product) {
      crumbs.push({
        label: text(categories[Number(product.category)]),
        to: `/store/category/${slugs[Number(product.category)]}`,
      });
      crumbs.push({ label: text(product.name) });
    } else crumbs.push({ label: tr("Product not found", "محصول پیدا نشد") });
  } else if (page === "category") {
    const index = slugs.indexOf(detail);
    crumbs.push({
      label: index > 0 ? text(categories[index]) : tr("Category", "دسته‌بندی"),
    });
  } else if (page === "account" && detail) {
    crumbs.push({ label: labels.account, to: "/store/account" });
    crumbs.push({
      label: labels[detail] ?? tr("Account details", "جزئیات حساب"),
      to: order ? `/store/account/${detail}` : undefined,
    });
    if (order) crumbs.push({ label: tr("Order details", "جزئیات سفارش") });
  } else if (page) {
    if (page === "checkout")
      crumbs.push({ label: labels.cart, to: "/store/cart" });
    crumbs.push({
      label: labels[page] ?? tr("Page not found", "صفحه پیدا نشد"),
    });
  }
  return (
    <nav
      className="shop-breadcrumbs"
      aria-label={tr("Breadcrumb", "مسیر صفحه")}
    >
      <ol>
        {crumbs.map((crumb, index) => (
          <li key={index}>
            {index > 0 && <ChevronRight size={12} aria-hidden="true" />}
            {crumb.to ? (
              crumb.to === "/" ? (
                <a href="/">{crumb.label}</a>
              ) : (
                <ShopLink to={crumb.to}>{crumb.label}</ShopLink>
              )
            ) : (
              <span aria-current="page">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
