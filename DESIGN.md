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

Servicios usa el fondo `#edf2e9`, y la galería pendiente un espacio con borde discontinuo y fondo `#f0f4ed`. Los placeholders indican material institucional ausente; no representan contenido aprobado. El CTA verde `--green-900` reúne título y acción a los lados, apilados hasta 767px.

El footer tiene cuatro columnas, dos hasta 1024px y una hasta 767px. Texto claro sobre verde oscuro y contorno amarillo para el foco. La marca, navegación y datos de contacto permanecen disponibles en el HTML compilado.

Sobre nosotros alterna una presentación con el logo sobre amarillo, historia sobre fondo suave, misión/visión en dos columnas y valores/objetivos en disclosures nativos. Contacto distribuye datos y acceso al correo en dos columnas, luego dirección y mapa pendiente. Ambas páginas apilan esas regiones hasta 767px. Ninguna usa datos inventados para completar los espacios.

La introducción y el título del manifiesto tienen reveals GSAP de 20px y opacidad inicial .65 al activarse por scroll, de .7s con `expo.out`. No se ocultan por CSS; las mejoras se omiten con movimiento reducido. Esta extensión se documenta desde el código, sin validación visual en navegador.
