# Prompts para Codex

## Prompt inicial

```text
Lee primero toda la documentación Markdown del proyecto, empezando por 00_INDEX.md y 14_AGENTS.md.

Actúa como Senior Frontend Engineer, UI/UX Designer y Creative Developer.

Estamos desarrollando el sitio institucional de APAG — Asociación de Productores Agrícolas del Guairá.

Stack base:
- HTML5
- CSS moderno
- JavaScript ES Modules
- Vite
- GSAP
- ScrollTrigger
- Lenis
- Lucide Icons

No usar Bootstrap, Tailwind, jQuery, React ni Vue salvo que la documentación sea actualizada explícitamente.

Objetivos:
- diseño institucional premium;
- responsive impecable;
- alto rendimiento;
- accesibilidad;
- scroll narrativo;
- animaciones refinadas;
- SEO;
- código mantenible.

No inventes contenido institucional. Si falta información usa:
[CONTENIDO PENDIENTE APAG]

Primero:
1. inspecciona el repositorio;
2. resume la arquitectura actual;
3. identifica qué existe y qué falta;
4. propone el siguiente bloque de implementación;
5. implementa solamente esa fase;
6. ejecuta las comprobaciones disponibles;
7. informa archivos modificados.

No intentes rehacer todo el proyecto de una vez.
```

## Prompt — crear base

```text
Implementa la Fase 1 definida en ROADMAP.md.

Necesito:
- configuración Vite;
- estructura src/css y src/js;
- variables;
- reset;
- tipografía;
- layout;
- header;
- mobile menu;
- inicialización GSAP;
- inicialización Lenis;
- reduced motion.

Mantén todo modular.
Al final ejecuta build y corrige errores.
```

## Prompt — Hero

```text
Implementa el Hero de Inicio siguiendo DESIGN_SYSTEM.md, COMPONENTS.md y ANIMATIONS_AND_INTERACTIONS.md.

Debe:
- ocupar 100svh;
- utilizar fotografía agrícola;
- tener overlay;
- incluir eyebrow, título, descripción y dos CTAs;
- animarse con GSAP timeline;
- incluir indicador de scroll;
- mouse parallax solo pointer fine;
- desactivar efectos complejos con prefers-reduced-motion;
- mantener excelente mobile.

No inventar información APAG.
```

## Prompt — auditoría visual

```text
Audita el frontend actual de APAG como Senior UI/UX Engineer.

Revisa:
- jerarquía;
- espaciado;
- tipografía;
- contraste;
- consistencia;
- mobile;
- overflow;
- navegación;
- animaciones;
- accesibilidad.

No modifiques todavía.
Entrega problemas ordenados por severidad y propuesta concreta.
```

## Prompt — performance

```text
Audita rendimiento del proyecto APAG.

Busca:
- imágenes demasiado pesadas;
- JS innecesario;
- GSAP/ScrollTrigger mal usados;
- listeners duplicados;
- CLS;
- LCP;
- carga de fuentes;
- lazy loading incorrecto;
- animaciones que provoquen layout.

Realiza optimizaciones sin alterar el diseño visual salvo que sea necesario.
```

## Prompt — QA final

```text
Realiza QA técnico final de APAG.

Verifica:
- rutas;
- enlaces;
- mobile;
- desktop;
- keyboard;
- reduced motion;
- formulario;
- SEO;
- sitemap;
- robots;
- schema;
- consola;
- build;
- imágenes;
- accesibilidad;
- performance.

Corrige problemas seguros.
No inventes contenido pendiente.
Entrega checklist final.
```
