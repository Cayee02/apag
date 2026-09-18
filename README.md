# 🌾 APAG — Sitio Web Institucional

Sitio web institucional moderno para la:

# Asociación de Productores Agrícolas del Guairá — APAG

Proyecto desarrollado por **Leo Systems**.

---

# 1. Visión del proyecto

El objetivo es desarrollar una experiencia web institucional moderna, rápida, elegante y visualmente diferenciada para APAG.

El sitio NO debe sentirse como una plantilla genérica de asociación.

Queremos transmitir:

- agricultura;
- producción;
- naturaleza;
- crecimiento;
- trabajo;
- comunidad;
- confianza;
- desarrollo rural;
- sostenibilidad;
- futuro.

La experiencia debe combinar una estética institucional con una presentación visual contemporánea.

El usuario debe sentir desde los primeros segundos que APAG representa:

> personas que trabajan la tierra, producen, crecen y construyen futuro.

---

# 2. Referencia inicial

Sitio compartido por el cliente:

https://agricultoresbajocauca.com

Debe utilizarse solamente como referencia de:

- temática;
- estructura institucional;
- presentación de servicios;
- información sobre la asociación;
- contacto.

NO copiar:

- estructura visual;
- diseño;
- componentes;
- textos;
- colores;
- animaciones;
- layouts.

La versión APAG debe superar ampliamente la referencia en:

- diseño;
- experiencia de usuario;
- navegación;
- velocidad;
- animaciones;
- responsive;
- jerarquía visual;
- accesibilidad;
- interacción.

---

# 3. Objetivo visual

Crear una identidad digital inspirada en el logotipo de APAG.

Colores principales derivados de la identidad:

## Verde APAG

```css
--apag-green-900: #075F36;
--apag-green-800: #08713F;
--apag-green-700: #168447;
--apag-green-500: #4D973D;
```

## Desarrollo iniciado

Primera entrega: base Vite, CSS y JavaScript modulares, logo oficial suministrado, encabezado, menú móvil y portada de Inicio. Las páginas internas tienen una base navegable; el contenido institucional no recibido se identifica como pendiente.

```sh
npm.cmd install
npm.cmd run dev
```

Abrir la URL indicada por Vite (normalmente http://127.0.0.1:5173).

```sh
npm.cmd run build
npm.cmd run check
npm.cmd run preview
```

La compilación se genera en `dist/`. En shells donde npm no esté restringido puede usarse `npm` en lugar de `npm.cmd`.

Estado y próximos pasos: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md). Procedencia de imágenes: [docs/ASSETS.md](docs/ASSETS.md). No se considera una entrega final de producción; faltan contenido oficial, activación de correo/política, configuración de hosting y verificación visual.

Roadmap actualizado por fase: [docs/ROADMAP_STATUS.md](docs/ROADMAP_STATUS.md). Configuración de dominio, indexación y metadatos: [docs/SEO.md](docs/SEO.md). La portada usa nuevamente una sola imagen, el atardecer original; la galería fotográfica se conserva.

## Panel PHP integrado

El gestor seleccionado es un panel ligero PHP: textos principales, fotos, servicios y contacto editables, con guardado inmediato sobre el diseño actual.

```sh
npm.cmd run admin:create
npm.cmd run dev:php
```

El primer comando activa tu cuenta solicitando usuario y contraseña sin mostrarla. El segundo compila y abre el servidor local: web http://127.0.0.1:8080/ y panel http://127.0.0.1:8080/admin. Vite en 5173 continúa siendo el entorno de diseño y no ejecuta el panel.

```sh
npm.cmd run check:php
npm.cmd run build:php
```

El paquete PHP queda en `dist-php/` con código privado y raíz pública separados. No incluye la cuenta, datos locales ni configuración privada SMTP. Requiere PHP 8.2+, GD/WebP, Fileinfo, Mbstring y sesiones; reglas de Apache incluidas, pendientes de validar en hosting. Guía de uso, respaldos y publicación: [docs/ADMIN.md](docs/ADMIN.md).

## Formulario de contacto

Formulario PHP con validación, antispam y PHPMailer para SMTP del hosting. Instalar las dependencias PHP antes de generar el paquete:

```sh
composer install --no-dev --prefer-dist --no-interaction
npm.cmd run check:contact
```

El envío real requiere configurar el correo del hosting y publicar la política aprobada desde el panel. La política sigue pendiente por decisión del usuario; las pruebas de envío usan SMTP local aislado y no envían correos a APAG. Instrucciones: [docs/CONTACT_FORM.md](docs/CONTACT_FORM.md).

## Contenido institucional y galería

El texto propuesto recibido se cargó en Inicio, Sobre APAG, Servicios y el panel, con ocho servicios y seis pilares. Misión/visión se muestran como propuestas y se aprueban por separado desde Sobre APAG. Fuente: `src/data/institutional.json`.

La página `galeria.html`, accesible desde los menús, muestra álbumes administrables. Incluye cuatro fotos de maquinaria compartidas por el cliente y mejoradas con IA, optimizadas a WebP. El panel permite añadir más fotos y álbumes. Portada original y galería editorial de Inicio conservadas. Uso y carga inicial: [docs/ADMIN.md](docs/ADMIN.md).

## Sitemap, robots y accesibilidad

El build genera `/sitemap.xml` y `/robots.txt`. Sin dominio configurado se usan URLs locales de prueba; definir `APAG_SITE_URL` antes de publicar y activar `APAG_INDEXABLE` tras aprobación. El check incluye etiquetas/alt/landmarks y contraste de texto/foco/bordes. Configuración, límites y revisión manual pendiente: [docs/SEO_ACCESSIBILITY.md](docs/SEO_ACCESSIBILITY.md).

## Publicación en SiteGround

Dominio confirmado: `https://apag-py.com/`. Guía completa: [guia_deploy.md](guia_deploy.md), también incluida en el paquete PHP. El entry generado reconoce su carpeta pública aunque se instale como `public_html`; PHP/datos permanecen fuera de ella. `npm.cmd run check:package` prueba esa distribución con datos aislados. SMTP, cuenta del panel, política, DNS/SSL/caché y validación real siguen pendientes de configurar en hosting.

Auditoría antes de publicación y pendientes reales: [docs/PREDEPLOY_REVIEW.md](docs/PREDEPLOY_REVIEW.md). Privacidad/misión/visión ya aprobadas en CMS local y cuenta existente; necesitan migración al hosting. SMTP todavía sin configurar.
