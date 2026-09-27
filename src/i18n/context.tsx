import { createContext, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Lang } from "@/data/types";
import type { UiCopy } from "@/i18n/types";
import { es } from "@/i18n/es/ui";
import { en } from "@/i18n/en/ui";

interface I18nValue {
  lang: Lang;
  ui: UiCopy;
  path: (bare: string) => string;
  switchTo: (next: Lang) => void;
}

const I18nContext = createContext<I18nValue | null>(null);

export function langFromPath(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
}

export function stripLang(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/";
  return pathname || "/";
}

export function withLang(bare: string, lang: Lang): string {
  const path = bare.startsWith("/") ? bare : `/${bare}`;
  const clean = stripLang(path);
  if (lang === "es") return clean;
  return clean === "/" ? "/en" : `/en${clean}`;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const lang = langFromPath(location.pathname);
  const ui = lang === "en" ? en : es;

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      ui,
      path: (bare: string) => withLang(bare, lang),
      switchTo: (next: Lang) => {
        const hash = location.hash;
        const search = location.search;
        navigate(withLang(stripLang(location.pathname), next) + search + hash);
      },
    }),
    [lang, ui, location.hash, location.pathname, location.search, navigate],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n outside provider");
  return ctx;
}
