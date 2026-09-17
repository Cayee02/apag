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

Estado y próximos pasos: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md). Procedencia de imágenes: [docs/ASSETS.md](docs/ASSETS.md). No se considera una entrega final de producción; faltan contenido oficial, CMS, formulario y verificación visual.
