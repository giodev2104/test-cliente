/*! Velority · Catálogo de productos para la web del cliente
 * Muestra los productos que el cliente gestiona desde su portal (velority.es > Catálogo).
 * Uso, en cualquier página (velority.cloud o el dominio propio del cliente):
 *   <div data-velority-catalogo="CLAVE" data-whatsapp="34600000000"></div>
 *   <script src="https://velority.es/catalogo.js" defer></script>
 * Opciones del <div>: data-whatsapp (botón «Consultar» con el producto), data-destacados="1" (solo destacados),
 * data-ofertas="1" (solo productos con descuento), data-max="6" (máximo de productos), data-filtros="0" (sin filtro de categorías), data-vacio="texto si no hay productos".
 * Estilo: hereda la letra y el color de la web. Se ajusta con variables CSS en el <div> o en :root:
 *   --vc-acento, --vc-oferta, --vc-fondo, --vc-borde, --vc-texto-suave, --vc-radio, --vc-columnas-min
 * Si no hay conexión, enseña la última copia guardada en el navegador.
 */
(function () {
  "use strict";
  var API = "https://ufwuvbjrgvphbggkfkuh.supabase.co/functions/v1/productos?c=";
  var CSS = ".vc{--vc-acento:currentColor;--vc-fondo:transparent;--vc-borde:rgba(127,127,127,.25);--vc-texto-suave:rgba(127,127,127,1);--vc-radio:4px;--vc-columnas-min:220px}" +
    ".vc-filtros{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:0 0 28px}" +
    ".vc-filtros button{font:inherit;font-size:.85em;letter-spacing:.08em;text-transform:uppercase;background:none;color:inherit;border:1px solid var(--vc-borde);border-radius:999px;padding:.45em 1.1em;cursor:pointer}" +
    ".vc-filtros button[aria-pressed=true]{border-color:var(--vc-acento);color:var(--vc-acento)}" +
    ".vc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(var(--vc-columnas-min),44%),1fr));gap:clamp(14px,2.5vw,28px)}" +
    ".vc-item{all:unset;box-sizing:border-box;display:flex;flex-direction:column;cursor:pointer;background:var(--vc-fondo);border-radius:var(--vc-radio);text-align:left;min-width:0}" +
    ".vc-item:focus-visible{outline:2px solid var(--vc-acento);outline-offset:4px}" +
    ".vc-foto{position:relative;aspect-ratio:1;overflow:hidden;border-radius:var(--vc-radio);background:rgba(127,127,127,.08)}" +
    ".vc-foto img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}.vc-item:hover .vc-foto img{transform:scale(1.04)}" +
    ".vc-dest{position:absolute;top:10px;left:10px;font-size:.7em;letter-spacing:.12em;text-transform:uppercase;background:rgba(255,255,255,.92);color:#222;padding:.35em .8em;border-radius:999px}" +
    ".vc-desc{position:absolute;top:10px;right:10px;font-size:.72em;font-weight:600;letter-spacing:.06em;background:var(--vc-oferta,#b42318);color:#fff;padding:.35em .75em;border-radius:999px}" +
    ".vc-antes{text-decoration:line-through;opacity:.65;margin-right:.45em}.vc-rebaja{color:var(--vc-oferta,#b42318)}.vc-hasta{display:block;font-size:.85em;color:var(--vc-oferta,#b42318)}" +
    ".vc-nom{margin:.9em 0 .2em;font-size:1em;font-weight:500;line-height:1.35;overflow-wrap:anywhere}" +
    ".vc-pre{font-size:.92em;color:var(--vc-texto-suave)}" +
    ".vc-modal{position:fixed;inset:0;z-index:2147483000;background:rgba(10,10,12,.72);display:flex;align-items:center;justify-content:center;padding:16px}" +
    ".vc-caja{background:#fff;color:#1b1b1f;border-radius:10px;max-width:880px;width:100%;max-height:calc(100vh - 32px);overflow:auto;display:grid;grid-template-columns:1.1fr 1fr;position:relative}" +
    "@media(max-width:700px){.vc-caja{grid-template-columns:1fr}}" +
    ".vc-gal{background:#f4f4f5}.vc-gal>img{width:100%;aspect-ratio:1;object-fit:cover;display:block}" +
    ".vc-mini{display:flex;gap:6px;padding:8px;flex-wrap:wrap}.vc-mini button{all:unset;cursor:pointer;width:56px;height:56px;border-radius:6px;overflow:hidden;opacity:.55;outline-offset:2px}.vc-mini button[aria-current=true]{opacity:1;outline:2px solid #1b1b1f}.vc-mini img{width:100%;height:100%;object-fit:cover}" +
    ".vc-info{padding:clamp(20px,4vw,36px);display:flex;flex-direction:column;gap:12px}" +
    ".vc-info small{letter-spacing:.14em;text-transform:uppercase;color:#71717a;font-size:.72em}.vc-info h3{margin:0;font-size:1.5em;font-weight:500;line-height:1.25}" +
    ".vc-info .vc-pre{font-size:1.15em;color:#1b1b1f}.vc-info p{margin:0;line-height:1.7;color:#3f3f46;white-space:pre-line}" +
    ".vc-wa{display:inline-flex;align-items:center;justify-content:center;gap:8px;margin-top:8px;padding:.85em 1.4em;background:#1b1b1f;color:#fff;text-decoration:none;border-radius:999px;font-size:.92em;letter-spacing:.04em}" +
    ".vc-cerrar{all:unset;position:absolute;top:10px;right:10px;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.92);color:#1b1b1f;display:grid;place-items:center;font-size:20px;cursor:pointer;z-index:1}" +
    ".vc-vacio{text-align:center;color:var(--vc-texto-suave)}";

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined && txt !== null) e.textContent = txt; return e; }
  function precio(p) {
    if (p.precio === null || p.precio === undefined) return "Precio bajo consulta";
    var n = Number(p.precio);
    return n.toLocaleString("es-ES", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + " €";
  }
  function euros(n) { n = Number(n); return n.toLocaleString("es-ES", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + " €"; }
  function pct(p) { return Math.round((1 - p.precio / p.precio_antes) * 100); }
  // Precio con el anterior tachado si hay descuento
  function precioEl(p, cls, conFecha) {
    var e = el("span", cls);
    if (p.precio_antes) {
      var a = el("span", "vc-antes", euros(p.precio_antes)); a.setAttribute("aria-label", "Antes " + euros(p.precio_antes));
      e.appendChild(a); e.appendChild(el("span", "vc-rebaja", euros(p.precio)));
      if (conFecha && p.oferta_hasta) e.appendChild(el("span", "vc-hasta", "Oferta hasta el " + new Date(p.oferta_hasta + "T12:00").toLocaleDateString("es-ES", { day: "numeric", month: "long" })));
    } else e.textContent = precio(p);
    return e;
  }
  function guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} }
  function leer(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (_) { return null; } }

  function ficha(p, wa) {
    var previo = document.activeElement, m = el("div", "vc-modal"), caja = el("div", "vc-caja"), gal = el("div", "vc-gal"), info = el("div", "vc-info");
    m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-label", p.nombre);
    var cerrar = el("button", "vc-cerrar", "×"); cerrar.setAttribute("aria-label", "Cerrar"); cerrar.type = "button";
    var grande = el("img"); grande.alt = p.nombre;
    if (p.fotos.length) { grande.src = p.fotos[0]; gal.appendChild(grande); }
    if (p.fotos.length > 1) {
      var mini = el("div", "vc-mini");
      p.fotos.forEach(function (f, i) {
        var b = el("button"), im = el("img"); im.src = f; im.alt = "Foto " + (i + 1) + " de " + p.nombre; im.loading = "lazy";
        b.type = "button"; b.setAttribute("aria-current", i === 0 ? "true" : "false"); b.appendChild(im);
        b.onclick = function () { grande.src = f; [].forEach.call(mini.children, function (x) { x.setAttribute("aria-current", x === b ? "true" : "false"); }); };
        mini.appendChild(b);
      });
      gal.appendChild(mini);
    }
    if (p.categoria) info.appendChild(el("small", "", p.categoria));
    info.appendChild(el("h3", "", p.nombre));
    info.appendChild(precioEl(p, "vc-pre", true));
    if (p.descripcion) info.appendChild(el("p", "", p.descripcion));
    if (wa) {
      var a = el("a", "vc-wa", "Consultar por WhatsApp");
      a.href = "https://wa.me/" + wa + "?text=" + encodeURIComponent("Hola, me interesa: " + p.nombre);
      a.target = "_blank"; a.rel = "noopener"; info.appendChild(a);
    }
    if (p.fotos.length) caja.appendChild(gal); else caja.style.gridTemplateColumns = "1fr";
    caja.appendChild(info); caja.appendChild(cerrar); m.appendChild(caja);
    var fuera = function () { m.remove(); document.removeEventListener("keydown", tecla); document.documentElement.style.overflow = ""; if (previo && previo.focus) previo.focus(); };
    var tecla = function (e) { if (e.key === "Escape") fuera(); };
    cerrar.onclick = fuera; m.onclick = function (e) { if (e.target === m) fuera(); };
    document.addEventListener("keydown", tecla); document.documentElement.style.overflow = "hidden";
    document.body.appendChild(m); cerrar.focus();
  }

  function pintar(cont, lista) {
    var d = cont.dataset, wa = (d.whatsapp || "").replace(/\D/g, ""), max = parseInt(d.max, 10) || 0;
    if (d.destacados === "1") lista = lista.filter(function (p) { return p.destacado; });
    if (d.ofertas === "1") lista = lista.filter(function (p) { return p.precio_antes; });
    if (max) lista = lista.slice(0, max);
    cont.textContent = ""; cont.classList.add("vc");
    if (!lista.length) { if (d.vacio) cont.appendChild(el("p", "vc-vacio", d.vacio)); return; }
    var cats = [], grid = el("div", "vc-grid"), activa = "";
    lista.forEach(function (p) { if (p.categoria && cats.indexOf(p.categoria) < 0) cats.push(p.categoria); });
    function llenar() {
      grid.textContent = "";
      lista.forEach(function (p) {
        if (activa && p.categoria !== activa) return;
        var b = el("button", "vc-item"), f = el("div", "vc-foto");
        b.type = "button"; b.setAttribute("aria-label", p.nombre + ", " + (p.precio_antes ? euros(p.precio) + ", antes " + euros(p.precio_antes) : precio(p)) + ". Ver detalles");
        if (p.fotos.length) { var im = el("img"); im.src = p.fotos[0]; im.alt = ""; im.loading = "lazy"; im.decoding = "async"; f.appendChild(im); }
        if (p.destacado && d.destacados !== "1") f.appendChild(el("span", "vc-dest", "Destacado"));
        if (p.precio_antes) f.appendChild(el("span", "vc-desc", "−" + pct(p) + " %"));
        b.appendChild(f); b.appendChild(el("span", "vc-nom", p.nombre)); b.appendChild(precioEl(p, "vc-pre"));
        b.onclick = function () { ficha(p, wa); };
        grid.appendChild(b);
      });
    }
    if (cats.length > 1 && d.filtros !== "0") {
      var fil = el("div", "vc-filtros"); fil.setAttribute("role", "group"); fil.setAttribute("aria-label", "Filtrar por categoría");
      ["Todo"].concat(cats).forEach(function (c, i) {
        var b = el("button", "", c); b.type = "button"; b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
        b.onclick = function () { activa = i ? c : ""; [].forEach.call(fil.children, function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); llenar(); };
        fil.appendChild(b);
      });
      cont.appendChild(fil);
    }
    llenar(); cont.appendChild(grid);
    // Datos para Google (solo productos con precio)
    var conPrecio = lista.filter(function (p) { return p.precio !== null && p.precio !== undefined; });
    if (conPrecio.length) {
      var ld = document.getElementById("vc-ld-" + d.velorityCatalogo) || el("script");
      ld.type = "application/ld+json"; ld.id = "vc-ld-" + d.velorityCatalogo;
      ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", itemListElement: conPrecio.map(function (p, i) {
        return { "@type": "ListItem", position: i + 1, item: { "@type": "Product", name: p.nombre, description: p.descripcion || undefined, image: p.fotos.length ? p.fotos : undefined, category: p.categoria || undefined,
          offers: { "@type": "Offer", price: Number(p.precio).toFixed(2), priceCurrency: "EUR", availability: "https://schema.org/InStock" } } };
      }) });
      if (!ld.parentNode) document.head.appendChild(ld);
    }
  }

  function iniciar() {
    var conts = document.querySelectorAll("[data-velority-catalogo]");
    if (!conts.length) return;
    if (!document.getElementById("vc-css")) { var s = el("style"); s.id = "vc-css"; s.textContent = CSS; document.head.appendChild(s); }
    [].forEach.call(conts, function (cont) {
      var clave = cont.dataset.velorityCatalogo || "", k = "vc-cache-" + clave;
      if (!/^[0-9a-f]{16}$/.test(clave)) return;
      var copia = leer(k);
      if (copia) pintar(cont, copia);
      fetch(API + clave).then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); }).then(function (j) {
        var lista = Array.isArray(j.productos) ? j.productos : [];
        if (JSON.stringify(lista) !== JSON.stringify(copia)) pintar(cont, lista);
        guardar(k, lista);
      }).catch(function (e) { if (e === 404) { cont.textContent = ""; try { localStorage.removeItem(k); } catch (_) {} } });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();
