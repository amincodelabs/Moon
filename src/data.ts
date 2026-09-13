import type { CopyKey } from "./locales";
export const routes = {
  store: "/store",
  education: "/education",
  tours: "/tours",
  magazine: "/magazine",
  login: "/account/login",
  register: "/account/register",
  account: "/account",
  contact: "/contact",
  support: "/support",
  legal: "/legal",
  privacy: "/privacy",
  social: "/social/instagram",
} as const;
export type RouteKey = keyof typeof routes;
export const campaign = {
  id: "autumn-sky-2026",
  expires: "2026-12-01T00:00:00Z",
  destination: "tours" as const,
};
export const destinations: {
  id: RouteKey;
  name: CopyKey;
  description: CopyKey;
  action: CopyKey;
  image: string;
  alt: CopyKey;
}[] = [
  {
    id: "store",
    name: "store",
    description: "storeDesc",
    action: "storeAction",
    image: "telescope",
    alt: "telescopeAlt",
  },
  {
    id: "education",
    name: "education",
    description: "educationDesc",
    action: "educationAction",
    image: "sky",
    alt: "skyAlt",
  },
  {
    id: "tours",
    name: "tours",
    description: "toursDesc",
    action: "toursAction",
    image: "tour",
    alt: "tourAlt",
  },
  {
    id: "magazine",
    name: "magazine",
    description: "magazineDesc",
    action: "magazineAction",
    image: "galaxy",
    alt: "galaxyAlt",
  },
];
export const products: {
  id: string;
  name: CopyKey;
  detail: CopyKey;
  alt: CopyKey;
  images: string[];
  price: number;
  oldPrice?: number;
  available: boolean;
}[] = [
  {
    id: "refractor",
    name: "telescopeName",
    detail: "telescopeDetail",
    alt: "telescopeAlt",
    images: ["telescope", "telescope-detail"],
    price: 185000000,
    oldPrice: 205000000,
    available: true,
  },
  {
    id: "binoculars",
    name: "binocularsName",
    detail: "binocularsDetail",
    alt: "binocularsAlt",
    images: ["binoculars", "binoculars-detail"],
    price: 48000000,
    available: true,
  },
  {
    id: "eyepiece",
    name: "eyepieceName",
    detail: "eyepieceDetail",
    alt: "eyepieceAlt",
    images: ["eyepiece", "eyepiece-detail"],
    price: 12500000,
    available: false,
  },
];
export const journey: { title: CopyKey; detail: CopyKey; route: RouteKey }[] = [
  { title: "learnStep", detail: "learnDetail", route: "education" },
  { title: "equipStep", detail: "equipDetail", route: "store" },
  { title: "travelStep", detail: "travelDetail", route: "tours" },
  { title: "shareStep", detail: "shareDetail", route: "magazine" },
];
