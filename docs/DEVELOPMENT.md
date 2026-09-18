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
- Activar la cuenta real del panel PHP, comprobarlo visualmente y completar capacitación/despliegue. El gestor ya está elegido e implementado; ver [ADMIN.md](ADMIN.md).
- Confirmar WhatsApp principal, redes y ubicación precisa del mapa.
- Activar el formulario implementado con SMTP del hosting y política aprobada. Validación/antispam y pruebas locales están implementados; ver [CONTACT_FORM.md](CONTACT_FORM.md).
- Dominio definitivo para activar canonical, Open Graph absoluto y sitemap; su generación está implementada. Ver [SEO.md](SEO.md).
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

## Preloader agrícola
Pedido del usuario: una apertura agrícola en las páginas. Se incorpora un SVG animado de semilla, sol, surcos y brote, con salida breve de 1.35 segundos en las cuatro entradas. No requiere imágenes ni dependencias adicionales.

La apertura arranca con estilos y script críticos en el head; se cierra independientemente del bundle. El Hero espera la finalización. El teclado y un toque permiten omitirla; prefers-reduced-motion la desactiva. Sin JavaScript, la página sigue accesible. La restauración del historial no conserva el overlay.

`npm.cmd run check` incluye pruebas de la salida por tiempo, teclado, pagehide, cambio de preferencia, módulo tardío y limpieza en HMR. Son pruebas funcionales simuladas, no capturas ni validación visual en navegador.

## Integración de fotografías suministradas — entrega anterior
- `campo2` pasa a ser la primera imagen del Hero, acompañada de `campo3` y el paisaje de referencia existente.
- Carrusel con transición de .85s, cambio cada 6 segundos, selección manual y botón de reproducción/pausa. Solo se activa después del preloader.
- Pausa temporal por foco, hover y pestaña oculta. La selección manual detiene el autoplay y conserva la imagen elegida.
- Con movimiento reducido no hay autoplay; los botones siguen permitiendo cambiar imágenes sin transición. Flechas, Home y End permiten selección por teclado.
- Galería fotográfica asimétrica en Inicio: foto principal alta y dos secundarias; lista vertical en móvil.
- Imágenes contextuales en Servicios y Sobre nosotros, con captions de material proporcionado.
- Variantes WebP responsive de 480/960/1440 px y logos ligeros. Originales conservados. Para nuevas versiones de esas fotos ejecutar `npm.cmd run images:optimize` antes del build.
- Las imágenes no acreditan ubicaciones ni actividades oficiales; se conserva la distinción con el contenido institucional pendiente.

En esta entrega anterior se ejecutaron pruebas funcionales simuladas del carrusel. El carrusel y sus pruebas se retiraron en la revisión siguiente; la galería se conserva. La revisión visual de la web continúa pendiente por navegador integrado no disponible.

## Revisión actual — portada original, motion y SEO

- Restituido el atardecer original como única imagen de portada, con su composición y caption anteriores. Eliminados el carrusel, controles, módulo y pruebas asociados.
- Conservadas la galería aprobada y las fotografías de páginas internas.
- Curvas de cultivo inline con trazado ligado al scroll, respuesta moderada de los CTA al ratón y entrada escalonada de enlaces del menú. Soporte de movimiento reducido y limpieza de las mejoras GSAP.
- Metadatos sociales y JSON-LD Organization con datos documentados. Canonical, imágenes absolutas, WebSite y sitemap se generan cuando se configura el dominio; no se inventa una URL pública.
- Borrador no indexable por defecto, con activación explícita en el build. La página 404 nunca es indexable y tiene un enlace de retorno. Su asignación a errores HTTP reales depende del hosting.
- Checks ampliados a cinco páginas, portada única, metadatos y generación SEO. Build y checks aprobados.

Estado por fase y siguientes tareas: [ROADMAP_STATUS.md](ROADMAP_STATUS.md). La consulta sobre el gestor fue resuelta en la siguiente entrega.

## Panel PHP — elección confirmada e implementación

El usuario seleccionó un panel ligero PHP. Implementación nativa PHP 8.2+, sin base de datos: `server/` contiene almacenamiento, acceso, render, imágenes y vistas; `storage/` es privado, persistente e ignorado por Git.

Textos principales de Inicio/internas, contenido institucional pendiente, listado de servicios, contacto y seis fotos se editan desde `/admin`. Cambios renderizados en servidor sobre el frontend compilado, disponibles al guardar sin rebuild. La portada conserva una sola imagen y la galería conserva su layout. Servicios no cargados mantienen el placeholder; no se inventa información.

`npm.cmd run admin:create` activa la cuenta desde una terminal sin mostrar la contraseña. `npm.cmd run dev:php` compila y sirve web/panel en http://127.0.0.1:8080/. Vite en 5173 sigue siendo el entorno de diseño; no ejecuta el CMS. `npm.cmd run build:php` genera un paquete con `public/` y `app/` separados; no copia la cuenta ni datos locales.

Acceso con sesiones y CSRF, cambio de contraseña, límite de intentos, validación de formularios, escape de contenido, control de revisiones, backup del guardado anterior e imágenes validadas/reencodificadas a WebP. La cuenta única administra contenido del sitio; no hay registro público ni portal de socios.

Las pruebas de `npm.cmd run check:php` ejecutan validaciones PHP y recorridos HTTP reales con datos/cuentas temporales. Guía y límites en [ADMIN.md](ADMIN.md). No se creó una cuenta con credenciales predeterminadas ni se desplegó el paquete.

## Formulario de contacto — PHP y SMTP del hosting

Formulario integrado en Contacto, con campos definidos por la documentación, validación JS/PHP, errores por campo, foco, estado de envío y éxito/error. Funciona sin JS mediante POST y redirección; consultas fallidas conservan los valores escapados en la respuesta, sin almacenar el texto en el CMS.

PHPMailer 7.1.1 instalado por Composer y fijado en lock. SMTP cifrado/autenticado del hosting, remitente autorizado, Reply-To del visitante y correo de texto plano. Configuración privada por archivo local ignorado/excluido del paquete o entorno PHP. No se usó mail() ni un éxito simulado.

Sesión pública separada, CSRF, token de envío, mínimo de tiempo, honeypot, intervalo y límite por IP como HMAC. Los reintentos de un token confirmado no vuelven a invocar SMTP. Diagnósticos privados/credenciales no llegan al visitante.

Privacidad editable con estado de publicación en el panel. Borradores no publicados quedan privados; el placeholder no se puede aprobar. La aceptación queda vinculada a la versión del texto. Campos nuevos se incorporan a datos guardados anteriores sin perderlos.

El usuario confirmó correo del hosting y política pendiente. Por eso el envío real permanece sin habilitar. Las pruebas `check:contact` envían a un SMTP loopback aislado y cubren HTML sin JS, validación, antispam, duplicados, cambio de política y fallos. No se contactó al correo real de APAG. Guía y límites: [CONTACT_FORM.md](CONTACT_FORM.md).

## Contenido institucional y material del cliente

Propuesta recibida cargada en `src/data/institutional.json`, schema/CMS y páginas compiladas: hero de tres líneas, presentación, seis pilares, orgánica/capacitación, ocho servicios, estándares, comercio justo, comercialización, instituciones y financiamiento. Misión y visión pendientes, con rótulos y aprobación independiente desde Sobre APAG en el panel. No se agregan fechas, cifras ni vigencia de certificados.

Cuatro fotos del cliente mejoradas con ayuda de ChatGPT según el usuario: álbum de maquinaria, imagen de grupo en Sobre APAG, carga de caña en Inicio y cosecha en Servicios. Optimización Sharp sin alterar PNG, srcset con dimensiones reales. La portada original y la composición editorial permanecen. Carga local con backup conserva datos de contacto, privacidad y álbumes previos; los nuevos valores iniciales hacen que el paquete público también muestre el texto recibido.

Build, checks frontend/PHP/formulario y publicación HTTP aprobados. Cuenta real, aprobación final de contenido/misión/visión, política, SMTP del hosting y QA visual/producción siguen pendientes.

## Animaciones sutiles en Inicio

Añadidos revelados por elemento/grupo y una caña SVG original que desciende y gira según el scroll. Nuevo módulo `src/js/animations/sugar-cane.js`, coordinado después del preloader y con limpieza mediante matchMedia/HMR. La decoración se limita al margen; admite móvil y movimiento reducido. Build/check aprobados; revisión visual pendiente por indisponibilidad del navegador integrado.

## Sitemap, robots y accesibilidad — 18 de septiembre de 2026

Generación permanente de sitemap XML y robots, con URLs locales de prueba mientras falta APAG_SITE_URL, sin habilitar indexación. Reglas panel/API adaptadas a subdirectorio; cinco páginas públicas. Nuevo check de accesibilidad incorporado al check frontend, bordes/checkbox/foco/desplazamiento reforzados y retorno de foco del menú corregido para páginas auxiliares. Build/check aprobados. Configuración y límites documentados en SEO_ACCESSIBILITY.md.

Corrección del fallo de estilos en desarrollo: carga del CSS de accesibilidad mediante import ES desde main.js, conservando el orden de estilos. Vite en 5173 comprobado por HTTP antes/después (500 → 200); compilación y checks aprobados.

## Preparación de publicación en SiteGround

Dominio apag-py.com recibido y configurado en el build local con noindex durante revisión. Creada guia_deploy.md e incluida en el paquete. Entry PHP reconoce su propia carpeta pública, permitiendo public_html sin cambiar bootstrap. Nuevo check:package verifica esa distribución con CMS y datos aislados; build/check/frontend/PHP/formulario/paquete aprobados. La guía indica adaptaciones de HTTPS/caché y traslado seguro del contenido/cuenta; no se ha desplegado el sitio ni usado SMTP externo.

## Auditoría del roadmap y proyecto antes de deploy

Verificado código/alcance/QA/entrega, build y checks; npm/Composer de producción sin avisos de vulnerabilidad conocidos. Detectado desfase documental: cuenta y privacidad/misión/visión ya activadas/aprobadas en CMS local (rev.17). Documentación corregida y creado PREDEPLOY_REVIEW.md; datos/credenciales/aprobaciones preservados. La copia privada de contenido/media es necesaria para reproducir el estado local en hosting. Sin SMTP y sin validación visual/SiteGround; no se han ejecutado publicaciones externas.
