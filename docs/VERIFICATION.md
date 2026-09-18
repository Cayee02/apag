# Verificación de la primera entrega

Fecha: 17 de septiembre de 2026.

## Comprobaciones realizadas
- `npm.cmd run build`: correcto con Vite 8.3.0; cuatro entradas HTML generadas en `dist/`.
- `npm.cmd run check`: correcto; enlaces y recursos locales existentes, plantillas compartidas resueltas, un H1 por página, navegación activa, destino del skip link y noindex del borrador.
- Servidor Vite: HTTP 200 para Inicio, Servicios, Sobre nosotros, Contacto, logo, fotografía y módulo principal.
- Contrato de diseño conservado como comentario en el HTML compilado.
- Instalación de dependencias: auditoría npm sin vulnerabilidades reportadas en la instalación.

## Revisión independiente de código
Una revisión estática encontró dos detalles de foco: contraste sobre el encabezado oscuro y foco hacia el botón de menú oculto tras pasar a escritorio. Ambos se corrigieron y el revisor los calificó como resueltos. El salto al contenido mueve el foco de forma explícita para conservarlo con el scroll mejorado.

## Alcance de la evidencia
No se pudieron realizar capturas ni pruebas de interacción: el navegador integrado no estaba disponible y la lista de navegadores fue vacía. El diseño responsive y la preferencia de movimiento reducido están implementados, pero su comportamiento real requiere QA en navegador.

No se certifica cumplimiento completo WCAG, métricas Lighthouse, ausencia de errores de consola ni apariencia visual en dispositivos reales. La revisión independiente fue estática y el segundo dictamen se limitó a las dos correcciones indicadas.

El servidor de desarrollo queda en http://127.0.0.1:5173/ durante esta sesión. Si se detiene, reiniciar con `npm.cmd run dev`.

## Segunda entrega
La estructura de Inicio y las páginas internas pasan `npm.cmd run build`. Las comprobaciones agregadas verifican también IDs únicos, destinos de anclajes y referencias aria-labelledby/aria-controls. Los nuevos recursos son locales y el SVG decorativo está incluido en el build.

La revisión independiente mencionada arriba corresponde a la primera entrega. La segunda entrega se revisó desde el código; todavía no se verificó la apariencia ni la interacción real en navegador, ya que la lista de navegadores integrados continúa vacía.

## Preloader
- Build aprobado con apertura compartida y estilos/bootstrap críticos en las cuatro entradas.
- HTTP 200 y markup del preloader presente en cada página servida por Vite.
- Pruebas funcionales del bootstrap y coordinador: límite menor a 1.5 segundos aun sin bundle, movimiento reducido sin espera, Tab/Escape sin interferir con el teclado, pagehide, cambio de preferencia, toque, callback único, módulo tardío y cancelación HMR.
- La comprobación de build verifica un único overlay por página y la presencia del script de salida independiente.
- El navegador integrado sigue sin estar disponible: no se verificó el resultado visual animado.

## Fotografías y carrusel — comprobación histórica
- Build aprobado con variantes WebP y galería de tres imágenes.
- Checks de recursos ampliados a srcset e imagesrcset.
- Pruebas simuladas del carrusel: cambio automático a 6s, pausa por foco/pestaña oculta, selección manual, Home, movimiento reducido, error de carga, carga pendiente interrumpida por foco y limpieza.
- Los WebP campo2/campo3 de 960px se abrieron y verificaron como imágenes completas, conservando las escenas originales.
- La lista de navegadores integrados sigue vacía; no hay capturas ni pruebas de composición/interacción real de la página.

## Revisión actual — portada única y SEO

- `npm.cmd run build` y `npm.cmd run check`: aprobados, con cinco entradas HTML incluyendo la plantilla 404.
- Comprobación de una sola fotografía en portada, usando `campo.jpg`, y ausencia del carrusel. Sus pruebas anteriores fueron retiradas junto con el módulo.
- Enlaces, recursos, srcset, IDs, anclajes y referencias ARIA válidos en las cinco páginas; plantilla resuelta, un H1 y preloader único por página.
- Pruebas SEO: borrador sin canonical inventado, rechazo de URLs inválidas o indexación sin dominio, rutas absolutas en subdirectorio, cuatro URLs del sitemap, exclusión de 404, metadatos sin duplicados, JSON-LD válido y escape de cierre de script.
- Comprobación de emisión de robots y sitemap según configuración. El sitemap no se emite sin dominio.
- Servidor Vite: HTTP 200 en las cinco páginas y robots; sitemap HTTP 404 mientras no se configure dominio. La plantilla 404 devuelve 200 al abrirla directamente: el estado HTTP de errores reales se configura en el hosting.
- Las animaciones nuevas se revisaron desde el código, incluyendo condiciones de puntero/ancho/movimiento reducido y limpieza. Su apariencia y comportamiento real no se verificaron en navegador.

No se realizaron mediciones Lighthouse ni certificación WCAG. En esta revisión anterior, CMS y envío de formulario todavía no estaban implementados.

## Panel PHP — validación actual

- Sintaxis correcta en los módulos PHP y vista. Runtime local PHP 8.3.16 con GD/WebP, Fileinfo, Mbstring y Session.
- Validación de campos, correo y teléfono internacional; servicios vacíos ignorados y servicio incompleto rechazado. No se publica contenido institucional inventado.
- Persistencia, revisión incrementada, conflicto rechazado sin sobrescritura y backup previo comprobados. Almacenamiento dentro de la raíz pública rechazado.
- Render conserva título de portada, manifiesto, una sola foto y SVG; textos/servicios de prueba con HTML se escapan. El placeholder auxiliar de historia se retira al completar el contenido.
- Imágenes inválidas y slot inválido rechazados; reencodificación WebP elimina payload adjunto de una imagen de prueba. No se amplían fuentes pequeñas. Preload y foto reemplazada quedan sincronizados.
- Recorridos HTTP reales: acceso sin configurar, creación por CLI, hash de contraseña, acceso no autorizado, CSRF, sesión regenerada, edición/publicación sin recompilar, conflicto, validación fallida, contacto/enlaces/schema, servicios, subida multipart y restauración.
- Cookies HttpOnly/SameSite Strict y panel sin caché/incrustación. Cambio de contraseña invalida otra sesión y renueva CSRF. Logout y límite de cinco intentos comprobados. Vencimiento por inactividad, duración máxima y versión revocada comprobados en PHP.
- Archivos privados no descargables desde las rutas de prueba. Errores HTTP 404 reales con recursos correctos para URLs anidadas; soporte de subdirectorio, HEAD y rechazo de métodos no admitidos.
- Fuentes locales del panel servidas correctamente. Cuentas/contenido/media de prueba aislados en carpetas temporales, eliminados al terminar.

El intento de revisión en navegador no pudo continuar: no hay navegadores disponibles y la lista sigue vacía. No hubo screenshots ni interacción de UI real. Apache, HTTPS/cookies Secure tras proxy y hosting real todavía necesitan validación. Las pruebas de esta entrega anterior no comprobaron envío de correo; se incorpora en la siguiente revisión.

## Formulario — validación actual

- `npm.cmd run build`, `check`, `check:php` y `check:contact`: aprobados. Seis HTML compilados con referencias ARIA, incluyendo aria-describedby, y recursos válidos.
- Validación JS y PHP de campos requeridos/opcionales, longitud, acentos/trim, email, teléfono, aceptación y rechazo de CR/LF en cabeceras. Arrays inválidos rechazados.
- Compatibilidad de datos CMS anteriores: privacidad se incorpora pendiente por defecto. Borradores no aprobados no aparecen en la página pública; el panel rechaza aprobar el placeholder.
- Prueba SMTP real local con PHPMailer 7.1.1: remitente/destinatario fijos, Reply-To del visitante y cuerpo UTF-8 texto plano con consulta/versión de política.
- API/HTML HTTP: CSRF, honeypot, tiempo mínimo, reserva/límites, éxito confirmado, repetición de token sin segundo email, nueva consulta sobre token anterior rechazada, cambio de política con consentimiento reiniciado.
- Recorrido sin JS probado por HTTP: formulario habilitado en HTML con configuración/política de prueba, POST exitoso con redirección, feedback de éxito y errores escapados con valores conservados.
- SMTP de prueba rechaza el envío: respuesta 503 sin diagnósticos privados y sin éxito falso. No se guarda la consulta ni correo personal en content.json; contadores no contienen IP clara.
- Subdirectorio conserva acción y enlace de política correctos; secreto privado no descargable. Servidor local principal responde 200 en Contacto, API y Privacidad, con envío deshabilitado por política/configuración pendientes.

Las pruebas usaron configuración, cuentas, contenido y SMTP temporales aislados, sin credenciales reales ni mensajes externos. No se probó TLS real, SMTP del hosting, recepción en bandeja ni Apache. El navegador integrado sigue sin estar disponible: QA visual, estados interactivos reales y dispositivos pendientes.

## Álbumes y cierre de Inicio — validación actual

- Build PHP, checks frontend, checks PHP y formulario HTTP/SMTP local aprobados. Portada única y galería editorial conservadas.
- PHP: textos/atributos escapados, identificadores de álbum/foto existentes, exclusión de álbumes vacíos y límites de 12 álbumes/40 fotos comprobados.
- HTTP con cuenta temporal: crear álbum vacío sin publicarlo; subir foto real, reencodificar a WebP sin payload original, publicar sin recompilar y servir imagen grande; editar leyenda con HTML escapado; ordenar fotos y cambiar portada; retirar foto y eliminar álbum.
- CSRF inválido rechazado; conflicto de revisión conserva revisión anterior y no añade archivos; identificador de foto de otro álbum rechazado; subida sin archivo rechazada. Enlaces del álbum funcionan en subdirectorio.
- Contacto de Inicio pasa a una sola sección; fuentes, enlaces y referencias ARIA de los seis HTML siguen válidos. Paquete de hosting actualizado.

El navegador vuelve a reportar «No browser is available» y lista vacía. No se comprobó la composición visual ni se recorrió el visor real con ratón/teclado. Las pruebas HTTP de álbumes ejercitan formularios nativos del panel; no equivalen a revisión visual. No se modificaron cuentas/contenido/media reales con las pruebas.

## Galería independiente — validación actual

Build y checks frontend/PHP aprobados con siete HTML. `galeria.html` tiene navegación activa, recursos, referencias ARIA, preloader y metadatos; el sitemap condicional incluye cinco páginas principales. Se añadió el paso por PHP en las reglas Apache para que el hosting renderice los álbumes del panel.

HTTP: Galería responde 200 en raíz/subcarpeta; fotos subidas y leyendas editadas aparecen allí sin recompilar; álbumes vacíos y fotos retiradas se ocultan. Inicio no contiene el bloque de álbumes ni el visor, mantiene su galería editorial y enlaza a Galería. Panel con sección «Galería» y acceso a la página pública. Pruebas con datos aislados. QA visual del menú ampliado/visor y validación Apache real siguen pendientes.

## Contenido institucional y maquinaria — validación actual

Build PHP y checks frontend/PHP/formulario aprobados. Siete HTML con recursos/referencias ARIA correctos; título de tres líneas, frase institucional, ocho servicios y cuatro fotos nuevas disponibles por defecto. PHP renderiza párrafos separados sin perder el escape; borrar el listado de servicios no restaura el listado anterior de la plantilla.

Misión/visión: dos rótulos de propuesta por defecto; aprobar solo misión retira solo su rótulo; aprobar un placeholder de visión se rechaza por HTTP. Las pruebas usan datos aislados. La carga institucional autorizada sí se aplicó al CMS local real bajo bloqueo/revisión y con backup, conservando contacto/privacidad/álbumes anteriores.

Comprobación HTTP del sitio local: Inicio, Sobre APAG y Servicios responden 200 con texto cargado, sin placeholder institucional; portada única y álbumes fuera de Inicio. Galería contiene las cuatro fotos nuevas. CMS real con ocho servicios, misión/visión sin aprobar y privacidad aún pendiente. No se envió correo externo.

Sharp generó variantes WebP sin ampliar fotos pequeñas; srcset usa sus dimensiones reales. Los PNG originales se inspeccionaron. El navegador sigue sin estar disponible; no hubo screenshot ni revisión de composición, recortes y estados reales del panel. Hosting/Apache, TLS real y recepción de correo siguen pendientes.

## Animación de Inicio — validación actual

Build y check frontend aprobados: siete páginas, recursos, enlaces, anclajes, referencias ARIA, preloader y SEO. Revelado de contenido ampliado y caña SVG integrada únicamente en Inicio. Código revisado: preferencia de movimiento reducido, limpieza de animaciones/ScrollTriggers, cálculo responsive tras refresh y franja sin interacción recortada al margen. No se oculta contenido de lectura sin JavaScript.

El navegador integrado reporta «No browser is available» y lista vacía. No se verificaron visualmente los tiempos, el recorrido real, móvil ni la interacción con rueda/táctil; esta limitación sigue abierta.

## Sitemap, robots y accesibilidad — 18 de septiembre de 2026

Build/check frontend aprobados. Ambos archivos se generan incluso sin dominio: sitemap de prueba con cinco URLs absolutas locales; producción/subcarpeta comprobadas con dominio reservado de test, sin URLs locales. Robots enlaza al sitemap y excluye panel/API con prefijos correspondientes; el borrador conserva noindex. Errores, panel y privacidad pendiente fuera del sitemap.

Nuevo check estático integrado para idioma, landmarks, destino enfocable del salto, alt, labels y nombres/tipos de botones. Contraste calculado: texto de paleta >=4.5:1 y foco/borde de campos >=3:1. No evalúa contraste de fotografías, dimensiones renderizadas ni uso real con teclado/lector. Navegador integrado nuevamente no disponible; no hubo Lighthouse, screenshot ni auditoría WCAG completa. Guía: SEO_ACCESSIBILITY.md.

HTTP local PHP: GET /sitemap.xml y /robots.txt responden 200 con application/xml y text/plain respectivamente; XML parseado con cinco URLs. Inicio conserva noindex. Paquete PHP actualizado con ambos archivos.

Corrección CSS en Vite: reproducido HTTP 500 al solicitar /src/css/main.css aunque accessibility.css existe. Se retiró ese @import y se importó accessibility.css directamente desde src/js/main.js después del CSS principal. El mismo servidor Vite, sin reiniciarlo, responde ahora 200 para ambos CSS y main.js. Build/check aprobados; paquete PHP actualizado.

## Preparación SiteGround — apag-py.com

URL confirmada configurada en .env local, sin activar indexación. Build PHP, check frontend, check PHP, formulario HTTP/SMTP local y nuevo check del paquete aprobados. Sitemap/robots/canonical usan https://apag-py.com/ y el sitemap contiene cinco URLs sin localhost.

El nuevo check copia el paquete a un directorio temporal con public_html/ y app/ hermanos, lo sirve por PHP sin APAG_PUBLIC_DIR heredado y comprueba Inicio/CSS/Galería/panel/sitemap/robots, protección de rutas privadas y 404. Storage se crea fuera de public_html; configuración SMTP/cuentas locales ausentes del paquete. Datos aislados y directorio temporal eliminado tras la prueba. No se hicieron cambios DNS, publicaciones ni envíos externos.

Guía creada con referencias oficiales SiteGround actuales, SSL/DNS/caché/SMTP/cuenta/privacidad y mantenimiento. Apache/NGINX, TLS, DNS, correo real y QA visual siguen sin validación en el hosting.

## Auditoría completa antes de deploy

Build PHP, check frontend/PHP/contacto/paquete aprobados nuevamente. Auditorías autorizadas npm --omit=dev y Composer --locked --no-dev completadas: cero vulnerabilidades conocidas reportadas y sin paquetes PHP abandonados. No es auditoría integral de seguridad.

Snapshot real revisión 17: cuenta existente, privacidad/misión/visión aprobadas, ocho servicios, dos álbumes/siete fotos, cuatro espacios de imagen editados y seis archivos media. Veinticuatro rutas fotográficas comprobadas, cero faltantes. HTTP de seis páginas responde 200, sin placeholders/rótulos pendientes y con noindex. API ready=false, SMTP sin configurar. No se alteraron credenciales/aprobaciones/contenido; pruebas con datos aislados y sin correo externo. Navegador integrado no disponible, sin QA visual ni mediciones.

Roadmap/guía corregidos para reflejar el CMS real; informe detallado: PREDEPLOY_REVIEW.md. Pendientes: migración de datos, SMTP, configuración/validación SiteGround, QA/mediciones, indexación tras aprobación y entrega operativa.
