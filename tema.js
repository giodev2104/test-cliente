// Velority · tema de temporada en las páginas por sector. Lee el tema activo del panel (tema_publico) y
// decora la página igual que la portada. ?tema=halloween o ?tema=navidad lo enseña como vista previa.
(function () {
  if (/bot|crawl|spider|slurp|mediapartners|inspectiontool/i.test(navigator.userAgent)) return;   // Google ve siempre la página normal
  var URL_SB = "https://ufwuvbjrgvphbggkfkuh.supabase.co", CLAVE = "sb_publishable_qxIupQGDLTM9ZXf4uAB60A_FHyRBws_";
  var CLASE = { halloween: "th-hw", navidad: "th-nv" };
  var LOGO = { "th-hw": "/logo-halloween.svg", "th-nv": "/logo-navidad.webp" };
  var FAV = { "th-hw": ["/logo-halloween.svg", "image/svg+xml"], "th-nv": ["/favicon-navidad.png", "image/png"] };
  var q = new URLSearchParams(location.search).get("tema");
  function vigente(t) { var n = Date.now(); return !!t && !!CLASE[t.tema] && (!t.desde || n >= Date.parse(t.desde)) && (!t.hasta || n <= Date.parse(t.hasta)); }
  function escena(cls) {
    var h = "", i;
    if (cls === "th-hw") {
      for (i = 0; i < 14; i++) h += '<i class="ch" style="left:' + (i * 53 + 11) % 100 + '%;animation-duration:' + (8 + (i * 7) % 9) + 's;animation-delay:-' + (i * 13) % 14 + 's;--dx:' + (((i * 37) % 80) - 40) + 'px"></i>';
      return '<div class="luna"></div><i class="rama r1"></i><i class="rama r3"></i><i class="mu m1"></i><i class="mu m2"></i><i class="mu m4"></i>' + h + '<div class="niebla"></div>';
    }
    for (i = 0; i < 26; i++) h += '<i class="copo" style="left:' + (i * 37 + 7) % 100 + '%;animation-duration:' + (9 + (i * 5) % 10) + 's;animation-delay:-' + (i * 11) % 19 + 's;--dx:' + (((i * 29) % 60) - 30) + 'px;width:' + (2 + i % 3) + 'px;height:' + (2 + i % 3) + 'px;opacity:' + (.45 + (i % 5) / 10) + '"></i>';
    return '<div class="foto"></div>' + h;
  }
  function alto() {
    var e = document.getElementById("th-escena"), hero = document.querySelector(".hero");
    if (e && hero) e.style.setProperty("--esc-h", Math.round(hero.getBoundingClientRect().bottom + scrollY + 120) + "px");
  }
  function aplicar(t, forzar) {
    var cls = t && (forzar || vigente(t)) ? CLASE[t.tema] : null, raiz = document.documentElement;
    Object.keys(CLASE).forEach(function (k) { raiz.classList.toggle(CLASE[k], CLASE[k] === cls); });
    var e = document.getElementById("th-escena");
    if (e && e.dataset.cls !== cls) { e.remove(); e = null; }
    if (cls && !e) { e = document.createElement("div"); e.id = "th-escena"; e.dataset.cls = cls; e.setAttribute("aria-hidden", "true"); e.innerHTML = escena(cls); document.body.appendChild(e); }
    alto();
    var img = document.querySelector(".brand img");
    if (img) { if (!img.dataset.orig) img.dataset.orig = img.getAttribute("src"); img.setAttribute("src", cls ? LOGO[cls] : img.dataset.orig); }
    var ic = document.querySelector('link[rel="icon"][type^="image/svg"]') || document.getElementById("ic-svg");
    if (ic) { ic.id = "ic-svg"; if (!ic.dataset.orig) ic.dataset.orig = ic.getAttribute("href"); var f = FAV[cls]; ic.setAttribute("href", f ? f[0] : ic.dataset.orig); ic.setAttribute("type", f ? f[1] : "image/svg+xml"); }
  }
  var guardado = null;
  try { guardado = JSON.parse(localStorage.getItem("velority-tema") || "null"); } catch (_) {}
  if (CLASE[q]) aplicar({ tema: q }, true); else aplicar(guardado);
  addEventListener("resize", alto);
  fetch(URL_SB + "/rest/v1/rpc/tema_publico", { method: "POST", headers: { apikey: CLAVE, Authorization: "Bearer " + CLAVE, "Content-Type": "application/json" }, body: "{}" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (t) { try { localStorage.setItem("velority-tema", JSON.stringify(t || null)); } catch (_) {} if (!CLASE[q]) aplicar(t); })
    .catch(function () {});
})();
