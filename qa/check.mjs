import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const errors = [];
const fail = (message) => errors.push(message);

const es = readFileSync("src/i18n/es/ui.ts", "utf8");
const en = readFileSync("src/i18n/en/ui.ts", "utf8");
const keys = (text) => [...text.matchAll(/^\s{2}(\w+):/gm)].map((match) => match[1]);
const esKeys = keys(es);
const enKeys = keys(en);
if (esKeys.join() !== enKeys.join()) fail("ES/EN top-level key order diverges");

const forbidden = /#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/gi;
const css = readFileSync("src/styles/tokens.css", "utf8") + readFileSync("src/styles/app.css", "utf8");
const allowed = new Set(["#ffffff", "#fff", "#1e73be", "#494949", "#0085b2"]);
for (const match of css.matchAll(forbidden)) {
  const hex = match[0].toLowerCase();
  if (!allowed.has(hex)) fail(`color outside palette: ${hex}`);
}

if (/OLEA|purple|violet|#7c3aed|#ff00/i.test(css + es + en)) fail("legacy or off-palette token leaked into source");

const mediaDir = "public/media";
const required = [
  "hero.jpg",
  "hero-wide.jpg",
  "about.jpg",
  "cap-antennas.jpg",
  "cap-broadcast.jpg",
  "cap-critical.jpg",
  "cap-rf.jpg",
  "cap-transmission.jpg",
  "proj-am.jpg",
  "proj-stl.jpg",
  "sender-hero.mp4",
];
required.forEach((file) => {
  if (!existsSync(join(mediaDir, file))) fail(`missing asset ${file}`);
});

const catalog = readFileSync("src/data/catalog.ts", "utf8");
const names = [...catalog.matchAll(/name: \{ es: "([^"]+)", en: "([^"]+)" \}/g)];
if (names.length < 20) fail(`catalog names incomplete: ${names.length}`);
names.forEach(([raw, spanish, english]) => {
  if (!spanish || !english) fail(`empty translation near ${raw.slice(0, 40)}`);
});

const tsx = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith(".tsx")) tsx.push(readFileSync(path, "utf8"));
  }
}
walk("src");
const joined = tsx.join("\n");
const images = [...joined.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
const editorial = [...joined.matchAll(/<(?:Editorial|Cinematic|Immersive)Image\b[^>]*\/?>/g)].map((match) => match[0]);
[...images, ...editorial].forEach((tag) => {
  if (tag.includes("{...props}")) return;
  if (!/\balt=/.test(tag)) fail(`image without alt: ${tag.slice(0, 80)}`);
});

if (existsSync("dist/index.html")) {
  const html = readFileSync("dist/index.html", "utf8");
  ["<title>", "name=\"description\"", "rel=\"canonical\"", "hreflang=\"es-CL\"", "hreflang=\"en\"", "og:title", "twitter:card", "application/ld+json"].forEach((token) => {
    if (!html.includes(token)) fail(`dist/index.html missing ${token}`);
  });
  if (!existsSync("dist/sitemap.xml")) fail("dist/sitemap.xml missing");
  if (!existsSync("dist/robots.txt")) fail("dist/robots.txt missing");
}

if (errors.length) {
  console.error(errors.map((item) => `FAIL ${item}`).join("\n"));
  process.exit(1);
}
console.log("qa: translations, palette, assets, alt text, seo shell — ok");
