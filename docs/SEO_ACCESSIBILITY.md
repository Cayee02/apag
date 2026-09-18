# Sitemap, robots y accesibilidad

Actualizado: 18 de septiembre de 2026.

Dominio confirmado posteriormente: `https://apag-py.com/`, configurado en el `.env` local y reflejado en el paquete actual. La indexación sigue desactivada hasta aprobar la publicación. Instrucciones específicas para el hosting elegido: [guia_deploy.md](../guia_deploy.md).

## Archivos públicos

Cada build genera `dist/sitemap.xml` y `dist/robots.txt`; el paquete PHP los incluye en `dist-php/public/`. Se consultan en `/sitemap.xml` y `/robots.txt` al instalar en la raíz del dominio. También están disponibles en Vite.

El sitemap XML contiene las URLs absolutas de Inicio, Servicios, Sobre APAG, Galería y Contacto. No incluye errores 404, panel, API ni la política todavía pendiente. Sin `APAG_SITE_URL`, usa exclusivamente la dirección local de prueba `http://127.0.0.1:8080/`; no es un sitemap listo para enviar a Google. No se inventó un dominio de APAG.

Robots permite leer el sitio y sus recursos, enlaza al sitemap y excluye `/admin`, `/admin/` y `/api/`. Los prefijos se adaptan al subdirectorio configurado. El borrador mantiene `noindex, nofollow` en las páginas. Robots no sustituye la autenticación del panel.

## Preparación para publicar

1. Copiar `.env.example` a `.env` si no existe y establecer `APAG_SITE_URL` con la URL definitiva, incluido subdirectorio cuando corresponda.
2. Mantener `APAG_INDEXABLE=false` durante revisión. Cambiarlo a `true` cuando APAG apruebe la publicación.
3. Ejecutar `npm.cmd run build:php` y `npm.cmd run check`.
4. Verificar los dos archivos en hosting y comprobar que ninguna URL del sitemap contiene `127.0.0.1`.
5. Presentar el sitemap desde Google Search Console cuando el dominio esté verificado.

Si se aloja en una subcarpeta, su sitemap puede permanecer allí, pero las directivas robots deben integrarse en el único `/robots.txt` de la raíz del dominio. Google no aplica un robots dentro de una subcarpeta.

Referencias: [sitemaps de Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) y [ubicación y reglas de robots](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt).

## Accesibilidad implementada

Idioma español, un H1 por página, landmark principal único, salto al contenido enfocable, navegación etiquetada, página activa, texto alternativo en imágenes, botones semánticos y campos con etiquetas vinculadas. El formulario asocia errores/instrucciones y anuncia estados. Menú y visor usan dialog nativo, Escape y retorno del foco; corregido el retorno al pasar a escritorio desde páginas auxiliares sin enlace activo.

Foco visible sobre fondos claros/oscuros; espacio de desplazamiento reservado para el encabezado fijo; enlaces del pie con altura mínima de 24px; checkbox de 24px y campos de 48px; menú con desplazamiento propio. Borde de campos reforzado para superar contraste 3:1 contra su fondo. Modo de colores forzados mantiene contornos/bordes del sistema. Las animaciones existentes respetan movimiento reducido y las ilustraciones decorativas no reciben interacción.

`npm.cmd run check` incluye `scripts/check-accessibility.mjs`: comprueba idioma, landmarks etiquetados, alternativas de imágenes, etiquetas vinculadas, nombres/tipos de botones y contraste de la paleta para texto/foco/bordes. Estas comprobaciones de HTML/CSS no certifican WCAG ni evalúan imágenes superpuestas, layout o comportamiento de un lector de pantalla.

Revisión manual pendiente: Tab/Shift+Tab y Escape; navegación/visor/formulario; lector de pantalla; zoom 200–400%; móvil de 320px; contraste de leyendas sobre fotografías; modo de colores forzados y movimiento reducido. No hay navegador integrado disponible en esta sesión.

Referencias: [foco no oculto — WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) y [tamaño mínimo de controles](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
