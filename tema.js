// Velority · tema de temporada en las páginas por sector. Lee el tema activo del panel (tema_publico) y
// decora la página igual que la portada. ?tema=halloween, ?tema=navidad o ?tema=blackfriday lo enseña como vista previa.
(function () {
  if (/bot|crawl|spider|slurp|mediapartners|inspectiontool/i.test(navigator.userAgent)) return;   // Google ve siempre la página normal
  var URL_SB = "https://ufwuvbjrgvphbggkfkuh.supabase.co", CLAVE = "sb_publishable_qxIupQGDLTM9ZXf4uAB60A_FHyRBws_";
  var CLASE = { halloween: "th-hw", navidad: "th-nv", blackfriday: "th-bf" };
  var LOGO = { "th-hw": "/logo-halloween.svg", "th-nv": "/logo-navidad.webp", "th-bf": "/logo-blackfriday.svg" };
  var FAV = { "th-hw": ["/logo-halloween.svg", "image/svg+xml"], "th-nv": ["/favicon-navidad.png", "image/png"], "th-bf": ["/logo-blackfriday.svg", "image/svg+xml"] };
  var q = new URLSearchParams(location.search).get("tema");
  function vigente(t) { var n = Date.now(); return !!t && !!CLASE[t.tema] && (!t.desde || n >= Date.parse(t.desde)) && (!t.hasta || n <= Date.parse(t.hasta)); }
  function escena(cls) {
    var h = "", i;
    if (cls === "th-bf") {
      for (i = 0; i < 16; i++) h += '<i class="bfc' + (i % 3 === 1 ? ' b' : i % 5 === 2 ? ' n' : '') + '" style="left:' + (i * 41 + 5) % 100 + '%;animation-duration:' + (7 + (i * 5) % 8) + 's;animation-delay:-' + (i * 11) % 15 + 's;--dx:' + (((i * 31) % 70) - 35) + 'px"></i>';
      return '<i class="foco f1"></i><i class="foco f2"></i>' + h;
    }
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
    if (cls && !e) { e = document.createElement("div"); e.id = "th-escena"; e.dataset.cls = cls; if (cls === "th-bf") e.className = "bf"; e.setAttribute("aria-hidden", "true"); e.innerHTML = escena(cls); document.body.appendChild(e); }
    var ll = document.getElementById("th-lluvia");
    if (cls === "th-bf" && !ll) {
      ll = document.createElement("div"); ll.id = "th-lluvia"; ll.setAttribute("aria-hidden", "true");
      for (var j = 0, h2 = ""; j < 16; j++) h2 += '<i class="' + (j % 3 === 1 ? 'b' : j % 5 === 2 ? 'n' : '') + '" style="left:' + (j * 37 + 11) % 100 + '%;animation-duration:' + (14 + (j * 7) % 12) + 's;animation-delay:-' + (j * 13) % 24 + 's;--dx:' + (((j * 29) % 80) - 40) + 'px"></i>';
      ll.innerHTML = h2; document.body.insertBefore(ll, document.body.firstChild);
    } else if (cls !== "th-bf" && ll) ll.remove();
    var tira = document.getElementById("th-tira");
    if (cls === "th-bf") {
      if (!tira) { tira = document.createElement("div"); tira.id = "th-tira"; tira.setAttribute("role", "note"); document.body.insertBefore(tira, document.body.firstChild); }
      var pct = t.descuentos || forzar ? (+t.descuento_max || 50) : 0, esc = function (x) { return String(x).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
      var msg = t.franja_activa && t.franja ? esc(t.franja) : pct ? "Hasta <b>−" + pct + " %</b> en mejoras para tu web" : "Pide tu demo gratuita y sin compromiso";
      var dest = pct ? "/servicios/conweb/" : "/?demo=1";
      tira.innerHTML = '<div class="tt-in"><span class="tt-tag">BLACK FRIDAY</span><span class="tt-msg">' + msg + '</span><span class="tt-cd"></span><a class="tt-btn" href="' + dest + '">' + (pct ? "Ver ofertas →" : "Pedir mi demo") + '</a></div>';
      tira.onclick = function (e) { if (matchMedia("(max-width:700px)").matches && !e.target.closest(".tt-btn")) location.href = dest; };
      var cd = tira.querySelector(".tt-cd"), fin = Date.parse(t.hasta || ""); clearInterval(window.__ttCd);
      if (fin) { var pinta = function () { var r = Math.max(0, fin - Date.now()), d = Math.floor(r / 864e5), h = Math.floor(r / 36e5) % 24, m = Math.floor(r / 6e4) % 60, sg = Math.floor(r / 1e3) % 60, z = function (n) { return (n < 10 ? "0" : "") + n; }; cd.textContent = r ? "⏳ Termina en " + (d ? d + " d " : "") + z(h) + ":" + z(m) + ":" + z(sg) : ""; }; pinta(); window.__ttCd = setInterval(pinta, 1000); }
    } else if (tira) { tira.remove(); clearInterval(window.__ttCd); }
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
