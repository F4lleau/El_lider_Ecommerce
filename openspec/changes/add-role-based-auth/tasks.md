# Tasks: add-role-based-auth

## 1. Auditoría

- [x] Revisar backend auth existente.
- [x] Revisar modelo `User` y roles en Prisma.
- [x] Revisar rutas y middlewares existentes.
- [x] Revisar formularios y servicios frontend.
- [x] Revisar Swagger actual.
- [x] Revisar tests existentes.

## 2. Backend

- [x] Mantener y completar registro real.
- [x] Mantener y completar login real.
- [x] Incluir `sub`, `email` y `role` en JWT.
- [x] Migrar rol común de `CUSTOMER` a `USER`.
- [x] Implementar `GET /api/auth/me`.
- [x] Implementar middleware `requireAuth`.
- [x] Implementar middleware `requireRole`.
- [x] Aplicar `requireAuth` a rutas privadas existentes.
- [x] Crear script para admin inicial.
- [x] Actualizar `.env.example`.
- [x] Actualizar Swagger de auth.

## 3. Frontend

- [x] Completar servicio de auth.
- [x] Implementar store de sesión.
- [x] Restaurar sesión mediante `/api/auth/me`.
- [x] Implementar logout.
- [x] Conectar formulario de login.
- [x] Conectar formulario de registro.
- [x] Implementar `ProtectedRoute`.
- [x] Implementar `AdminRoute`.
- [x] Proteger `/mi-cuenta`.
- [x] Proteger `/admin` y `/admin/dashboard`.
- [x] Agregar redirecciones según sesión y rol.

## 4. Tests

- [x] Test de registro exitoso.
- [x] Test de email duplicado.
- [x] Test de login exitoso.
- [x] Test de contraseña incorrecta.
- [x] Test de `/api/auth/me` sin token.
- [x] Test de `/api/auth/me` con token.
- [x] Test de ruta admin con usuario común.
- [x] Test de ruta admin con admin.

## 5. Validación y cierre

- [x] Aplicar migración Prisma.
- [x] Ejecutar build backend.
- [x] Ejecutar build frontend.
- [x] Ejecutar tests backend.
- [x] Confirmar navegación pública sin login.
- [x] Confirmar rechazo de rutas privadas sin token.
- [x] Confirmar autorización por rol.
- [x] Documentar resultado en `current-state.md`.
