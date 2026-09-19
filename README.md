# APAG — Sitio web institucional

Sitio oficial de la **Asociación de Productores Agrícolas del Guairá (APAG)**, desarrollado por **Leo Systems**.

El proyecto combina un frontend institucional compilado con Vite y un panel administrativo ligero en PHP. El panel permite actualizar el contenido sin modificar el diseño ni recompilar el sitio.

## Estado actual

Actualizado: **19 de septiembre de 2026**.

- Dominio de producción: [apag-py.com](https://apag-py.com/).
- Instalación preparada para SiteGround con `public_html`, `app` y `storage` separados.
- Panel administrativo instalado en `/admin`.
- Contenido local: revisión 26, privacidad, misión y visión aprobadas, tres álbumes y 21 archivos multimedia.
- Teléfonos publicados: `+595 995 654544` y `+595 981 482592`.
- Cuenta SMTP confirmada: `contactos@apag-py.com`, servidor `mail.apag-py.com`, puerto 465 y SMTPS.
- Indexación desactivada durante la revisión final mediante `APAG_INDEXABLE=false`.

La contraseña SMTP nunca forma parte del repositorio ni del paquete generado. Todavía debe comprobarse en producción la recepción real del formulario antes de considerarlo entregado.

## Funcionalidades

- Inicio institucional con animaciones de scroll, preloader y fotografía principal estática.
- Páginas de Servicios, Sobre APAG, Galería, Contacto y Privacidad.
- Galerías y álbumes administrables con visor de fotografías.
- Panel PHP para textos, servicios, imágenes, álbumes, contacto y aprobaciones institucionales.
- Procesamiento de imágenes con variantes WebP.
- Formulario de contacto con SMTP autenticado, CSRF, validación, honeypot, límites y control de duplicados.
- Sitemap, robots, canonical, Open Graph y datos estructurados.
- Navegación responsive, foco visible, movimiento reducido y comprobaciones estáticas de accesibilidad.
- Mapa de la oficina integrado en la página de Contacto.

## Stack

- HTML semántico, CSS modular y JavaScript ES Modules.
- Vite 8 para desarrollo y compilación.
- GSAP y Lenis para movimiento y desplazamiento.
- Lucide para iconos y Fontsource para tipografías locales.
- PHP 8.2 o superior, sin framework ni base de datos.
- PHPMailer mediante Composer.
- Archivos JSON privados para contenido, cuenta administrativa y revisiones.

## Requisitos locales

- Node.js 22.12 o superior.
- npm.
- PHP 8.2 o superior.
- Extensiones PHP: GD con WebP, Fileinfo, Mbstring, Session y OpenSSL.
- Composer.

## Instalación local

```powershell
npm.cmd ci
composer install --no-dev --prefer-dist --no-interaction
Copy-Item .env.example .env
```

Configurar `.env`:

```dotenv
APAG_SITE_URL=https://apag-py.com/
APAG_INDEXABLE=false
```

El entorno de Vite sirve solamente el frontend estático:

```powershell
npm.cmd run dev
```

Para probar el sitio con el panel y el contenido PHP:

```powershell
npm.cmd run admin:create
npm.cmd run dev:php
```

- Web local: `http://127.0.0.1:8080/`
- Panel local: `http://127.0.0.1:8080/admin`

`admin:create` solicita las credenciales sin mostrar la contraseña. El panel admite una sola cuenta administrativa. No existe un usuario ni contraseña predeterminados.

## Comandos disponibles

| Comando | Función |
| --- | --- |
| `npm.cmd run dev` | Inicia Vite para trabajo visual |
| `npm.cmd run dev:php` | Compila y sirve el sitio PHP local |
| `npm.cmd run build` | Genera el frontend en `dist/` |
| `npm.cmd run build:php` | Genera el paquete de hosting en `dist-php/` |
| `npm.cmd run admin:create` | Crea la cuenta administrativa local |
| `npm.cmd run images:optimize` | Regenera variantes optimizadas |
| `npm.cmd run check` | Comprueba frontend, SEO y accesibilidad estática |
| `npm.cmd run check:php` | Comprueba panel, persistencia, seguridad e imágenes |
| `npm.cmd run check:contact` | Comprueba formulario y SMTP local aislado |
| `npm.cmd run check:package` | Comprueba la distribución final para PHP |

Antes de publicar una nueva versión:

```powershell
npm.cmd run build:php
npm.cmd run check
npm.cmd run check:php
npm.cmd run check:contact
npm.cmd run check:package
```

## Estructura principal

```text
apag/
├── public/                  # Imágenes y recursos públicos originales
├── src/                     # CSS, JavaScript, datos y parciales
├── server/                  # CMS, formulario, router y panel PHP
├── storage/                 # Datos privados locales; no se empaquetan
├── scripts/                 # Build, optimización y comprobaciones
├── docs/                    # Documentación técnica y operativa
├── dist/                    # Frontend compilado
└── dist-php/                # Paquete preparado para SiteGround
```

El contenido de `storage/` incluye información persistente. No debe colocarse dentro de la raíz pública ni sobrescribirse durante una actualización rutinaria.

## Paquete de producción

`npm.cmd run build:php` genera:

```text
dist-php/
├── public/      # Copiar su contenido a public_html/
├── app/         # Código PHP privado y vendor/
├── docs/
└── guia_deploy.md
```

La estructura esperada en SiteGround es:

```text
/home/customer/www/apag-py.com/
├── public_html/
├── app/
└── storage/
```

`app` y `storage` son hermanos de `public_html`, no subcarpetas públicas. El paquete excluye deliberadamente:

- `storage/admin.json`;
- `storage/content.json` y fotografías cargadas desde el panel;
- `app/config.local.php`;
- contraseñas y otras credenciales.

Estos elementos deben conservarse o migrarse por separado.

## SMTP de producción

Crear en el servidor el archivo privado:

```text
/home/customer/www/apag-py.com/app/config.local.php
```

Configuración confirmada:

```php
<?php
return [
    'smtp_host' => 'mail.apag-py.com',
    'smtp_port' => 465,
    'smtp_encryption' => 'ssl',
    'smtp_username' => 'contactos@apag-py.com',
    'smtp_password' => 'CONTRASEÑA_GUARDADA_SOLO_EN_EL_SERVIDOR',
    'mail_from' => 'contactos@apag-py.com',
    'mail_from_name' => 'APAG',
    'mail_to' => 'contactos@apag-py.com',
];
```

El correo del visitante se utiliza como `Reply-To`. IMAP 993 sirve para leer el buzón y no interviene en el formulario web.

## Consideraciones de SiteGround

Las URLs `.html` deben pasar por `public_html/index.php` para incorporar los cambios guardados por el panel. En SiteGround:

1. Desactivar **NGINX Direct Delivery** para el dominio.
2. Conservar las reglas incluidas en `public_html/.htaccess`.
3. Vaciar **Dynamic Cache** después de modificar la configuración.
4. Comprobar los cambios desde una ventana privada.

Si `/index.php` muestra el contenido nuevo pero `/index.html` conserva una versión anterior, la capa estática está evitando el renderizado PHP.

La cuenta administrativa de producción se crea directamente con `php app/bin/create-admin.php`; no se ejecutan npm ni Composer dentro de `public_html`. El procedimiento seguro está en la sección 6 de la guía de despliegue.

## Indexación

Durante la revisión se mantiene:

```dotenv
APAG_INDEXABLE=false
```

Cuando APAG apruebe la salida pública:

1. Cambiar a `APAG_INDEXABLE=true` en el entorno local de build.
2. Ejecutar nuevamente `npm.cmd run build:php` y las comprobaciones.
3. Subir el paquete conservando `storage/` y `app/config.local.php`.
4. Revisar `robots.txt`, `sitemap.xml` y canonical.
5. Registrar el sitemap en Google Search Console.

## Seguridad y respaldos

- No guardar contraseñas en README, `.env` de Vite, HTML, Git o comandos visibles.
- Mantener `app/` y `storage/` fuera de `public_html`.
- Respaldar juntos `storage/content.json`, `storage/admin.json` y `storage/media/`.
- Conservar `app/config.local.php` durante las actualizaciones.
- No utilizar permisos `777`.
- Antes de reemplazar una cuenta administrativa, respaldar `storage/admin.json`.

## Documentación

- [Guía completa de despliegue](guia_deploy.md)
- [Administración del contenido](docs/ADMIN.md)
- [Formulario y SMTP](docs/CONTACT_FORM.md)
- [Estado del roadmap](docs/ROADMAP_STATUS.md)
- [Revisión antes del despliegue](docs/PREDEPLOY_REVIEW.md)
- [SEO y accesibilidad](docs/SEO_ACCESSIBILITY.md)
- [Desarrollo y decisiones](docs/DEVELOPMENT.md)
- [Procedencia de recursos visuales](docs/ASSETS.md)

## Créditos

Proyecto desarrollado por [Leo Systems](https://leo-systems-py.com/) para APAG.
