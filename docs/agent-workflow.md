# Agent Workflow — El Líder E-commerce

## Objetivo

Este documento define cómo debe trabajar el agente o desarrollador al modificar el proyecto El Líder E-commerce.

La prioridad es avanzar rápido, pero sin romper la arquitectura existente ni agregar código desordenado.

## Reglas generales

Antes de modificar código:

- Revisar la estructura actual del proyecto.
- No inventar archivos si ya existe uno equivalente.
- Mantener la arquitectura modular.
- No romper endpoints existentes.
- Revisar Prisma schema antes de tocar services o controllers.
- Actualizar Swagger si se crea o modifica un endpoint.
- Agregar tests para lógica crítica nueva.
- Mantener TypeScript estricto.
- Evitar duplicar tipos innecesariamente.
- No hardcodear datos que deben venir desde backend.
- No confiar en datos sensibles enviados desde frontend.

## Backend

Cada módulo backend debe mantener una estructura clara.

Cuando se modifique o cree un endpoint:

- Revisar route.
- Revisar controller.
- Revisar service.
- Revisar validaciones.
- Revisar Prisma model.
- Revisar permisos.
- Revisar Swagger.
- Revisar tests.

## Reglas backend obligatorias

- Toda ruta privada debe usar middleware de autenticación.
- Toda ruta admin debe usar middleware de rol admin.
- Los precios se calculan siempre en backend.
- El frontend nunca define el total final de una compra.
- El checkout debe validar stock antes de crear una orden.
- El pago debe asociarse siempre a una orden.
- Los errores deben tener formato consistente.
- Las variables sensibles deben venir desde `.env`.

## Frontend

Cuando se modifique o cree una pantalla:

- Usar componentes reutilizables.
- Usar React Query para llamadas API.
- Mostrar loading state.
- Mostrar error state.
- Mostrar empty state.
- Mantener diseño mobile first.
- Proteger rutas privadas.
- Proteger rutas admin.
- Evitar lógica de negocio sensible en frontend.

## Reglas frontend obligatorias

- El catálogo público debe funcionar sin login.
- El carrito debe funcionar sin login.
- El usuario puede comprar como invitado.
- Las rutas `/mi-cuenta/*` requieren usuario autenticado.
- Las rutas `/admin/*` requieren usuario admin.
- El token no debe usarse para mostrar permisos sin validar también en backend.

## Swagger

Cada endpoint nuevo o modificado debe documentar:

- Método HTTP.
- URL.
- Descripción.
- Body esperado.
- Parámetros.
- Respuesta exitosa.
- Errores posibles.
- Si requiere autenticación.
- Si requiere rol admin.

## Tests

Flujos críticos que deben tener tests:

- Registro.
- Login.
- Middleware de roles.
- Catálogo.
- Carrito.
- Checkout.
- Órdenes.
- Pagos.
- Webhook de Mercado Pago.
- Rutas admin.
- Cálculo de totales.
- Cálculo de envío.

## Flujo recomendado por cambio

Para cada mejora grande:

1. Revisar OpenSpec.
2. Revisar archivos actuales.
3. Implementar backend.
4. Documentar Swagger.
5. Implementar frontend.
6. Agregar tests.
7. Ejecutar pruebas.
8. Validar manualmente.
9. Actualizar tasks de OpenSpec.

## Prioridad actual

El primer cambio activo es:

`fix-encoding-and-project-baseline`

Objetivo:

- Corregir textos rotos.
- Validar estado real del proyecto.
- Revisar backend.
- Revisar frontend.
- Confirmar que Swagger y healthcheck funcionan.
