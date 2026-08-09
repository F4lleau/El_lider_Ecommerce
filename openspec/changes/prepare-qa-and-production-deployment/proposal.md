# Change: prepare-qa-and-production-deployment

## Summary

Preparar el proyecto para deploy en ambiente QA y dejar documentado el camino a producción, incluyendo diagnóstico técnico, variables de entorno, configuración de frontend/backend/base de datos, checklist de validación, URLs públicas y guía para compartir el enlace de prueba con el cliente.

## Motivation

La aplicación ya tiene un MVP avanzado de ecommerce: catálogo público, auth, carrito, checkout, pagos, tracking, panel admin y zona privada de usuario.

Ahora se necesita pasar de desarrollo local a un ambiente QA accesible por URL pública para que el cliente pueda probar la app y enviar correcciones antes de producción.

La persona responsable del proyecto no tiene servidores propios y necesita una solución simple, preferentemente gratuita, con pasos documentados.

## Scope

Este cambio incluye:

- Diagnóstico del estado actual antes de deploy.
- Checklist anti-bugs desde rama `develop`.
- Preparación de variables de entorno para QA.
- Preparación de variables de entorno para producción.
- Documentación de deploy frontend.
- Documentación de deploy backend.
- Documentación de base PostgreSQL QA y producción.
- Configuración esperada de CORS.
- Configuración esperada de URLs públicas.
- Configuración esperada de Mercado Pago para QA.
- Estrategia inicial para Vercel, Render y Neon.
- Documentación para compartir link QA al cliente.
- Validación de build, tests, Swagger y healthcheck.
- Crear `docs/deployment-guide.md`.
- Crear `docs/qa-checklist.md`.
- Crear `current-state.md`.

## Out of Scope

Este cambio no incluye:

- Comprar dominio.
- Configurar DNS real.
- Configurar servidor propio.
- Dockerizar si no es necesario.
- CI/CD avanzado con GitHub Actions.
- Monitoreo avanzado.
- Backups automáticos avanzados.
- Emails reales.
- WhatsApp.
- Nuevas funcionalidades de negocio.
- Cambios visuales grandes.

## Acceptance Criteria

- Existe una guía clara para desplegar QA.
- Existe una guía clara para preparar producción.
- Está documentado qué variables van en frontend y backend.
- Está documentado que frontend no lleva secretos.
- Está documentado cómo crear una base QA separada.
- Está documentado cómo configurar Render para backend QA.
- Está documentado cómo configurar Vercel para frontend QA.
- Está documentado cómo configurar Neon para PostgreSQL QA.
- Está documentado cómo configurar URLs de Mercado Pago en QA.
- Existe checklist manual para validar QA.
- Existe texto sugerido para enviar al cliente con el link de QA.
- Build frontend pasa.
- Build backend pasa.
- Tests críticos pasan o quedan documentadas limitaciones.
- Swagger responde HTTP 200.
- Healthcheck responde HTTP 200.