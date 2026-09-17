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
