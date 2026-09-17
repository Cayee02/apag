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
