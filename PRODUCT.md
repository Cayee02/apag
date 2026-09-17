# APAG

## Platform
web

## Stack
HTML5, CSS modular, JavaScript ES Modules, Vite, GSAP, ScrollTrigger, Lenis y Lucide. Definido en la documentación del proyecto. Sin frameworks UI.

Autoadministración mediante PHP nativo 8.2+ y almacenamiento JSON privado, seleccionada expresamente por el usuario. Sin WordPress ni base de datos en este MVP.

Formulario PHP con PHPMailer/Composer para SMTP del hosting, validación y antispam. Política de privacidad editable en el panel; su texto aprobado sigue pendiente por indicación del usuario.

## Users
Productores e interesados que buscan conocer APAG y contactar con la asociación.

## Product Purpose
Presencia institucional de la Asociación de Productores Agrícolas del Guairá, desarrollada por Leo Systems.

## Capabilities and Constraints
Cinco páginas principales: Inicio, Servicios, Sobre Nosotros, Galería y Contacto, más privacidad y 404 auxiliares. Desarrollo por fases. Base técnica, navegación, estructura de Inicio y páginas internas implementadas. Los contenidos institucionales pendientes están identificados; no se consideran aprobados ni completos. Panel PHP implementado para textos principales, imágenes, álbumes, servicios, contacto y política, con un rol administrador. Formulario desarrollado y probado con SMTP local. Activación de la cuenta real, SMTP del hosting, política aprobada, capacitación, QA visual y publicación pendientes.

## Brand Commitments
Logo suministrado en imagenes/APAG.png. Identidad verde y amarilla, agrícola, editorial, institucional y cercana. Hero suministrado: «Cultivamos producción. Fortalecemos productores. Construimos futuro.»; frase institucional «Juntos cultivamos oportunidades.». Contenido propuesto sujeto a revisión final de APAG.

Preferencia visual confirmada: portada con una sola foto, el atardecer original. Conservar la galería fotográfica actual; el usuario aprobó su composición. El carrusel de portada se retiró por petición expresa.

## Evidence on Hand
Documentación en APAG_Project_Documentation y APAG_Documentacion_Completa.md. Dirección, dos teléfonos, correo institucional y mapa de la oficina confirmados. Texto institucional propuesto suministrado y cargado: presentación, propósito, caña orgánica, capacitación, ocho servicios, estándares de referencia, comercio justo, venta conjunta, articulación y financiamiento. Misión/visión identificadas como propuestas hasta aprobación. No se inventan estadísticas, fechas históricas ni certificados vigentes. Redes y WhatsApp principal pendientes.

El usuario suministró `public/images/hero/campo2.png` y `campo3.png` para la composición visual. Se usan con descripciones del contenido visible, sin atribuir una ubicación o actividad oficial a APAG.

Cuatro fotografías adicionales del cliente (`Maquinaria.png`, `Maquinaria2.png`, `Maquinaria3.png`, `Maquinaria4.png`), mejoradas con ayuda de ChatGPT según el usuario. Integradas en álbum/páginas con captions de procedencia y variantes WebP, sin alterar originales ni identificar a las personas. No se cambia la foto de portada aprobada.

Por petición del usuario, los álbumes con fotografías ampliables están en la página independiente Galería, accesible desde los menús. El panel PHP permite añadir álbumes/fotos, textos, orden y retirada. Inicio conserva sus tres fotos editoriales y el cierre de contacto con más espacio, que reemplaza los dos CTA consecutivos. La página Galería y el nuevo cierre requieren QA visual.

## Accessibility & Inclusion
Navegación por teclado, foco visible, gestión del foco del menú, contenido esencial sin JavaScript y prefers-reduced-motion. Objetivo WCAG 2.2 AA.
