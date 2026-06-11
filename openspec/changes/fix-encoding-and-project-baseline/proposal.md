# Change: fix-encoding-and-project-baseline

## Summary

Corregir problemas de encoding, validar el estado actual del backend/frontend y dejar una base limpia para continuar el desarrollo del e-commerce.

## Motivation

La app muestra textos rotos como `CategorÃ­as`, `ReposterÃ­a` e `Iniciar SesiÃ³n`.

Antes de avanzar con carrito, checkout, pagos y panel admin, se necesita estabilizar el proyecto para evitar construir funcionalidades nuevas sobre una base con errores visibles o inconsistencias.

## Scope

Este cambio incluye:

- Corregir encoding UTF-8.
- Revisar seeds.
- Revisar textos hardcodeados.
- Revisar respuestas de API.
- Validar que backend y frontend levanten correctamente.
- Revisar healthcheck.
- Revisar Swagger actual.
- Documentar el estado real del proyecto.
- Detectar endpoints existentes.
- Detectar módulos incompletos.

## Out of Scope

Este cambio no incluye:

- Implementar carrito real.
- Implementar checkout.
- Implementar Mercado Pago.
- Implementar panel admin.
- Implementar perfil de usuario.
- Agregar nuevas funcionalidades comerciales.

## Acceptance Criteria

- No aparecen textos con caracteres rotos.
- Backend levanta sin errores.
- Frontend levanta sin errores.
- Swagger abre correctamente.
- Healthcheck responde correctamente.
- Catálogo actual sigue funcionando.
- Se documenta el estado real del proyecto.
- Se identifican los próximos cambios necesarios.
