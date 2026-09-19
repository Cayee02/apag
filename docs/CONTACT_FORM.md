# Formulario de contacto APAG

## Implementación

Contacto incluye nombre obligatorio, apellido opcional, correo obligatorio, teléfono opcional, asunto, mensaje y aceptación de la política de privacidad. El diseño conserva verde/amarillo y se adapta a una o dos columnas según ancho.

PHP valida siempre los campos, incluso si falla JavaScript. El formulario funciona con POST normal y redirección después del éxito; JavaScript añade validación, estado de envío, mensajes sin recargar y foco en el campo inválido. Si falla el envío conserva la consulta en el formulario, sin guardarla en una base de datos ni en el panel.

Los mensajes se envían con PHPMailer 7.1.1 por SMTP. El remitente es una dirección autorizada del hosting; el correo del visitante se usa únicamente en Reply-To. El mensaje es texto plano y contiene consulta, contacto, fecha UTC, referencia y versión de política aceptada. Solo se muestra éxito cuando SMTP confirma la aceptación; esto no garantiza llegada a la bandeja de entrada.

## Estado de activación

El usuario eligió **correo del hosting**. El 19 de septiembre de 2026 confirmó la cuenta `contactos@apag-py.com`, servidor `mail.apag-py.com`, SMTP 465 con autenticación y SMTPS (`ssl`). **La política está aprobada/publicada en el CMS local**. Falta guardar la contraseña directamente en la configuración privada de producción y comprobar una entrega real. Las pruebas no enviaron correo externo; teléfonos/correo directo siguen disponibles.

El destino inicial usa el correo institucional del panel: `asociacion.prod.agric.guaira@gmail.com`. Confirmarlo antes de producción. `mail_to` permite un destino fijo privado independiente del correo visible.

## Configurar el correo del hosting

Instalar dependencias PHP en el proyecto:

```sh
composer install --no-dev --prefer-dist --no-interaction
```

La versión queda fijada en `composer.lock`. Referencias: [PHPMailer](https://github.com/PHPMailer/PHPMailer), [instalación reproducible con Composer](https://getcomposer.org/doc/01-basic-usage.md#installing-from-composer-lock).

Para desarrollo, copiar `server/config.example.php` a `server/config.local.php` y completar con los datos suministrados por el hosting. El archivo local está ignorado por Git y excluido del paquete generado; no compartir contraseñas por chat ni incluirlas en HTML.

| Configuración privada | Variable del proceso PHP | Valor requerido |
| --- | --- | --- |
| `smtp_host` | `APAG_SMTP_HOST` | Servidor indicado por el hosting |
| `smtp_port` | `APAG_SMTP_PORT` | Puerto indicado por el hosting |
| `smtp_encryption` | `APAG_SMTP_ENCRYPTION` | `tls` para STARTTLS o `ssl` para SMTPS |
| `smtp_username` | `APAG_SMTP_USERNAME` | Cuenta SMTP del hosting |
| `smtp_password` | `APAG_SMTP_PASSWORD` | Contraseña de esa cuenta |
| `mail_from` | `APAG_MAIL_FROM` | Dirección autorizada por el hosting |
| `mail_from_name` | `APAG_MAIL_FROM_NAME` | `APAG` por defecto |
| `mail_to` | `APAG_MAIL_TO` | Vacío usa el correo institucional del panel |

Los valores no vacíos del entorno PHP tienen prioridad sobre el archivo privado. En producción configurar variables del proceso o colocar `config.local.php` junto al código privado en `app/`; también puede definirse `APAG_MAIL_CONFIG` con una ruta a un archivo PHP de configuración fuera de la raíz pública. `.env` de Vite no es cargado por PHP. No utilizar variables `VITE_` para credenciales.

Puertos habituales: 587 con `tls`, 465 con `ssl`; utilizar los valores reales del hosting. Se mantiene verificación de certificados TLS, sin deshabilitarla. SMTP externo requiere cifrado y autenticación. `none` solamente se admite para pruebas en loopback; no se configura en el hosting. PHP necesita OpenSSL para TLS.

Con el servidor local activo, el archivo privado se lee en cada request; cambios en variables de entorno requieren reiniciar el proceso. `npm.cmd run dev:php` compila y sirve web/panel en http://127.0.0.1:8080/.

## Política y consentimiento

En `/admin?section=privacy`, cargar el texto aprobado por APAG y marcar «Publicar este texto revisado y aprobado por APAG». Guardar sin marcar conserva un borrador privado: visitantes siguen viendo el placeholder, y el formulario continúa sin habilitarse. No se permite publicar el placeholder como política aprobada.

La página `privacidad.html` está enlazada desde el formulario y footer. Su texto/aprobación reside en el CMS guardado, no en los valores iniciales del paquete. La revisión y aprobación institucional del contenido corresponde a APAG.

Cada formulario contiene la versión del título/texto de política, vinculada al token de envío. Si cambia antes del envío, el backend rechaza esa aceptación y solicita leer/aceptar la nueva versión. Cambiar otros datos del sitio no invalida la política.

## Protección e integridad

- Sesión pública independiente del administrador, cookies HttpOnly/SameSite Strict y Secure con HTTPS; formularios y respuestas JSON sin caché.
- CSRF y token de envío por formulario; token válido hasta 30 minutos, mínimo 2 segundos antes de enviar.
- Honeypot fuera del foco y del árbol accesible.
- Una reserva de envío por IP cada 60 segundos y hasta cinco reservas en 15 minutos; los fallos SMTP también consumen reserva. La IP se almacena como HMAC con clave privada, no en texto claro. No se confía en cabeceras de IP enviadas por clientes.
- Un token cuyo envío ya fue confirmado no vuelve a invocar SMTP. Se conserva estado temporal y fingerprint HMAC para diferenciar un reintento de una consulta modificada. Hay hasta diez tokens por sesión y se conservan estados hasta una hora; esto no garantiza entrega exactamente una vez ante un fallo ambiguo del propio SMTP.
- Campos limitados y UTF-8 validado, rechazo de inyección de cabeceras, correo válido y consentimiento requerido. Mensaje entre 20 y 4000 caracteres, asunto entre 3 y 160.
- Texto escapado en errores HTML; límite de solicitud de 32 KiB y sin adjuntos. Credenciales y diagnósticos SMTP no se devuelven al visitante.

El servidor no guarda el texto de consultas ni una bandeja de mensajes. Guarda tokens/fingerprints temporales, versión de política, contadores antispam y clave privada de HMAC en `storage/`. La consulta llega al correo del destinatario; su conservación corresponde a la configuración y política aprobada por APAG. Los logs de fallo contienen solamente una referencia técnica, sin datos enviados ni contraseña/respuesta SMTP.

El antispam usa `REMOTE_ADDR`. Si el hosting está detrás de un proxy, configurar el servidor para informar una IP confiable antes de ajustar límites; de lo contrario varios visitantes pueden compartir el límite. No se añade CAPTCHA en esta entrega.

## Rutas y pruebas

`GET/POST contacto.html` atiende HTML y el recorrido sin JavaScript. `GET/POST api/contacto` entrega estado/tokens o resultado JSON para la mejora JS. Sin CORS abierto. El proxy de Vite reenvía API, privacidad y assets compilados al PHP local para la vista de desarrollo; PHP sigue siendo el entorno de prueba completo.

```sh
npm.cmd run build
npm.cmd run check
npm.cmd run check:php
npm.cmd run check:contact
npm.cmd run build:php
```

Las pruebas del formulario usan SMTP real en loopback con direcciones `example.test`, cuentas, configuración y almacenamiento temporales aislados. No usan credenciales reales ni modifican la política real. Verifican SMTP, Reply-To, contenido, validación, CSRF, honeypot, tiempo, límites, duplicados, cambio de política, HTML sin JS, error SMTP sin detalles privados y subdirectorio.

El paquete incluye Composer/vendor en el código privado, pero excluye configuración local y datos/cuenta del sitio. Falta probar el SMTP del hosting, dominio, TLS, recepción en bandeja, política real y apariencia/interacción en navegador. El navegador integrado no está disponible; no se certificó QA visual ni cumplimiento WCAG completo.
