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
