// Analítica de visitas (Metricool) solo con consentimiento.
// Guarda la elección en localStorage («velority-analitica» = "si" | "no"). Sin elección no se mide nada.
// velorityCookies() vuelve a abrir el aviso (enlace «Cambiar mis preferencias» de /legal/cookies/).
(function () {
  var K = "velority-analitica", HASH = "a780c56350c7103c924be78851c0ffa0";
  function leer() { try { return localStorage.getItem(K); } catch (_) { return null; } }
  function guardar(v) { try { localStorage.setItem(K, v); localStorage.setItem("webcare-cookies", "ok"); } catch (_) {} }
  // Nunca se mide una URL con datos de acceso (enlaces mágicos, tokens, códigos)
  function urlSegura() { return !/token|code=|access|refresh|type=(magiclink|recovery|invite|signup)/i.test(location.search + location.hash); }
  var cargado = false;
  function medir() {
    if (cargado || !urlSegura()) return; cargado = true;
    var s = document.createElement("script");
    s.src = "https://tracker.metricool.com/resources/be.js"; s.async = true;
    s.onload = function () { try { beTracker.t({ hash: HASH }); } catch (_) {} };
    document.head.appendChild(s);
  }
  function estilos() {
    if (document.getElementById("vck-css")) return;
    var c = document.createElement("style"); c.id = "vck-css";
    c.textContent = ".vck{position:fixed;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:9990;max-width:680px;margin:0 auto;background:#141a2e;color:#e8ebf7;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:14px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;box-shadow:0 10px 30px rgba(0,0,0,.4);font:13.5px/1.5 Inter,system-ui,-apple-system,'Segoe UI',sans-serif}" +
      ".vck p{flex:1;min-width:230px;margin:0;color:#aab1cc}.vck a{color:#c6ccff}.vck .vb{display:flex;gap:8px}" +
      ".vck button{font:600 14px Inter,system-ui,sans-serif;padding:10px 16px;border-radius:10px;cursor:pointer;border:1px solid rgba(255,255,255,.18);background:transparent;color:#e8ebf7}" +
      ".vck button.si{background:linear-gradient(135deg,#7c8cff,#a78bfa);border-color:transparent;color:#fff}" +
      ".vck button:focus-visible{outline:3px solid #5b6cff;outline-offset:2px}@media(max-width:480px){.vck .vb{width:100%}.vck button{flex:1}}";
    document.head.appendChild(c);
  }
  function aviso() {
    var v = document.querySelector(".vck"); if (v) v.remove();
    estilos();
    var d = document.createElement("div");
    d.className = "vck"; d.setAttribute("role", "region"); d.setAttribute("aria-label", "Aviso de cookies");
    d.innerHTML = '<p>Con tu permiso, contamos las visitas con Metricool para saber qué páginas se leen más. No usamos publicidad. <a href="/legal/cookies/">Más información</a></p>' +
      '<div class="vb"><button type="button" class="no">Rechazar</button><button type="button" class="si">Aceptar</button></div>';
    d.querySelector(".no").onclick = function () { guardar("no"); d.remove(); };
    d.querySelector(".si").onclick = function () { guardar("si"); d.remove(); medir(); };
    document.body.appendChild(d);
  }
  window.velorityCookies = aviso;
  var e = leer();
  if (e === "si") medir();
  else if (e !== "no") {
    // Sale cuando la página ya ha cargado, para no mover el contenido mientras se pinta
    var poner = function () { setTimeout(aviso, 600); };
    if (document.readyState === "complete") poner(); else addEventListener("load", poner, { once: true });
  }
})();
