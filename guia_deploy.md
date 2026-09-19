# Guía de deploy de APAG en SiteGround

Destino: **https://apag-py.com/**. Actualizada: 18 de septiembre de 2026.

Esta web utiliza HTML/CSS/JavaScript compilados con Vite y un panel/formulario en PHP. No requiere WordPress, MySQL ni un proceso Node en el hosting. Node y Composer se usan para preparar el paquete localmente. Esta guía prepara la publicación; no significa que ya se haya subido o validado el sitio en SiteGround.

**Estado local comprobado en la auditoría posterior:** cuenta administrativa existente; privacidad, misión y visión marcadas como aprobadas; contenido revisión 17 y seis archivos subidos en media. SMTP sigue sin configurar. Conservar estas ediciones y aprobaciones mediante la migración del paso 5. Informe completo: [PREDEPLOY_REVIEW.md](docs/PREDEPLOY_REVIEW.md).

## 1. Qué falta antes de la entrega

| Pendiente | Para qué sirve |
| --- | --- |
| Acceso a Site Tools y control del DNS | Instalar archivos, configurar PHP, SSL y el dominio |
| Migrar la cuenta existente o crear una cuenta de producción elegida | Administrar textos, fotografías y álbumes |
| Crear/confirmar la cuenta SMTP de SiteGround | Enviar consultas del formulario |
| Migrar la política ya aprobada en el CMS local | Conservar el consentimiento y habilitar formulario junto con SMTP |
| Migrar aprobaciones de misión/visión y confirmar aceptación final de textos/fotos | Conservar el contenido validado y completar la entrega |
| Revisar móvil/escritorio y probar el hosting | Comprobar estilos, navegación, PHP, caché, subidas y correo |
| Activar indexación al terminar la revisión | Publicar canonical, sitemap y metadatos coherentes con el dominio |

Se puede subir una versión de revisión con `APAG_INDEXABLE=false` y el formulario deshabilitado. Para entregar el sitio con todas sus funciones, deben completarse cuenta, política y SMTP. El sitemap ya puede apuntar a `apag-py.com` aunque la indexación siga desactivada. WhatsApp/redes aún necesitan datos confirmados; no impiden el despliegue técnico.

## 2. Preparar el sitio en SiteGround

1. En **Websites / Sitios web**, abrir o crear el sitio correspondiente a `apag-py.com` y entrar en **Site Tools**. Usar un sitio para código propio; no instalar WordPress para este proyecto.
2. Abrir **Site > File Manager**. La carpeta pública normalmente corresponde a `/home/customer/www/apag-py.com/public_html`. Confirmar la ruta real de la cuenta antes de copiar.
3. Respaldar cualquier web existente antes de sustituir archivos. No mezclar el proyecto con un `index.php`, `.htaccess` o instalación anteriores sin revisar sus reglas.
4. Usar File Manager o SFTP. Para SFTP, consultar los datos de **Devs > SSH Keys Manager > SSH Credentials**, autenticarse con clave y utilizar el puerto indicado; la documentación actual indica 18765. No confundir esta clave con el usuario del panel APAG. [SiteGround: SFTP](https://www.siteground.com/kb/sftp-command-line/).

La ruta típica de `public_html` está documentada por [SiteGround](https://world.siteground.com/kb/how_can_i_create_a_full_backup_of_my_website_/); puede variar según la instalación.

## 3. Configurar PHP

En **Devs > PHP Manager**, seleccionar PHP 8.3 o una versión posterior compatible que se haya probado. El mínimo del proyecto es PHP 8.2. Verificar estas extensiones: **GD con WebP, Fileinfo, Mbstring, Session y OpenSSL**.

Revisar los límites disponibles:

| Ajuste | Requisito del proyecto |
| --- | --- |
| `upload_max_filesize` | Al menos 10 MB |
| `post_max_size` | Al menos 12 MB; superior al límite de archivo |
| `memory_limit` | Al menos 256 MB para procesar fotografías grandes |
| `display_errors` | Off en producción |
| `log_errors` | On; revisar los registros privados del hosting |

Las fotos admitidas son JPG/PNG/WebP de hasta 10 MB y 20 megapíxeles. Si el plan impone límites inferiores, confirmar con soporte o reducir las fotos. Algunos valores están fijados globalmente en hosting compartido; no asumir que todos son editables. [SiteGround: variables PHP](https://www.siteground.com/kb/how_to_change_the_value_of_a_php_setting).

No dejar un `phpinfo.php` público después de comprobar extensiones. Puede verificarse la versión/extensiones por SSH con `php -v` y `php -m`, comprobando también que la versión web coincida con la seleccionada en Site Tools.

## 4. Preparar el paquete localmente

Abrir PowerShell en `C:\laragon\www\apag`. Requisitos locales: Node >=22.12, PHP >=8.2 con las extensiones indicadas y Composer.

Si se parte de una copia nueva del proyecto, instalar dependencias con los archivos lock existentes:

```powershell
npm.cmd ci
composer install --no-dev --prefer-dist --no-interaction
```

Si ya están instaladas y no cambiaron los locks, continuar con el build. No usar `composer update` como paso habitual de publicación: cambia las versiones acordadas. [Composer: instalación desde lock](https://getcomposer.org/doc/01-basic-usage.md#installing-from-composer-lock).

El archivo local `.env` debe contener:

```dotenv
APAG_SITE_URL=https://apag-py.com/
APAG_INDEXABLE=false
```

La URL ya quedó configurada localmente. Mantener `false` durante revisión. Si existen `.env.production`, `.env.local` o variables del proceso con los mismos nombres, revisar sus valores: pueden tener prioridad sobre `.env`. Reiniciar Vite si se cambia su configuración de entorno. PHP no lee este `.env`; aquí solo se configura el build y su SEO. [Vite: entorno y modos](https://vite.dev/guide/env-and-mode.html).

Generar el paquete y ejecutar las comprobaciones:

```powershell
npm.cmd run build:php
npm.cmd run check
npm.cmd run check:php
npm.cmd run check:contact
npm.cmd run check:package
```

Si alguna falla, corregirla antes de publicar. Las pruebas usan cuentas/datos temporales; las de correo utilizan SMTP local, no el servidor real de SiteGround.

El resultado es `dist-php/`: `public/` contiene el frontend y punto de entrada; `app/` contiene PHP y `vendor/`; también se incluye esta guía. No subir `node_modules`, `.git`, fuentes de Vite ni el repositorio completo. El paquete excluye la cuenta local, contenido guardado, fotos subidas y configuración SMTP privada: esos datos se trasladan por separado.

## 5. Copiar los archivos con la estructura correcta

Dentro de la carpeta del sitio, dejar esta estructura:

```text
/home/customer/www/apag-py.com/
├── public_html/          ← contenido de dist-php/public/
│   ├── index.php
│   ├── index.html
│   ├── servicios.html
│   ├── nosotros.html
│   ├── galeria.html
│   ├── contacto.html
│   ├── privacidad.html
│   ├── 404.html
│   ├── .htaccess
│   ├── assets/
│   ├── images/
│   ├── admin-assets/
│   ├── sitemap.xml
│   └── robots.txt
├── app/                  ← carpeta dist-php/app/ completa
│   ├── bootstrap.php
│   ├── schema.json
│   ├── config.local.php  ← crear aparte para SMTP
│   ├── vendor/
│   └── ...
└── storage/              ← datos privados persistentes
    ├── admin.json
    ├── content.json      ← si se migra el contenido local
    └── media/            ← si hay fotografías subidas al panel
```

Copiar **el contenido** de `dist-php/public/` a `public_html/`, incluyendo el archivo oculto `.htaccess`. No crear `public_html/public/`. `app/` y `storage/` deben quedar como hermanos de `public_html`, nunca dentro de la carpeta pública. Si File Manager limita ese acceso, solicitar la ubicación privada al soporte y adaptar las rutas.

El `index.php` generado usa su propia carpeta como `APAG_PUBLIC_DIR`; así reconoce `public_html` sin buscar una carpeta inexistente llamada `public`. Carga `../app/bootstrap.php`. El almacenamiento por defecto será `../storage`, fuera de la raíz pública.

Para producción con HTTPS obligatorio, añadir esta línea al `public_html/index.php` después de `declare(strict_types=1);`:

```php
putenv('APAG_HTTPS=true');
```

Esto marca las cookies del panel y formulario como Secure incluso si el proxy termina TLS antes de PHP. Activar primero SSL/HTTPS del paso 9 y acceder después al panel por HTTPS. Esta línea debe conservarse o volver a añadirse cuando un nuevo paquete sustituya `index.php`. No añadir credenciales SMTP a este archivo público.

Si se cambia la ubicación privada, configurar explícitamente `APAG_STORAGE_DIR` antes de cargar bootstrap, usando la ruta real. Para la estructura anterior no hace falta. El proceso PHP debe poder leer `app/` y escribir en `storage/`. Usar permisos habituales 755/644 para archivos públicos; restringir los privados a 700/600 cuando el usuario propietario y PHP permitan ese acceso. Corregir propiedad/permisos con soporte si falla; no utilizar 777.

### Trasladar el contenido que ya cargamos

Para conservar las ediciones del panel local, copiar `storage/content.json` y, si existe, `storage/media/` al almacenamiento privado del hosting. Copiar también `content.json.bak` si se desea la revisión anterior. Hacerlo con las ediciones pausadas, en la primera instalación, para mantener JSON y fotos coherentes.

No trasladar sesiones, contadores, locks ni las claves temporales del formulario: el hosting los genera nuevamente. No sobrescribir contenido o media de un hosting que ya tiene cambios sin respaldo y revisión. Sin `content.json`, el sitio usa los valores iniciales del paquete, incluidos textos institucionales y fotos iniciales, pero no las ediciones locales posteriores.

## 6. Crear la cuenta administrativa

La auditoría confirmó una cuenta local existente. Puede migrarse `storage/admin.json` a la carpeta privada del hosting para conservarla. No recrearla ni resetearla automáticamente. Los pasos siguientes son la alternativa cuando se elige deliberadamente una cuenta de producción nueva.

Método sin guardar una contraseña en comandos: crear una cuenta de despliegue desde la terminal local y subir únicamente su hash.

En PowerShell, dentro del proyecto:

```powershell
$deployStoragePath = Join-Path (Get-Location) 'storage\deploy-apag'
$deployPreviousStorage = $env:APAG_STORAGE_DIR
try {
    $env:APAG_STORAGE_DIR = $deployStoragePath
    npm.cmd run admin:create
} finally {
    if ($null -eq $deployPreviousStorage) {
        Remove-Item Env:APAG_STORAGE_DIR -ErrorAction SilentlyContinue
    } else {
        $env:APAG_STORAGE_DIR = $deployPreviousStorage
    }
}
```

Elegir un usuario de 3–60 caracteres y contraseña de al menos 12 caracteres, hasta 72 bytes; el comando la solicita dos veces sin mostrarla. Subir `storage/deploy-apag/admin.json` al **`storage/admin.json` privado del hosting**. No subir la subcarpeta `deploy-apag` como almacenamiento adicional. No existe contraseña predeterminada ni instalador público.

Si ese directorio local ya tiene una cuenta, el comando rechaza sobrescribirla. Utilizar `npm.cmd run admin:create -- --reset` en el mismo bloque solo si se quiere reemplazar esa cuenta de despliegue. No ejecutar resets por rutina.

Acceder a **https://apag-py.com/admin** después de SSL. Comprobar login, guardado y logout. Cambiar la contraseña desde **Mi cuenta** si hace falta. Guardar el acceso en un gestor de contraseñas; entregar a APAG su cuenta, sin compartir credenciales por chat o publicar archivos privados.

## 7. Configurar caché y reglas PHP en SiteGround

Diagnóstico comprobado durante la publicación: si `/index.php` muestra imágenes `/media/` del panel pero `/index.html` conserva las imágenes iniciales y devuelve `Cache-Control: max-age=15552000`, el HTML está siendo servido por la capa estática. Desactivar NGINX Direct Delivery y vaciar las cachés con los pasos siguientes. El paquete actualizado incluye `private, no-store, no-cache, max-age=0` en las respuestas PHP y en las reglas para HTML/PHP; esto no sustituye desactivar la entrega directa que evita PHP. No sobrescribir el `storage/content.json` del servidor al aplicar esta corrección.

**Este paso es obligatorio para comprobar que el panel realmente actualiza las páginas.** Las URLs `.html` deben pasar por `index.php`, aunque exista la plantilla compilada. El `.htaccess` incluido ya define esas reglas y el índice PHP.

1. En **Speed > Caching > NGINX Direct Delivery**, desactivar esta opción para el sitio durante la instalación. SiteGround indica que entrega directamente documentos HTML estáticos. Para APAG, se infiere que esto puede evitar las reglas PHP del CMS; por eso se desactiva y se valida antes de optimizar. [SiteGround: NGINX Direct Delivery](https://www.siteground.com/tutorials/supercacher/nginx-direct-delivery/).
2. Añadir al final de `public_html/.htaccess` este bloque. Utiliza `private`, documentado por SiteGround para excluir caché, y conserva también la protección de no almacenar respuestas del panel/formulario:

```apache
<IfModule mod_headers.c>
  Header set Cache-Control "private, no-store, no-cache, max-age=0"
</IfModule>
```

3. Ir a **Speed > Caching > Dynamic Cache** y vaciar la caché después del cambio. Mantener el CDN desactivado durante estas pruebas. [SiteGround: desactivar caché sin WordPress](https://www.siteground.com/kb/disable-dynamic-caching-website).
4. Cambiar un texto desde el panel, abrir `/index.html`, `/nosotros.html` y `/galeria.html` según la sección modificada, y confirmar la edición desde una ventana privada sin sesión administrativa. Si aparece la plantilla vieja, revisar NGINX, caché y rewrite.

No añadir `AddHandler` para ejecutar todos los HTML como PHP: aquí PHP se ejecuta en `index.php` mediante rewrite. No hace falta Memcached ni un plugin de WordPress. Conservar estas reglas específicas de SiteGround después de futuras subidas del `.htaccess`. Optimizar más adelante la caché de assets manteniendo fuera de caché sesiones, formulario y páginas del CMS.

## 8. Activar correo y privacidad

### Correo del hosting

1. Crear la cuenta elegida en **Email > Accounts**, por ejemplo `contacto@apag-py.com` si APAG aprueba ese nombre.
2. En la cuenta, abrir **Actions > Mail Configuration > Manual Settings** y copiar el servidor SMTP exacto. La cuenta completa es el usuario; la documentación actual indica SMTP 465. Usar `ssl` en este proyecto para SMTPS. Si el panel indica 587/STARTTLS, utilizar `tls`. [SiteGround: configuración de correo](https://www.siteground.com/kb/how_to_configure_my_mail_client/).
3. Crear **`app/config.local.php`** fuera de `public_html`, siguiendo este ejemplo y reemplazando los valores indicados:

```php
<?php
return [
    'smtp_host' => 'REEMPLAZAR_CON_SERVIDOR_DE_MANUAL_SETTINGS',
    'smtp_port' => 465,
    'smtp_encryption' => 'ssl',
    'smtp_username' => 'contacto@apag-py.com',
    'smtp_password' => 'REEMPLAZAR_CON_CONTRASENA_DE_LA_CUENTA',
    'mail_from' => 'contacto@apag-py.com',
    'mail_from_name' => 'APAG',
    'mail_to' => 'asociacion.prod.agric.guaira@gmail.com',
];
```

El ejemplo utiliza una cuenta propuesta, no una cuenta ya creada. Confirmar el destinatario con APAG. `mail_to` vacío usa el correo visible configurado en el panel. El remitente debe ser la cuenta autorizada del hosting; el correo del visitante se añade como Reply-To. Escribir una contraseña PHP correctamente escapada si contiene comillas o barras; no incluirla en HTML, `.env` de Vite, Git ni el paquete público. El build no incluye este archivo y las actualizaciones deben conservarlo.

Revisar **Email > Authentication** y publicar/verificar SPF y DKIM en el proveedor DNS que sea realmente autoritativo. Usar los valores propios de la cuenta, sin duplicar registros SPF. Revisar DMARC con el responsable del correo y comprobar entrega antes de endurecer su política. [SiteGround: autenticación de correo](https://www.siteground.com/tutorials/email/authentication).

### Privacidad

La auditoría confirmó privacidad marcada como aprobada/publicada en el CMS local y sin placeholder. Migrar `storage/content.json` para conservar ese texto y aprobación; no basta subir el paquete, cuyos valores iniciales mantienen la política pendiente. Para futuras revisiones, usar **Panel > Privacidad** y publicar solo el texto revisado/aprobado por APAG.

Guardar y revisar **https://apag-py.com/privacidad.html**. El formulario solo se habilita cuando la política está aprobada y la configuración SMTP está completa. La web no guarda una bandeja de consultas: se envían al correo. Definir allí su conservación. Más detalles: [CONTACT_FORM.md](docs/CONTACT_FORM.md).

Probar una consulta desde el navegador y verificar que llega a la bandeja del destinatario; revisar spam y que Responder se dirige al visitante. No basta con que la web muestre éxito: SMTP puede aceptar el envío sin garantizar llegada a bandeja.

## 9. Apuntar el dominio y activar HTTPS

Preparar los archivos y respaldos antes de cambiar DNS. Tomar la IP/nameservers reales del sitio en la cuenta; no usar valores de ejemplo.

Se puede delegar el DNS a SiteGround o conservar el proveedor actual y apuntar el registro A del dominio a la IP de SiteGround. Revisar `www`, registros AAAA existentes y los MX/TXT del correo para que no sigan apuntando a servicios anteriores por error. Si se cambian nameservers, trasladar antes los registros de correo y verificación necesarios. La propagación depende del TTL/proveedor; comprobar resolución antes de emitir SSL. La gestión DNS actual de SiteGround se documenta en **Client Area > Services > Domains > Settings > DNS Zone Editor** y requiere sus nameservers. [SiteGround: DNS](https://www.siteground.com/kb/manage-dns-records).

Instalar Let's Encrypt en **Security > SSL Manager**, cubriendo `apag-py.com` y `www.apag-py.com` si este último se utiliza. Después activar **Security > HTTPS Enforce**. Comprobar que HTTP redirige a HTTPS y que no hay contenido mixto. [SiteGround: Let's Encrypt](https://www.siteground.com/kb/can-get-lets-encrypt-certificates), [HTTPS Enforce](https://www.siteground.com/kb/how-do-i-enforce-https).

La versión principal elegida es **sin www**. Cuando ambos nombres resuelvan y tengan certificado, agregar una redirección permanente de `www` al dominio principal antes de las reglas del CMS en `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTP_HOST} ^www\.apag-py\.com$ [NC]
  RewriteRule ^ https://apag-py.com%{REQUEST_URI} [R=301,L]
</IfModule>
```

Conservar los parámetros de consulta y comprobar que no se produce un bucle con otras reglas del hosting. La redirección HTTPS principal se gestiona mediante HTTPS Enforce; no añadir reglas basadas en cabeceras de proxy no confirmadas.

## 10. Revisar antes de activar indexación

- [ ] Inicio, Servicios, Sobre APAG, Galería y Contacto cargan con CSS, fuentes e imágenes y sin errores de consola/red.
- [ ] Portada con una sola foto; animaciones sutiles, sin tapar contenido; movimiento reducido respeta la preferencia del sistema.
- [ ] Menú móvil, álbumes y visor funcionan con teclado, Escape y retorno del foco; textos e imágenes se leen con zoom y en pantalla pequeña.
- [ ] Cambiar texto desde el panel se refleja sin recompilar y sin depender de la sesión del administrador.
- [ ] Subir una foto publica variantes WebP; ordenar/retirar fotos actualiza Galería; conservar copia de las fotos autorizadas fuera del hosting.
- [ ] Login/logout, cambio de contraseña y privacidad funcionan por HTTPS; cookies administrativas/públicas muestran Secure/HttpOnly.
- [ ] La política aprobada se ve y el formulario recibe una consulta real en la bandeja correcta.
- [ ] Misión/visión aprobadas desde Sobre APAG o mantienen explícitamente el rótulo de propuesta hasta su aprobación.
- [ ] `/sitemap.xml` responde con XML y cinco URLs de `https://apag-py.com/`, sin localhost; `/robots.txt` responde como texto y enlaza al mapa correcto.
- [ ] Una ruta inexistente y una ruta anidada inexistente devuelven HTTP 404 real, con estilos y enlaces correctos.
- [ ] `/app/config.local.php`, `/storage/content.json`, `/storage/admin.json` y `/vendor/autoload.php` no son accesibles desde la web.
- [ ] Hay respaldo privado de contenido, cuenta, media y configuración; se conoce cómo restaurarlo.

Medir Lighthouse/Web Vitals con el sitio real y revisar los hallazgos. Los checks locales no sustituyen esta revisión, ni certifican WCAG completo. La configuración Apache, DNS, TLS y SMTP del hosting todavía deben comprobarse allí.

Cuando APAG apruebe la salida pública, cambiar localmente:

```dotenv
APAG_SITE_URL=https://apag-py.com/
APAG_INDEXABLE=true
```

Repetir `npm.cmd run build:php`, `npm.cmd run check` y `npm.cmd run check:package`; subir el paquete actualizado conservando datos/configuración y las adaptaciones HTTPS/caché/redirección. Verificar `index, follow` y canonical en las páginas principales. La política pendiente y el 404 conservan su protección de indexación según el estado/servidor. Registrar el dominio en Google Search Console y presentar `https://apag-py.com/sitemap.xml`. [Google: sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## 11. Actualizaciones, respaldo y recuperación

Las ediciones de contenido/fotos se realizan desde el panel y no requieren build. Para actualizar código, generar el paquete local, ejecutar checks y subir assets nuevos antes de las plantillas que los referencian; mantener los assets anteriores hasta terminar y poder revertir. Coordinar una ventana breve de mantenimiento si se reemplaza PHP.

Nunca sustituir `storage/` por la copia local durante una actualización rutinaria. Conservar `app/config.local.php` y las líneas SiteGround de `index.php`/`.htaccess`: el paquete no lleva esas credenciales ni las configuraciones manuales del hosting.

Respaldar conjuntamente `storage/content.json`, su backup, `storage/admin.json`, `storage/media/`, configuración SMTP privada y la versión desplegada del código. Guardar la copia fuera de la raíz pública y limitar el acceso. Las sesiones/contadores pueden omitirse. La copia `content.json.bak` conserva una revisión, no reemplaza un respaldo externo. Confirmar que el respaldo del hosting incluye también las carpetas privadas; una copia solo de `public_html` no recupera el panel.

Si se usan backups de SiteGround, revisar qué funciones incluye el plan; la descarga gestionada de backups puede requerir Premium. También puede descargarse una copia manual por SFTP, incluyendo carpetas privadas. [SiteGround: backups](https://world.siteground.com/kb/how_can_i_create_a_full_backup_of_my_website_/).

Ante un fallo, pausar ediciones, recuperar la versión anterior del código y, solo si el problema afecta datos, restaurar el JSON junto con sus fotos correspondientes. Mantener las credenciales vigentes salvo que también sea necesaria su recuperación, y vaciar cachés después. Probar de nuevo login, publicación y formulario.

## 12. Problemas frecuentes

| Síntoma | Qué revisar |
| --- | --- |
| Error 500 o página sin cargar | Error Log de SiteGround, versión/extensiones PHP, `app/bootstrap.php`, ubicación de `vendor/` y permisos privados |
| PHP dice que falta compilar o no encuentra plantillas | Contenido del paquete dentro de `public_html`; `index.php` con `APAG_PUBLIC_DIR=__DIR__` |
| Panel guarda pero la web no cambia | NGINX Direct Delivery, Dynamic Cache, `.htaccess` completo y rutas HTML pasando por PHP |
| Se perdió el CSS | `/assets/` subido completo; plantillas y assets del mismo build; ausencia de caché vieja |
| Subida falla | GD/WebP, límite 10 MB/20 MP, límites PHP y escritura en `storage/media/` |
| El formulario sigue deshabilitado | Política aprobada, SMTP completo, OpenSSL y autoloader de `app/vendor/` |
| El correo no llega | Servidor/puerto/cifrado de Manual Settings, remitente autorizado, destinatario, spam y SPF/DKIM |
| Login no se mantiene | Acceso por HTTPS, cookies Secure, escritura en sesiones privadas y ausencia de caché del panel |
| Canonical/sitemap muestran localhost | `APAG_SITE_URL` definitivo, prioridades del entorno y recompilar/subir el paquete |
| Google no indexa | `APAG_INDEXABLE=true`, nuevo build publicado, dominio/DNS accesibles y Search Console; no bloquear lectura del noindex anterior |

Tras completar estas comprobaciones, entregar a APAG el acceso al panel, una explicación breve para gestionar contenido/álbumes y los responsables de correo, renovaciones del dominio, respaldos y mantenimiento.
