# SEO y preparación de publicación

Vite genera los metadatos a partir del título y descripción de cada página y de `src/data/contact.json`. Incluye Open Graph, tarjetas sociales y JSON-LD Organization con nombre, sigla, correo y teléfonos documentados. No agrega fechas, coordenadas ni servicios no confirmados.

## Configuración

Dominio definitivo confirmado y configurado localmente: `APAG_SITE_URL=https://apag-py.com/`. La URL debe incluir subdirectorio si aplica, sin query, fragmento ni credenciales. Si se vacía, canonical/URLs sociales se omiten, pero sitemap/robots de prueba se generan con URLs locales. Guía actual: [SEO_ACCESSIBILITY.md](SEO_ACCESSIBILITY.md).

Con URL configurada se añaden canonical, imagen social del atardecer, logo absoluto, WebSite y `sitemap.xml` con las cinco páginas principales, incluida Galería. La plantilla 404 queda excluida y mantiene noindex.

`APAG_INDEXABLE=false` es el valor inicial. Cambiarlo a `true` solamente para el build de publicación, después de aprobar contenido y configurar el dominio. Intentar habilitarlo sin URL detiene el build. El servidor de desarrollo conserva noindex incluso si se activa esa variable.

Recompilar con `npm.cmd run build` después de cambiar la configuración. `npm.cmd run check` comprueba el HTML generado y las pruebas de generación SEO.

## Rastreo y errores

`robots.txt` permite rastrear para que los buscadores puedan leer el noindex del borrador. Robots no es un mecanismo de privacidad ni garantiza evitar la indexación: ver [documentación de Google sobre robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro). Si se publica un entorno privado de revisión, debe protegerse en el hosting.

La estructura Organization se limita a información disponible; referencia: [documentación de Google sobre Organization](https://developers.google.com/search/docs/appearance/structured-data/organization).

`404.html` es una plantilla compilada. El servidor PHP ya la usa para errores reales con estado HTTP 404 y corrige sus rutas en URLs anidadas. Se probó en raíz y subdirectorio con PHP local; las reglas Apache del paquete deben validarse en hosting. Abrir el archivo directamente desde un servidor estático no comprueba esa integración.

El render PHP actualiza correo y teléfonos de Organization al guardar contacto en el panel. Canonical, URLs sociales y sitemap siguen dependiendo del dominio/configuración del build.

Pendiente antes de publicar: migración de las aprobaciones y contenido local, aceptación final de textos/fotos, QA visual, mediciones, configuración SiteGround y activación deliberada de indexación. WhatsApp/redes requieren datos confirmados. PostalAddress en JSON-LD todavía no se implementó; es una mejora pendiente mencionada en el brief. Los metadatos no garantizan resultados enriquecidos ni posición en búsquedas. Estado comprobado: [PREDEPLOY_REVIEW.md](PREDEPLOY_REVIEW.md).
