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

## D-011 — Primera entrega de desarrollo

**Decisión:** iniciar con base técnica, navegación y portada. Generar bases navegables de las cuatro páginas, manteniendo placeholders en los contenidos institucionales pendientes. El usuario confirmó construir directamente la web.

**Implementación:** Vite 8, HTML multipágina, CSS modular y ES Modules; GSAP/ScrollTrigger, Lenis y Lucide; fuentes locales Manrope e Inter. Header y footer compartidos se expanden a HTML en desarrollo y producción.

**Recursos:** logo entregado en `imagenes/APAG.png`; fotografía de referencia provisional de Unsplash identificada en portada. No se presenta como fotografía de APAG.

**Pendientes:** CMS/autoadministración, contenido oficial, formulario y QA visual. El borrador usa noindex hasta completar aprobación y datos de producción.

## D-012 — Estructura de Inicio y páginas internas

**Decisión:** avanzar en la composición de Inicio y en las páginas internas dentro del frontend existente, sin completar contenidos institucionales con datos inventados.

**Implementación:** manifiesto y pilares conceptuales, espacios de servicios/galería, footer completo, secciones institucionales, contacto directo y mapa pendiente. Datos de contacto centralizados en JSON; expansión a HTML con escape. Disclosures nativos para valores y objetivos; reveals moderados con movimiento reducido.

**Límites:** el CMS y el formulario backend siguen pendientes. El mailto de Contacto abre el cliente de correo; no es un formulario. No se publica un mapa ni WhatsApp sin confirmar sus datos. El navegador integrado sigue sin estar disponible para QA visual.
