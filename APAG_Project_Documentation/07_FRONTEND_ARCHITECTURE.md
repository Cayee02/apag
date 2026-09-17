# Arquitectura frontend

## Stack base

- HTML5
- CSS moderno
- JavaScript ES Modules
- Vite
- GSAP
- ScrollTrigger
- Lenis
- Lucide Icons
- Swiper solo si es necesario

## No usar

- Bootstrap
- Tailwind
- jQuery
- React
- Vue

salvo cambio de arquitectura aprobado.

## Estructura propuesta

```text
apag-web/
├── public/
│   ├── favicon/
│   ├── images/
│   │   ├── logo/
│   │   ├── hero/
│   │   ├── services/
│   │   ├── about/
│   │   ├── gallery/
│   │   └── textures/
│   └── videos/
│
├── src/
│   ├── css/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   ├── typography.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── animations.css
│   │   ├── responsive.css
│   │   └── main.css
│   │
│   ├── js/
│   │   ├── core/
│   │   │   ├── gsap.js
│   │   │   ├── lenis.js
│   │   │   └── cursor.js
│   │   ├── animations/
│   │   │   ├── hero.js
│   │   │   ├── reveal.js
│   │   │   ├── parallax.js
│   │   │   ├── counters.js
│   │   │   ├── horizontal-scroll.js
│   │   │   └── page-transition.js
│   │   ├── components/
│   │   │   ├── header.js
│   │   │   ├── mobile-menu.js
│   │   │   ├── contact-form.js
│   │   │   └── gallery.js
│   │   ├── utils/
│   │   │   ├── dom.js
│   │   │   ├── media.js
│   │   │   └── accessibility.js
│   │   └── main.js
│   └── main.js
│
├── index.html
├── servicios.html
├── nosotros.html
├── contacto.html
├── package.json
├── vite.config.js
└── docs/
```

## Dependencias sugeridas

```bash
npm install gsap lenis lucide
```

Opcional:

```bash
npm install swiper
```

Verificar el nombre actual del paquete de Lenis antes de instalar.

## Principios de código

- módulos pequeños;
- responsabilidades claras;
- no duplicar lógica;
- no crear “god files”;
- usar funciones con nombres explícitos;
- centralizar breakpoints;
- centralizar tokens de diseño;
- no colocar lógica compleja inline en HTML.

## Inicialización

```js
import { initSmoothScroll } from "./core/lenis.js";
import { initHeader } from "./components/header.js";
import { initRevealAnimations } from "./animations/reveal.js";

document.addEventListener("DOMContentLoaded", () => {
  initSmoothScroll();
  initHeader();
  initRevealAnimations();
});
```

## Progressive Enhancement

El contenido esencial debe seguir siendo legible aunque JavaScript falle.

## CMS

La capa visual no debe quedar acoplada a un CMS específico antes de decidir la solución de autoadministración.
