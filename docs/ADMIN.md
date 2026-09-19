# Panel ligero PHP de APAG

## Qué permite actualizar

- Inicio: título de tres líneas, descripción, presentación, manifiesto, seis pilares, producción orgánica, capacitación, cierre y leyenda/procedencia de portada.
- Sobre APAG: título, presentación, propósito/organización, misión, visión, lo que guía a la asociación, objetivos y leyenda de fotografía. Misión y visión tienen casillas de aprobación independientes; sin marcar, la web las identifica como propuestas.
- Servicios: título, introducción, leyenda de fotografía, estándares, comercio justo, comercialización, articulación y financiamiento; listado de hasta 24 servicios. Los tres primeros aparecen también en Inicio.
- Fotos de Inicio: títulos y detalles de las tres fotos editoriales, conservando la composición aprobada.
- Galería: crear/editar/eliminar hasta 12 álbumes; añadir hasta 40 fotografías por álbum, editar descripciones y leyendas, ordenar y quitar fotos. La primera foto es la portada; los álbumes vacíos no se publican.
- Fotografías: una portada, tres fotos editoriales, dos de páginas internas y una de producción orgánica; descripción accesible y restauración de la imagen inicial.
- Contacto: introducción, correo, dirección, dos teléfonos y texto del pie. Los enlaces de correo/teléfono y los datos estructurados se actualizan juntos.
- Mi cuenta: cambio de contraseña e invalidación de otras sesiones.
- Privacidad: borrador privado y publicación del texto aprobado por APAG para el consentimiento del formulario.

El panel conserva la identidad, la portada de una única foto y la galería actual. Textos institucionales no recibidos mantienen `[CONTENIDO PENDIENTE APAG]`. No es una herramienta para editar HTML, CSS, DNS ni la estructura de las páginas. WhatsApp y redes siguen pendientes de datos confirmados; no se inventan enlaces. El mapa confirmado por el usuario está integrado en la plantilla de Contacto; editar la dirección escrita en el panel no mueve el punto del mapa.

## Añadir más fotos a Galería

Entrar a **Galería** en el menú lateral del panel, crear un álbum con nombre y descripción, y abrir **Añadir una fotografía**. Seleccionar una foto autorizada JPG/PNG/WebP de hasta 10 MB, describir su contenido y añadir opcionalmente una leyenda/crédito. Guardar publica la foto en `galeria.html` sin recompilar. Repetir para añadir más; las flechas cambian el orden y la portada del álbum. El enlace «Ver la galería pública» abre la página de los visitantes.

La página Galería está separada de Inicio, que conserva sus tres fotos editoriales. Hay un enlace «Galería» en la navegación principal, el menú móvil y el pie. El álbum inicial «Miradas del campo» contiene las imágenes de referencia actuales, sin atribuirlas a actividades oficiales. En la web, abrir el álbum muestra sus fotos; con JavaScript se amplían en un visor con anterior/siguiente y cierre mediante Escape. Sin JS, el álbum se abre igualmente y los enlaces llevan a la imagen grande.

Las subidas se reencodifican a WebP responsive, sin ampliar fuentes pequeñas ni guardar originales. Quitar fotos o eliminar álbumes retira su publicación; los archivos optimizados se conservan para no romper la copia anterior de contenido. Su limpieza física sigue pendiente del mantenimiento de media. Los límites de carga/dimensiones son los mismos que para los siete espacios fijos.

## Contenido institucional cargado

El texto propuesto suministrado por el usuario está en `src/data/institutional.json`. Se incorporó a los valores iniciales del CMS y a su contenido local guardado, con backup anterior. Ocho servicios y un álbum «Maquinaria y trabajo de campo» con cuatro fotos del cliente, mejoradas con IA. Dirección, teléfonos, correo, privacidad y álbumes anteriores se conservaron. No se aprobó automáticamente misión ni visión; la privacidad continúa pendiente.

Los párrafos se separan con una línea vacía en el editor. El título de portada usa tres líneas; el manifiesto, dos. Los estándares son referencias mencionadas en el texto suministrado, sin afirmar certificados vigentes. La aprobación final del contenido corresponde a APAG.

Para preparar nuevamente los valores iniciales desde el archivo fuente, ejecutar `npm.cmd run images:optimize` y `node scripts/prepare-institutional.mjs`. Importar a un CMS ya guardado con `node scripts/import-institutional.mjs` es una acción manual: sustituye los textos institucionales y servicios cargados, cambia las imágenes de Sobre APAG/Servicios/Producción orgánica y reinicia misión/visión como propuestas. No ejecutarlo como parte habitual del build ni para actualizar fotos desde el panel.

## Primer acceso local

Requiere PHP 8.2+ con GD/WebP, Fileinfo, Mbstring y Session. El equipo actual tiene PHP 8.3.16 en Laragon; los scripts lo detectan si no está en PATH. Puede configurarse `APAG_PHP_BIN` con otra ruta.

Crear la cuenta en una terminal interactiva:

```sh
npm.cmd run admin:create
```

El comando solicita usuario y contraseña dos veces; la contraseña no se muestra ni se pasa como argumento del proceso. No existe contraseña predeterminada ni instalador web. Usa al menos 12 caracteres; el hash actual limita la entrada a 72 bytes. Solo se almacena su hash.

Iniciar web y panel:

```sh
npm.cmd run dev:php
```

Web: http://127.0.0.1:8080/ · Panel: http://127.0.0.1:8080/admin

En el paquete desplegado en SiteGround, la cuenta se crea con `php app/bin/create-admin.php` desde la raíz privada del sitio, enviándole el JSON por entrada estándar. `public_html` no contiene `package.json` ni `composer.json`; por tanto, no se ejecutan allí npm ni Composer. Los comandos seguros para SSH y el procedimiento de reemplazo de la única cuenta están documentados en `guia_deploy.md`, sección 6.

`APAG_PHP_PORT` permite elegir otro puerto. El servidor escucha únicamente en loopback y es para desarrollo local. El comando compila el frontend primero. Tras modificar código del frontend, recompilar para actualizar lo que sirve PHP.

El servidor Vite de `npm.cmd run dev` sigue siendo útil para diseño, pero no ejecuta PHP ni muestra las ediciones guardadas en el panel. Para probar autoadministración utiliza la URL PHP indicada arriba.

## Uso cotidiano

1. Inicia sesión y elige una sección.
2. Actualiza únicamente información confirmada.
3. Guarda y utiliza «Ver la web» para revisar el resultado.

Los cambios se publican al guardar, sin volver a compilar. En servicios, filas completamente vacías se ignoran; cada servicio publicado necesita título y descripción. Con JavaScript puedes añadir/quitar filas; sin JavaScript quedan espacios adicionales para editar mediante formularios normales.

En fotografías, selecciona JPG, PNG o WebP de hasta 10 MB. La portada recomienda 1920 × 1080 px o más. Las imágenes se reencodifican a variantes WebP sin ampliar fuentes pequeñas. Cada fotografía permite cambiar únicamente su descripción dejando el archivo vacío, o restaurar la foto inicial. La portada no admite carrusel.

Si otra pestaña o sesión guardó antes, el panel rechaza el guardado con un mensaje de conflicto. Conserva el texto enviado para que puedas copiarlo; recarga y revisa los cambios antes de guardar de nuevo.

## Almacenamiento y respaldo

Sin base de datos. El formulario utiliza PHPMailer instalado con Composer; el panel mantiene PHP nativo. El directorio privado `storage/`, fuera de la raíz pública, contiene:

- `content.json`: textos, servicios, referencias de imágenes y revisión.
- `content.json.bak`: estado anterior al último guardado.
- `admin.json`: usuario, hash de contraseña y versión de acceso.
- `media/`: variantes WebP; los archivos originales subidos no se publican ni conservan.
- `sessions/`, archivos de bloqueo y contador temporal de intentos de acceso.
- `contact-sessions/`, tokens y contadores/clave de protección del formulario público. No almacena consultas en texto claro.

JSON se escribe mediante archivo temporal y renombrado bajo bloqueo; las revisiones impiden sobrescribir una edición anterior. Solo existe un rol administrador en este MVP. No hay registro público ni edición simultánea fusionada automáticamente.

Configurar `APAG_STORAGE_DIR` para usar otra ubicación privada persistente. El servidor rechaza ubicaciones dentro de la raíz pública. El usuario PHP debe poder escribir allí; no necesita escribir código ni plantillas. No usar permisos 777.

Se añade una regla de denegación Apache dentro del almacenamiento como protección adicional si la configuración local de Laragon incluye la carpeta del proyecto. La ubicación privada fuera de la raíz pública sigue siendo obligatoria en hosting.

Respaldar contenido, cuenta y media fuera de la raíz pública. La copia automática de una revisión no reemplaza un respaldo externo. Las variantes de fotos sustituidas se conservan para que los respaldos previos sigan teniendo sus archivos; su depuración es una tarea de mantenimiento pendiente. Sesiones y contadores pueden omitirse del respaldo.

Para recuperar acceso local, reemplazar la cuenta desde una terminal autorizada:

```sh
npm.cmd run admin:create -- --reset
```

En hosting se utiliza el mismo script PHP con entrada JSON por stdin en una sesión técnica autorizada; no pasar la contraseña en la URL ni en argumentos. El reset cambia la versión de acceso e invalida las sesiones existentes.

## Paquete para hosting PHP

```sh
npm.cmd run build:php
```

Genera `dist-php/public/` (frontend, punto de entrada y `.htaccess`) y `dist-php/app/` (PHP privado). No incluye cuentas locales, contenido guardado ni fotos subidas. La raíz pública del hosting debe apuntar a `public/`; `app/` y `storage/` deben quedar fuera. El paquete requiere Apache 2.4 con mod_rewrite y AllowOverride para `.htaccess`, o reglas equivalentes explícitas en otro servidor.

Instalar primero las dependencias con `composer install --no-dev --prefer-dist --no-interaction`. El paquete incluye `app/vendor/`, pero excluye `server/config.local.php`; configurar SMTP en el código privado/entorno del hosting. Ver [CONTACT_FORM.md](CONTACT_FORM.md).

Todas las rutas HTML principales deben pasar por `public/index.php`, aunque exista el HTML compilado. Servir ese HTML directamente omite el CMS. La configuración incluida aplica esa regla en Apache y también proporciona errores reales con estado 404 y recursos correctos en URLs anidadas. Falta comprobarla en el hosting elegido; no se probó Apache en esta sesión.

Si el sitio se instala en un subdirectorio, configurar `APAG_BASE_PATH` (por ejemplo `/apag`) cuando el servidor no lo deduzca de la ruta de `index.php`. `APAG_PUBLIC_DIR` permite ubicar las plantillas compiladas. Son variables del proceso PHP; el archivo `.env` de Vite configura el SEO del build y no es cargado por PHP.

Activar HTTPS en hosting. Las cookies usan HttpOnly y SameSite Strict, y Secure con HTTPS. Si TLS termina en un proxy, configurar `APAG_HTTPS=true` en el proceso PHP; no se confía automáticamente en cabeceras enviadas por el cliente. Mantener `display_errors=Off` y logs privados. Ajustar `upload_max_filesize=10M`, `post_max_size=12M` y memoria de al menos 256 MB para fotos de hasta 20 megapíxeles.

Las sesiones vencen por 30 minutos de inactividad o 8 horas desde el ingreso. Login, guardado, subida, cambio de contraseña y cierre de sesión usan CSRF; la sesión se regenera al ingresar/cambiar contraseña. Cinco intentos fallidos desde una IP bloquean nuevos intentos durante la ventana de 15 minutos. El panel no se indexa y no permite incrustación en frames.

## Comprobaciones

```sh
npm.cmd run build
npm.cmd run check
npm.cmd run check:php
npm.cmd run check:contact
```

Las pruebas PHP usan cuentas, contenido y servidores temporales aislados: no modifican la cuenta real. Verifican validación, guardado, conflicto, backup, escape HTML, procesamiento de imágenes y los recorridos HTTP de acceso/edición/subida/contacto/servicios/404/contraseña/logout.

QA visual del panel, Apache real y pruebas en dispositivos siguen pendientes por falta de navegador integrado disponible. No se ha desplegado ni creado una cuenta con contraseña predeterminada. El formulario está implementado y probado con SMTP local; para activarlo faltan SMTP del hosting y política aprobada. El mailto continúa como contacto directo.

## Hosting confirmado: SiteGround

Publicación en `https://apag-py.com/`: seguir [guia_deploy.md](../guia_deploy.md). El entry generado configura APAG_PUBLIC_DIR con su propia carpeta, por lo que se puede copiar el contenido de public/ a public_html/. app/ y storage/ quedan como hermanos privados. El paquete incluye la guía; no incluye cuenta, datos ni SMTP. Prueba adicional: `npm.cmd run check:package` (PHP loopback, distribución public_html, datos aislados; no sustituye Apache/NGINX/SMTP reales).

## Estado local auditado antes del deploy

El 18 de septiembre se comprobó cuenta local existente, contenido revisión 17, privacidad/misión/visión aprobadas en el panel, ocho servicios, dos álbumes/siete fotos y seis archivos en media. SMTP sin configurar. Estos datos no se incluyen en el paquete: migrar content.json, cuenta elegida y media para conservarlos. No recrear ni resetear automáticamente la cuenta. El estado de carga inicial descrito arriba es histórico; situación actual: [PREDEPLOY_REVIEW.md](PREDEPLOY_REVIEW.md).
