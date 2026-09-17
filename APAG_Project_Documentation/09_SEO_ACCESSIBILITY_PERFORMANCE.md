# SEO, accesibilidad y rendimiento

## SEO on-page

Cada página requiere:

- `<title>`;
- meta description;
- canonical;
- Open Graph;
- Twitter Card;
- headings jerárquicos;
- URLs limpias;
- alt text;
- enlaces internos.

## Titles sugeridos

### Inicio
APAG | Asociación de Productores Agrícolas del Guairá

### Servicios
Servicios | APAG

### Sobre Nosotros
Sobre APAG | Asociación de Productores Agrícolas del Guairá

### Contacto
Contacto | APAG

Ajustar con contenido final y estrategia SEO.

## Structured Data

Añadir JSON-LD:
- Organization;
- WebSite;
- PostalAddress si la dirección es confirmada y geocodificable.

No inventar redes, logo URL o coordenadas.

## Sitemap

Crear:
- `/sitemap.xml`

## Robots

Crear:
- `/robots.txt`

## Accesibilidad

Objetivo:
- WCAG 2.2 AA en lo razonable para el alcance.

Requisitos:
- navegación con teclado;
- focus visible;
- labels;
- contraste;
- botones semánticos;
- enlaces descriptivos;
- alt text;
- `aria-*` solamente cuando corresponda;
- skip link;
- no depender exclusivamente de color;
- reduced motion.

## Menú mobile

Debe:
- controlar foco;
- restaurar foco al cerrar;
- cerrar con Escape;
- bloquear fondo correctamente.

## Performance

Objetivos orientativos Lighthouse:

- Performance >= 90
- Accessibility >= 95
- Best Practices >= 95
- SEO >= 95

## Core Web Vitals

Objetivos:
- LCP < 2.5 s
- INP < 200 ms
- CLS < 0.1

## Imágenes

Preferir:
- AVIF;
- WebP;
- `srcset`;
- `sizes`;
- lazy loading.

Hero:
- no lazy;
- priorizar carga;
- tamaño correcto.

## Fuentes

- cargar solo pesos usados;
- `font-display: swap`;
- preferir self-host si la licencia lo permite.

## JavaScript

- cargar módulos;
- evitar librerías innecesarias;
- no inicializar animaciones en elementos inexistentes;
- destruir listeners cuando corresponda.

## Animación y performance

Preferir:
- transform;
- opacity.

Evitar animar:
- width;
- height;
- top;
- left;
cuando no sea necesario.
