# Revisión antes del deploy — APAG

Fecha: 18 de septiembre de 2026. Destino: `https://apag-py.com/`, SiteGround.

## Resultado

El proyecto está preparado para instalar una versión de revisión en SiteGround. La compilación y las comprobaciones locales no mostraron fallos bloqueantes. La entrega pública con todas sus funciones requiere configurar SMTP, trasladar los datos privados, validar el hosting y realizar QA visual. No se ha comprobado el servidor real ni publicado el proyecto durante esta revisión.

## Estado comprobado del contenido local

Snapshot de `storage/content.json`, revisión 17:

- Cuenta administrativa local existente, sin revelar ni modificar credenciales.
- Privacidad marcada como aprobada; texto de 3782 caracteres, sin placeholder.
- Misión y visión marcadas como aprobadas en el panel.
- Ocho servicios, dos álbumes y siete fotografías de álbumes.
- Cuatro espacios de imágenes con ediciones guardadas; seis archivos en `storage/media/`.
- Veinticuatro rutas distintas de fotografías referenciadas en el JSON, ninguna faltante en almacenamiento/build.
- Sin la leyenda «Imagen mejorada con IA» en el contenido guardado.

HTTP del sitio PHP local: Inicio, Servicios, Sobre APAG, Galería, Contacto y Privacidad responden 200; no contienen placeholders ni rótulos de misión/visión pendientes. Todas conservan noindex por la configuración de revisión. La API informa `ready=false`: no hay archivo SMTP local ni variables SMTP de host/contraseña en el entorno auditado.

La aprobación registrada en el panel se conserva. No se hizo una nueva revisión jurídica de la política ni se cambió su texto.

## Comprobaciones ejecutadas

| Comprobación | Resultado |
| --- | --- |
| `npm.cmd run build:php` | Aprobado: frontend y paquete PHP completos |
| `npm.cmd run check` | Aprobado: siete HTML, recursos/enlaces/ARIA, preloader, SEO y accesibilidad estática |
| `npm.cmd run check:php` | Aprobado: autenticación, CSRF, edición, conflictos, backups, fotos/álbumes, contraseña y 404/subcarpeta |
| `npm.cmd run check:contact` | Aprobado: validación, políticas/tokens, antispam, SMTP local, reintentos y flujo sin JS |
| `npm.cmd run check:package` | Aprobado: paquete instalado como public_html, CMS/assets, rutas públicas/privadas y storage aislado |
| `npm.cmd audit --omit=dev --json` | Cero vulnerabilidades conocidas reportadas en dependencias npm de producción |
| `composer audit --locked --no-dev --format=json` | Sin avisos de vulnerabilidad ni paquetes abandonados reportados |

Las consultas de dependencias se completaron después de habilitar acceso de red autorizado. No equivalen a una auditoría de seguridad integral. Las pruebas PHP/formulario/paquete utilizan datos temporales; no modifican cuenta, contenido o media reales y no envían correo externo.

## Pendientes para el deploy y la entrega

| Prioridad | Pendiente | Criterio de cierre |
| --- | --- | --- |
| Antes de subir | Respaldar y trasladar `content.json`, cuenta elegida y `media/` | En hosting aparecen las ediciones, aprobaciones y fotos locales; almacenamiento fuera de public_html |
| Antes de habilitar contacto | Crear/confirmar correo SiteGround y configurar SMTP privado | El formulario se habilita y una consulta real llega a la bandeja confirmada con Reply-To correcto |
| En instalación | Configurar PHP/extensiones, permisos y rutas public_html/app/storage | Login, edición, subidas, privacidad y assets funcionan por PHP |
| En instalación | Validar rewrite y caché SiteGround | Las rutas HTML pasan por PHP; cambios del panel se ven en sesión privada sin recompilar; panel/formulario sin caché |
| En instalación | DNS, certificado, HTTPS y redirección www | Dominio resuelve al servidor correcto, TLS válido y sin bucles ni contenido mixto |
| Antes de salida pública | QA móvil/tablet/escritorio y navegadores | Menú, visor, formulario, animaciones, zoom, foco y teclado revisados en navegador real |
| Antes de salida pública | Medir Lighthouse/Web Vitals y revisar los resultados | Mediciones registradas y problemas materiales corregidos; no se atribuyen puntuaciones sin medir |
| Para aparecer en buscadores | Activar APAG_INDEXABLE tras aprobación y subir nuevo build | Páginas principales index/follow, canonical/sitemap del dominio real y Search Console configurado |
| Para cerrar alcance/entrega | Confirmar WhatsApp/redes y aceptación final de contenido/fotos | Enlaces reales incorporados cuando se entreguen; información aceptada por APAG |
| Para entrega operativa | Respaldo/restauración, capacitación y accesos | Copia privada recuperable, editor capacitado y responsables de correo/dominio/mantenimiento definidos |

No recrear ni resetear automáticamente la cuenta existente. Puede migrarse su `admin.json` privado o crear deliberadamente una cuenta de producción nueva siguiendo la guía. El paquete no contiene estos datos por diseño. Sin trasladar `content.json`, el hosting vuelve a los valores iniciales, con política pendiente y misión/visión como propuestas, y no recupera las fotos subidas.

## Revisión visual y mejoras restantes

El navegador integrado reporta «No browser is available» y lista vacía. No se hicieron screenshots, pruebas de dispositivos ni Lighthouse. Las validaciones estáticas de idioma, alt, labels, contraste de paleta y referencias ARIA no sustituyen una comprobación con teclado/lector de pantalla ni certifican WCAG completo.

Transiciones entre páginas siguen sin implementar; cursor y sección horizontal permanecen diferidos para conservar la composición. Son trabajo visual restante y no impiden instalar el sitio PHP. PostalAddress en JSON-LD, mencionado en el brief cuando hubiera dirección confirmada, aún no está implementado; Organization/WebSite y contacto sí están presentes. La limpieza de variantes de fotos retiradas es una tarea de mantenimiento, conservadas actualmente para respaldos.

Se copian también PNG originales de campo/maquinaria al paquete aunque las páginas usan WebP optimizados. No bloquean el funcionamiento ni se cargan por las páginas por ese hecho, pero puede reducirse el tamaño de futuras entregas conservando los originales en un archivo privado.

## Orden recomendado

1. Respaldar los datos y preparar la copia de contenido/cuenta/media.
2. Instalar el paquete en SiteGround siguiendo [guia_deploy.md](../guia_deploy.md).
3. Configurar PHP, caché, DNS y HTTPS; comprobar el CMS desde una sesión privada.
4. Configurar SMTP y probar llegada real utilizando la política ya aprobada/migrada.
5. Completar QA visual y mediciones; confirmar información pendiente con APAG.
6. Activar indexación, validar sitemap/Search Console y entregar capacitación/respaldo.

Roadmap actualizado: [ROADMAP_STATUS.md](ROADMAP_STATUS.md). Este informe registra el estado local observado en la fecha indicada; debe volver a comprobarse si cambia el contenido o se modifica el servidor.
