# Genera las páginas por sector de velority.es (HTML estático, rastreable sin JavaScript)
# Uso: cd _herramientas/paginas-sector && python3 gen.py   (regenera las 7 páginas por sector, la 404 y el sitemap)
import json, os, html
R = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))   # raíz del repositorio
B = "https://velority.es"
WA = "34696273459"
HOY = "2026-10-22"
from extra import EXTRA
from articulos import ART
esc = html.escape

P = [
 dict(slug="diseno-web-reformas", sector="reformas", estilo="moderno", corto="Reformas",
  title="Diseño web para empresas de reformas · Precio cerrado | Velority",
  desc="Página web para empresas de reformas, construcción y oficios: galería de obras, petición de presupuesto y SEO local. Demo gratis y precio cerrado desde 100 €.",
  h1="Diseño web para empresas de reformas", kick="Reformas, construcción y oficios",
  lead="Una web que enseña tus obras y convierte visitas en peticiones de presupuesto. Primero la ves gratis con el nombre de tu empresa; luego decides.",
  porque=("Tus próximos clientes buscan «reformas en» + su ciudad y comparan fotos antes de llamar. Si no apareces o tu web no enseña tu trabajo, el presupuesto se lo piden a otro.",),
  feats=[("📷","Galería de antes y después","Tus mejores obras ordenadas por tipo: cocinas, baños, integrales, fachadas…"),
         ("📝","Formulario de presupuesto","El cliente te cuenta qué necesita, los metros y la zona, y te llega directo al correo o al WhatsApp."),
         ("📍","SEO local","Preparada para salir en Google y en Google Maps en las zonas donde trabajas."),
         ("⭐","Reseñas de Google","Muestra las opiniones de tus clientes para generar confianza al momento."),
         ("💬","WhatsApp en un toque","Botón de WhatsApp siempre visible para que te escriban desde el móvil."),
         ("📱","Rápida en el móvil","La mayoría te buscará desde el móvil, en la obra o en el sofá.")],
  plan="Tu web", precio="100 €", nota="El precio final depende de las secciones y funciones que necesites, y te lo damos cerrado antes de empezar. Sin cuotas ni permanencia.",
  faq=[("¿Cuánto cuesta una página web para una empresa de reformas?","Desde 100 €, en un único pago. El precio final depende de lo que necesites (galería de obras, formulario de presupuesto, ficha de Google Maps…) y te lo damos cerrado antes de empezar, sin cuotas."),
       ("¿Puedo subir yo las fotos de las obras nuevas?","Sí. Con el Plan Negocio la web es autogestionable: añades fotos y trabajos nuevos sin depender de nadie. Si lo prefieres, nos las mandas por el chat y las subimos nosotros."),
       ("¿Me ayudáis a salir en Google Maps?","Sí. El Plan Negocio incluye la ficha de Google Maps (SEO local). También puedes contratarla por separado si ya tienes web."),
       ("¿Cuánto tarda en estar lista?","La demo gratuita te la enseñamos en pocos días. Cuando la apruebas y nos pasas tus textos y fotos, la web suele estar publicada en una o dos semanas.")]),
 dict(slug="diseno-web-peluquerias-estetica", sector="estetica", estilo="elegante", corto="Peluquerías y estética",
  title="Diseño web para peluquerías y centros de estética | Velority",
  desc="Página web para peluquerías, barberías y centros de estética con carta de tratamientos y cita previa online. Demo gratis y precio cerrado, pago único.",
  h1="Diseño web para peluquerías y centros de estética", kick="Peluquerías, barberías y estética",
  lead="Una web elegante con tus tratamientos, tus precios y cita previa online, para que te reserven a cualquier hora. Pruébala gratis antes de pagar nada.",
  porque=("Cada llamada que no puedes coger mientras atiendes es una cita que se va. Con la reserva online tus clientas eligen día y hora solas, y tú solo miras la agenda.",),
  feats=[("💅","Carta de tratamientos","Servicios con precio y duración, ordenados por categorías: color, corte, uñas, facial…"),
         ("📅","Cita previa online","Reservas desde la web las 24 horas, con aviso por correo para ti y para el cliente."),
         ("📸","Galería de trabajos","Tus mejores looks y el ambiente del salón, bien presentados."),
         ("⭐","Reseñas de Google","Las opiniones de tus clientas, visibles en la web."),
         ("📍","Google Maps","Para que te encuentren al buscar «peluquería cerca de mí»."),
         ("💬","WhatsApp directo","Para dudas rápidas, sin formularios.")],
  plan="Tu web", precio="100 €", nota="El precio final depende de las secciones y funciones que necesites, y te lo damos cerrado antes de empezar. Sin cuotas ni permanencia.",
  faq=[("¿Cuánto cuesta una web con reserva de citas para un salón?","Desde 100 €, en un único pago. Si quieres reservas online, el precio cerrado dependerá de cómo funcione tu agenda; te lo damos por escrito antes de empezar."),
       ("¿Puedo cambiar los precios de los tratamientos yo misma?","Sí. Te dejamos la web preparada para que actualices precios, tratamientos y fotos, e incluimos una hora de formación."),
       ("¿Los clientes reciben confirmación de la cita?","Sí. Al reservar, el cliente y tú recibís un correo automático con el día y la hora."),
       ("¿Puedo verla antes de pagar?","Sí. Te preparamos una demo gratuita con el nombre de tu salón y, si no te convence, no pagas nada.")]),
 dict(slug="diseno-web-restaurantes", sector="hosteleria", estilo="calido", corto="Restaurantes y bares",
  title="Diseño web para restaurantes y bares · Carta online | Velority",
  desc="Página web para restaurantes, bares y cafeterías: carta online, reservas, horarios y Google Maps. Ve tu web gratis antes de pagar. Precio cerrado desde 100 €.",
  h1="Diseño web para restaurantes, bares y cafeterías", kick="Hostelería",
  lead="Tu carta, tus horarios y tu ubicación a un toque, con fotos que abren el apetito y un botón para reservar mesa. Primero la ves gratis; luego decides.",
  porque=("Antes de entrar, la gente mira la carta, las fotos y las reseñas en el móvil. Una web propia hace que no dependas solo de plataformas que cobran comisión.",),
  feats=[("📖","Carta online","Platos, precios y alérgenos fáciles de leer en el móvil, sin PDF que haya que ampliar."),
         ("📅","Reservas de mesa","Botón de reserva por WhatsApp o, si lo necesitas, con motor de reservas."),
         ("🕐","Horarios y ubicación","Horario, mapa y cómo llegar, siempre a la vista."),
         ("📸","Galería del local","El ambiente, los platos estrella y la terraza."),
         ("⭐","Reseñas de Google","Tus mejores opiniones dentro de tu propia web."),
         ("📍","SEO local","Para aparecer al buscar «restaurante» o «bar» en tu zona.")],
  plan="Tu web", precio="100 €", nota="El precio final depende de las secciones y funciones que necesites, y te lo damos cerrado antes de empezar. Sin cuotas ni permanencia.",
  faq=[("¿Cuánto cuesta la web de un restaurante?","Desde 100 €, en un único pago, con carta, horarios, mapa y WhatsApp. Si quieres reservas o pedidos online, te damos el precio cerrado antes de empezar."),
       ("¿Puedo cambiar la carta cuando quiera?","Sí. Te dejamos la carta preparada para que cambies platos y precios tú mismo, o nos lo pides por el chat."),
       ("¿Sirve la carta para leer desde un código QR en la mesa?","Sí. La carta tiene su propia dirección y te damos el QR listo para imprimir."),
       ("¿Tengo que pagar cuotas mensuales?","No. La web es un pago único y es tuya, con el dominio incluido. Solo pagas el alojamiento y la renovación del dominio cuando toque.")]),
 dict(slug="diseno-web-clinicas", sector="clinica", estilo="minimal", corto="Clínicas y salud",
  title="Diseño web para clínicas, dentistas y fisioterapia | Velority",
  desc="Página web para clínicas, dentistas, fisioterapeutas y psicólogos: servicios, equipo, cita previa y textos legales RGPD. Demo gratis y precio cerrado.",
  h1="Diseño web para clínicas y centros de salud", kick="Clínicas, dentistas, fisioterapia y psicología",
  lead="Una web clara y que transmite confianza: tus tratamientos explicados, tu equipo, cómo pedir cita y la información legal en regla. Pruébala gratis antes de pagar.",
  porque=("Elegir dónde tratarse da respeto. Una web seria, con el equipo y los tratamientos explicados en lenguaje sencillo, es lo que hace que un paciente nuevo pida cita contigo.",),
  feats=[("🩺","Tratamientos explicados","Cada servicio con su página o bloque: en qué consiste, para quién es y cómo es la primera visita."),
         ("👩‍⚕️","Equipo","Presentación de los profesionales, con su especialidad y número de colegiado si quieres."),
         ("📅","Cita previa","Por formulario, WhatsApp o con motor de reservas online."),
         ("🔒","RGPD","Formularios con consentimiento y textos legales adaptados a datos de salud."),
         ("📍","Google Maps","Para salir al buscar «fisioterapeuta» o «dentista» en tu zona."),
         ("⭐","Reseñas","Las opiniones de tus pacientes, visibles y verificables.")],
  plan="Tu web", precio="100 €", nota="El precio final depende de las secciones y funciones que necesites, y te lo damos cerrado antes de empezar. Sin cuotas ni permanencia.",
  faq=[("¿Cuánto cuesta la web de una clínica?","Desde 100 €, en un único pago. El precio final depende de las secciones, los profesionales y si quieres reservas online; siempre cerrado antes de empezar."),
       ("¿Incluye los textos legales?","El Plan Negocio incluye la configuración legal RGPD. Si necesitas textos adaptados a tu caso, también tenemos el servicio de Aviso legal y RGPD por separado."),
       ("¿Puedo poner varias especialidades o profesionales?","Sí. Organizamos la web por tratamientos y por profesionales, según cómo trabajéis."),
       ("¿Puedo ver la web antes de decidir?","Sí. Te preparamos una demo gratis con el nombre de tu clínica, sin compromiso.")]),
 dict(slug="diseno-web-asesorias", sector="profesional", estilo="minimal", corto="Asesorías y despachos",
  title="Diseño web para asesorías, abogados y despachos | Velority",
  desc="Página web para asesorías, gestorías, abogados y consultores: servicios, formulario de consulta y SEO local. Demo gratis antes de pagar, precio cerrado.",
  h1="Diseño web para asesorías y despachos profesionales", kick="Asesorías, gestorías, abogados y consultores",
  lead="Una web profesional que explica bien lo que haces, para quién y cómo trabajas, y que facilita el primer contacto. La ves gratis antes de pagar.",
  porque=("Tus clientes buscan a alguien de confianza para un tema delicado: impuestos, un contrato, una herencia. Una web clara y seria es tu mejor carta de presentación.",),
  feats=[("📂","Áreas de servicio","Fiscal, laboral, contable, jurídico… cada área bien explicada."),
         ("📨","Formulario de consulta","El cliente te cuenta su caso y te llega ordenado al correo."),
         ("👔","Quiénes sois","El equipo y vuestra forma de trabajar, para generar confianza."),
         ("📰","Blog","Para publicar novedades y aparecer en Google con temas que buscan tus clientes."),
         ("📍","SEO local","Para salir al buscar «asesoría» o «abogado» en tu ciudad."),
         ("🔒","RGPD","Formularios y textos legales en regla.")],
  plan="Tu web", precio="100 €", nota="El precio final depende de las secciones y funciones que necesites, y te lo damos cerrado antes de empezar. Sin cuotas ni permanencia.",
  faq=[("¿Cuánto cuesta la web de una asesoría o despacho?","Desde 100 €, en un único pago. El precio final depende de las secciones y de si quieres blog o formularios a medida; te lo damos cerrado antes de empezar."),
       ("¿Podemos escribir nosotros los artículos del blog?","Sí, la web es autogestionable. Si no tenéis tiempo, también ofrecemos la gestión de blog mensual."),
       ("¿Se puede poner un correo con nuestro dominio?","Sí. Configuramos correo corporativo (por ejemplo, info@tuasesoria.es) como servicio adicional."),
       ("¿Qué pasa si no nos gusta la demo?","Nada: la demo es gratis y sin compromiso. Si os gusta, os damos el precio cerrado; si no, no pagáis.")]),
 dict(slug="tienda-online", sector="tienda", estilo="moderno", corto="Tienda online",
  title="Crear tienda online para tu negocio · Precio cerrado | Velority",
  desc="Creamos tu tienda online con catálogo, carrito y pago con tarjeta, Bizum o PayPal. Sin comisiones de la agencia por venta. Demo gratis, desde 100 € pago único.",
  h1="Crea tu tienda online con precio cerrado", kick="Tienda online",
  lead="Catálogo, carrito y pago seguro para vender las 24 horas, con una tienda que gestionas tú. Primero la ves gratis con tus productos; luego decides.",
  porque=("Vender solo en marketplaces significa comisiones en cada venta y clientes que no son tuyos. Con tu propia tienda decides precios, envíos y promociones.",),
  feats=[("🛍️","Catálogo de productos","Fotos, variantes (tallas, colores), stock y categorías."),
         ("💳","Pagos online","Tarjeta, Bizum, PayPal o Stripe, según lo que necesites."),
         ("📦","Pedidos y envíos","Correos automáticos de pedido y gestión sencilla de envíos y recogidas."),
         ("📊","Analítica","Para saber qué se vende y de dónde vienen tus clientes."),
         ("🎓","Formación","Una hora de formación para que la gestiones tú."),
         ("⚡","Carga de productos","Si tienes un catálogo grande, podemos cargarlo por ti.")],
  plan="Tu web", precio="100 €", nota="El precio final depende de las secciones y funciones que necesites, y te lo damos cerrado antes de empezar. Sin cuotas ni permanencia.",
  faq=[("¿Cuánto cuesta crear una tienda online?","Desde 100 €, en un único pago. El precio final depende del número de productos y de los métodos de pago, y te lo damos cerrado antes de empezar."),
       ("¿Cobráis comisión por cada venta?","No. Nosotros no cobramos nada por tus ventas. Solo pagas las comisiones de tu pasarela de pago (por ejemplo, Stripe o PayPal)."),
       ("¿Puedo añadir productos yo mismo?","Sí. Te enseñamos a gestionar productos, pedidos y stock en una hora de formación incluida."),
       ("¿Qué métodos de pago puedo aceptar?","Tarjeta, Bizum, PayPal o Stripe. Si necesitas otra pasarela, la añadimos como servicio adicional.")]),
 dict(slug="seo-local-google-maps", sector=None, estilo=None, corto="SEO local",
  title="SEO local y ficha de Google Maps para negocios | Velority",
  desc="Optimizamos tu ficha de Google Business Profile para salir en Google Maps cuando te buscan en tu zona. Desde 79 €, pago único y sin permanencia.",
  h1="SEO local: aparece en Google Maps cuando te buscan", kick="SEO local y Google Business Profile",
  lead="Optimizamos tu ficha de Google para que salgas en el mapa al buscar tu servicio en tu zona. Vale tanto si tu web la hacemos nosotros como si ya tienes una.",
  porque=("Cuando alguien busca «fontanero», «peluquería» o «restaurante» cerca, Google enseña primero el mapa con tres negocios. Esos tres se llevan la mayoría de llamadas.",),
  feats=[("📍","Ficha de Google optimizada","Categorías, servicios, horarios, zona de servicio y descripción con las palabras que busca tu cliente."),
         ("📸","Fotos y publicaciones","Te dejamos la ficha con fotos y te explicamos cómo publicar novedades."),
         ("⭐","Estrategia de reseñas","Cómo pedir reseñas a tus clientes y responderlas bien."),
         ("🔗","Coherencia de datos","Mismo nombre, dirección y teléfono en tu web y en los directorios."),
         ("🧭","Search Console y sitemap","Para que Google indexe tu web correctamente (servicio adicional)."),
         ("🔎","Auditoría SEO","Revisión de tu web con mejoras concretas y priorizadas.")],
  plan="Ficha Google Maps (SEO Local)", precio="79 €", nota="El Pack Presencia Local Total (119 €) añade 2 correos corporativos, el widget de reseñas de Google y el botón de WhatsApp.",
  faq=[("¿Cuánto cuesta optimizar mi ficha de Google Maps?","La optimización completa de tu perfil de Google Business Profile cuesta 79 €, pago único. Con el Pack Presencia Local Total (119 €) añades correos corporativos, widget de reseñas y botón de WhatsApp."),
       ("¿Necesito tener web con vosotros?","No. El SEO local sirve tanto para la web que hacemos contigo como para una web externa que ya tengas."),
       ("¿En cuánto tiempo se notan los resultados?","Depende de la competencia de tu zona. Los cambios en la ficha se aplican en días, y la mejora en posiciones suele verse en las semanas siguientes. No prometemos posiciones concretas: nadie puede garantizarlas."),
       ("¿Hay permanencia?","No. Es un pago único, sin cuotas ni permanencia.")]),
]

def iconos():
    return '<link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/manifest.webmanifest">'

FUENTES = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap"></noscript>'

CSS = """:root{--bg:#0b0e1a;--sf:#121628;--sf2:#181d33;--tx:#e8ebf7;--mu:#a3abc8;--bd:#262c48;--ac:#7c8cff;--ac2:#a78bfa;--ac3:#2dd4bf}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--tx);font:16px/1.6 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
a{color:var(--ac)}h1,h2,h3{font-family:"Plus Jakarta Sans",Inter,system-ui,sans-serif;line-height:1.15;letter-spacing:-.02em;margin:0}
.w{max-width:1080px;margin:0 auto;padding:0 20px}
.top{position:sticky;top:0;z-index:5;background:rgba(11,14,26,.86);backdrop-filter:blur(10px);border-bottom:1px solid var(--bd)}
.top .w{display:flex;align-items:center;justify-content:space-between;gap:16px;height:64px}
.brand{display:flex;align-items:center;gap:10px;font:800 20px "Plus Jakarta Sans",Inter,sans-serif;color:var(--tx);text-decoration:none}.brand img{width:36px;height:28px}
.nav{display:flex;gap:22px;align-items:center}.nav a{color:var(--mu);text-decoration:none;font-size:14.5px}.nav a:hover{color:var(--tx)}.nav a.btn{color:#fff}
.btn{display:inline-block;background:linear-gradient(135deg,var(--ac),var(--ac2));color:#fff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:12px;border:0}
.btn.s{background:transparent;border:1px solid var(--bd);color:var(--tx)}.btn.xl{padding:15px 26px;font-size:17px}
.bc{font-size:13.5px;color:var(--mu);margin:26px 0 0}.bc a{color:var(--mu)}
.hero{padding:34px 0 46px}.kick{display:inline-block;font-size:13px;font-weight:600;color:#c6ccff;background:rgba(124,140,255,.12);border:1px solid rgba(124,140,255,.3);padding:5px 12px;border-radius:99px;margin-bottom:16px}
.hero h1{font-size:clamp(32px,5vw,52px);font-weight:800;max-width:820px}.grad{background:linear-gradient(90deg,var(--ac),var(--ac2),var(--ac3));-webkit-background-clip:text;background-clip:text;color:transparent}
.lead{font-size:18.5px;color:var(--mu);max-width:720px;margin:18px 0 26px}.cta{display:flex;gap:12px;flex-wrap:wrap}.desde{color:var(--mu);font-size:14.5px;margin-top:14px}.desde b{color:var(--tx)}
section{padding:42px 0}h2{font-size:clamp(25px,3.4vw,34px);font-weight:800;margin-bottom:12px}.mu{color:var(--mu)}
.g{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:22px}.c{background:var(--sf);border:1px solid var(--bd);border-radius:16px;padding:20px}
.c h3{font-size:17px;margin:8px 0 6px}.c p{margin:0;color:var(--mu);font-size:15px}.ic{font-size:24px}
.por{background:var(--sf);border:1px solid var(--bd);border-left:4px solid var(--ac);border-radius:14px;padding:18px 20px;max-width:820px}
.stp{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:22px}.stp .n{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:rgba(124,140,255,.16);color:#c6ccff;font-weight:700}
.precio{display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between;background:linear-gradient(135deg,rgba(124,140,255,.14),rgba(45,212,191,.08));border:1px solid var(--bd);border-radius:18px;padding:24px}
.precio b.p{font:800 34px "Plus Jakarta Sans",Inter,sans-serif}.precio small{display:block;color:var(--mu)}
.ck{list-style:none;padding:0;margin:14px 0 0;display:grid;gap:6px}.ck li:before{content:"✓ ";color:var(--ac3);font-weight:700}
details{background:var(--sf);border:1px solid var(--bd);border-radius:14px;padding:14px 18px;margin-top:10px}summary{cursor:pointer;font-weight:600}details p{color:var(--mu);margin:10px 0 0}
.band{text-align:center;background:linear-gradient(135deg,rgba(124,140,255,.18),rgba(167,139,250,.12));border:1px solid var(--bd);border-radius:22px;padding:36px 22px;margin:20px 0 40px}.band p{color:var(--mu);max-width:620px;margin:10px auto 20px}
.otros{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.otros a{color:var(--mu);text-decoration:none;border:1px solid var(--bd);border-radius:99px;padding:6px 12px;font-size:14px}.otros a:hover{color:var(--tx);border-color:var(--ac)}
footer{border-top:1px solid var(--bd);padding:26px 0 40px;color:var(--mu);font-size:14px}footer a{color:var(--mu)}
.art{max-width:760px}.art h2{font-size:clamp(22px,3vw,28px);margin:34px 0 12px}.art p,.art li{font-size:17px;line-height:1.7}.art ul,.art ol{padding-left:22px}.art li{margin:6px 0}.art .ck{padding-left:0}
.meta{color:var(--mu);font-size:14px;margin-top:14px}.lista{display:grid;gap:14px;margin-top:22px}.lista a{text-decoration:none;color:var(--tx)}.lista .c:hover{border-color:var(--ac)}
@media(max-width:860px){.g,.stp{grid-template-columns:1fr 1fr}.nav a.o{display:none}}
@media(max-width:560px){.g,.stp{grid-template-columns:1fr}.nav a:not(.btn){display:none}.btn{padding:10px 14px}.btn.xl{width:100%;text-align:center}.lead{font-size:17px}}"""

def cab(title, desc, url, extra_ld, robots="index, follow, max-image-preview:large, max-snippet:-1"):
    return f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title><meta name="description" content="{esc(desc)}"><meta name="robots" content="{robots}">
{'<link rel="canonical" href="'+url+'">' if url else ''}<meta name="theme-color" content="#0b0e1a">
<meta property="og:type" content="website"><meta property="og:site_name" content="Velority"><meta property="og:locale" content="es_ES">{'<meta property="og:url" content="'+url+'">' if url else ''}
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}"><meta property="og:image" content="{B}/og.jpg"><meta name="twitter:card" content="summary_large_image">
{iconos()}{FUENTES}<link rel="preload" as="style" href="/tema.css" onload="this.onload=null;this.rel='stylesheet'"><script>try{{if(/bot|crawl|spider|slurp|mediapartners|inspectiontool/i.test(navigator.userAgent))throw 0;var C={{halloween:"th-hw",navidad:"th-nv"}},t=JSON.parse(localStorage.getItem("velority-tema")||"null"),n=Date.now(),q=new URLSearchParams(location.search).get("tema"),k=C[q]?q:t&&C[t.tema]&&(!t.desde||n>=Date.parse(t.desde))&&(!t.hasta||n<=Date.parse(t.hasta))?t.tema:null;if(k)document.documentElement.classList.add(C[k])}}catch(e){{}}</script>
{''.join('<script type="application/ld+json">'+json.dumps(x,ensure_ascii=False,separators=(",",":"))+'</script>' for x in extra_ld)}
<style>{CSS}</style></head><body>
<header class="top"><div class="w"><a class="brand" href="/"><img src="/logo.svg" alt="" width="36" height="28">Velority</a>
<nav class="nav" aria-label="Menú principal"><a class="o" href="/#srv">Servicios</a><a class="o" href="/#ejemplos">Ejemplos</a><a href="/#faq">Preguntas</a><a class="btn" href="/?demo=1">Demo gratis</a></nav></div></header>"""

def pie(actual):
    otros = "".join(f'<a href="/{x["slug"]}/">{esc(x["corto"])}</a>' for x in P if x["slug"] != actual)
    return f"""<footer><div class="w"><p><b>Velority</b> · Diseño web para negocios y autónomos con precio cerrado y pago único.</p>
<p>Diseño web por sector: {" · ".join(f'<a href="/{x["slug"]}/">{esc(x["corto"])}</a>' for x in P)}</p>
<p><a href="/">Inicio</a> · <a href="/blog/">Blog</a> · <a href="/#faq">Preguntas frecuentes</a> · <a href="/legal/condiciones-pago-unico.pdf">Condiciones de pago único (PDF)</a> · <a href="https://wa.me/{WA}" rel="noopener">WhatsApp</a></p></div></footer>
<script src="/tema.js" defer></script>
</body></html>
""", otros

ORG = {"@id": B + "/#organization"}

for x in P:
    ex = EXTRA[x["slug"]]
    x = {**x, "faq": x["faq"] + ex["faq"]}
    url = f"{B}/{x['slug']}/"
    es_seo = x["sector"] is None
    srv = {"@type": "Service", "@id": url + "#servicio", "name": x["h1"], "serviceType": "Diseño web" if not es_seo else "SEO local",
           "description": x["desc"], "url": url, "provider": {"@type": "Organization", "@id": B + "/#organization", "name": "Velority", "url": B + "/"},
           "areaServed": {"@type": "Country", "name": "España"},
           "offers": {"@type": "Offer", "priceCurrency": "EUR", "price": x["precio"].replace(" €", ""), "description": f"{x['plan']}, desde {x['precio']}, pago único", "url": url}}
    bc = {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Inicio", "item": B + "/"},
          {"@type": "ListItem", "position": 2, "name": x["corto"], "item": url}]}
    fq = {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in x["faq"]]}
    wp = {"@type": "WebPage", "@id": url, "url": url, "name": x["title"], "inLanguage": "es-ES", "isPartOf": {"@id": B + "/#website"}, "about": {"@id": url + "#servicio"}, "breadcrumb": {"@id": url + "#migas"}}
    bc["@id"] = url + "#migas"
    ld = [{"@context": "https://schema.org", "@graph": [wp, srv, bc, fq]}]
    demo = f"/plantillas/plantilla.html?s={x['sector']}&e={x['estilo']}" if x["sector"] else None
    pie_html, otros = pie(x["slug"])
    feats = "".join(f'<div class="c"><div class="ic" aria-hidden="true">{i}</div><h3>{esc(t)}</h3><p>{esc(d)}</p></div>' for i, t, d in x["feats"])
    faq = "".join(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in x["faq"])
    partes = x["h1"].split(":") if ":" in x["h1"] else None
    h1 = f'{esc(partes[0])}:<br><span class="grad">{esc(partes[1].strip())}</span>' if partes else esc(x["h1"])
    paso2 = "Te enviamos una demo gratuita" if not es_seo else "Revisamos tu ficha y te decimos qué mejorar"
    cuerpo = f"""
<main><div class="w">
<nav class="bc" aria-label="Migas de pan"><a href="/">Inicio</a> › <span>{esc(x['corto'])}</span></nav>
<section class="hero"><span class="kick">{esc(x['kick'])}</span><h1>{h1}</h1><p class="lead">{esc(x['lead'])}</p>
<div class="cta"><a class="btn xl" href="/?demo=1">{"Quiero mi demo gratuita" if not es_seo else "Quiero salir en Google Maps"}</a>{f'<a class="btn s xl" href="{demo}" rel="nofollow">▶ Ver un diseño de ejemplo</a>' if demo else f'<a class="btn s xl" href="https://wa.me/{WA}?text=' + 'Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20SEO%20local' + '" rel="noopener">Escríbenos por WhatsApp</a>'}</div>
<p class="desde">{"Tu web" if not es_seo else esc(x["plan"])} desde <b>{esc(x["precio"])}</b> · pago único, precio final · sin cuotas ni permanencia</p></section>
<section><h2>¿Por qué {"una web propia" if not es_seo else "el SEO local"}?</h2><div class="por"><p style="margin:0">{esc(x['porque'][0])}</p><p style="margin:12px 0 0">{esc(ex['porque2'])}</p></div></section>
<section><h2>{"Qué incluye tu web" if not es_seo else "Qué hacemos por tu ficha"}</h2><p class="mu">Lo que solemos preparar para {esc(x['corto'].lower())}. Lo ajustamos a tu negocio y te damos el precio cerrado antes de empezar.</p><div class="g">{feats}</div></section>
<section><h2>Cómo trabajamos</h2><div class="stp"><div class="c"><div class="n">1</div><h3>Nos cuentas tu negocio</h3><p>Por el chat o por WhatsApp, en unos minutos.</p></div><div class="c"><div class="n">2</div><h3>{paso2}</h3><p>{"Ves tu futura web con tu nombre, gratis y sin compromiso." if not es_seo else "Gratis y sin compromiso, con el precio cerrado."}</p></div><div class="c"><div class="n">3</div><h3>{"Recibes tu web" if not es_seo else "La optimizamos"}</h3><p>{"2 rondas de cambios incluidas, pago único y 30 días de garantía. La web y el dominio, a tu nombre." if not es_seo else "Pago único, sin permanencia. Te explicamos cómo mantenerla al día."}</p></div></div></section>
<section><h2>{"Claves de una buena web para " + esc(x['corto'].lower()) if not es_seo else "Claves del SEO local"}</h2><div class="g">{"".join(f'<div class="c"><h3>{esc(t)}</h3><p>{esc(d)}</p></div>' for t, d in ex["guia"])}</div></section>
<section><h2>Precio</h2><div class="precio"><div><small>{esc(x['plan'])}</small><b class="p">desde {esc(x['precio'])}</b><small>Pago único · precio final</small></div><div style="max-width:520px"><p class="mu" style="margin:0">{esc(x['nota'])}</p></div><a class="btn" href="/?demo=1">Pedir mi {"demo" if not es_seo else "revisión"} gratis</a></div></section>
<section><h2>Preguntas frecuentes</h2>{faq}</section>
<div class="band"><h2>¿Hablamos de tu {"web" if not es_seo else "ficha de Google"}?</h2><p>{"Te preparamos una primera versión gratis. Si te gusta, te damos el precio cerrado; si no, no pagas nada." if not es_seo else "Te decimos gratis qué mejorar en tu ficha y cuánto cuesta, sin compromiso."}</p><a class="btn xl" href="/?demo=1">{"Quiero mi demo gratuita" if not es_seo else "Quiero mi revisión gratuita"}</a></div>
<section style="padding-top:0"><h2 style="font-size:22px">También hacemos webs para</h2><div class="otros">{otros}</div></section>
</div></main>
"""
    os.makedirs(f"{R}/{x['slug']}", exist_ok=True)
    open(f"{R}/{x['slug']}/index.html", "w", encoding="utf-8").write(cab(x["title"], x["desc"], url, ld) + cuerpo + pie_html)

# Blog: índice /blog/ y un artículo por página (no se enlazan desde la portada)
MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
fechaEs = lambda f: f"{int(f[8:])} de {MESES[int(f[5:7])-1]} de {f[:4]}"
TITULOS = {x["slug"]: ("/" + x["slug"] + "/", x["h1"]) for x in P}
TITULOS.update({a["slug"]: ("/blog/" + a["slug"] + "/", a["h1"]) for a in ART})
AUTOR = {"@type": "Person", "name": "Hugo Vazquez", "url": B + "/"}
for a in ART:
    url = f"{B}/blog/{a['slug']}/"
    post = {"@type": "BlogPosting", "@id": url + "#articulo", "headline": a["h1"], "description": a["desc"], "url": url, "mainEntityOfPage": url,
            "datePublished": a["fecha"], "dateModified": a["fecha"], "inLanguage": "es-ES", "author": AUTOR, "image": B + "/og.jpg",
            "publisher": {"@type": "Organization", "@id": B + "/#organization", "name": "Velority", "logo": {"@type": "ImageObject", "url": B + "/icon-512.png"}}}
    bc = {"@type": "BreadcrumbList", "@id": url + "#migas", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Inicio", "item": B + "/"},
          {"@type": "ListItem", "position": 2, "name": "Blog", "item": B + "/blog/"}, {"@type": "ListItem", "position": 3, "name": a["h1"], "item": url}]}
    graf = [post, bc] + ([{"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": r}} for q, r in a["faq"]]}] if a.get("faq") else [])
    cuerpo = "".join(f"<h2>{esc(h)}</h2>{t}" for h, t in a["cuerpo"])
    faq = "".join(f"<details><summary>{esc(q)}</summary><p>{esc(r)}</p></details>" for q, r in a.get("faq", []))
    rel = "".join(f'<a href="{TITULOS[r][0]}"><div class="c"><h3 style="margin:0">{esc(TITULOS[r][1])}</h3></div></a>' for r in a["rel"])
    html_a = cab(a["title"], a["desc"], url, [{"@context": "https://schema.org", "@graph": graf}]).replace('<meta property="og:type" content="website">', '<meta property="og:type" content="article">') + f"""
<main><div class="w">
<nav class="bc" aria-label="Migas de pan"><a href="/">Inicio</a> › <a href="/blog/">Blog</a> › <span>{esc(a['h1'])}</span></nav>
<article class="art"><section class="hero" style="padding-bottom:10px"><span class="kick">Blog · Velority</span><h1 style="font-size:clamp(30px,4.4vw,44px)">{esc(a['h1'])}</h1>
<p class="meta">Por Hugo Vazquez · {fechaEs(a['fecha'])} · {a['min']} min de lectura</p><p class="lead">{esc(a['lead'])}</p></section>
{cuerpo}
{('<h2>Preguntas frecuentes</h2>' + faq) if faq else ''}
</article>
<div class="band"><h2>¿Quieres ver cómo quedaría tu web?</h2><p>Te preparamos una demo gratuita con el nombre de tu negocio. Precio cerrado, pago único y dominio incluido. Si no te gusta, no pagas nada.</p><a class="btn xl" href="/?demo=1">Quiero mi demo gratuita</a></div>
<section style="padding-top:0"><h2 style="font-size:22px">Sigue leyendo</h2><div class="lista">{rel}</div></section>
</div></main>
"""
    os.makedirs(f"{R}/blog/{a['slug']}", exist_ok=True)
    open(f"{R}/blog/{a['slug']}/index.html", "w", encoding="utf-8").write(html_a + pie("")[0])

url = B + "/blog/"
blog_ld = {"@context": "https://schema.org", "@graph": [{"@type": "Blog", "@id": url, "url": url, "name": "Blog de Velority", "inLanguage": "es-ES",
           "publisher": {"@id": B + "/#organization"}, "blogPost": [{"@id": f"{B}/blog/{a['slug']}/#articulo"} for a in ART]},
           {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Inicio", "item": B + "/"}, {"@type": "ListItem", "position": 2, "name": "Blog", "item": url}]}]}
lista = "".join(f'<a href="/blog/{a["slug"]}/"><div class="c"><h3 style="margin:0 0 6px">{esc(a["h1"])}</h3><p>{esc(a["desc"])}</p><p class="meta" style="margin:8px 0 0">{fechaEs(a["fecha"])} · {a["min"]} min</p></div></a>' for a in ART)
open(f"{R}/blog/index.html", "w", encoding="utf-8").write(cab("Blog de diseño web para negocios: guías y consejos | Velority",
    "Guías prácticas para negocios: cuánto cuesta una página web, cómo aparecer en Google Maps, cómo elegir dominio y qué debe tener tu web.", url, [blog_ld]) + f"""
<main><div class="w">
<nav class="bc" aria-label="Migas de pan"><a href="/">Inicio</a> › <span>Blog</span></nav>
<section class="hero" style="padding-bottom:10px"><span class="kick">Blog</span><h1>Guías para tener <span class="grad">una web que trae clientes</span></h1>
<p class="lead">Consejos prácticos y sin tecnicismos para negocios y autónomos: precios, Google Maps, dominios y todo lo que necesita tu página web.</p></section>
<section style="padding-top:0"><div class="lista">{lista}</div></section>
</div></main>
""" + pie("")[0])

# 404
c404 = cab("Página no encontrada | Velority", "Esta página no existe. Vuelve al inicio de Velority, diseño web para negocios con precio cerrado.", None, [], robots="noindex, follow")
c404 = c404.replace('<link rel="icon" href="/favicon.ico"', '<base href="/"><link rel="icon" href="/favicon.ico"', 1) if False else c404
open(f"{R}/404.html", "w", encoding="utf-8").write(c404 + f"""
<main><div class="w"><section class="hero" style="padding-top:70px"><span class="kick">Error 404</span><h1>Esta página <span class="grad">no existe</span></h1>
<p class="lead">Puede que el enlace esté mal escrito o que la página se haya movido. Desde aquí puedes seguir:</p>
<div class="cta"><a class="btn xl" href="/">Ir al inicio</a><a class="btn s xl" href="/?demo=1">Pedir mi demo gratuita</a></div></section>
<section><h2>Diseño web por sector</h2><div class="otros">{"".join(f'<a href="/{x["slug"]}/">{esc(x["corto"])}</a>' for x in P)}</div></section></div></main>
""" + pie("")[0])

# sitemap
urls = [(B + "/", "1.0", "weekly")] + [(f"{B}/{x['slug']}/", "0.8", "monthly") for x in P] + [(B + "/blog/", "0.6", "weekly")] + [(f"{B}/blog/{a['slug']}/", "0.6", "monthly") for a in ART] + [(B + "/legal/condiciones-pago-unico.pdf", "0.3", "yearly")]
open(f"{R}/sitemap.xml", "w", encoding="utf-8").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    "".join(f"  <url><loc>{u}</loc><lastmod>{HOY}</lastmod><changefreq>{f}</changefreq><priority>{p}</priority></url>\n" for u, p, f in urls) + "</urlset>\n")
print("ok", len(P))
