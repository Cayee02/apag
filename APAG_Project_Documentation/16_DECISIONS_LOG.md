# Registro de decisiones

## D-001 — Dirección visual

**Decisión:** diseño institucional agrícola moderno.

**Motivo:** diferenciar APAG de webs institucionales genéricas.

## D-002 — Stack visual

**Decisión:** HTML + CSS + JavaScript + Vite + GSAP + ScrollTrigger + Lenis.

**Motivo:** control total del diseño, excelente rendimiento potencial y animaciones premium sin framework pesado.

## D-003 — No Bootstrap

**Decisión:** no utilizar Bootstrap.

**Motivo:** evitar estética genérica y mantener sistema visual propio.

## D-004 — Motion moderado

**Decisión:** animaciones con intención, no por decoración.

## D-005 — Reduced Motion

**Decisión:** obligatorio.

## D-006 — Contenido

**Decisión:** no inventar datos de APAG.

## D-007 — CMS

**Estado:** resuelto por D-017: panel ligero PHP, elegido expresamente por el usuario.

El presupuesto requiere autoadministración, por lo que debe definirse la solución antes de cierre del proyecto.

Opciones:
- CMS desacoplado;
- WordPress como backend con theme/custom frontend;
- panel propio.

## D-008 — Horizontal scroll

**Decisión:** máximo una sección principal.

## D-009 — Logo como lenguaje visual

**Decisión:** usar sol y líneas de cultivo como inspiración gráfica y de movimiento.

## D-010 — Responsive

**Decisión:** mobile se diseña como experiencia propia, no como desktop reducido.

## D-011 — Primera entrega de desarrollo

**Decisión:** iniciar con base técnica, navegación y portada. Generar bases navegables de las cuatro páginas, manteniendo placeholders en los contenidos institucionales pendientes. El usuario confirmó construir directamente la web.

**Implementación:** Vite 8, HTML multipágina, CSS modular y ES Modules; GSAP/ScrollTrigger, Lenis y Lucide; fuentes locales Manrope e Inter. Header y footer compartidos se expanden a HTML en desarrollo y producción.

**Recursos:** logo entregado en `imagenes/APAG.png`; fotografía de referencia provisional de Unsplash identificada en portada. No se presenta como fotografía de APAG.

**Pendientes:** CMS/autoadministración, contenido oficial, formulario y QA visual. El borrador usa noindex hasta completar aprobación y datos de producción.

## D-012 — Estructura de Inicio y páginas internas

**Decisión:** avanzar en la composición de Inicio y en las páginas internas dentro del frontend existente, sin completar contenidos institucionales con datos inventados.

**Implementación:** manifiesto y pilares conceptuales, espacios de servicios/galería, footer completo, secciones institucionales, contacto directo y mapa pendiente. Datos de contacto centralizados en JSON; expansión a HTML con escape. Disclosures nativos para valores y objetivos; reveals moderados con movimiento reducido.

**Límites:** el CMS y el formulario backend siguen pendientes. El mailto de Contacto abre el cliente de correo; no es un formulario. No se publica un mapa ni WhatsApp sin confirmar sus datos. El navegador integrado sigue sin estar disponible para QA visual.

## D-013 — Preloader agrícola en las páginas

**Decisión:** por instrucción explícita del usuario, mostrar una apertura agrícola en cada carga de página, ampliando la recomendación inicial de limitarla a la primera visita.

**Implementación:** semilla, surcos, sol y brote SVG con animación CSS; duración 1.35s, salida por clip-path y Hero coordinado. Estilos y bootstrap críticos embebidos, sin recursos adicionales. Timeout independiente, salida por teclado/toque, limpieza en pagehide y omisión con prefers-reduced-motion. Sin JavaScript no se muestra.

**Verificación:** build, presencia en las cuatro páginas y pruebas funcionales simuladas del ciclo de vida. La revisión visual continúa pendiente por navegador integrado no disponible.

## D-014 — Fotografías suministradas y portada con carrusel

**Decisión:** integrar campo2/campo3 en Hero, galería y páginas internas, conservando la identidad aprobada por el usuario. No se necesitan imágenes adicionales para esta composición.

**Implementación:** WebP responsive y originales conservados; carrusel ligero propio, controles accesibles, pausa automática y soporte para movimiento reducido. Galería asimétrica en desktop, vertical en móvil. Captions descriptivos sin atribuciones institucionales no confirmadas.

**Herramientas:** Sharp como dependencia de desarrollo para generar variantes reproducibles, no como dependencia del navegador. Build y pruebas funcionales simuladas aprobados. QA visual pendiente.

## D-015 — Restituir la portada original

**Decisión:** por petición expresa del usuario, volver a una sola foto en portada: el atardecer original. Se conserva la galería fotográfica aprobada. Esta decisión reemplaza la parte de portada de D-014.

**Implementación:** retirados carrusel, controles, estilos específicos, módulo y pruebas. Restaurados JPEG original, preload, caption y composición anteriores. Las fotografías suministradas permanecen en galería y páginas internas.

## D-016 — Continuar motion y preparación SEO

**Decisión:** avanzar tareas independientes del roadmap mientras se define el gestor de contenidos. No incorporar sección horizontal ni cursor personalizado en esta entrega para preservar la composición y navegación actuales.

**Implementación:** trazado SVG de cultivos ligado al scroll, respuesta de CTA al ratón limitada a 4px, enlaces del menú escalonados y soporte de movimiento reducido. Generación de metadatos sociales, Organization, canonical/WebSite/sitemap cuando exista dominio y robots que permite leer noindex. Indexación desactivada por defecto, activación explícita en build con URL obligatoria. Plantilla 404 sin indexación; integración HTTP pendiente del hosting.

**Verificación y pendientes:** build y checks de cinco páginas, portada única y generación SEO aprobados. QA visual, CMS, formulario, contenido y producción siguen pendientes. Estado detallado en `docs/ROADMAP_STATUS.md`.

## D-017 — Panel ligero PHP integrado

**Decisión:** el usuario eligió un panel ligero PHP para este sitio. Se conserva el frontend Vite/GSAP y el diseño aprobado. PHP 8.2+ nativo, sin framework backend, Composer ni base de datos en el MVP; almacenamiento JSON privado fuera de la raíz pública.

**Implementación:** un administrador, creación/reset por CLI sin contraseña predeterminada, login/logout, sesiones con vencimiento y cambio de contraseña. Textos principales, historia/misión/visión/valores/objetivos, servicios, contacto y seis espacios de imagen editables. Render sobre HTML compilado, sin JS necesario para leer contenido ni recompilación al guardar. JSON-LD y enlaces de contacto sincronizados con los datos editados.

**Integridad y acceso:** CSRF en todas las acciones POST, cookies HttpOnly/SameSite y Secure con HTTPS, regeneración de sesión, límite de intentos y revocación de otras sesiones al cambiar contraseña. Escritura bajo bloqueo con revisión, backup anterior y guardado temporal/renombrado. Imágenes validadas y reencodificadas con GD a WebP responsive; no se publican originales subidos. Restauración de fotos iniciales.

**Entrega técnica:** scripts para servir PHP localmente, activar la cuenta, probar recorridos HTTP y generar paquete privado/público con reglas Apache. Se integra 404 real y corrección de rutas en errores anidados. Uso y despliegue en `docs/ADMIN.md`.

**Pendientes:** cuenta real por activar con una contraseña elegida por el responsable, revisión visual y en dispositivos, validación Apache/hosting, capacitación, contenido oficial y formulario. No se ha desplegado ni enviado correo. Las pruebas usan cuentas temporales aisladas.

## D-018 — Formulario PHP con SMTP del hosting y política pendiente

**Decisión:** desarrollar el formulario previsto. El usuario eligió correo del hosting y confirmó que no hay política aprobada todavía. No se inventa contenido legal ni se habilitan envíos reales hasta completar SMTP/política.

**Implementación:** campos documentados, JS/PHP, errores accesibles, estado de envío, valores conservados ante fallo y recorrido HTML sin JS. PHPMailer 7.1.1 por Composer, SMTP cifrado/autenticado, remitente autorizado, Reply-To del visitante y cuerpo de texto plano. Configuración privada excluida de Git y del paquete.

**Protección:** sesión pública separada, CSRF, honeypot, mínimo de tiempo, intervalo/límite, clave HMAC privada para IP, estado temporal por token y bloqueo de reenvío confirmado. Validación de cabeceras, escape HTML y errores SMTP sin información privada. No se conserva el texto de consultas en el CMS.

**Privacidad:** editor/publicación en el panel, borradores privados y página auxiliar enlazada. El placeholder no es aprobable. Aceptación vinculada a la versión del texto; cambios de política obligan a aceptarla de nuevo. Migración por defecto de los datos previos sin pérdida.

**Verificación y límites:** build/checks, administración y pruebas HTTP/SMTP loopback aprobados. No se envió correo externo ni se usaron credenciales reales. QA visual/navegador, TLS/SMTP del hosting, recepción real, Apache y política de APAG siguen pendientes. Guía en `docs/CONTACT_FORM.md`.

## D-019 — Mapa de la oficina, álbumes y cierre de Inicio

**Decisión:** el usuario confirmó el mapa suministrado como ubicación de la oficina y solicitó una sección para galerías más amplias, con posibilidad de añadir más fotos. También pidió aliviar las dos llamadas consecutivas de contacto en Inicio.

**Implementación:** mapa compartido integrado en Contacto con enlace externo, carga diferida y etiqueta de oficina. Sección adicional de álbumes mediante details/summary y visor dialog; panel PHP para crear/editar/eliminar álbumes, subir/describir/ordenar/retirar fotos. Hasta 12 álbumes y 40 fotos por álbum, optimizadas a WebP; primera foto como portada. Álbumes vacíos sin publicación. Galería aprobada y portada original conservadas. Un único cierre de contacto con acción principal y teléfono secundario.

**Verificación:** build/checks, operaciones de álbumes por HTTP, validación/escape, límites, CSRF, revisión y subdirectorio aprobados. Pruebas aisladas sin alterar contenido real. QA visual, recorrido interactivo del visor y hosting siguen pendientes porque no hay navegador disponible.

## D-020 — Galería independiente accesible desde el menú

**Decisión:** el usuario pidió retirar de Inicio «Nuestro archivo visual / Más miradas del campo» y sus álbumes, y acceder a las fotos mediante un botón «Galería» en el menú. Reemplaza la ubicación de álbumes de D-019; conserva la galería editorial previamente aprobada.

**Implementación:** nueva `galeria.html` con álbumes dinámicos del panel y visor. Enlaces «Galería» en escritorio, menú móvil y pie. Menú administrativo: «Galería» para álbumes y «Fotos de Inicio» para las leyendas editoriales, sin cambiar claves ni perder contenido. Vite, router PHP, reglas Apache, metadatos y sitemap actualizados.

**Verificación:** build/checks con siete HTML y recorridos HTTP de subida/edición/retirada en Galería, ausencia de álbumes en Inicio y soporte de subcarpeta aprobados. QA visual del menú/visor y Apache real pendientes.

## D-021 — Cargar propuesta institucional y fotografías del cliente

**Decisión:** el usuario autorizó cargar el texto institucional propuesto y cuatro fotos compartidas por el cliente, que mejoró con ayuda de ChatGPT. Misión y visión se identifican como propuestas hasta que APAG apruebe cada una. No se presentan las referencias de estándares como prueba de certificados vigentes.

**Implementación:** hero de tres líneas y botones suministrados; presentación, seis pilares, orgánica, capacitación y CTA en Inicio; contenido completo de Sobre APAG y áreas de Servicios; ocho servicios en panel. Fotos optimizadas, álbum de cuatro imágenes del cliente y fotos contextuales. Se conserva foto de portada, galería editorial y página Galería independiente. Aprobaciones institucionales separadas, párrafos editables y valores iniciales sincronizados con el build. CMS local cargado bajo revisión/bloqueo y backup, preservando contacto/privacidad/álbumes previos.

**Verificación:** build/checks frontend/PHP/formulario y HTTP real local aprobados. Fotos originales inspeccionadas; versiones WebP sin ampliación. No se enviaron emails externos. Contenido final/misión/visión, política, SMTP del hosting, QA visual y producción pendientes.
