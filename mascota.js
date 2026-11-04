/* Velority · Mascota con IA para webs de clientes.
 * Uso (una línea, antes de </body>):
 *   <script src="https://velority.es/mascota.js" data-cliente="proelite" defer></script>
 * Opciones: data-lado="izquierda" (por defecto, derecha).
 * La mascota responde con la función «mascota» de Velority (datos del negocio y catálogo de su tienda). */
(function () {
  "use strict";
  var yo = document.currentScript || document.querySelector('script[src*="mascota.js"]');
  var CLIENTE = (yo && yo.dataset.cliente) || "";
  var IZQ = yo && yo.dataset.lado === "izquierda";
  var API = "https://ufwuvbjrgvphbggkfkuh.supabase.co/functions/v1/mascota";

  var PERFILES = {
    proelite: {
      nombre: "Carpi", subtitulo: "Experto en cebos · Pro Elite Baits",
      color: "#cda951", oscuro: "#111111", claro: "#fbf6e6",
      hola: "¡Hola! Soy Carpi 🎣 ¿Te ayudo a elegir cebo?",
      bienvenida: "¡Hola, pescador! Soy **Carpi**, la carpa de Pro Elite Baits. Te ayudo a elegir cebo, te cuento envíos y devoluciones o lo que necesites. ¿Dónde vas a pescar?",
      sugerencias: ["¿Qué cebo me recomiendas?", "Gama Gold o Classic", "Gastos de envío", "Cebos para feeder", "Ofertas", "Devoluciones"],
      dominios: ["proelitebaits.com"]
    }
  };
  var P = PERFILES[CLIENTE];
  if (!P || document.getElementById("vm-raiz")) return;

  /* Personaje: carpa dorada con gorra (SVG propio) */
  var CARPA = '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
    '<defs><linearGradient id="vmg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d77e"/><stop offset=".55" stop-color="#cda951"/><stop offset="1" stop-color="#9c7a2f"/></linearGradient></defs>' +
    '<path class="vm-cola" d="M18 60 L2 40 Q8 60 2 80 Z" fill="#9c7a2f"/>' +
    '<path d="M50 30 Q58 14 74 22 Q66 26 64 32 Z" fill="#b8913d"/>' +
    '<ellipse cx="62" cy="62" rx="46" ry="32" fill="url(#vmg)"/>' +
    '<path d="M40 50 q6 -4 12 0 M40 62 q6 -4 12 0 M40 74 q6 -4 12 0 M54 56 q6 -4 12 0 M54 68 q6 -4 12 0" stroke="#9c7a2f" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round"/>' +
    '<path d="M58 88 Q64 100 72 92 Z" fill="#b8913d"/>' +
    '<circle cx="86" cy="54" r="11" fill="#fff"/><circle class="vm-ojo" cx="89" cy="55" r="6" fill="#111"/><circle cx="91" cy="52" r="2" fill="#fff"/>' +
    '<path d="M98 70 Q104 74 99 78" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M100 76 q6 6 2 12" stroke="#9c7a2f" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="78" cy="68" rx="5" ry="3" fill="#e9967a" opacity=".55"/>' +
    '<path d="M66 40 Q74 22 98 30 Q104 34 100 42 Z" fill="#111"/><path d="M96 38 Q112 38 114 44 Q104 46 98 44 Z" fill="#111"/>' +
    '<text x="82" y="38" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#cda951" text-anchor="middle">PE</text>' +
    '</svg>';

  var css = "#vm-raiz{all:initial;position:fixed;bottom:18px;" + (IZQ ? "left" : "right") + ":18px;z-index:2147483000;font:15px/1.45 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#1d1d1f}" +
    "#vm-raiz *{box-sizing:border-box;font:inherit}" +
    ".vm-boton{all:unset;cursor:pointer;display:block;width:84px;height:84px;border-radius:50%;background:" + P.oscuro + ";box-shadow:0 10px 30px rgba(0,0,0,.35);position:relative;transition:transform .2s}" +
    ".vm-boton:hover{transform:translateY(-3px) scale(1.04)}.vm-boton:focus-visible{outline:3px solid " + P.color + ";outline-offset:3px}" +
    ".vm-boton svg{position:absolute;inset:10px;width:64px;height:64px;animation:vm-nada 3.2s ease-in-out infinite}" +
    ".vm-cola{transform-origin:18px 60px;animation:vm-cola 1.2s ease-in-out infinite}" +
    "@keyframes vm-nada{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-4px) rotate(3deg)}}" +
    "@keyframes vm-cola{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(10deg)}}" +
    "@media (prefers-reduced-motion:reduce){.vm-boton svg,.vm-cola{animation:none}}" +
    ".vm-globo{position:absolute;bottom:96px;" + (IZQ ? "left" : "right") + ":0;width:max-content;max-width:230px;background:#fff;color:#1d1d1f;padding:10px 14px;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.18);font-size:14px;cursor:pointer;animation:vm-entra .4s ease}" +
    ".vm-globo:after{content:'';position:absolute;bottom:-7px;" + (IZQ ? "left" : "right") + ":30px;border:8px solid transparent;border-top-color:#fff;border-bottom:0}" +
    ".vm-globo button{all:unset;cursor:pointer;position:absolute;top:-8px;" + (IZQ ? "right" : "left") + ":-8px;width:22px;height:22px;border-radius:50%;background:#333;color:#fff;font-size:13px;text-align:center;line-height:22px}" +
    "@keyframes vm-entra{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}" +
    ".vm-panel{position:absolute;bottom:0;" + (IZQ ? "left" : "right") + ":0;width:min(380px,calc(100vw - 24px));height:min(580px,calc(100vh - 36px));background:#fff;border-radius:18px;box-shadow:0 18px 50px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden;animation:vm-entra .25s ease}" +
    ".vm-cab{display:flex;align-items:center;gap:12px;padding:14px 16px;background:" + P.oscuro + ";color:#fff}" +
    ".vm-cab .vm-av{width:46px;height:46px;flex:none;border-radius:50%;background:#222;display:grid;place-items:center}.vm-cab .vm-av svg{width:40px;height:40px}" +
    ".vm-cab b{display:block;font-weight:700;font-size:16px;color:" + P.color + "}.vm-cab small{display:block;font-size:12px;opacity:.8}" +
    ".vm-cab button{all:unset;cursor:pointer;margin-left:auto;width:34px;height:34px;border-radius:50%;text-align:center;line-height:34px;font-size:22px;color:#fff}.vm-cab button:hover{background:rgba(255,255,255,.12)}" +
    ".vm-lista{flex:1;overflow-y:auto;padding:16px;background:" + P.claro + ";display:flex;flex-direction:column;gap:10px;overscroll-behavior:contain}" +
    ".vm-m{max-width:86%;padding:10px 13px;border-radius:14px;white-space:pre-wrap;overflow-wrap:anywhere}" +
    ".vm-m.b{align-self:flex-start;background:#fff;border:1px solid rgba(0,0,0,.08);border-bottom-left-radius:4px}" +
    ".vm-m.u{align-self:flex-end;background:" + P.oscuro + ";color:#fff;border-bottom-right-radius:4px}" +
    ".vm-m a{color:#7a5c12;font-weight:600;text-decoration:underline}.vm-m b{font-weight:700}" +
    ".vm-m.e{background:#fff3f2;color:#8a1c12;border:1px solid #f3c9c4}" +
    ".vm-esc{align-self:flex-start;display:flex;gap:4px;padding:12px 14px;background:#fff;border-radius:14px}.vm-esc i{width:7px;height:7px;border-radius:50%;background:" + P.color + ";animation:vm-pun 1s infinite}.vm-esc i:nth-child(2){animation-delay:.15s}.vm-esc i:nth-child(3){animation-delay:.3s}" +
    "@keyframes vm-pun{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}" +
    ".vm-sug{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 10px;background:" + P.claro + "}" +
    ".vm-sug button{all:unset;cursor:pointer;font-size:13px;padding:6px 11px;border-radius:99px;border:1px solid " + P.color + ";color:#5a4510;background:#fff}.vm-sug button:hover{background:" + P.color + ";color:#111}" +
    ".vm-pie{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #eee;background:#fff}" +
    ".vm-pie textarea{flex:1;resize:none;border:1px solid #ddd;border-radius:12px;padding:10px 12px;max-height:110px;min-height:42px;outline:none;color:#1d1d1f;background:#fff}.vm-pie textarea:focus{border-color:" + P.color + "}" +
    ".vm-pie button{all:unset;cursor:pointer;width:44px;height:44px;border-radius:12px;background:" + P.color + ";display:grid;place-items:center}.vm-pie button[disabled]{opacity:.5;cursor:default}" +
    ".vm-legal{font-size:11px;color:#888;text-align:center;padding:0 12px 8px;background:#fff}" +
    "@media (max-width:480px){#vm-raiz{bottom:12px;" + (IZQ ? "left" : "right") + ":12px}.vm-boton{width:70px;height:70px}.vm-boton svg{inset:8px;width:54px;height:54px}.vm-globo{bottom:80px}.vm-panel{position:fixed;inset:0;width:100%;height:100%;border-radius:0}}";

  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  var raiz = document.createElement("div"); raiz.id = "vm-raiz"; document.body.appendChild(raiz);

  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  /* Markdown mínimo y seguro: **negrita** y [texto](url) solo hacia los dominios del cliente */
  function md(t) {
    var h = esc(t);
    h = h.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
    h = h.replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, function (m, txt, url) {
      var ok = P.dominios.some(function (d) { try { var host = new URL(url.replace(/&amp;/g, "&")).hostname; return host === d || host.slice(-d.length - 1) === "." + d; } catch (e) { return false; } });
      return ok ? '<a href="' + url + '" target="_top">' + txt + "</a>" : txt;
    });
    return h;
  }

  var K = "vm-" + CLIENTE, H = [];
  try { H = JSON.parse(sessionStorage.getItem(K) || "[]"); } catch (e) {}
  var guardar = function () { try { sessionStorage.setItem(K, JSON.stringify(H.slice(-20))); } catch (e) {} };

  var boton = document.createElement("button");
  boton.className = "vm-boton"; boton.type = "button"; boton.setAttribute("aria-label", "Hablar con " + P.nombre); boton.innerHTML = CARPA;
  raiz.appendChild(boton);

  var globo = null;
  try { if (!sessionStorage.getItem(K + "-globo")) setTimeout(function () {
    if (abierto) return;
    globo = document.createElement("div"); globo.className = "vm-globo"; globo.innerHTML = esc(P.hola) + '<button type="button" aria-label="Cerrar aviso">×</button>';
    globo.onclick = function (e) { if (e.target.tagName === "BUTTON") { quitarGlobo(); } else abrir(); };
    raiz.appendChild(globo);
  }, 2500); } catch (e) {}
  function quitarGlobo() { if (globo) { globo.remove(); globo = null; } try { sessionStorage.setItem(K + "-globo", "1"); } catch (e) {} }

  var panel, lista, area, enviar, sug, abierto = false, ocupado = false;
  function pintarMensaje(rol, texto, err) {
    var d = document.createElement("div"); d.className = "vm-m " + (err ? "b e" : rol === "user" ? "u" : "b");
    d.innerHTML = rol === "user" ? esc(texto) : md(texto); lista.appendChild(d); lista.scrollTop = lista.scrollHeight;
  }
  function abrir() {
    quitarGlobo();
    if (abierto) return; abierto = true; boton.style.display = "none";
    panel = document.createElement("div"); panel.className = "vm-panel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Chat con " + P.nombre);
    panel.innerHTML = '<div class="vm-cab"><div class="vm-av">' + CARPA + '</div><div><b>' + esc(P.nombre) + '</b><small>' + esc(P.subtitulo) + '</small></div><button type="button" aria-label="Cerrar chat">×</button></div>' +
      '<div class="vm-lista" aria-live="polite"></div><div class="vm-sug"></div>' +
      '<div class="vm-pie"><textarea rows="1" maxlength="1000" placeholder="Escribe tu pregunta…" aria-label="Tu mensaje"></textarea><button type="button" aria-label="Enviar"><svg width="20" height="20" viewBox="0 0 24 24" fill="#111"><path d="M3 20.5 21 12 3 3.5l.01 6.6L15 12 3.01 13.9z"/></svg></button></div>' +
      '<div class="vm-legal">Asistente con IA: puede equivocarse. No compartas datos personales.</div>';
    raiz.appendChild(panel);
    lista = panel.querySelector(".vm-lista"); area = panel.querySelector("textarea"); enviar = panel.querySelector(".vm-pie button"); sug = panel.querySelector(".vm-sug");
    panel.querySelector(".vm-cab button").onclick = cerrar;
    pintarMensaje("assistant", P.bienvenida);
    H.forEach(function (m) { pintarMensaje(m.role, m.content); });
    if (!H.length) P.sugerencias.forEach(function (s) { var b = document.createElement("button"); b.type = "button"; b.textContent = s; b.onclick = function () { preguntar(s); }; sug.appendChild(b); });
    enviar.onclick = function () { preguntar(area.value); };
    area.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); preguntar(area.value); } });
    area.addEventListener("input", function () { area.style.height = "auto"; area.style.height = Math.min(area.scrollHeight, 110) + "px"; });
    panel.addEventListener("keydown", function (e) { if (e.key === "Escape") cerrar(); });
    area.focus();
  }
  function cerrar() { abierto = false; if (panel) panel.remove(); boton.style.display = ""; boton.focus(); }
  function preguntar(t) {
    t = String(t || "").trim(); if (!t || ocupado) return;
    sug.innerHTML = ""; area.value = ""; area.style.height = "";
    H.push({ role: "user", content: t.slice(0, 1000) }); guardar(); pintarMensaje("user", t);
    ocupado = true; enviar.disabled = true;
    var p = document.createElement("div"); p.className = "vm-esc"; p.innerHTML = "<i></i><i></i><i></i>"; lista.appendChild(p); lista.scrollTop = lista.scrollHeight;
    fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cliente: CLIENTE, mensajes: H.slice(-16) }) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        p.remove();
        if (j.respuesta) { H.push({ role: "assistant", content: j.respuesta }); guardar(); pintarMensaje("assistant", j.respuesta); }
        else { H.pop(); guardar(); pintarMensaje("assistant", j.error || "No he podido responder. Inténtalo de nuevo.", true); }
      })
      .catch(function () { p.remove(); H.pop(); guardar(); pintarMensaje("assistant", "Sin conexión. Inténtalo de nuevo en un momento.", true); })
      .then(function () { ocupado = false; enviar.disabled = false; area.focus(); });
  }
  boton.onclick = abrir;
})();
