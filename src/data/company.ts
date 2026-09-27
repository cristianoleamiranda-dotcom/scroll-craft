/**
 * Datos corporativos confirmados.
 * Verificados contra sender.cl y contra src/content/company.ts del repositorio fuente.
 * Si un dato no está aquí, no se publica.
 */

export const company = {
  name: "Sender",
  legalName: "Sender",
  claim: {
    es: "Tecnología que transmite",
    en: "Technology that transmits",
  },
  city: { es: "Santiago, Chile", en: "Santiago, Chile" },
  years: "20+",
  phone: "+56 9 8386 4148",
  phoneHref: "tel:+56983864148",
  whatsappNumber: "56983864148",
  email: "sender@sender.cl",
  salesEmail: "bis.ltda@gmail.com",
  address: {
    street: "Blanco Viel 1108, 2º piso",
    commune: "San Miguel",
    city: "Santiago",
    country: "Chile",
  },
  addressOneLine: {
    es: "Blanco Viel 1108, 2º piso, San Miguel, Santiago, Chile",
    en: "Blanco Viel 1108, 2nd floor, San Miguel, Santiago, Chile",
  },
  mapsHref: "https://maps.google.com/?q=Blanco+Viel+1108,+San+Miguel,+Santiago,+Chile",
  siteUrl: "https://www.sender.cl",
} as const;

export function whatsappHref(lang: "es" | "en", context?: string): string {
  const base =
    lang === "es"
      ? "Hola, quiero iniciar un proyecto con Sender."
      : "Hello, I want to start a project with Sender.";
  const text = context ? `${base} ${context}` : base;
  return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export const SITE_URL = (import.meta.env.VITE_SITE_URL || company.siteUrl).replace(/\/$/, "");
