# Procedencia de recursos

## Logo
- Original suministrado por el usuario: `imagenes/APAG.png`.
- Copia utilizada por la web: `public/images/logo/apag.png`.
- La identidad no fue redibujada ni modificada.
- `APAG_Project_Documentation/references/apag-logo-reference.jfif` se conserva como referencia anterior.

## Fotografía de portada
- Archivo: `public/images/hero/campo.jpg`.
- Fuente: Unsplash, recurso `photo-1500382017468-9049fed747ef`.
- Descarga: https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=85
- Paisaje de campo al atardecer, usado como referencia visual provisional.
- No representa una ubicación, propiedad ni actividad verificada de APAG. La portada la identifica como imagen de referencia.
- Sustituir por fotografía oficial con autorización antes de la publicación final.

## Fuentes e iconos
- Manrope e Inter mediante paquetes `@fontsource`, servidas localmente y con `font-display: swap`.
- Licencias incluidas en los paquetes correspondientes.
- Lucide mediante paquete `lucide`, solo iconos usados; licencia ISC.

## Motivo gráfico de cultivos
- Archivo: `public/images/graphics/field-lines.svg`.
- Vector original creado en código para este proyecto: curvas geométricas inspiradas en las líneas de cultivo del logo.
- Uso decorativo en el manifiesto de Inicio. No es una fotografía ni representa una parcela real.

## Símbolo del preloader
- SVG inline en `src/partials/preloader.html`, creado en código para APAG.
- Semilla, brote de dos hojas, sol y curvas de cultivo; animación CSS propia.
- No emplea fotografías, imágenes generadas ni recursos externos.

## Imágenes campo2 y campo3
- Originales proporcionados por el usuario: `public/images/hero/campo2.png` y `public/images/hero/campo3.png`.
- `campo2`: cosecha mecanizada entre cultivos, 1672 × 941 px.
- `campo3`: tractor sobre surcos junto a cultivos, 1448 × 1086 px.
- Utilizadas en galería y páginas internas; retiradas de la portada por petición del usuario. No se infiere autor, ubicación, propiedad, cultivo específico ni relación institucional de la actividad con APAG.
- Se conserva el original; las variantes WebP solo cambian tamaño y compresión, sin alterar escenas.

## Variantes para la web
- Directorio: `public/images/optimized/`.
- Fotos en 480, 960 y 1440 px, generadas con Sharp, calidad WebP 82.
- Logo en 132 y 264 px, calidad WebP 90; favicon PNG de 64 px.
- Script reproducible: `npm.cmd run images:optimize`.
- Cada variante conserva la procedencia de su original descrita arriba. Inventario de dimensiones y peso en `docs/IMAGE_OPTIMIZATION.json`.
- La galería, fotos internas y logos usan las variantes; la portada vuelve al JPEG original del atardecer. Los originales se conservan en sus rutas iniciales.

## Fotografías de maquinaria del cliente

- Cuatro archivos suministrados por el usuario en `public/images/hero/`: `Maquinaria.png` (primera imagen, no se encontró `Maquinaria1`), `Maquinaria2.png`, `Maquinaria3.png` y `Maquinaria4.png`.
- El usuario indica que proceden del cliente y fueron mejoradas con ayuda de ChatGPT antes de compartirlas. La procedencia se conserva en este registro interno; por petición del usuario se retiró esa indicación de las leyendas públicas; no se conocen autor, fecha ni lugar exactos.
- Primera imagen: tractor verde de frente, 1254 × 1254 px. Segunda: grupo junto a tractor/rastra, 1254 × 1254 px. Tercera: carga de caña con tractor/remolque, 1448 × 1086 px. Cuarta: maquinaria de cosecha/remolque junto a caña, 1448 × 1086 px. No se identifica a las personas ni se infiere su cargo.
- Variantes `maquinaria1` a `maquinaria4` en `public/images/optimized/`, generadas por el script existente. Anchos solicitados 480/960/1440 px, sin ampliar: las dos primeras tienen máximo real 1254 px aunque la variante se llame `-1440.webp`. El srcset usa el ancho real.
- Uso: álbum «Maquinaria y trabajo de campo» con las cuatro fotos; Maquinaria2 en Sobre APAG, Maquinaria3 en producción orgánica de Inicio, Maquinaria4 en Servicios. Portada y composición de la galería editorial previa conservadas.
- Solo se cambian dimensiones/compresión WebP en esta entrega. No se altera el contenido visual ni se modifican los PNG originales. Versiones originales revisadas como imágenes; composición web pendiente de navegador.

## Caña decorativa de Inicio

Ilustración vectorial original creada en código, integrada en `index.html`. Tallo segmentado, nudos y hojas en verdes de la identidad; sin imágenes externas ni recursos raster adicionales. SVG decorativo sin significado informativo, oculto a tecnologías de asistencia. Movimiento vinculado al scroll con GSAP/ScrollTrigger.
