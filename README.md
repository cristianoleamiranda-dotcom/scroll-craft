import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const site = (process.env.VITE_SITE_URL || "https://www.sender.cl").replace(/\/$/, "");
const catalog = readFileSync("src/data/catalog.ts", "utf8");
const [catPart, prodPart] = catalog.split("export const products");
const slugs = (part) => [...part.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]);
const categories = slugs(catPart);
const products = slugs(prodPart);

const paths = ["/", "/en", "/productos", "/en/productos"];
categories.forEach((slug) => {
  paths.push(`/productos/${slug}`, `/en/productos/${slug}`);
});
products.forEach((slug) => {
  paths.push(`/producto/${slug}`, `/en/producto/${slug}`);
});

const urls = paths
  .map((path) => {
    const loc = `${site}${path === "/" ? "/" : path}`;
    const es = path.startsWith("/en") ? path.replace(/^\/en/, "") || "/" : path;
    const en = es === "/" ? "/en" : `/en${es}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <xhtml:link rel="alternate" hreflang="es-CL" href="${site}${es === "/" ? "/" : es}"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${site}${en}"/>\n  </url>`;
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
writeFileSync("public/sitemap.xml", sitemap);
writeFileSync("dist/sitemap.xml", sitemap);

const index = readFileSync("dist/index.html", "utf8");
const shells = [
  ...categories.map((slug) => [`productos/${slug}`, `SENDER Chile | ${slug}`]),
  ...products.map((slug) => [`producto/${slug}`, `SENDER Chile | ${slug}`]),
  ["productos", "SENDER Chile | Catálogo"],
  ["en", "SENDER Chile | RF Engineering, Broadcasting & Transmission Systems"],
];

shells.forEach(([route, title]) => {
  const file = join("dist", route, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  const html = index
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${site}/${route}"`);
  writeFileSync(file, html);
});

console.log(`seo: ${paths.length} urls, ${shells.length} route shells`);
