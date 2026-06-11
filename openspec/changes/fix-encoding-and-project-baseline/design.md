# Design: fix-encoding-and-project-baseline

## Context

El proyecto ya tiene backend, frontend, Prisma schema, Swagger y páginas públicas. Sin embargo, existen textos con caracteres rotos y todavía hay interacciones frontend que parecen estar incompletas.

Antes de sumar funcionalidades nuevas, se necesita validar el estado real de la app.

## Technical approach

### 1. Encoding

Se revisarán:

- Archivos `.tsx`.
- Archivos `.ts`.
- Seeds.
- Textos hardcodeados.
- Respuestas de API.
- Datos guardados en base de datos.

El objetivo es asegurar que todo esté en UTF-8.

Ejemplos a corregir:

- `CategorÃ­as` debe ser `Categorías`.
- `ReposterÃ­a` debe ser `Repostería`.
- `Iniciar SesiÃ³n` debe ser `Iniciar Sesión`.

### 2. Backend baseline

Se validará:

- Arranque de Express.
- Conexión con PostgreSQL.
- Prisma Client.
- Healthcheck.
- Swagger.
- Endpoints principales.
- Seeds.
- Variables de entorno.
- Scripts disponibles en `package.json`.

### 3. Frontend baseline

Se validará:

- Arranque de Vite.
- Rutas públicas.
- Home.
- Productos.
- Categorías.
- Ofertas.
- Más vendidos.
- Login.
- Registro.
- Carrito.
- Consumo real de API.
- Errores de consola.
- Textos visibles.

### 4. Documentation baseline

Se documentará:

- Qué endpoints existen.
- Qué endpoints faltan.
- Qué páginas existen.
- Qué páginas están conectadas.
- Qué páginas son estáticas.
- Qué módulos están pendientes.

## Risks

- Los textos rotos pueden venir desde la base de datos y no solo desde el código.
- Los seeds podrían estar mal codificados.
- Puede haber inconsistencias entre frontend y backend.
- Puede haber endpoints documentados en Swagger pero no usados por el frontend.
- Puede haber vistas frontend creadas pero no conectadas a API.

## Decisions

- No se agregará funcionalidad nueva hasta dejar limpia la base.
- Se mantendrá el stack actual.
- Se documentará el estado real encontrado.
- Las correcciones deben ser mínimas y seguras.
- No se refactorizará de más en este primer cambio.
