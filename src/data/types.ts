/** Tipos del contenido bilingüe. Cada texto visible es un par { es, en }. */

export type Lang = "es" | "en";

export interface Loc {
  es: string;
  en: string;
}

export interface ProductVariant {
  model: Loc;
  power: Loc;
  detail: Loc;
}

export interface SpecRow {
  k: Loc;
  v: Loc;
}

export interface SpecGroup {
  title: Loc;
  rows: SpecRow[];
}

export interface Product {
  slug: string;
  categoryId: string;
  index: Loc;
  name: Loc;
  summary: Loc;
  specs: SpecGroup[];
  features: Loc[];
  applications: Loc[];
  variants?: ProductVariant[];
  image: string;
  alt: Loc;
  sourceUrl?: string;
}

export interface Category {
  id: string;
  slug: string;
  index: Loc;
  name: Loc;
  kicker: Loc;
  description: Loc;
  scope: Loc[];
  productSlugs: string[];
  image: string;
  alt: Loc;
}

export interface Project {
  id: string;
  index: string;
  name: Loc;
  category: Loc;
  location: Loc;
  technology: Loc;
  summary: Loc;
  image: string;
  alt: Loc;
  source?: { label: Loc; url: string };
}

export function tx(value: Loc, lang: Lang): string {
  return value[lang];
}
