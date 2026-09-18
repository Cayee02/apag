# Sistema visual APAG

Portada institucional, agrícola y editorial: territorio y comunidad mediante verde profundo, amarillo, titulares amplios y fotografía. El contrato del hero está en el comentario del `body` de `index.html`. Esta entrega comprende base técnica, navegación y portada; las páginas interiores mantienen el alcance y los contenidos pendientes definidos en `PRODUCT.md`.

## Tokens y tipografía

| Token CSS | Valor |
| --- | --- |
| `--green-950` | `#063d26` |
| `--green-900` | `#075f36` |
| `--green-700` | `#168447` |
| `--yellow` | `#ffe600` |
| `--white` | `#ffffff` |
| `--paper` | `#f8faf5` |
| `--text` | `#24382c` |
| `--muted` | `#526459` |
| `--line` | `#d6dfd6` |
| `--gutter` | `clamp(1.25rem, 4.3vw, 5.5rem)` |
| `--header-height` | `100px`; `80px` hasta `767px` |

Manrope para titulares y navegación del diálogo; pesos latinos locales 500 y 600. Inter para cuerpo y controles; pesos latinos locales 400, 500 y 600. Las fuentes se sirven mediante `@fontsource` con `font-display: swap` y respaldo `sans-serif`.

El cuerpo usa `1rem` y altura de línea `1.65`. Titulares: peso 600, espaciado `-.035em`; h1 `clamp(3.5rem, 7.7vw, 7.75rem)` / `1.02`, h2 `clamp(2rem, 4vw, 3.75rem)` / `1.12`. El pie fotográfico usa Manrope 500. Selección: amarillo sobre verde profundo.

## Composición y adaptación

Contenedor centrado de hasta `1440px`, descontando dos gutters. Hero de al menos `100svh`: texto sobre verde en el 49% izquierdo y fotografía en el 51% derecho. La segunda línea del título es amarilla; debajo aparecen «Conoce APAG» y «Contáctanos». Fotografía con `object-fit: cover`, posición `52% center`, degradado y leyenda inferior derecha. El indicador de desplazamiento ocupa el borde inferior izquierdo.

| Punto de cambio | Comportamiento |
| --- | --- |
| Hasta `1100px` | Hero 53/47; se oculta la etiqueta de marca y se compactan acciones. |
| Hasta `767px` | Hero en una columna: texto y fotografía de `minmax(240px, 34svh)`; h1 `clamp(3.5rem, 14vw, 5.5rem)`. Se oculta el indicador inferior; intro y contacto se apilan. Logo de 54px y header de 80px. |
| Hasta `360px` | Se compactan etiqueta de marca y espaciado de acciones. |
| Desde `1600px` | El texto del hero alinea su margen izquierdo con el contenedor de 1440px. |

El header es fijo; en Inicio comienza con fondo `#063d26eb` y texto blanco. Tras superar 24px de scroll usa fondo papel, texto verde y borde `--line`. En escritorio el logo mide 66px. Sin la mejora del menú móvil, el header móvil entra en flujo y conserva los enlaces visibles.

## Controles y estados

Botones, apertura y cierre de menú tienen radio de `4px`. CTA principal: amarillo, texto verde, altura mínima 54px; 50px en el hero móvil. CTA del header: 46px. Apertura y cierre del menú: mínimo 44px. El botón secundario del hero usa fondo transparente y borde `#a7bcb0`.

Hover principal `#ffef59`; secundario `#ffffff12`; flechas se desplazan 3px. La navegación de escritorio subraya hover y página actual; el enlace actual del menú móvil es amarillo. Iconos Lucide decorativos, trazo 1.7; flechas de acciones de 19px y controles de menú de 20px.

Foco visible de 3px, separado 6px, en verde `--green-700`; amarillo sobre hero, diálogo y header oscuro. El enlace «Saltar al contenido» aparece al recibir foco y apunta al `main` enfocable. Estos recursos apoyan el objetivo WCAG 2.2 AA; no constituyen una certificación de conformidad.

## Interacción y movimiento

Menú móvil mediante `<dialog>` nativo con `showModal()`: foco inicial en «Cerrar», cierre nativo con Escape, bloqueo del scroll y actualización de `aria-expanded`. Al cerrar devuelve foco al botón de apertura; al pasar a escritorio cierra y enfoca la página actual de la navegación.

Mejora progresiva: contenido y enlaces esenciales existen en HTML, el botón de menú comienza oculto y solo se habilita al disponer de diálogo modal. El contenido del hero no requiere animación para ser visible.

GSAP anima título, descripción y acciones durante 0.8s con `expo.out`. El paralaje de fotografía (`yPercent: 5`, escala 1.06, `scrub: 1`) exige ancho mínimo de 768px, puntero fino y ausencia de preferencia por movimiento reducido. Lenis también exige puntero fino y `no-preference`. Con `prefers-reduced-motion: reduce` se omiten esas mejoras y CSS reduce animaciones/transiciones a `.01ms`, con scroll automático.

## Recursos, contenido y revisión

Logo original suministrado, sin redibujar. La fotografía de Unsplash es provisional y está identificada como imagen de referencia: no acredita ubicación, propiedad ni actividad de APAG. Debe sustituirse por fotografía oficial autorizada antes de publicar; procedencia y archivos en `docs/ASSETS.md`.

«Cultivamos futuro.», «La tierra nos conecta.» y el resto del copy conceptual requieren aprobación. No añadir servicios, historia, cifras o afirmaciones institucionales sin datos confirmados. La entrega conserva `noindex, nofollow` mientras permanece en revisión.

Documento contrastado con HTML, CSS y JavaScript de la entrega. No hubo inspección visual en navegador ni capturas disponibles; la comprobación visual y de interacción queda pendiente.

## Extensión de Inicio y páginas internas

Se conserva la portada original. Las secciones siguientes usan separaciones verticales `clamp(65px, 8vw, 110px)`. El manifiesto es verde oscuro con título de hasta 6rem, énfasis amarillo y curvas decorativas SVG. Los pilares se presentan como tres columnas con líneas superiores e iconos; en móvil forman una lista vertical.

Servicios usa el fondo `#edf2e9`. Los placeholders indican material institucional ausente; no representan contenido aprobado. La galería fotográfica se describe más abajo. El CTA verde `--green-900` reúne título y acción a los lados, apilados hasta 767px.

El footer tiene cuatro columnas, dos hasta 1024px y una hasta 767px. Texto claro sobre verde oscuro y contorno amarillo para el foco. La marca, navegación y datos de contacto permanecen disponibles en el HTML compilado.

Sobre nosotros alterna una presentación con el logo sobre amarillo, historia sobre fondo suave, misión/visión en dos columnas y valores/objetivos en disclosures nativos. Contacto distribuye datos y acceso al correo en dos columnas, luego dirección y mapa pendiente. Ambas páginas apilan esas regiones hasta 767px. Ninguna usa datos inventados para completar los espacios.

La introducción y el título del manifiesto tienen reveals GSAP de 20px y opacidad inicial .65 al activarse por scroll, de .7s con `expo.out`. No se ocultan por CSS; las mejoras se omiten con movimiento reducido. Esta extensión se documenta desde el código, sin validación visual en navegador.

## Preloader agrícola

Por pedido del usuario, cada página incluye una apertura de 1.35s: semilla, surcos dibujados, pequeño sol y brote de dos hojas. Vector original inline, fondo `#063d26`, sol y acento `#ffe600`, hojas `#b5d95e` y `#f8faf5`, surcos `#86c23b`. Texto «Todo empieza con una semilla.» y wordmark APAG. La línea inferior es un recurso temporal decorativo, no un porcentaje de descarga.

El overlay termina con una apertura mediante clip-path de .38s. El símbolo mide hasta 320px; se compacta a 220px en ventanas de hasta 540px de alto. CSS y bootstrap críticos se inyectan en el head, sin descargar recursos adicionales. El Hero empieza tras la salida.

Sin JavaScript, el overlay permanece oculto. Con movimiento reducido se omite sin espera; Tab, Escape o un toque permiten continuar de inmediato. El timeout independiente de 1350ms evita que el módulo principal pueda dejar el sitio bloqueado. Pagehide retira el overlay antes de guardar la página en el historial. Verificación funcional en entorno simulado; revisión visual pendiente por navegador no disponible.

## Fotografía en portada y galería

Por indicación del usuario, la portada vuelve a una única fotografía: el atardecer original `campo.jpg`, conservado en 1920 × 1080 px. Mantiene el reparto 49/51, foco al 52% horizontal y caption a 42px del borde inferior. No hay carrusel, autoplay ni controles de reproducción.

La galería reemplaza el espacio vacío: columnas 1.2/.8 y dos filas de 280px, con la primera imagen ocupando ambas filas. Hasta 1024px las filas miden 220px; hasta 767px se apilan en una columna, primera imagen de 390px y restantes de 300px. Captions descriptivos en blanco sobre degradado verde, sin atribuir actividades o ubicación a APAG. Hover de escala 1.035 solo con ratón y ausencia de movimiento reducido.

La foto original del Hero se precarga y prioriza. Galería e imágenes internas usan srcset 480/960/1440 WebP y lazy loading. Sin JavaScript permanecen la portada y toda la galería.

Servicios y Sobre nosotros incorporan una fotografía contextual panorámica con caption de origen. El logo se sirve mediante variantes WebP y el favicon usa un PNG pequeño. Las versiones optimizadas se revisaron como archivos de imagen; la composición real de la web todavía requiere verificación en navegador.

## Continuación del movimiento

Las curvas de cultivo del manifiesto son SVG inline: su trazo se completa conforme se desplaza la sección. Los dos CTA de portada responden al ratón con un desplazamiento máximo de 4px, solo desde 768px y con puntero fino. La apertura del menú escalona sus enlaces en intervalos de 45ms. Estas mejoras se omiten con movimiento reducido; las mejoras GSAP se limpian al cambiar la preferencia y durante HMR.

Se conserva la galería aprobada y el cursor del sistema. La sección horizontal y el cursor personalizado del roadmap no se incorporan en esta entrega. Las transiciones entre páginas siguen pendientes; el preloader funciona en cada carga.

## Panel de autoadministración

Panel PHP con verde profundo, acentos amarillos, papel y fuentes Manrope/Inter locales. Header con logo y acceso a «Ver la web»; navegación lateral de secciones en escritorio y enlaces que se ajustan en móvil. Formularios en tarjetas blancas, mensajes de guardado/error, fotos de referencia y acción de restauración. Controles de al menos 46px, labels visibles, foco y enlace de salto al panel.

La administración edita contenido y fotos sin modificar la composición de portada ni de galería. Acceso, edición y subidas funcionan mediante formularios en servidor sin depender de JavaScript; JS mejora filas de servicios y avisos de cambios sin guardar. No hay animaciones añadidas al panel. QA visual pendiente por navegador no disponible.

## Formulario de contacto

Contacto combina datos/alternativa de correo a la izquierda y formulario blanco con borde verde a la derecha (1/1.35), apilados hasta 767px. Título editorial, labels visibles, campos de al menos 48px, dos columnas que pasan a una hasta 420px y botón amarillo. Mensajes de error rojizos, éxito verde y estado de envío por texto sin animación. Foco al primer campo inválido o al feedback de resultado; los errores del servidor enlazan a los campos.

Privacidad es una página auxiliar con lectura de hasta 82ch y contenido proporcionado/aprobado por APAG. Hasta configurarla y activar SMTP, el formulario muestra disponibilidad pendiente con alternativas de teléfono/correo; no expone detalles técnicos al visitante. Portada y galería no se modifican en esta entrega. Revisión desde código/HTTP; QA visual pendiente.

## Álbumes y cierre de Inicio

La galería editorial aprobada mantiene su composición en Inicio. Por petición del usuario, los álbumes están en una página independiente Galería, con encabezado/breadcrumb y contenido sobre papel verde claro. Se accede desde la navegación principal, menú móvil y pie. Álbumes en blanco con portada amplia, nombre, descripción, cantidad de fotos y apertura mediante details/summary nativos. Al abrir, las fotos aparecen en tres columnas, dos hasta 1024px y una hasta 480px. Portada/texto del álbum se apilan hasta 767px. Las imágenes se sirven con variantes responsive y carga diferida.

Los enlaces de las fotos abren un dialog verde profundo con imagen completa sin recorte, leyenda/posición, anterior/siguiente y cierre. Flechas del teclado, Escape nativo y retorno del foco al enlace; se pausa el desplazamiento suave mientras está abierto. Sin JavaScript se conserva la apertura del álbum y el acceso directo a las fotos grandes. No se incorporaron animaciones al visor.

El cierre de Inicio sustituye «Conectemos» y la banda siguiente por un solo bloque «Estamos cerca. Hablemos.». Dos columnas con separación amplia: título/texto a la izquierda y botón amarillo con teléfono secundario a la derecha, separados por una línea tenue. Padding vertical de 75–130px; móvil apilado con separación y línea horizontal. Fuentes/colores originales. Código y publicación HTTP verificados; composición, teclado/foco reales y visor requieren QA en navegador, que sigue sin estar disponible.

## Contenido institucional y fotografías del cliente

El hero conserva una sola foto del atardecer y cambia al título suministrado de tres líneas, con la última amarilla. Tipografía más compacta (aprox. 30–48px) para admitir frases largas en el 49% de texto y descripción completa; botones «Conocer APAG» y «Nuestros servicios». Móvil adapta el tamaño y permite crecimiento natural del bloque. El manifiesto usa «Juntos cultivamos oportunidades.».

Inicio incluye seis pilares, servicios reales del texto propuesto, una sección de producción orgánica con foto de carga de caña y un bloque de capacitación. Servicios desarrolla estándares, comercio justo, comercialización, trabajo interinstitucional y financiamiento en filas editoriales con dos columnas y separación amplia; móvil apilado. Sobre APAG usa la foto del grupo y textos de presentación/propósito. Los párrafos tienen 24px de separación y lectura de hasta 65ch.

Misión y visión muestran un rótulo amarillo «Propuesta pendiente de aprobación por APAG». El panel permite aprobarlas por separado. Las cuatro fotos nuevas se atribuyen al cliente y a la mejora con IA; álbum en Galería, sin añadir otra galería a Inicio. El cierre usa el CTA institucional suministrado conservando un solo bloque. No hubo revisión visual web: los originales se inspeccionaron como imágenes y se aprobaron build/pruebas/HTTP, con navegador aún no disponible.

## Movimiento de Inicio — caña de azúcar

Revelado suave de títulos, columnas, pilares, servicios y fotografías al entrar en pantalla: 18px de desplazamiento, opacidad inicial 0.72 y duración 0.85s, con separación de 70ms entre elementos de un grupo. Cada elemento se revela una vez y recupera sus estilos originales.

Una caña de azúcar SVG original desciende por el margen derecho entre la presentación de APAG y el final de la galería editorial. Su giro y el movimiento de las hojas responden al progreso del scroll, sin reproducción continua. La franja decorativa se recorta al ancho del margen para evitar cubrir textos; no recibe clics ni foco. Tamaño responsive de 32–64px. Oculta sin JavaScript y con movimiento reducido; limpieza de GSAP al cambiar la preferencia o recargar módulos. La fotografía única de portada y composición de la galería se conservan.

Revisión de código y build aprobados; navegador integrado no disponible, por lo que la revisión visual sigue pendiente.
