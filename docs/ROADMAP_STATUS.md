# Estado del roadmap APAG

Revisión: 18 de septiembre de 2026. Referencia original: `APAG_Project_Documentation/13_ROADMAP.md`.

Auditoría actual del proyecto y pendientes de publicación: [PREDEPLOY_REVIEW.md](PREDEPLOY_REVIEW.md). Estado local comprobado: cuenta existente y privacidad/misión/visión aprobadas en el panel. Esos datos requieren migración; el paquete conserva defaults sin aprobar y no incluye storage.

| Fase | Estado actual | Trabajo pendiente |
| --- | --- | --- |
| 0 — Preparación | Documentación, logo, ubicación y fotos revisados; contenido institucional propuesto y cuatro fotos del cliente cargados | Revisión final de APAG y WhatsApp principal |
| 1 — Base técnica | Implementada: Vite, módulos, tokens, fuentes, navegación, breakpoints, GSAP y Lenis | Validación real en navegador |
| 2 — Inicio | Foto de portada original y galería editorial conservadas; hero de tres líneas, presentación, seis pilares, orgánica, capacitación y cierre con contenido suministrado | Aprobación final del copy/fotos y QA visual |
| 3 — Internas | Presentación, propósito, ocho servicios y áreas de trabajo cargados; misión/visión aprobadas en CMS local; fotos/álbumes integrados | Migrar aprobaciones/datos al hosting; aceptación final de contenido/fotos y activación de envíos |
| 4 — Motion | Entrada del hero, revelados de texto/fotos, caña SVG con scroll, paralaje, trazado SVG, CTA, menú y preloader | QA visual de tiempos/recorrido; transiciones entre páginas; sección horizontal y cursor personalizado diferidos |
| 5 — Autoadministración | Panel PHP implementado y cuenta local existente; textos/fotos/servicios/contacto/privacidad/álbumes con revisiones y backup | Migrar o crear cuenta elegida de producción, datos/media; QA visual/hosting, capacitación y mantenimiento |
| 6 — Formulario | Backend y flujo sin JS probados con SMTP local; privacidad aprobada/publicada en CMS local; ready=false por SMTP sin configurar | Configurar SMTP privado y migrar política al hosting; QA visual y comprobar recepción real |
| 7 — SEO/accesibilidad | Dominio confirmado apag-py.com y configurado en build; sitemap/robots/canonical con HTTPS definitivo, indexación aún desactivada. Etiquetas/alt/landmarks y contraste comprobados | Activar indexación tras aprobación; comprobación manual en navegador/lector de pantalla y revisión de contenido |
| 8 — Optimización | WebP responsive, logos ligeros y fuentes locales | Medir Web Vitals/Lighthouse y ajustar según resultados |
| 9 — QA | Build, checks frontend, validaciones PHP, administración HTTP y formulario HTTP/SMTP local aprobados con datos aislados | Móvil/tablet/escritorio, navegadores, Apache/hosting, contenido, TLS y recepción real de correo |
| 10 — Producción | SiteGround elegido y guia_deploy.md creada; paquete probado desde carpeta public_html con datos aislados; 404/subcarpeta local y reglas Apache preparadas | Acceso/configuración SiteGround, validación Apache/NGINX, DNS, SSL, caché, SMTP, deploy, capacitación y entrega |

## Próxima etapa de desarrollo

El panel ligero PHP fue seleccionado e implementado; la cuenta local ya existe. Revisar web/panel con `npm.cmd run dev:php` y preparar la migración o una cuenta de producción elegida deliberadamente; no resetear la existente por rutina. Guía: [ADMIN.md](ADMIN.md). Falta validación visual y en hosting.

El formulario PHP está desarrollado. El usuario seleccionó correo del hosting; la política ya está aprobada/publicada en el CMS local. SMTP no está configurado y ready=false. Configurar el correo y trasladar esa política al hosting. Guía: [CONTACT_FORM.md](CONTACT_FORM.md). No se enviaron correos externos en las pruebas.

Los álbumes están en una página independiente `galeria.html`, accesible mediante «Galería» en la navegación principal, menú móvil y pie. En el panel, «Galería» administra 12 álbumes de hasta 40 fotos; «Fotos de Inicio» mantiene las leyendas de las tres fotos editoriales. Publicación, subida, orden, retirada y subcarpeta se probaron por HTTP con contenido aislado. Inicio conserva la galería previamente aprobada y una sola sección de contacto. El visor y la composición requieren revisión real en navegador.

Ubicación confirmada e integrada en Contacto: latitud `-25.954824447631836`, longitud `-56.329647064208984`. Se conserva el iframe compartido por el usuario, con carga diferida, título accesible y enlace independiente para abrir Google Maps. Referencia de integración: [compartir e insertar mapas de Google](https://support.google.com/maps/answer/11471036). El mapa está configurado en la plantilla; la dirección escrita sigue editable en el panel.

Próximas tareas: migrar contenido/cuenta/media, configurar/verificar SMTP y SiteGround, completar QA visual/mediciones, confirmar WhatsApp/redes y aceptación final de contenido/fotos. Dominio confirmado apag-py.com; indexación aún desactivada. Privacidad y 404 son auxiliares.

Contenido recibido: propuesta institucional aplicada en Inicio/Sobre APAG/Servicios y ocho servicios; misión/visión aprobadas en CMS local mediante opciones independientes. Estándares tratados como referencias, sin afirmar certificación vigente. Fotografías del cliente optimizadas y álbumes disponibles. Fuente: `src/data/institutional.json` y [ADMIN.md](ADMIN.md). La auditoría actual confirma privacidad aprobada y ediciones adicionales; migrar el CMS guardado para conservarlas. Falta aceptación final, WhatsApp/redes y configuración/validación hosting.

La validación visual sigue pendiente porque no hay navegador integrado disponible en esta sesión. No se marca completa ninguna fase que dependa de esa comprobación o de datos no recibidos.

Movimiento de Inicio ampliado: revelados de textos/fotos y caña SVG descendente vinculada al scroll, con tamaño responsive y reduced motion. Implementado y compilado; recorrido y tiempos pendientes de QA visual.
