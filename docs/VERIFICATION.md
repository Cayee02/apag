# Verificación de la primera entrega

Fecha: 17 de septiembre de 2026.

## Comprobaciones realizadas
- `npm.cmd run build`: correcto con Vite 8.3.0; cuatro entradas HTML generadas en `dist/`.
- `npm.cmd run check`: correcto; enlaces y recursos locales existentes, plantillas compartidas resueltas, un H1 por página, navegación activa, destino del skip link y noindex del borrador.
- Servidor Vite: HTTP 200 para Inicio, Servicios, Sobre nosotros, Contacto, logo, fotografía y módulo principal.
- Contrato de diseño conservado como comentario en el HTML compilado.
- Instalación de dependencias: auditoría npm sin vulnerabilidades reportadas en la instalación.

## Revisión independiente de código
Una revisión estática encontró dos detalles de foco: contraste sobre el encabezado oscuro y foco hacia el botón de menú oculto tras pasar a escritorio. Ambos se corrigieron y el revisor los calificó como resueltos. El salto al contenido mueve el foco de forma explícita para conservarlo con el scroll mejorado.

## Alcance de la evidencia
No se pudieron realizar capturas ni pruebas de interacción: el navegador integrado no estaba disponible y la lista de navegadores fue vacía. El diseño responsive y la preferencia de movimiento reducido están implementados, pero su comportamiento real requiere QA en navegador.

No se certifica cumplimiento completo WCAG, métricas Lighthouse, ausencia de errores de consola ni apariencia visual en dispositivos reales. La revisión independiente fue estática y el segundo dictamen se limitó a las dos correcciones indicadas.

El servidor de desarrollo queda en http://127.0.0.1:5173/ durante esta sesión. Si se detiene, reiniciar con `npm.cmd run dev`.

## Segunda entrega
La estructura de Inicio y las páginas internas pasan `npm.cmd run build`. Las comprobaciones agregadas verifican también IDs únicos, destinos de anclajes y referencias aria-labelledby/aria-controls. Los nuevos recursos son locales y el SVG decorativo está incluido en el build.

La revisión independiente mencionada arriba corresponde a la primera entrega. La segunda entrega se revisó desde el código; todavía no se verificó la apariencia ni la interacción real en navegador, ya que la lista de navegadores integrados continúa vacía.
