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
 * Pedidos online: si la tienda tiene activada la gestión de pedidos (portal › Pedidos), aparece «Añadir al carrito»
 *   y un carrito flotante; el pedido llega al portal de la tienda y por correo. Opción: data-privacidad="URL de su
 *   política de privacidad" para enlazarla en el formulario.
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
    ".vc-vacio{text-align:center;color:var(--vc-texto-suave)}" +
    ".vc-add{all:unset;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:8px;margin-top:8px;padding:.85em 1.4em;background:var(--vc-acento-boton,#1b1b1f);color:#fff;border-radius:999px;font-size:.92em;letter-spacing:.04em;cursor:pointer;text-align:center}" +
    ".vc-add.ok{background:#15803d}.vc-cant{display:flex;align-items:center;gap:10px}.vc-cant button{all:unset;cursor:pointer;width:34px;height:34px;border-radius:50%;border:1px solid #d4d4d8;display:grid;place-items:center;font-size:18px;color:#1b1b1f}.vc-cant b{min-width:22px;text-align:center}" +
    ".vc-carro{all:unset;position:fixed;left:16px;bottom:16px;z-index:2147482000;cursor:pointer;background:#1b1b1f;color:#fff;border-radius:999px;padding:.8em 1.2em;font:600 15px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25)}" +
    ".vc-carro b{background:#fff;color:#1b1b1f;border-radius:999px;padding:.15em .55em;margin-left:.5em}" +
    ".vc-cc{background:#fff;color:#1b1b1f;border-radius:10px;max-width:560px;width:100%;max-height:calc(100vh - 32px);overflow:auto;position:relative;padding:clamp(20px,4vw,30px);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px}" +
    ".vc-cc h3{margin:0 0 14px;font-size:1.35em;font-weight:600}.vc-cc ul{list-style:none;margin:0;padding:0}.vc-cc li{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #eee}" +
    ".vc-cc li span{flex:1;min-width:0;overflow-wrap:anywhere}.vc-cc .vc-quitar{all:unset;cursor:pointer;color:#b42318;font-size:.85em}.vc-tot{display:flex;justify-content:space-between;margin:12px 0 2px;font-size:1.05em}" +
    ".vc-cc form{display:grid;gap:10px;margin-top:16px}.vc-cc label{display:grid;gap:4px;font-size:.88em;color:#3f3f46}.vc-cc input,.vc-cc select,.vc-cc textarea{font:inherit;font-size:15px;padding:.6em .7em;border:1px solid #d4d4d8;border-radius:8px;color:#1b1b1f;background:#fff;width:100%;box-sizing:border-box}" +
    ".vc-radio{display:flex;gap:14px;flex-wrap:wrap}.vc-radio label{display:flex;align-items:center;gap:6px;font-size:.95em;color:#1b1b1f}.vc-radio input{width:auto}" +
    ".vc-legal{font-size:.78em;color:#71717a;line-height:1.5;margin:0}.vc-err{color:#b42318;margin:0;font-size:.9em}.vc-cc .vc-add{width:100%;margin-top:4px}.vc-cc .vc-add[disabled]{opacity:.6;cursor:wait}";

  var POST = API.replace(/\?c=$/, ""), TIENDA = {}, CARRO_K = "vc-carro-";
  function carro(clave) { return leer(CARRO_K + clave) || []; }
  function ponerCarro(clave, l) { guardar(CARRO_K + clave, l); pintarBoton(clave); }
  function anadir(clave, p, n) {
    var l = carro(clave), x = l.filter(function (i) { return i.id === p.id; })[0];
    if (x) x.cantidad = Math.min(99, x.cantidad + n); else l.push({ id: p.id, nombre: p.nombre, precio: p.precio, cantidad: n });
    ponerCarro(clave, l);
  }
  function pintarBoton(clave) {
    var b = document.getElementById("vc-carro-" + clave), l = carro(clave), n = l.reduce(function (a, i) { return a + i.cantidad; }, 0);
    if (!n) { if (b) b.remove(); return; }
    if (!b) { b = el("button", "vc-carro"); b.id = "vc-carro-" + clave; b.type = "button"; b.onclick = function () { verCarro(clave); }; document.body.appendChild(b); }
    b.textContent = "🛒 Tu pedido"; var c = el("b", "", String(n)); b.appendChild(c); b.setAttribute("aria-label", "Ver tu pedido, " + n + (n === 1 ? " producto" : " productos"));
  }
  function modal(contenido, etiqueta) {
    var previo = document.activeElement, m = el("div", "vc-modal"), cerrar = el("button", "vc-cerrar", "×");
    m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-label", etiqueta);
    cerrar.type = "button"; cerrar.setAttribute("aria-label", "Cerrar"); contenido.appendChild(cerrar); m.appendChild(contenido);
    var fuera = function () { m.remove(); document.removeEventListener("keydown", tecla); document.documentElement.style.overflow = ""; if (previo && previo.focus) previo.focus(); };
    var tecla = function (e) { if (e.key === "Escape") fuera(); };
    cerrar.onclick = fuera; m.onclick = function (e) { if (e.target === m) fuera(); };
    document.addEventListener("keydown", tecla); document.documentElement.style.overflow = "hidden"; document.body.appendChild(m); cerrar.focus();
    return fuera;
  }
  function verCarro(clave) {
    var t = TIENDA[clave]; if (!t) return;
    var caja = el("div", "vc-cc"), cerrar = modal(caja, "Tu pedido");
    function dibujar() {
      [].slice.call(caja.childNodes).forEach(function (n) { if (!n.classList || !n.classList.contains("vc-cerrar")) n.remove(); });
      var l = carro(clave), cierre = caja.querySelector(".vc-cerrar");
      caja.insertBefore(el("h3", "", "Tu pedido"), cierre);
      if (!l.length) { caja.insertBefore(el("p", "", "Tu pedido está vacío."), cierre); return; }
      var ul = el("ul"), sub = 0;
      l.forEach(function (i) {
        sub += i.precio * i.cantidad;
        var li = el("li"), c = el("div", "vc-cant"), menos = el("button", "", "−"), mas = el("button", "", "+"), q = el("button", "vc-quitar", "Quitar");
        menos.type = mas.type = q.type = "button"; menos.setAttribute("aria-label", "Uno menos de " + i.nombre); mas.setAttribute("aria-label", "Uno más de " + i.nombre);
        menos.onclick = function () { i.cantidad = Math.max(1, i.cantidad - 1); ponerCarro(clave, l); dibujar(); };
        mas.onclick = function () { i.cantidad = Math.min(99, i.cantidad + 1); ponerCarro(clave, l); dibujar(); };
        q.onclick = function () { ponerCarro(clave, l.filter(function (x) { return x !== i; })); dibujar(); };
        c.appendChild(menos); c.appendChild(el("b", "", String(i.cantidad))); c.appendChild(mas);
        li.appendChild(el("span", "", i.nombre)); li.appendChild(c); li.appendChild(el("strong", "", euros(i.precio * i.cantidad))); li.appendChild(q); ul.appendChild(li);
      });
      caja.insertBefore(ul, cierre);
      var tot = el("div", "vc-tot"); tot.appendChild(el("span", "", "Subtotal")); tot.appendChild(el("b", "", euros(sub))); caja.insertBefore(tot, cierre);
      var f = el("form"); f.noValidate = true;
      function campo(etq, tipo, nombre, extra) { var lb = el("label", "", etq), i = el(tipo === "textarea" ? "textarea" : "input"); if (tipo !== "textarea") i.type = tipo; i.name = nombre; for (var k in (extra || {})) i.setAttribute(k, extra[k]); lb.appendChild(i); f.appendChild(lb); return i; }
      var nom = campo("Nombre y apellidos", "text", "nombre", { autocomplete: "name", maxlength: "80", required: "" });
      var tel = campo("Teléfono", "tel", "telefono", { autocomplete: "tel", maxlength: "25", required: "" });
      campo("Correo (opcional, para recibir la confirmación)", "email", "email", { autocomplete: "email", maxlength: "120" });
      var ents = [];
      if (t.recogida) ents.push(["recogida", "Recojo en la tienda"]);
      if (t.envio) ents.push(["envio", "Envío a domicilio" + (t.coste_envio ? " (" + euros(t.coste_envio) + (t.gratis_desde ? ", gratis desde " + euros(t.gratis_desde) : "") + ")" : " (gratis)")]);
      var rg = el("div", "vc-radio"), dir;
      ents.forEach(function (e, k) { var lb = el("label"), r = el("input"); r.type = "radio"; r.name = "entrega"; r.value = e[0]; r.checked = !k; r.onchange = function () { dir.parentNode.style.display = r.value === "envio" ? "" : "none"; total(); }; lb.appendChild(r); lb.appendChild(document.createTextNode(e[1])); rg.appendChild(lb); });
      var lr = el("label", "", "Entrega"); lr.appendChild(rg); f.appendChild(lr);
      dir = campo("Dirección de envío", "text", "direccion", { autocomplete: "street-address", maxlength: "300" }); dir.parentNode.style.display = ents[0] && ents[0][0] === "envio" ? "" : "none";
      if (t.pagos && t.pagos.length) { var lp = el("label", "", "Forma de pago"), sel = el("select"); sel.name = "pago"; t.pagos.forEach(function (x) { var o = el("option", "", x); o.value = x; sel.appendChild(o); }); lp.appendChild(sel); f.appendChild(lp); }
      campo("Nota para la tienda (opcional)", "textarea", "nota", { rows: "2", maxlength: "1000" });
      if (t.nota) f.appendChild(el("p", "vc-legal", t.nota));
      var tg = el("div", "vc-tot"); f.appendChild(tg);
      function total() {
        var envio = f.entrega && f.entrega.value === "envio" ? (t.gratis_desde && sub >= t.gratis_desde ? 0 : Number(t.coste_envio || 0)) : 0;
        tg.textContent = ""; tg.appendChild(el("span", "", "Total" + (envio ? " (con envío)" : ""))); tg.appendChild(el("b", "", euros(sub + envio)));
      }
      var leg = el("p", "vc-legal"), priv = cerrarPriv; leg.textContent = "Enviaremos tus datos a la tienda solo para gestionar este pedido. No pagas nada ahora: la tienda te contactará para confirmarlo y acordar el pago. ";
      if (priv) { var a = el("a", "", "Política de privacidad"); a.href = priv; a.target = "_blank"; a.rel = "noopener"; leg.appendChild(a); }
      f.appendChild(leg);
      var err = el("p", "vc-err"); err.setAttribute("role", "alert"); f.appendChild(err);
      var env = el("button", "vc-add", "Enviar pedido"); env.type = "submit"; f.appendChild(env);
      f.onsubmit = function (e) {
        e.preventDefault(); err.textContent = "";
        if (nom.value.trim().length < 2) { err.textContent = "Escribe tu nombre."; nom.focus(); return; }
        if (tel.value.replace(/\D/g, "").length < 9) { err.textContent = "Escribe un teléfono válido."; tel.focus(); return; }
        var ent = f.entrega ? f.entrega.value : "recogida";
        if (ent === "envio" && dir.value.trim().length < 8) { err.textContent = "Escribe la dirección de envío completa."; dir.focus(); return; }
        env.disabled = true; env.textContent = "Enviando…";
        var datos = { nombre: nom.value, telefono: tel.value, email: f.email.value, entrega: ent, direccion: dir.value, pago: f.pago ? f.pago.value : "", nota: f.nota.value,
          lineas: carro(clave).map(function (i) { return { id: i.id, cantidad: i.cantidad }; }) };
        fetch(POST, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accion: "pedido", clave: clave, pedido: datos }) })
          .then(function (r) { return r.json(); }).then(function (j) {
            if (j.error) throw new Error(j.error);
            ponerCarro(clave, []);
            [].slice.call(caja.childNodes).forEach(function (n) { if (!n.classList || !n.classList.contains("vc-cerrar")) n.remove(); });
            var ci = caja.querySelector(".vc-cerrar");
            caja.insertBefore(el("h3", "", "¡Pedido enviado! 🎉"), ci);
            caja.insertBefore(el("p", "", "Tu número de pedido es el #" + j.numero + " (" + euros(j.total) + "). La tienda te contactará pronto para confirmarlo" + (datos.pago ? " y acordar el pago (" + datos.pago + ")" : "") + "."), ci);
            if (datos.email) caja.insertBefore(el("p", "vc-legal", "Te hemos enviado un resumen a " + datos.email + "."), ci);
          }).catch(function (x) { err.textContent = x.message || "No se ha podido enviar. Inténtalo de nuevo."; env.disabled = false; env.textContent = "Enviar pedido"; });
      };
      caja.insertBefore(f, cierre); total();
    }
    var cerrarPriv = t.privacidad || ""; dibujar();
  }

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

  function ficha(p, wa, clave) {
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
    if (clave && TIENDA[clave] && p.precio !== null && p.precio !== undefined) {
      var n = 1, cant = el("div", "vc-cant"), menos = el("button", "", "−"), mas = el("button", "", "+"), num = el("b", "", "1"), add = el("button", "vc-add", "Añadir al pedido");
      menos.type = mas.type = add.type = "button"; menos.setAttribute("aria-label", "Uno menos"); mas.setAttribute("aria-label", "Uno más");
      menos.onclick = function () { n = Math.max(1, n - 1); num.textContent = n; }; mas.onclick = function () { n = Math.min(99, n + 1); num.textContent = n; };
      cant.appendChild(menos); cant.appendChild(num); cant.appendChild(mas); info.appendChild(cant);
      add.onclick = function () { anadir(clave, p, n); add.textContent = "✓ Añadido · Ver mi pedido"; add.classList.add("ok"); add.onclick = function () { cerrar.click(); verCarro(clave); }; };
      info.appendChild(add);
    }
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
        b.onclick = function () { ficha(p, wa, d.velorityCatalogo); };
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
        if (j.pedidos) { j.pedidos.privacidad = cont.dataset.privacidad || ""; TIENDA[clave] = j.pedidos; pintarBoton(clave); } else { delete TIENDA[clave]; try { localStorage.removeItem(CARRO_K + clave); } catch (_) {} }
        if (JSON.stringify(lista) !== JSON.stringify(copia)) pintar(cont, lista);
        guardar(k, lista);
      }).catch(function (e) { if (e === 404) { cont.textContent = ""; try { localStorage.removeItem(k); } catch (_) {} } });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();
