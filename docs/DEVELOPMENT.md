# Desarrollo de APAG

## Contexto revisado
Documentación completa de `APAG_Project_Documentation`, documento consolidado, README y logo suministrado. El repositorio inicial no contenía código de aplicación.

## Alcance implementado
- Base técnica Vite con HTML semántico, CSS modular y JavaScript ES Modules.
- Tokens verdes y amarillos derivados de la identidad.
- Encabezado fijo con estado de scroll y navegación activa.
- Menú móvil fullscreen mediante dialog nativo: aislamiento del fondo, foco, Escape, restauración del foco y bloqueo del scroll.
- GSAP, ScrollTrigger y Lenis con soporte para cambios de prefers-reduced-motion. Lenis solo se activa con puntero preciso.
- Portada de Inicio con concepto provisional «Cultivamos futuro.», imagen de referencia, CTAs y entrada moderada.
- Bases de Servicios, Sobre nosotros y Contacto para dar destinos reales a la navegación. Las dos primeras tienen el placeholder obligatorio.
- Correo, dirección y ambos teléfonos documentados, con enlaces mailto y tel.
- Fuentes locales, favicon, títulos, descripciones y noindex para el borrador.
- Header y footer compartidos se expanden a HTML durante desarrollo y build; no requieren JavaScript en el navegador para existir.

## Ejecución en Windows
Usar `npm.cmd` cuando PowerShell impida ejecutar `npm.ps1`.

```sh
npm.cmd install
npm.cmd run dev
npm.cmd run build
npm.cmd run check
npm.cmd run preview
```

El frontend se abre en la dirección que indique Vite, normalmente http://127.0.0.1:5173. No abrir los archivos HTML directamente ni servir el código fuente con Apache: Vite transforma módulos y plantillas. Para hosting convencional utilizar el contenido generado en `dist/`.

## Pendientes para próximas fases
- Contenido oficial de servicios, presentación, historia, misión, visión y valores.
- Fotografías oficiales y aprobación del copy conceptual.
- Completar las secciones de servicios y galería con contenido oficial, y aprobar las páginas internas.
- Definir CMS: la autoadministración es un requisito contractual y todavía no está implementada.
- Confirmar WhatsApp principal, redes y ubicación precisa del mapa.
- Backend de formulario, antispam y política de privacidad.
- Dominio definitivo para canonical, Open Graph absoluto, sitemap y schema.
- QA visual, interacción real del menú, responsive y mediciones Lighthouse en navegador. El navegador integrado no estuvo disponible en esta sesión.

No se considera una entrega de producción ni el cumplimiento total del alcance contratado.

Resultados de las comprobaciones y límites de la revisión: [VERIFICATION.md](VERIFICATION.md).

## Segunda entrega — estructura de Inicio y páginas internas
- Inicio ampliado con manifiesto conceptual, pilares de identidad, espacios de servicios y galería, CTA y contacto rápido.
- Pie de página compartido con marca, navegación, teléfonos, correo y dirección.
- Sobre nosotros con presentación, identidad visual, historia, misión, visión, valores y objetivos. Cada contenido no recibido conserva el placeholder obligatorio; no se agregaron fechas ni cifras.
- Servicios con espacio para el listado oficial y CTA de consulta. No se añadieron servicios imaginarios.
- Contacto con dos teléfonos, correo, dirección, botón mailto y espacio reservado para el mapa confirmado. El botón abre la aplicación de correo; no simula un envío de formulario.
- Datos de contacto centralizados en `src/data/contact.json`, expandidos y escapados durante build y desarrollo. Esto prepara una integración futura; no reemplaza el CMS requerido.
- Motivo SVG de líneas de cultivo, propio y decorativo, sin representar un campo real.
- Reveals moderados en dos puntos de Inicio, con contenido visible por defecto y limpieza al cambiar prefers-reduced-motion.
- Comprobaciones de anclajes, IDs duplicados y referencias ARIA agregadas a `npm.cmd run check`.

La composición está implementada en CSS para escritorio y móvil; la validación visual sigue pendiente por falta de navegador integrado. Galería y servicios todavía necesitan material aprobado para considerarse terminados.
