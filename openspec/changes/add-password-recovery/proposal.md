# Change: add-password-recovery

## Summary

Implementar recuperación de contraseña para usuarios registrados, permitiendo solicitar un enlace o token de recuperación, validar el email internamente, establecer una nueva contraseña segura y gestionar bloqueos temporales por intentos fallidos.

## Motivation

El sistema ya cuenta con autenticación, roles, login y registro. Sin embargo, si un usuario olvida su contraseña actualmente no tiene forma de recuperarla desde la aplicación.

Esto afecta la experiencia de usuario y puede bloquear compras futuras de usuarios registrados.

También se necesita reforzar la seguridad del login mediante reglas claras de contraseña y bloqueo temporal cuando existan intentos fallidos reiterados.

## Scope

Este cambio incluye:

- Agregar enlace “Olvidé mi contraseña” en login.
- Crear pantalla para solicitar recuperación de contraseña.
- Validar internamente si el email existe.
- Responder de forma segura sin revelar si el email existe o no.
- Crear token de recuperación de contraseña.
- Guardar token hasheado, expiración y estado de uso.
- Crear pantalla para establecer nueva contraseña.
- Validar token de recuperación.
- Validar nueva contraseña segura.
- Actualizar contraseña con hash seguro.
- Invalidar token después de uso.
- Desbloquear la cuenta si corresponde después del cambio exitoso.
- Implementar o ajustar bloqueo temporal por intentos fallidos.
- Bloqueo de 30 minutos cuando corresponda.
- Notificar claramente al usuario si su cuenta está bloqueada y cuánto debe esperar.
- Agregar Swagger.
- Agregar tests críticos backend.
- Agregar vistas frontend.
- Crear `current-state.md`.

## Out of Scope

Este cambio no incluye:

- Autenticación con Google.
- Autenticación con redes sociales.
- 2FA.
- Recuperación por SMS.
- Recuperación por WhatsApp.
- Cambio de email.
- Panel admin para resetear contraseñas.
- Emails transaccionales productivos avanzados.
- Plantillas HTML avanzadas.
- Auditoría completa de sesiones.
- Revocación de todas las sesiones activas, salvo que ya exista infraestructura.

## Acceptance Criteria

- En `/login` existe un enlace “Olvidé mi contraseña”.
- El usuario puede ingresar su email en una pantalla de recuperación.
- El backend valida internamente si el email existe.
- La respuesta pública no revela si el email existe.
- Si el email existe, se genera un token de recuperación.
- El token se guarda hasheado.
- El token tiene expiración.
- El token no puede reutilizarse.
- El usuario puede abrir una pantalla para establecer nueva contraseña.
- La nueva contraseña debe tener mínimo 6 caracteres.
- La nueva contraseña debe tener al menos una mayúscula.
- La nueva contraseña debe tener al menos una minúscula.
- La nueva contraseña debe tener al menos un carácter especial.
- Si el token es inválido o expiró, se muestra mensaje claro.
- Si la cuenta está bloqueada, se informa que debe esperar 30 minutos o el tiempo restante.
- Al cambiar contraseña correctamente, el usuario puede volver a iniciar sesión.
- Swagger documenta los endpoints.
- Tests críticos pasan.
- Build backend pasa.
- Build frontend pasa.