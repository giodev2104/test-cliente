// Copia estática de la portada dentro de <main id="v"> (y el FAQPage en <head>) para que Google y las IA
// lean el contenido sin ejecutar JavaScript. Al cargar la página, render() la sustituye por la versión viva.
// Vuelve a ejecutarlo cada vez que cambies la portada (LAND):
//   node _herramientas/prerender.mjs            → usa el catálogo real de Supabase
//   node _herramientas/prerender.mjs cat.json   → usa un catálogo guardado (lista de catalogo_publico)
// Necesita Playwright y Chromium. La carpeta empieza por «_», así que GitHub Pages no la publica.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INDEX = path.join(RAIZ, "index.html");
const { chromium } = await import(process.env.PLAYWRIGHT || "playwright");
let html = fs.readFileSync(INDEX, "utf8");
const conf = k => (html.match(new RegExp(`\\b${k}\\s*=\\s*"([^"]+)"`)) || [])[1];

let catalogo;
if (process.argv[2]) catalogo = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
else {
  const url = conf("SUPABASE_URL"), clave = conf("SUPABASE_KEY");
  const r = await fetch(`${url}/rest/v1/rpc/catalogo_publico`, { method: "POST", headers: { apikey: clave, Authorization: `Bearer ${clave}`, "Content-Type": "application/json" }, body: "{}" });
  if (!r.ok) throw new Error(`catalogo_publico: ${r.status} ${await r.text()}`);
  catalogo = await r.json();
}

// Sirve la página sin la copia anterior, para que la nueva salga siempre del código vivo
const limpio = html.replace(/<main id="v">[\s\S]*?<\/main>/, '<main id="v"></main>').replace(/<script id="faq-ld"[^>]*>[\s\S]*?<\/script>\n?/, "");
const srv = http.createServer((q, s) => {
  const f = path.join(RAIZ, decodeURIComponent(new URL(q.url, "http://x").pathname));
  if (f === RAIZ + "/" || f === INDEX) { s.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); return s.end(limpio); }
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); } else { s.writeHead(200); s.end(d); } });
}).listen(0);
const puerto = srv.address().port;

// supabase-js de mentira: solo responde al catálogo y a las opiniones públicas
const falso = `window.supabase={createClient:()=>({rpc:async n=>({data:n=="catalogo_publico"?${JSON.stringify(catalogo)}:n=="valoraciones_publicas"?{total:0}:null,error:null}),functions:{invoke:async()=>({data:null,error:null})},auth:{}})};`;
const nav = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const pag = await nav.newPage({ viewport: { width: 1280, height: 900 }, serviceWorkers: "block" });
await pag.route("**/*", r => {
  const u = r.request().url();
  if (u.includes("supabase-js")) return r.fulfill({ contentType: "application/javascript", body: falso });
  if (u.startsWith(`http://localhost:${puerto}`)) return r.continue();
  return r.abort();
});
await pag.addInitScript(() => { try { localStorage.clear() } catch (_) {} });
await pag.goto(`http://localhost:${puerto}/`, { waitUntil: "load" });
await pag.waitForFunction(() => document.querySelector("#v .hx") && document.querySelector("#v #opiniones") && document.getElementById("faq-ld"), null, { timeout: 15000 });
await pag.waitForTimeout(400);
const { main, faq } = await pag.evaluate(() => {
  const v = document.getElementById("v").cloneNode(true);
  v.querySelectorAll(".mock.ba").forEach(m => m.style.setProperty("--x", "50%"));
  v.querySelectorAll(".ba-r").forEach(r => r.setAttribute("value", "50"));
  return { main: v.innerHTML.trim(), faq: document.getElementById("faq-ld").textContent };
});
await nav.close(); srv.close();

if (!main.includes("<h1>") || main.length < 5000) throw new Error("La copia no parece la portada; no se guarda nada.");
html = limpio.replace('<main id="v"></main>', `<main id="v">\n${main}\n</main>`)
  .replace("</head>", `<script id="faq-ld" type="application/ld+json">${faq.replace(/<\//g, "<\\/")}</script>\n</head>`);
fs.writeFileSync(INDEX, html);
console.log(`Portada copiada: ${(main.length / 1024).toFixed(0)} KB de HTML estático.`);
