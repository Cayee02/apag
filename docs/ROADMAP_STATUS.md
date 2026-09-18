# Estado del roadmap APAG

Revisión: 17 de septiembre de 2026. Referencia original: `APAG_Project_Documentation/13_ROADMAP.md`.

| Fase | Estado actual | Trabajo pendiente |
| --- | --- | --- |
| 0 — Preparación | Documentación, logo, ubicación y fotos revisados; contenido institucional propuesto y cuatro fotos del cliente cargados | Revisión final de APAG y WhatsApp principal |
| 1 — Base técnica | Implementada: Vite, módulos, tokens, fuentes, navegación, breakpoints, GSAP y Lenis | Validación real en navegador |
| 2 — Inicio | Foto de portada original y galería editorial conservadas; hero de tres líneas, presentación, seis pilares, orgánica, capacitación y cierre con contenido suministrado | Aprobación final del copy/fotos y QA visual |
| 3 — Internas | Presentación, propósito, ocho servicios y áreas de trabajo cargados; misión/visión marcadas como propuestas; fotos del cliente y álbum integrados | Aprobación de misión/visión y contenido final; activación de envíos |
| 4 — Motion | Entrada del hero, reveals, paralaje, trazado SVG, CTA con respuesta al ratón, menú y preloader | Image reveal y transiciones entre páginas; sección horizontal y cursor personalizado diferidos para conservar composición y navegación actuales |
| 5 — Autoadministración | Panel PHP implementado: textos, imágenes, servicios, contacto, privacidad y álbumes con subidas/orden/retirada de fotos; revisiones y backup | Activar la cuenta real, QA visual/hosting, capacitación y mantenimiento de media |
| 6 — Formulario | Frontend/PHP implementados; validación, CSRF, honeypot, tiempo, límites y SMTP con PHPMailer probados localmente; flujo sin JS | Configurar correo del hosting, cargar/aprobar política, QA visual y comprobar recepción real |
| 7 — SEO/accesibilidad | Metas, schema, robots y generación condicional de sitemap/canonical implementados; alt, foco, teclado y reduced motion en código | Dominio definitivo, comprobación en navegador y revisión de contenido |
| 8 — Optimización | WebP responsive, logos ligeros y fuentes locales | Medir Web Vitals/Lighthouse y ajustar según resultados |
| 9 — QA | Build, checks frontend, validaciones PHP, administración HTTP y formulario HTTP/SMTP local aprobados con datos aislados | Móvil/tablet/escritorio, navegadores, Apache/hosting, contenido, TLS y recepción real de correo |
| 10 — Producción | Build y paquete PHP disponibles; 404 real probado en servidor PHP local con subcarpeta; reglas Apache preparadas | Hosting, validación Apache, DNS, SSL, caché, headers, deploy, capacitación y entrega |

## Próxima etapa de desarrollo

El panel ligero PHP fue seleccionado e implementado. Activar la cuenta con `npm.cmd run admin:create` y revisar web/panel con `npm.cmd run dev:php`. Guía: [ADMIN.md](ADMIN.md). Falta validarlo visualmente y en el hosting elegido antes de cerrar la fase.

El formulario PHP está desarrollado. El usuario seleccionó correo del hosting y dejó la política pendiente: el envío real permanece sin habilitar hasta configurar SMTP y publicar el texto aprobado. Guía técnica y activación: [CONTACT_FORM.md](CONTACT_FORM.md). No se enviaron correos a APAG.

Los álbumes están en una página independiente `galeria.html`, accesible mediante «Galería» en la navegación principal, menú móvil y pie. En el panel, «Galería» administra 12 álbumes de hasta 40 fotos; «Fotos de Inicio» mantiene las leyendas de las tres fotos editoriales. Publicación, subida, orden, retirada y subcarpeta se probaron por HTTP con contenido aislado. Inicio conserva la galería previamente aprobada y una sola sección de contacto. El visor y la composición requieren revisión real en navegador.

Ubicación confirmada e integrada en Contacto: latitud `-25.954824447631836`, longitud `-56.329647064208984`. Se conserva el iframe compartido por el usuario, con carga diferida, título accesible y enlace independiente para abrir Google Maps. Referencia de integración: [compartir e insertar mapas de Google](https://support.google.com/maps/answer/11471036). El mapa está configurado en la plantilla; la dirección escrita sigue editable en el panel.

Próximas tareas: revisar/aprobar la propuesta institucional y recibir datos de WhatsApp/redes; activar y verificar correo/política; completar QA visual y preparar hosting/dominio para publicación. Privacidad y 404 son auxiliares a las cinco páginas principales.

Contenido recibido: propuesta institucional aplicada en Inicio/Sobre APAG/Servicios y ocho servicios cargados también al CMS local. Misión/visión pendientes, con aprobación independiente en el panel. Estándares tratados como referencias de trabajo; no se afirma certificación vigente. Cuatro fotos del cliente mejoradas con IA incorporadas y optimizadas. Fuente y carga reproducible: `src/data/institutional.json` y [ADMIN.md](ADMIN.md). Falta revisión final del cliente, datos de WhatsApp/redes, política y hosting.

La validación visual sigue pendiente porque no hay navegador integrado disponible en esta sesión. No se marca completa ninguna fase que dependa de esa comprobación o de datos no recibidos.

Movimiento de Inicio ampliado: revelados de textos/fotos y caña SVG descendente vinculada al scroll, con tamaño responsive y reduced motion. Implementado y compilado; recorrido y tiempos pendientes de QA visual.
