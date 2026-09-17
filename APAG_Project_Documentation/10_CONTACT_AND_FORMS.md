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
