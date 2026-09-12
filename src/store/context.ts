import { createContext, useContext } from "react";
import type { Store, Text } from "./model";
import type { Language } from "../locales";
export type StoreContextValue = Store & {
  language: Language;
  tr: (en: string, fa: string) => string;
  text: (value: Text) => string;
  money: (value: number) => string;
  navigate: (path: string) => void;
  notify: (en: string, fa: string) => void;
  path: string;
};
export const StoreContext = createContext<StoreContextValue | null>(null);
export function useShop() {
  return useContext(StoreContext)!;
}
