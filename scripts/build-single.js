/* build-single.js
 * Genera `sender-inmersivo.html`: un único HTML autocontenido
 * (CSS + JS + fuentes + imágenes como data URIs). Sin build step.
 *
 * Uso:  node scripts/build-single.js
 *
 * Notas:
 * - Las reemplazos usan funciones de retorno para que secuencias
 *   `$&`, `$'`, etc. de las librerías minificadas no sean
 *   interpretadas por String.replace.
 * - Cada imagen se incrusta UNA sola vez (mapa global SENDER_IMAGES):
 *   hero inline para carga inmediata; el resto se resuelve vía data-img.
 */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const b64 = p => fs.readFileSync(path.join(root, p)).toString('base64');
const esc = s => s.replace(/<\/script/gi, '<\\/script');

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

/* ---- CSS + fuentes ---- */
let css = fs.readFileSync(path.join(root, 'css/main.css'), 'utf8');
for (const f of ['space-grotesk-latin-wght-normal.woff2', 'jetbrains-mono-latin-wght-normal.woff2', 'inter-latin-wght-normal.woff2']) {
  css = css.split(`url('../assets/fonts/${f}')`).join(`url('data:font/woff2;base64,${b64('assets/fonts/' + f)}')`);
}
html = html.replace('<link rel="stylesheet" href="css/main.css">', () => `<style>\n${css}\n</style>`);
html = html.replace('<link rel="preconnect" href="assets/fonts/space-grotesk-latin-wght-normal.woff2">\n', () => '');

/* ---- Mapa global de imágenes (una copia por imagen) ---- */
const allImgs = fs.readdirSync(path.join(root, 'assets/img')).filter(f => f.endsWith('.jpg')).sort();
const globalMap = Object.fromEntries(allImgs.map(f => [f, `data:image/jpeg;base64,${b64('assets/img/' + f)}`]));
const PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 1x1 transparente
const imgScript = `<script>\nvar SENDER_IMAGES = ${JSON.stringify(globalMap)};\ndocument.addEventListener('DOMContentLoaded', function () {\n  document.querySelectorAll('img[data-img]').forEach(function (i) { i.src = SENDER_IMAGES[i.dataset.img]; });\n});\n</script>`;
html = html.replace('<body>', () => '<body>\n' + imgScript);

/* hero inline (carga inmediata); el resto vía data-img */
html = html.replace('src="assets/img/hero.jpg"', () => `src="${globalMap['hero.jpg']}"`);
html = html.replace(/src="(assets\/img\/(?!hero\.jpg)[A-Za-z0-9-]+\.jpg)"/g, (m, f, name) => `src="${PLACEHOLDER}" data-img="${name}"`);

/* ---- main.js: IMG() -> mapa global ---- */
let js = fs.readFileSync(path.join(root, 'js/main.js'), 'utf8');
js = js.replace('const IMG = p => `assets/img/${p}`;', () => 'const IMG = p => SENDER_IMAGES[p];');

/* ---- Scripts inline ---- */
const inline = file => `<script>\n${esc(fs.readFileSync(path.join(root, file), 'utf8'))}\n</script>`;
for (const v of ['assets/vendor/gsap.min.js', 'assets/vendor/ScrollTrigger.min.js', 'assets/vendor/lenis.min.js']) {
  html = html.replace(`<script src="${v}"></script>`, () => inline(v));
}
html = html.replace('<script src="js/main.js"></script>', () => `<script>\n${esc(js)}\n</script>`);

fs.writeFileSync(path.join(root, 'sender-inmersivo.html'), html);
console.log('OK —', (fs.statSync(path.join(root, 'sender-inmersivo.html')).size / 1024 / 1024).toFixed(2), 'MB');
console.log('image data URIs inlined:', (html.match(/data:image\/jpeg;base64/g) || []).length, '(esperado:', allImgs.length + ')');
console.log('font data URIs inlined:', (css.match(/data:font\/woff2;base64/g) || []).length);
