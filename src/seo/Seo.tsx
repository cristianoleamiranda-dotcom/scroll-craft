import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { company, SITE_URL } from "@/data/company";
import { categories, products } from "@/data/catalog";
import { tx } from "@/data/types";
import { useI18n, stripLang } from "@/i18n/context";
import { posters } from "@/data/images";

function upsert(selector: string, create: () => HTMLElement) {
  return document.head.querySelector(selector) ?? document.head.appendChild(create());
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  const el = upsert(`meta[${attr}="${key}"]`, () => {
    const node = document.createElement("meta");
    node.setAttribute(attr, key);
    return node;
  });
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  const el = upsert(selector, () => {
    const node = document.createElement("link");
    node.rel = rel;
    if (hreflang) node.hreflang = hreflang;
    return node;
  });
  el.setAttribute("href", href);
}

export function Seo() {
  const { lang, ui } = useI18n();
  const location = useLocation();

  useEffect(() => {
    const bare = stripLang(location.pathname);
    const product = products.find((item) => bare === `/producto/${item.slug}`);
    const category = categories.find((item) => bare === `/productos/${item.slug}`);
    const title = product
      ? `${tx(product.name, lang)} | SENDER Chile`
      : category
        ? `${tx(category.name, lang)} | SENDER Chile`
        : ui.meta.title;
    const description = product
      ? tx(product.summary, lang)
      : category
        ? tx(category.description, lang)
        : ui.meta.description;

    document.title = title;
    document.documentElement.lang = lang === "es" ? "es-CL" : "en";
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:locale", lang === "es" ? "es_CL" : "en_US");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    const path = `${bare === "/" ? "/" : bare}`;
    const canonical = `${SITE_URL}${lang === "en" ? (path === "/" ? "/en" : `/en${path}`) : path}`;
    setLink("canonical", canonical);
    setMeta("property", "og:url", canonical);
    setLink("alternate", `${SITE_URL}${path === "/" ? "/" : path}`, "es-CL");
    setLink("alternate", `${SITE_URL}${path === "/" ? "/en" : `/en${path}`}`, "en");
    setLink("alternate", `${SITE_URL}${path === "/" ? "/" : path}`, "x-default");

    const org = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: company.name,
      url: `${company.siteUrl}/`,
      slogan: company.claim[lang],
      email: company.email,
      telephone: "+56983864148",
      address: {
        "@type": "PostalAddress",
        streetAddress: company.address.street,
        addressLocality: company.address.commune,
        addressRegion: "Región Metropolitana",
        addressCountry: "CL",
      },
      areaServed: ["CL", "Latin America"],
    };
    const extra = product
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: tx(product.name, lang),
          description: tx(product.summary, lang),
          brand: { "@type": "Brand", name: "Sender" },
          url: `${SITE_URL}/producto/${product.slug}`,
        }
      : org;

    const script = upsert("#jsonld", () => {
      const node = document.createElement("script");
      node.id = "jsonld";
      node.type = "application/ld+json";
      return node;
    });
    script.textContent = JSON.stringify(extra);
    setMeta("property", "og:image", `${SITE_URL}${posters.lg.replace(import.meta.env.BASE_URL, "/")}`);
  }, [lang, location.pathname, ui.meta.description, ui.meta.title]);

  return null;
}
