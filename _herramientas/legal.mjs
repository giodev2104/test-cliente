// Páginas legales estáticas (/legal/aviso-legal/, /legal/privacidad/, /legal/cookies/, /legal/condiciones/).
// El texto sale de verLegal() de la portada (index.html), que sigue siendo la única fuente: si cambias allí
// el aviso legal, la privacidad o las cookies, vuelve a ejecutar:
//   node _herramientas/legal.mjs
// Usa como plantilla visual el blog (blog/index.html). Necesita Playwright y Chromium.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pw = await import(process.env.PLAYWRIGHT || "playwright");
const chromium = pw.chromium || pw.default.chromium;
const B = "https://velority.es";
const PAGINAS = [
  { k: "aviso", slug: "aviso-legal", desc: "Aviso legal de Velority: datos del titular, objeto del sitio y condiciones de uso (LSSI-CE)." },
  { k: "privacidad", slug: "privacidad", desc: "Política de privacidad de Velority: qué datos tratamos, para qué, con quién se comparten y cómo ejercer tus derechos." },
  { k: "cookies", slug: "cookies", desc: "Política de cookies de Velority: sin cookies de publicidad ni de analítica; solo almacenamiento técnico." },
  { k: "condiciones", slug: "condiciones", desc: "Condiciones de contratación de Velority: propiedad de la web, dominio, permanencia y tokens." },
];

// 1) Saca los textos de la portada en un navegador
const tipos = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json" };
const srv = http.createServer((q, s) => {
  let f = path.join(RAIZ, decodeURIComponent(new URL(q.url, "http://x").pathname));
  if (!f.startsWith(RAIZ)) { s.writeHead(403); return s.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f)) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { "Content-Type": tipos[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(s);
}).listen(0);
const puerto = srv.address().port;
const nav = await chromium.launch();
const pag = await nav.newPage();
await pag.goto(`http://localhost:${puerto}/`, { waitUntil: "load", timeout: 60000 });
await pag.waitForFunction(() => typeof verLegal === "function");
const textos = {};
for (const { k } of PAGINAS) {
  textos[k] = await pag.evaluate((k) => {
    verLegal(k);
    const mb = document.querySelector("#md .mb").cloneNode(true);
    mb.querySelector("button.x")?.remove();
    const titulo = mb.querySelector("h2").textContent; mb.querySelector("h2").remove();
    if (mb.lastElementChild?.querySelector("button.btn")) mb.lastElementChild.remove();
    closePlan();
    return { titulo, html: mb.innerHTML.trim() };
  }, k);
}
await nav.close(); srv.close();

// 2) Escribe cada página con la plantilla del blog
const plantilla = fs.readFileSync(path.join(RAIZ, "blog/index.html"), "utf8");
const escA = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
for (const p of PAGINAS) {
  const { titulo, html } = textos[p.k];
  const url = `${B}/legal/${p.slug}/`;
  const tit = `${titulo} | Velority`;
  const cuerpo = html.replace(/href="legal\//g, 'href="/legal/');   // enlaces relativos de la portada → absolutos
  const otros = PAGINAS.filter((x) => x !== p).map((x) => `<a href="/legal/${x.slug}/">${textos[x.k].titulo}</a>`).join(" · ");
  const h = plantilla
    .replace(/<title>[^<]*<\/title>/, `<title>${tit}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${escA(p.desc)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${escA(p.desc)}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${escA(p.desc)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${escA(tit)}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${escA(tit)}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, "")
    .replace(/<main>[\s\S]*?<\/main>/, `<main><div class="w">
<nav class="bc" aria-label="Migas de pan"><a href="/">Inicio</a> › ${titulo}</nav>
<article class="art" style="padding:24px 0 48px"><h1 style="font-size:clamp(30px,4.5vw,44px);font-weight:800;margin:0 0 18px">${titulo}</h1>
${cuerpo}
<p class="mu" style="margin-top:34px;font-size:15px">Más información legal: ${otros}</p></article>
</div></main>`);
  if (h === plantilla) throw new Error("La plantilla del blog ha cambiado: revisa legal.mjs");
  const dir = path.join(RAIZ, "legal", p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), h);
  console.log(`legal/${p.slug}/index.html · ${titulo}`);
}
