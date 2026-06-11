# Current State: add-role-based-auth

## Resultado

El change quedó implementado sobre la arquitectura existente. El catálogo continúa público y la autenticación protege únicamente las rutas privadas y administrativas.

## Backend

- Registro y login reales mediante bcrypt y JWT.
- El JWT contiene `sub`, `email` y `role`.
- Roles Prisma migrados de `ADMIN/CUSTOMER` a `ADMIN/USER`.
- `GET /api/auth/me` devuelve el usuario autenticado sin `passwordHash`.
- `requireAuth` valida JWT y consulta el usuario actual en base de datos.
- `requireRole(...roles)` responde `403` cuando el rol no está autorizado.
- Usuarios, carrito y órdenes usan `requireAuth`.
- Swagger documenta register, login, me, Bearer auth y errores principales.
- `npm run admin:create` crea o actualiza el admin inicial usando `ADMIN_EMAIL` y `ADMIN_PASSWORD`.

## Frontend

- Login y registro consumen la API real.
- La sesión se guarda en `localStorage` para el MVP y se revalida con `/api/auth/me`.
- Existe logout.
- `ProtectedRoute` protege `/mi-cuenta`.
- `AdminRoute` protege `/admin` y `/admin/dashboard`.
- Un visitante es redirigido a `/login`.
- Un usuario `USER` que intenta entrar a admin es redirigido a `/acceso-denegado`.
- El dashboard agregado es únicamente una pantalla mínima para validar acceso; el panel admin completo queda fuera de alcance.

## Tests y validación

- Migración Prisma aplicada correctamente.
- Backend build: exitoso.
- Frontend build: exitoso.
- Tests backend: 6 exitosos.
- El lint frontend mantiene 15 errores preexistentes fuera del alcance de este change.

## Operación

Para crear el admin inicial:

```powershell
$env:ADMIN_EMAIL="admin@ellider.com"
$env:ADMIN_PASSWORD="una-clave-segura"
npm run admin:create
```

El comando debe ejecutarse desde `backend`.
