import { useState } from "react";
import { readPreference, savePreference } from "../preferences";

export type Text = { en: string; fa: string };
export const words = (en: string, fa: string): Text => ({ en, fa });
export type Product = {
  id: string;
  name: Text;
  description: Text;
  category: string;
  brand: string;
  images: string[];
  price: number;
  oldPrice?: number;
  stock: number;
  sold: number;
  variants: Text[];
  specs: [Text, Text][];
  included: Text;
  returnable: boolean;
};
export const categories = [
  words("All equipment", "همه تجهیزات"),
  words("Telescopes", "تلسکوپ‌ها"),
  words("Binoculars", "دوربین‌های دوچشمی"),
  words("Accessories", "لوازم جانبی"),
];
export const catalog: Product[] = [
  {
    id: "refractor",
    name: words("Horizon 80 Refractor", "تلسکوپ شکستی هورایزن ۸۰"),
    category: "1",
    brand: "AvaStar",
    images: ["telescope", "telescope-detail"],
    price: 185000000,
    oldPrice: 205000000,
    stock: 8,
    sold: 128,
    variants: [
      words("Standard kit", "کیت استاندارد"),
      words("Travel kit", "کیت سفر"),
    ],
    description: words(
      "A clear first look at the Moon, bright planets and the wonders beyond. An approachable 80 mm refractor with smooth manual controls, ready for your next night under the stars.",
      "نگاهی روشن به ماه، سیاره‌های درخشان و شگفتی‌های دوردست. تلسکوپ شکستی ۸۰ میلی‌متری با کنترل دستی روان، آماده برای شب بعدی شما زیر ستاره‌ها.",
    ),
    specs: [
      [words("Aperture", "قطر دهانه"), words("80 mm", "۸۰ میلی‌متر")],
      [words("Focal length", "فاصله کانونی"), words("600 mm", "۶۰۰ میلی‌متر")],
    ],
    included: words(
      "Optical tube, tripod, 20 mm eyepiece, finder and carry bag",
      "لوله اپتیکی، سه‌پایه، چشمی ۲۰ میلی‌متری، جوینده و کیف",
    ),
    returnable: true,
  },
  {
    id: "binoculars",
    name: words("Atlas 10×50 Binoculars", "دوربین دوچشمی اطلس ۱۰×۵۰"),
    category: "2",
    brand: "Atlas",
    images: ["binoculars", "binoculars-detail"],
    price: 48000000,
    stock: 15,
    sold: 215,
    variants: [words("Graphite", "گرافیتی"), words("Forest", "سبز جنگلی")],
    description: words(
      "Take the wide view. Comfortable, bright binoculars for sweeping the Milky Way and finding your way around the night sky.",
      "آسمان را گسترده ببینید. دوربینی راحت و روشن برای تماشای راه شیری و پیدا کردن مسیر در آسمان شب.",
    ),
    specs: [
      [words("Magnification", "بزرگ‌نمایی"), words("10×", "۱۰ برابر")],
      [words("Objective", "قطر عدسی"), words("50 mm", "۵۰ میلی‌متر")],
    ],
    included: words(
      "Binoculars, strap, lens caps and soft case",
      "دوربین، بند، درپوش عدسی و کیف نرم",
    ),
    returnable: true,
  },
  {
    id: "eyepiece",
    name: words("Orbit 12 mm Eyepiece", "چشمی اوربیت ۱۲ میلی‌متری"),
    category: "3",
    brand: "Orbit",
    images: ["eyepiece", "eyepiece-detail"],
    price: 12500000,
    stock: 0,
    sold: 72,
    variants: [words("1.25 inch", "۱٫۲۵ اینچ")],
    description: words(
      "Bring lunar craters into focus with a comfortable, multicoated eyepiece, compatible with the Horizon and Zenith telescope kits.",
      "دهانه‌های ماه را با این چشمی راحت و چندلایه واضح ببینید؛ سازگار با کیت‌های هورایزن و زنیت.",
    ),
    specs: [
      [words("Focal length", "فاصله کانونی"), words("12 mm", "۱۲ میلی‌متر")],
      [words("Barrel", "قطر اتصال"), words("1.25 inch", "۱٫۲۵ اینچ")],
    ],
    included: words(
      "Eyepiece, protective caps and storage box",
      "چشمی، درپوش محافظ و جعبه نگهداری",
    ),
    returnable: true,
  },
  {
    id: "zenith",
    name: words("Zenith 90 Explorer", "تلسکوپ زنیت ۹۰ اکسپلورر"),
    category: "1",
    brand: "AvaStar",
    images: ["telescope-detail", "telescope"],
    price: 260000000,
    stock: 4,
    sold: 46,
    variants: [words("Standard kit", "کیت استاندارد")],
    description: words(
      "Go a little deeper. A larger aperture and a steady mount make long evenings exploring the Moon and star clusters feel effortless.",
      "کمی دورتر بروید. دهانه بزرگ‌تر و پایه پایدار، کاوش طولانی ماه و خوشه‌های ستاره‌ای را لذت‌بخش می‌کنند.",
    ),
    specs: [
      [words("Aperture", "قطر دهانه"), words("90 mm", "۹۰ میلی‌متر")],
      [words("Focal length", "فاصله کانونی"), words("900 mm", "۹۰۰ میلی‌متر")],
    ],
    included: words(
      "Optical tube, mount, tripod, two eyepieces and finder",
      "لوله اپتیکی، مقر، سه‌پایه، دو چشمی و جوینده",
    ),
    returnable: true,
  },
  {
    id: "scout",
    name: words("Atlas Scout 8×42", "دوربین اطلس اسکات ۸×۴۲"),
    category: "2",
    brand: "Atlas",
    images: ["binoculars-detail", "binoculars"],
    price: 36000000,
    oldPrice: 40000000,
    stock: 12,
    sold: 98,
    variants: [words("Graphite", "گرافیتی")],
    description: words(
      "A compact companion for daytime trails and twilight skies, with a relaxed field of view and an easy grip.",
      "همراهی جمع‌وجور برای مسیرهای روز و آسمان گرگ‌ومیش، با میدان دید راحت و بدنه خوش‌دست.",
    ),
    specs: [
      [words("Magnification", "بزرگ‌نمایی"), words("8×", "۸ برابر")],
      [words("Objective", "قطر عدسی"), words("42 mm", "۴۲ میلی‌متر")],
    ],
    included: words(
      "Binoculars, neck strap and case",
      "دوربین، بند گردنی و کیف",
    ),
    returnable: true,
  },
  {
    id: "widefield",
    name: words("Orbit 25 mm Widefield", "چشمی میدان‌باز اوربیت ۲۵"),
    category: "3",
    brand: "Orbit",
    images: ["eyepiece-detail", "eyepiece"],
    price: 18000000,
    stock: 20,
    sold: 154,
    variants: [words("1.25 inch", "۱٫۲۵ اینچ")],
    description: words(
      "Frame more of the sky. This low-power eyepiece is a compatible accessory for both AvaStar telescope kits.",
      "بخش بیشتری از آسمان را در قاب بگیرید. این چشمی کم‌بزرگ‌نمایی با هر دو کیت تلسکوپ آوااستار سازگار است.",
    ),
    specs: [
      [words("Focal length", "فاصله کانونی"), words("25 mm", "۲۵ میلی‌متر")],
      [words("Barrel", "قطر اتصال"), words("1.25 inch", "۱٫۲۵ اینچ")],
    ],
    included: words("Eyepiece and protective caps", "چشمی و درپوش محافظ"),
    returnable: false,
  },
];
export const promotion = {
  title: words("A little closer to the stars", "یک قدم نزدیک‌تر به ستاره‌ها"),
  body: words(
    "Save 10% with SKY10 · Ends 1 December 2026",
    "۱۰٪ تخفیف با SKY10 · تا ۱۰ آذر ۱۴۰۵",
  ),
  expires: "2026-12-01T00:00:00Z",
  destination: "/store?collection=starters",
};
export const bannerSlides = [
  {
    image: "sky",
    eyebrow: words("THE EQUIPMENT EDIT", "منتخب تجهیزات"),
    title: words(
      "Your next discovery\nstarts here.",
      "کشف بعدی شما\nاز اینجا آغاز می‌شود.",
    ),
    body: words(
      "Thoughtfully chosen equipment for a lifetime of looking up.",
      "تجهیزاتی با انتخاب دقیق، برای یک عمر تماشای آسمان.",
    ),
    link: "/store?collection=selected",
    action: words("Find your equipment", "تجهیزات خود را پیدا کنید"),
  },
  {
    image: "tour",
    eyebrow: words("THE DARK SKY SERIES", "مجموعه آسمان تاریک"),
    title: words(
      "Take your view\nbeyond the city.",
      "نگاهت را\nفراتر از شهر ببر.",
    ),
    body: words(
      "Portable companions for nights that deserve a wider horizon.",
      "همراهانی سبک برای شب‌هایی که افقی گسترده‌تر می‌خواهند.",
    ),
    link: "/tours",
    action: words("Discover dark skies", "کشف آسمان تاریک"),
  },
  {
    image: "galaxy",
    eyebrow: words("A LITTLE CLOSER", "یک قدم نزدیک‌تر"),
    title: words(
      "The right tool\nchanges everything.",
      "ابزار درست\nهمه‌چیز را تغییر می‌دهد.",
    ),
    body: words(
      "Start with a simple question and let curiosity choose the rest.",
      "با یک پرسش ساده شروع کنید و بگذارید کنجکاوی ادامه مسیر را انتخاب کند.",
    ),
    link: "/education",
    action: words("Learn before you choose", "پیش از انتخاب یاد بگیرید"),
  },
];
export type Line = { productId: string; variant: number; quantity: number };
export type Address = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  city: string;
  street: string;
  postal: string;
};
export type Profile = { name: string; email: string; phone: string };
export type Totals = {
  subtotal: number;
  productDiscount: number;
  voucherDiscount: number;
  eligibleCoins: number;
  coinDeduction: number;
  usedCoins: number;
  shipping: number;
  total: number;
};
export type Order = {
  id: string;
  date: string;
  items: Line[];
  address: Address;
  delivery: string;
  method: string;
  status: "pending" | "paid" | "failed";
  totals: Totals;
  tracking?: string;
};
export type ReturnRequest = {
  id: string;
  orderId: string;
  items: Line[];
  reason: string;
  status: "submitted" | "approved" | "declined";
  refund: "pending" | "completed" | "none";
};
export type Review = {
  productId: string;
  rating: number;
  body: string;
  date: string;
  name: string;
};
export type StoreState = {
  cart: Line[];
  wishlist: string[];
  profile: Profile | null;
  signedIn: boolean;
  addresses: Address[];
  orders: Order[];
  returns: ReturnRequest[];
  reviews: Review[];
  coins: number;
  voucher: string;
  useCoins: boolean;
};
const initial: StoreState = {
  cart: [],
  wishlist: [],
  profile: null,
  signedIn: false,
  addresses: [],
  orders: [],
  returns: [],
  reviews: [],
  coins: 240,
  voucher: "",
  useCoins: false,
};
export const productById = (id: string) => catalog.find((p) => p.id === id)!;
export function calculate(state: StoreState, delivery?: string): Totals {
  const subtotal = state.cart.reduce(
    (n, l) => n + productById(l.productId).price * l.quantity,
    0,
  );
  const productDiscount = state.cart.reduce(
    (n, l) =>
      n +
      ((productById(l.productId).oldPrice ?? productById(l.productId).price) -
        productById(l.productId).price) *
        l.quantity,
    0,
  );
  const voucherDiscount =
    state.voucher === "SKY10" && Date.now() < Date.parse(promotion.expires)
      ? Math.floor(subtotal * 0.1)
      : 0;
  const eligibleCoins = state.signedIn
    ? Math.min(
        state.coins,
        Math.floor(((subtotal - voucherDiscount) * 0.1) / 10000),
      )
    : 0;
  const usedCoins = state.useCoins ? eligibleCoins : 0;
  const shipping =
    !state.cart.length || !delivery
      ? 0
      : delivery === "express"
        ? 1200000
        : 600000;
  return {
    subtotal,
    productDiscount,
    voucherDiscount,
    eligibleCoins,
    usedCoins,
    coinDeduction: usedCoins * 10000,
    shipping,
    total: subtotal - voucherDiscount - usedCoins * 10000 + shipping,
  };
}
export function useStore() {
  const [state, setState] = useState<StoreState>(() => {
    try {
      const saved = JSON.parse(readPreference("avastar-store-v1", "null"));
      if (
        saved &&
        Array.isArray(saved.cart) &&
        Array.isArray(saved.orders) &&
        Array.isArray(saved.addresses)
      )
        return {
          ...initial,
          ...saved,
          cart: saved.cart.filter(
            (l: Line) =>
              catalog.some((p) => p.id === l.productId) &&
              Number.isInteger(l.quantity) &&
              l.quantity > 0,
          ),
        };
    } catch {
      /* Corrupt or unavailable storage starts a fresh local demo. */
    }
    return initial;
  });
  function update(updater: (previous: StoreState) => StoreState) {
    setState((previous) => {
      const next = updater(previous);
      savePreference("avastar-store-v1", JSON.stringify(next));
      return next;
    });
  }
  function add(productId: string, variant = 0) {
    update((s) => {
      const p = productById(productId);
      if (
        !p.stock ||
        s.cart
          .filter((l) => l.productId === productId)
          .reduce((n, l) => n + l.quantity, 0) >= p.stock
      )
        return s;
      const exists = s.cart.some(
        (l) => l.productId === productId && l.variant === variant,
      );
      return {
        ...s,
        cart: exists
          ? s.cart.map((l) =>
              l.productId === productId && l.variant === variant
                ? { ...l, quantity: l.quantity + 1 }
                : l,
            )
          : [...s.cart, { productId, variant, quantity: 1 }],
      };
    });
  }
  function quantity(productId: string, variant: number, value: number) {
    update((s) => ({
      ...s,
      cart: s.cart
        .map((l) =>
          l.productId === productId && l.variant === variant
            ? {
                ...l,
                quantity: Math.min(
                  Math.max(0, value),
                  productById(productId).stock -
                    s.cart
                      .filter(
                        (other) =>
                          other.productId === productId &&
                          other.variant !== variant,
                      )
                      .reduce((n, other) => n + other.quantity, 0),
                ),
              }
            : l,
        )
        .filter((l) => l.quantity > 0),
    }));
  }
  function wish(id: string) {
    update((s) => ({
      ...s,
      wishlist: s.wishlist.includes(id)
        ? s.wishlist.filter((p) => p !== id)
        : [...s.wishlist, id],
    }));
  }
  return { state, update, add, quantity, wish };
}
export type Store = ReturnType<typeof useStore>;
