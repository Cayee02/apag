# Animaciones e interacciones

## Filosofía

Las animaciones deben:
- guiar;
- jerarquizar;
- reforzar narrativa;
- aumentar percepción de calidad.

No deben:
- retrasar contenido;
- marear;
- bloquear interacción;
- competir con el mensaje;
- degradar rendimiento.

## Stack

- GSAP
- ScrollTrigger
- Lenis

## Hero Timeline

Secuencia sugerida:

1. logo/header;
2. eyebrow;
3. título;
4. descripción;
5. CTAs;
6. indicador de scroll.

## Text Reveal

Opciones:
- por línea;
- por palabra;
- fade + translateY;
- clip-path.

Evitar letra por letra salvo casos puntuales.

## Image Reveal

```css
[data-reveal="image"] {
  clip-path: inset(0 100% 0 0);
}
```

Animar hasta:

```css
clip-path: inset(0 0 0 0);
```

## Parallax

Uso:
- hero;
- fotografías;
- fondos decorativos.

Movimiento máximo:
- 5% a 12%.

## Mouse Parallax

Solo desktop.

Movimiento:
- aproximadamente ±10px máximo.

## Magnetic Buttons

Máximo:
- 4px a 8px.

## Horizontal Scroll

Usarlo una sola vez como momento especial.

Desktop:
- pinning + scrub.

Mobile:
- no pinning pesado;
- convertir a carrusel o sección vertical.

## SVG Field Lines

Crear SVG abstracto inspirado en los surcos/campos del logo.

Animar `stroke-dashoffset` con scroll.

## Sun Motif

Elemento inspirado en el sol del logo.

Puede:
- rotar lentamente;
- responder al scroll;
- entrar detrás de títulos;
- funcionar como máscara o transición.

## Counters

Solo con datos reales.

Activar una sola vez al entrar al viewport.

## Page Transition

Overlay de marca breve.

No romper:
- back button;
- enlaces externos;
- anchors;
- apertura en nueva pestaña.

## Cursor

Estados:
- default;
- link;
- media “VER”.

Debe deshabilitarse en:
- touch;
- reduced motion.

## Reduced Motion

Obligatorio.

Si:

```css
@media (prefers-reduced-motion: reduce)
```

desactivar o simplificar:
- Lenis;
- parallax;
- pinning;
- cursor;
- grandes desplazamientos;
- transiciones largas.

## Data attributes recomendados

```html
data-reveal
data-reveal="image"
data-parallax
data-speed
data-magnetic
data-counter
data-cursor
```
