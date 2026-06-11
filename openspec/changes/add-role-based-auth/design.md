# Design: add-role-based-auth

## Context

El proyecto ya cuenta con backend Node/Express + TypeScript, Prisma, PostgreSQL y frontend React + Vite + TypeScript.

La app necesita permitir navegación pública, pero proteger áreas privadas:

- `/mi-cuenta/*` para usuarios autenticados.
- `/admin/*` solo para administradores.

El checkout podrá funcionar sin login, por lo tanto auth no debe bloquear catálogo, carrito público ni checkout invitado.

## Technical approach

### 1. Backend auth

Se revisará primero si ya existen módulos de autenticación.

Si existen, se adaptarán.

Si están incompletos, se completarán con:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### 2. User model

El modelo `User` debe soportar roles.

Rol esperado:

```ts
enum Role {
  ADMIN
  USER
}

El token debe incluir información mínima:

{
  sub: user.id,
  email: user.email,
  role: user.role
}

No debe incluir información sensible.

3. JWT

El token debe incluir información mínima:

{
  sub: user.id,
  email: user.email,
  role: user.role
}

No debe incluir información sensible.

4. Password

Las contraseñas deben almacenarse hasheadas.

Se usará bcrypt o la librería ya instalada en el proyecto.

5. Middlewares

Se necesitan dos middlewares:

requireAuth
requireRole("ADMIN")

requireAuth debe:

Leer header Authorization Bearer.
Validar token.
Buscar o adjuntar usuario.
Rechazar si el token es inválido.

requireRole debe:

Validar que exista usuario autenticado.
Validar que tenga el rol requerido.
Rechazar con 403 si no corresponde.
6. Frontend auth

El frontend necesita:

Servicio de auth.
Store/context de sesión.
Guardar token.
Obtener usuario actual.
Logout.
ProtectedRoute.
AdminRoute.
7. Redirecciones

Reglas sugeridas:

Login exitoso admin redirige a /admin/dashboard.
Login exitoso user redirige a /mi-cuenta o a la página anterior.
Usuario sin token que entra a /mi-cuenta redirige a /login.
Usuario sin token que entra a /admin redirige a /login.
Usuario con rol user que entra a /admin muestra acceso denegado o redirige.
8. Swagger

Documentar:

Register.
Login.
Me.
Errores 400, 401 y 403.
Bearer auth.
9. Tests

Tests mínimos backend:

Registro exitoso.
Registro con email duplicado.
Login exitoso.
Login con contraseña incorrecta.
/auth/me sin token.
/auth/me con token válido.
Ruta admin con usuario común.
Ruta admin con admin.
Risks
Puede existir un modelo de roles distinto al esperado.
Puede existir auth parcial y no conviene duplicarla.
El frontend puede tener formularios estáticos que requieren adaptación.
Guardar token en localStorage es simple, pero tiene consideraciones de seguridad.
Si se usa refresh token, el alcance crece.
Decisions
Para MVP se usará JWT simple.
El registro público siempre crea usuarios con rol user.
El admin inicial se crea por seed/script, no desde registro público.
El frontend no decide permisos sensibles: el backend siempre valida.
No se implementa recuperación de contraseña en este change.