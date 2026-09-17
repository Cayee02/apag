# APAG — Documentación completa del proyecto

> Documento consolidado generado para Leo Systems / Codex.



---

# APAG — Índice de documentación del proyecto

Proyecto: Sitio Web Institucional de la Asociación de Productores Agrícolas del Guairá (APAG)  
Desarrollado por: Leo Systems  
Estado: Documentación base para diseño, desarrollo y trabajo con Codex

## Objetivo de este paquete

Este paquete concentra el contexto funcional, visual, técnico y operativo necesario para desarrollar el sitio de APAG sin depender de explicaciones repetidas en el chat.

La documentación está pensada para:
- alimentar Codex desde terminal;
- mantener consistencia entre sesiones;
- reducir decisiones improvisadas;
- evitar inventar contenido institucional;
- separar alcance contractual, diseño, arquitectura, animaciones, SEO, accesibilidad, QA y despliegue.

## Orden recomendado de lectura

1. `01_PROJECT_CONTEXT.md`
2. `02_SCOPE_AND_REQUIREMENTS.md`
3. `03_INFORMATION_ARCHITECTURE.md`
4. `04_DESIGN_SYSTEM.md`
5. `05_COMPONENTS.md`
6. `06_ANIMATIONS_AND_INTERACTIONS.md`
7. `07_FRONTEND_ARCHITECTURE.md`
8. `08_CONTENT_GUIDE.md`
9. `09_SEO_ACCESSIBILITY_PERFORMANCE.md`
10. `10_CONTACT_AND_FORMS.md`
11. `11_QA_CHECKLIST.md`
12. `12_DEPLOYMENT.md`
13. `13_ROADMAP.md`
14. `14_AGENTS.md`
15. `15_CODEX_PROMPTS.md`
16. `16_DECISIONS_LOG.md`
17. `17_HANDOFF_CHECKLIST.md`

## Regla de oro

Si existe una decisión entre “más efectos” y “mejor experiencia”, elegir siempre la mejor experiencia.

La web debe impresionar por su calidad, identidad, fluidez y claridad, no por una cantidad excesiva de animaciones.



---

# Contexto del proyecto — APAG

## Cliente

**Asociación de Productores Agrícolas del Guairá — APAG**

## Desarrollador

**Leo Systems**

## Tipo de proyecto

Sitio web institucional informativo con una experiencia visual moderna y diferenciada.

## Propósito

Crear una presencia digital clara, profesional y contemporánea para APAG que permita:

- presentar la organización;
- comunicar sus servicios y actividades;
- explicar quiénes son;
- facilitar el contacto con productores e interesados;
- reforzar confianza institucional;
- modernizar la percepción de la asociación;
- ofrecer una experiencia superior a una página institucional genérica.

## Enfoque creativo

La web debe transmitir:

- agricultura;
- producción;
- desarrollo;
- comunidad;
- territorio;
- crecimiento;
- sostenibilidad;
- cercanía;
- confianza;
- futuro.

Concepto creativo base:

> **Cultivamos futuro.**

Este concepto puede evolucionar si APAG entrega un lema institucional oficial.

## Referencia visual compartida por el cliente

https://agricultoresbajocauca.com

La referencia debe utilizarse solamente para comprender:
- temática;
- estructura institucional;
- tipo de contenidos;
- necesidades de una asociación agrícola.

No copiar diseño, textos, estructura exacta, recursos, animaciones ni componentes.

## Diferenciación buscada

La versión APAG debe diferenciarse mediante:
- dirección de arte propia;
- identidad basada en el logo;
- fotografías agrícolas de calidad;
- composiciones editoriales;
- scroll narrativo;
- animaciones suaves;
- microinteracciones;
- responsive real;
- excelente rendimiento;
- accesibilidad;
- SEO técnico;
- navegación moderna.

## Identidad derivada del logo

El logo utiliza principalmente:
- verde oscuro;
- verdes naturales;
- amarillo intenso;
- blanco;
- formas asociadas al sol;
- cultivos;
- campos;
- vegetación.

Estos elementos inspiran el sistema visual del sitio.

## Principio de contenido

No inventar:
- historia;
- misión;
- visión;
- estadísticas;
- número de productores;
- proyectos;
- comunidades;
- beneficios;
- servicios no confirmados;
- logros;
- fechas institucionales.

Cuando falte contenido usar:

`[CONTENIDO PENDIENTE APAG]`



---

# Alcance y requerimientos

## Alcance contratado

El sitio institucional contempla cuatro páginas principales:

1. Inicio
2. Servicios
3. Sobre Nosotros
4. Contáctenos

## Funcionalidades incluidas

- diseño institucional personalizado;
- diseño responsive;
- carga inicial de contenido;
- formulario de contacto;
- mapa / ubicación;
- teléfonos;
- correo institucional;
- acceso directo a WhatsApp;
- enlaces a redes sociales entregadas por APAG;
- configuración SEO básica;
- sitio autoadministrable para actualizar:
  - textos;
  - imágenes;
  - servicios;
  - datos de contacto;
- capacitación básica;
- soporte técnico inicial posterior a la entrega.

## Infraestructura incluida en el proyecto comercial

- dominio sujeto a disponibilidad;
- hosting por un año;
- certificado SSL;
- configuración técnica;
- pruebas;
- publicación.

## Entrega comercial estimada

Entre 15 y 20 días hábiles desde:
- recepción del pago inicial;
- recepción del contenido requerido.

## Fuera del alcance actual

No desarrollar dentro del MVP salvo ampliación aprobada:

- e-commerce;
- pagos en línea;
- portal privado de socios;
- intranet;
- facturación;
- ERP;
- gestión administrativa interna;
- sistema de membresías;
- reservas;
- marketplace;
- app móvil;
- funcionalidades complejas no contempladas.

## Requisito clave: autoadministración

La solución técnica debe permitir que APAG actualice contenido sin editar código.

La implementación puede resolverse con:
- CMS desacoplado;
- CMS tradicional con frontend personalizado;
- panel administrativo ligero;
- backend propio.

La elección final debe mantener:
- velocidad;
- seguridad;
- facilidad de uso;
- independencia del diseño;
- escalabilidad moderada.

## Requisito clave: experiencia visual

La web debe tener:
- scroll suave;
- animaciones GSAP;
- ScrollTrigger;
- reveals;
- parallax moderado;
- interacción con mouse solo en dispositivos apropiados;
- transiciones refinadas;
- menú mobile fullscreen;
- microinteracciones;
- soporte `prefers-reduced-motion`.

## Restricción

No sacrificar rendimiento o accesibilidad por efectos visuales.



---

# Arquitectura de información

## Mapa principal

```text
/
├── Inicio
├── Servicios
├── Sobre Nosotros
└── Contacto
```

## Inicio

### Secciones sugeridas

1. Header
2. Hero fullscreen
3. Introducción APAG
4. Manifiesto / mensaje institucional
5. Pilares
6. Servicios destacados
7. Galería / scroll horizontal
8. Indicadores de impacto (solo con datos confirmados)
9. CTA institucional
10. Contacto rápido
11. Footer

## Servicios

### Objetivo

Explicar de forma clara qué hace APAG para sus productores y aliados.

### Estructura

1. Hero
2. Introducción
3. Listado de servicios
4. Detalle visual alternado
5. CTA de contacto
6. Footer

Los servicios finales deben ser proporcionados o validados por APAG.

## Sobre Nosotros

### Estructura

1. Hero
2. Quiénes somos
3. Historia
4. Misión
5. Visión
6. Valores
7. Objetivos
8. Timeline opcional
9. CTA
10. Footer

No publicar historia ni fechas sin material oficial.

## Contacto

### Estructura

1. Hero
2. Datos de contacto
3. Formulario
4. Mapa
5. WhatsApp
6. Horario de atención si APAG lo proporciona
7. Footer

## Futuras extensiones

Preparar arquitectura para añadir más adelante:

- Noticias
- Proyectos
- Eventos
- Galería
- Documentos
- Convocatorias
- Aliados
- Productores
- Portal de socios

Estas secciones no forman parte del MVP.



---

# Sistema de diseño — APAG

## Dirección visual

Estética:
- institucional;
- agrícola;
- contemporánea;
- limpia;
- editorial;
- orgánica;
- premium sin perder cercanía.

## Paleta base sugerida

```css
:root {
  --apag-green-950: #063D26;
  --apag-green-900: #075F36;
  --apag-green-800: #08713F;
  --apag-green-700: #168447;
  --apag-green-500: #4D973D;

  --apag-lime-500: #86C23B;
  --apag-lime-300: #B5D95E;

  --apag-yellow-500: #FFE600;
  --apag-yellow-400: #FFEC36;
  --apag-gold-500: #D7CA13;

  --apag-white: #FFFFFF;
  --apag-off-white: #F8FAF5;
  --apag-cream: #F4F1E5;
  --apag-dark: #10251A;
  --apag-text: #24382C;
  --apag-muted: #68776D;
}
```

La paleta debe ajustarse luego de revisar el logo final y comprobar contraste.

## Tipografía

Sugerencia:

### Headings
- Manrope
- alternativa: Plus Jakarta Sans

### Body
- Inter

### Criterios
- títulos grandes;
- tracking levemente negativo;
- textos legibles;
- contrastes claros;
- evitar fuentes decorativas difíciles de leer.

## Escala tipográfica

```css
.hero-title {
  font-size: clamp(3.4rem, 9vw, 9rem);
  line-height: 0.9;
  letter-spacing: -0.055em;
}

.section-title {
  font-size: clamp(2.2rem, 5vw, 5rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
}

.body-lg {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
}
```

## Grid

Desktop:
- 12 columnas

Tablet:
- 6 columnas

Mobile:
- 4 columnas

Container sugerido:

```css
.container {
  width: min(100% - 40px, 1440px);
  margin-inline: auto;
}
```

En mobile puede utilizarse menor gutter.

## Border radius

Usar con moderación:

```css
--radius-sm: 10px;
--radius-md: 18px;
--radius-lg: 28px;
--radius-pill: 999px;
```

## Sombras

Muy suaves. Evitar diseño tipo dashboard.

## Elementos gráficos propios

Inspirados en el logo:

- sol;
- rayos;
- líneas curvas de cultivo;
- formas de campo;
- hojas abstractas;
- círculos;
- curvas topográficas.

## Fotografía

Priorizar imágenes reales de:
- productores;
- campos;
- cultivos;
- actividades;
- capacitaciones;
- Guairá;
- maquinaria;
- trabajo comunitario.

Evitar stock excesivamente artificial.

## Botones

Primario:
- fondo amarillo;
- texto verde oscuro.

Secundario:
- borde claro;
- fondo transparente.

Hover:
- desplazamiento leve;
- icono/flecha animada;
- magnetic effect únicamente desktop.

## Iconografía

Usar Lucide Icons cuando sea necesario.

No sobrecargar de iconos.



---

# Componentes

## Header

Estados:
- transparente sobre hero;
- sólido al hacer scroll;
- menú desktop;
- menú mobile;
- CTA de contacto.

Comportamiento:
- transición suave;
- logo variante clara/oscura;
- accesible con teclado.

## Mobile Menu

Fullscreen.

Debe incluir:
- Inicio;
- Servicios;
- Sobre Nosotros;
- Contacto;
- datos de contacto;
- redes sociales si están disponibles.

Animación:
- overlay;
- links en stagger;
- cierre por ESC;
- bloqueo de scroll;
- focus management.

## Hero

Elementos:
- eyebrow;
- título;
- descripción;
- CTA primario;
- CTA secundario;
- media;
- indicador de scroll.

## Section Heading

Props conceptuales:
- eyebrow;
- title;
- description;
- alignment;
- theme.

## Service Card

Campos:
- número;
- título;
- resumen;
- imagen opcional;
- link/CTA.

## Pillar Card

Campos:
- icono o número;
- título;
- descripción;
- imagen opcional.

## Impact Counter

Solo mostrar cuando existan cifras verificadas.

Campos:
- número;
- sufijo;
- etiqueta.

## Image Reveal

Componente visual reutilizable para fotografías.

## Horizontal Gallery

Desktop:
- pinning;
- scroll horizontal.

Mobile:
- lista vertical o slider táctil.

## CTA Banner

Mensaje institucional + botón.

## Contact Block

- dirección;
- email;
- teléfonos;
- WhatsApp;
- redes.

## Contact Form

Campos iniciales:
- nombre;
- apellido;
- email;
- teléfono;
- asunto;
- mensaje;
- aceptación de política.

## Footer

Bloques:
- marca;
- navegación;
- contacto;
- redes;
- copyright;
- crédito Leo Systems.

## Floating WhatsApp

No usar burbuja invasiva.

Debe integrarse visualmente a la marca.

## Preloader

Solo primera visita y solo si realmente aporta valor.

Máximo aproximado:
- 1 a 1.5 segundos.

## Custom Cursor

Solo:
- desktop;
- `pointer: fine`.

Nunca en touch devices.



---

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



---

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



---

# Guía de contenido

## Regla principal

El contenido institucional debe provenir de APAG.

No inventar datos para “rellenar”.

## Datos disponibles

### Entidad

Asociación de Productores Agrícolas del Guairá — APAG

### Dirección

Juan E. O'Leary casi Carlos Antonio López

### Correo

asociacion.prod.agric.guaira@gmail.com

### Teléfonos

- 0989 148 592
- 0986 156 489

## Información pendiente de APAG

Solicitar:

- historia;
- año de fundación;
- misión;
- visión;
- valores;
- objetivos;
- lista oficial de servicios;
- proyectos;
- cifras de impacto;
- cantidad de productores;
- fotografías;
- integrantes/directiva si desean publicarla;
- redes sociales;
- horario;
- WhatsApp preferido;
- ubicación exacta para mapa;
- lema institucional;
- aliados;
- testimonios si desean usarlos.

## Copy provisional permitido

Puede utilizarse copy conceptual claramente marcado como borrador.

Ejemplos:

### Hero

> Cultivamos futuro.

### Apoyo

> Trabajamos junto a productores para fortalecer el desarrollo agrícola, impulsar oportunidades y construir una comunidad productiva más fuerte.

Debe aprobarse antes de publicación.

## Placeholders

Usar:

`[CONTENIDO PENDIENTE APAG]`

Ejemplo:

```md
## Misión
[CONTENIDO PENDIENTE APAG]
```

## Tono

- claro;
- institucional;
- humano;
- cercano;
- profesional;
- positivo;
- sin exageraciones comerciales.

## Evitar

- “somos los mejores”;
- estadísticas sin fuente;
- promesas absolutas;
- lenguaje político;
- contenido técnico innecesario;
- frases genéricas sin sustancia.

## Fotografías

Cada imagen debe tener:
- propietario/origen claro;
- permiso de uso;
- descripción;
- alt text cuando sea informativa.



---

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



---

# Contacto, formulario y WhatsApp

## Datos institucionales disponibles

Dirección:
Juan E. O'Leary casi Carlos Antonio López

Correo:
asociacion.prod.agric.guaira@gmail.com

Teléfonos:
- 0989 148 592
- 0986 156 489

## WhatsApp

Definir con APAG cuál teléfono se utilizará como WhatsApp principal.

No asumir que ambos números tienen WhatsApp.

## Formulario

Campos:

- Nombre *
- Apellido
- Email *
- Teléfono
- Asunto *
- Mensaje *
- Aceptación de política *

## UX

Estados:
- default;
- focus;
- invalid;
- loading;
- success;
- error.

## Validación frontend

- requeridos;
- email válido;
- longitud mínima;
- trim;
- mensajes legibles.

## Validación backend

Siempre validar y sanitizar nuevamente.

## Antispam

Mínimo:
- honeypot;
- timeout de envío;
- rate limit si existe backend.

CAPTCHA solamente si realmente se necesita.

## Seguridad

Nunca exponer en frontend:
- contraseña SMTP;
- API keys privadas;
- tokens;
- secrets.

## Backend posible

Opciones:
- endpoint PHP;
- función serverless;
- backend del CMS;
- API propia.

La elección depende del hosting y del CMS final.

## Email

Destino inicial:
asociacion.prod.agric.guaira@gmail.com

Confirmar antes de producción.

## Mapa

La ubicación exacta debe ser validada por APAG antes de publicar.

Usar lazy loading para iframe.



---

# QA Checklist

## Resoluciones

Probar al menos:

- 360px
- 390px
- 430px
- 768px
- 1024px
- 1280px
- 1440px
- 1920px

## Navegadores

- Chrome
- Edge
- Firefox
- Safari
- Safari iOS
- Chrome Android

## Dispositivos reales

Mínimo:
- Android;
- iPhone;
- PC Windows.

## Navegación

- todos los links funcionan;
- navegación activa correcta;
- back/forward correctos;
- anchors correctos;
- menú mobile abre/cierra;
- Escape funciona.

## Header

- transición correcta;
- contraste correcto;
- logo correcto según fondo.

## Animaciones

- sin saltos;
- sin layout shifts;
- no se repiten innecesariamente;
- reduced motion funciona;
- mobile no se sobrecarga.

## Formularios

- required;
- email inválido;
- envío correcto;
- doble click prevenido;
- error backend;
- success state;
- spam basic protection.

## SEO

- title;
- meta description;
- canonical;
- OG;
- sitemap;
- robots;
- JSON-LD;
- alt.

## Accesibilidad

- tab order;
- focus;
- contraste;
- labels;
- landmarks;
- heading order;
- skip link;
- keyboard menu.

## Performance

- optimizar imágenes;
- revisar bundle;
- Lighthouse;
- Web Vitals;
- evitar recursos bloqueantes.

## Contenido

- ortografía;
- nombres;
- teléfonos;
- email;
- dirección;
- links externos;
- estadísticas verificadas.

## Producción

- SSL;
- 404;
- redirects;
- analytics si se aprueba;
- formulario real;
- favicon;
- cache.



---

# Despliegue

## Objetivo

El build final debe poder desplegarse en hosting convencional.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Salida esperada:

```text
/dist
```

## Antes de subir

Ejecutar:

```bash
npm run build
```

Luego comprobar localmente el contenido de `dist`.

## Producción

Configurar:
- dominio;
- DNS;
- SSL;
- cache;
- compresión;
- redirects HTTPS;
- página 404;
- headers básicos de seguridad.

## Recomendaciones de headers

Cuando el hosting lo permita:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`
- CSP evaluada con cuidado

No copiar una CSP rígida sin verificar recursos reales.

## Cache

Assets versionados:
- cache larga.

HTML:
- cache moderada/corta según estrategia.

## Formulario

Verificar en producción:
- CORS;
- SMTP/API;
- spam;
- errores;
- logs.

## CMS

Si se integra CMS, documentar aparte:
- URL de administración;
- roles;
- backup;
- actualización;
- credenciales entregadas fuera del repositorio.

## Backups

Antes de cambios importantes:
- backup archivos;
- backup base de datos si existe.

## Entrega

Guardar:
- fuente;
- build;
- documentación;
- credenciales por canal seguro;
- guía de edición de contenido.



---

# Roadmap

## Fase 0 — Preparación

- confirmar contenido;
- recopilar fotografías;
- validar logo;
- validar servicios;
- definir CMS/autoadministración;
- validar WhatsApp principal;
- validar ubicación.

## Fase 1 — Base técnica

- Vite;
- estructura;
- CSS tokens;
- tipografía;
- header;
- mobile menu;
- sistema de breakpoints;
- setup GSAP;
- setup Lenis.

## Fase 2 — Home

- hero;
- intro;
- manifiesto;
- pilares;
- servicios;
- galería;
- CTA;
- footer.

## Fase 3 — Páginas internas

- servicios;
- sobre nosotros;
- contacto.

## Fase 4 — Motion

- text reveal;
- image reveal;
- parallax;
- SVG field path;
- horizontal section;
- magnetic buttons;
- cursor;
- page transitions.

## Fase 5 — CMS / administración

- modelo de datos;
- panel;
- contenido editable;
- imágenes;
- servicios;
- contacto.

## Fase 6 — Formulario

- backend;
- validación;
- antispam;
- correo.

## Fase 7 — SEO / accesibilidad

- metas;
- schema;
- sitemap;
- robots;
- alt;
- keyboard;
- reduced motion.

## Fase 8 — Optimización

- imágenes;
- bundles;
- Web Vitals;
- Lighthouse.

## Fase 9 — QA

- mobile;
- tablet;
- desktop;
- browsers;
- formulario;
- contenido.

## Fase 10 — Producción

- build;
- DNS;
- SSL;
- deploy;
- validación;
- capacitación;
- entrega.



---

# AGENTS.md — Reglas para agentes de IA / Codex

## Contexto

Estás trabajando en el sitio institucional de APAG — Asociación de Productores Agrícolas del Guairá.

Antes de modificar código, leer:
- `00_INDEX.md`
- `01_PROJECT_CONTEXT.md`
- `02_SCOPE_AND_REQUIREMENTS.md`
- `04_DESIGN_SYSTEM.md`
- `07_FRONTEND_ARCHITECTURE.md`

## Reglas críticas

1. No inventar información institucional.
2. No inventar estadísticas.
3. No agregar servicios no aprobados.
4. No cambiar el stack sin una razón documentada.
5. No introducir Bootstrap, Tailwind, jQuery, React o Vue sin aprobación.
6. No sacrificar accesibilidad por animaciones.
7. No sacrificar performance por efectos.
8. Respetar `prefers-reduced-motion`.
9. Mantener responsive real.
10. No almacenar secrets en frontend.

## Arquitectura

Preferir:
- HTML semántico;
- CSS modular;
- JavaScript ES Modules;
- funciones pequeñas;
- componentes reutilizables;
- data attributes para animaciones genéricas.

## Antes de editar

- inspeccionar archivos existentes;
- entender la convención;
- identificar dependencias;
- evitar reescribir módulos completos si no es necesario.

## Después de editar

- verificar consola;
- verificar build;
- verificar layout;
- verificar responsive;
- verificar reduced motion;
- verificar accesibilidad básica.

## Git

Cambios deben ser pequeños y coherentes.

Mensajes sugeridos:

```text
feat: implement APAG hero section
feat: add scroll reveal system
fix: improve mobile navigation focus
perf: optimize gallery images
a11y: add reduced motion handling
```

## Contenido faltante

Usar:

`[CONTENIDO PENDIENTE APAG]`

Nunca “rellenar” con datos imaginarios.

## Calidad visual

La web debe ser:
- elegante;
- natural;
- moderna;
- limpia;
- distintiva.

No convertirla en una demo de animaciones.

## Decisión de UX

Si hay conflicto entre:
- efecto visual;
- lectura;
- velocidad;
- navegación;

priorizar:
1. comprensión;
2. accesibilidad;
3. rendimiento;
4. estética.



---

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



---

# Registro de decisiones

## D-001 — Dirección visual

**Decisión:** diseño institucional agrícola moderno.

**Motivo:** diferenciar APAG de webs institucionales genéricas.

## D-002 — Stack visual

**Decisión:** HTML + CSS + JavaScript + Vite + GSAP + ScrollTrigger + Lenis.

**Motivo:** control total del diseño, excelente rendimiento potencial y animaciones premium sin framework pesado.

## D-003 — No Bootstrap

**Decisión:** no utilizar Bootstrap.

**Motivo:** evitar estética genérica y mantener sistema visual propio.

## D-004 — Motion moderado

**Decisión:** animaciones con intención, no por decoración.

## D-005 — Reduced Motion

**Decisión:** obligatorio.

## D-006 — Contenido

**Decisión:** no inventar datos de APAG.

## D-007 — CMS

**Estado:** pendiente.

El presupuesto requiere autoadministración, por lo que debe definirse la solución antes de cierre del proyecto.

Opciones:
- CMS desacoplado;
- WordPress como backend con theme/custom frontend;
- panel propio.

## D-008 — Horizontal scroll

**Decisión:** máximo una sección principal.

## D-009 — Logo como lenguaje visual

**Decisión:** usar sol y líneas de cultivo como inspiración gráfica y de movimiento.

## D-010 — Responsive

**Decisión:** mobile se diseña como experiencia propia, no como desktop reducido.



---

# Checklist de entrega

## Código

- repositorio actualizado;
- build sin errores;
- documentación incluida;
- `.env.example` sin secretos;
- dependencias limpias.

## Contenido

- textos aprobados;
- fotos aprobadas;
- teléfonos verificados;
- correo verificado;
- dirección verificada;
- WhatsApp verificado;
- redes verificadas.

## Funcional

- Inicio;
- Servicios;
- Sobre Nosotros;
- Contacto;
- formulario;
- mapa;
- WhatsApp;
- menú;
- footer.

## CMS

- acceso entregado;
- editor capacitado;
- editar textos;
- editar imágenes;
- editar servicios;
- editar contacto.

## SEO

- titles;
- descriptions;
- OG;
- schema;
- sitemap;
- robots;
- canonical.

## Accesibilidad

- teclado;
- focus;
- contrastes;
- alt;
- labels;
- reduced motion.

## Performance

- imágenes optimizadas;
- Lighthouse revisado;
- cache;
- compresión;
- Web Vitals razonables.

## Producción

- dominio;
- DNS;
- SSL;
- 404;
- formulario real;
- email real;
- backups.

## Cliente

- capacitación realizada;
- alcance revisado;
- aceptación final;
- inicio de soporte post-entrega.



---

# MASTER PROJECT CONTEXT — APAG

Este archivo resume el proyecto para cargar rápidamente contexto en un agente de IA.

## Proyecto

Sitio Web Institucional de APAG — Asociación de Productores Agrícolas del Guairá.

Desarrollado por Leo Systems.

## Objetivo

Crear un sitio institucional moderno, visualmente fuerte, responsive, accesible, rápido y autoadministrable.

## Páginas

- Inicio
- Servicios
- Sobre Nosotros
- Contacto

## Datos disponibles

Dirección:
Juan E. O'Leary casi Carlos Antonio López

Correo:
asociacion.prod.agric.guaira@gmail.com

Teléfonos:
- 0989 148 592
- 0986 156 489

## Funcionalidades

- responsive;
- formulario;
- mapa;
- WhatsApp;
- redes;
- SEO básico;
- edición de textos;
- edición de imágenes;
- edición de servicios;
- edición de contacto;
- capacitación;
- soporte inicial.

## Stack visual

- HTML5
- CSS moderno
- JavaScript ES Modules
- Vite
- GSAP
- ScrollTrigger
- Lenis
- Lucide

## No usar

- Bootstrap
- Tailwind
- jQuery
- React
- Vue

salvo decisión futura documentada.

## Identidad

Inspirada en el logo:
- verde;
- amarillo;
- sol;
- cultivo;
- campo;
- naturaleza;
- desarrollo.

Concepto creativo:
**Cultivamos futuro.**

## Animaciones

- hero timeline;
- text reveal;
- image reveal;
- parallax;
- horizontal scroll;
- SVG drawing;
- magnetic buttons;
- cursor desktop;
- page transitions;
- reduced motion obligatorio.

## Regla de contenido

No inventar información APAG.

Usar:
`[CONTENIDO PENDIENTE APAG]`

## Regla de UX

Si existe una decisión entre más efectos o mejor experiencia, elegir mejor experiencia.

## CMS

Pendiente definir solución final.

Debe respetar requisito contractual de autoadministración.

## Referencia

https://agricultoresbajocauca.com

Solo como referencia temática/estructural. No copiar.

