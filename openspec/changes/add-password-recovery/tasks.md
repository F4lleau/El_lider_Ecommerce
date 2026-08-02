# Tasks: add-password-recovery

## 1. Auditoria inicial

- [x] Revisar modelo `User`.
- [x] Revisar auth service actual.
- [x] Revisar endpoints actuales de auth.
- [x] Revisar validaciones actuales de contrasena.
- [x] Revisar login frontend.
- [x] Revisar manejo de errores de login.
- [x] Revisar si existe servicio de email.
- [x] Revisar variables de entorno.
- [x] Revisar Swagger auth actual.
- [x] Revisar tests auth existentes.

## 2. Modelo y migracion

- [x] Crear modelo `PasswordResetToken`.
- [x] Agregar relacion con `User`.
- [x] Guardar `tokenHash`.
- [x] Guardar `expiresAt`.
- [x] Guardar `usedAt`.
- [x] Agregar indices necesarios.
- [x] Agregar campos de bloqueo a `User`.
- [x] Agregar `failedLoginAttempts`.
- [x] Agregar `lockedUntil`.
- [x] Agregar `lastFailedLoginAt`.
- [x] Crear migracion Prisma.
- [x] Ejecutar migracion local.
- [x] Ejecutar `prisma generate`.

## 3. Forgot password backend

- [x] Crear endpoint `POST /api/auth/forgot-password`.
- [x] Validar formato de email.
- [x] Buscar usuario internamente.
- [x] No revelar si el email existe.
- [x] Si usuario existe, generar token seguro.
- [x] Guardar hash del token.
- [x] Definir expiracion del token.
- [x] Invalidar tokens anteriores si corresponde.
- [x] Preparar link con `FRONTEND_URL`.
- [x] No implementar email real en este change.
- [x] Loguear link solo en development/test si no existe email.
- [x] Responder mensaje generico.

## 4. Validate token backend

- [x] Crear endpoint `POST /api/auth/validate-reset-token`.
- [x] Validar token recibido.
- [x] Buscar token por hash.
- [x] Rechazar token inexistente.
- [x] Rechazar token usado.
- [x] Rechazar token expirado.
- [x] Responder si token es valido.
- [x] No exponer datos sensibles.

## 5. Reset password backend

- [x] Crear endpoint `POST /api/auth/reset-password`.
- [x] Validar token.
- [x] Validar password.
- [x] Validar confirmPassword.
- [x] Validar minimo 6 caracteres.
- [x] Validar al menos una mayuscula.
- [x] Validar al menos una minuscula.
- [x] Validar al menos un caracter especial.
- [x] Hashear nueva contrasena.
- [x] Actualizar usuario.
- [x] Marcar token como usado.
- [x] Invalidar tokens anteriores si corresponde.
- [x] Resetear intentos fallidos.
- [x] Desbloquear usuario si corresponde.
- [x] Responder exito.

## 6. Login lockout backend

- [x] Revisar logica actual de login fallido.
- [x] Incrementar `failedLoginAttempts` en credenciales invalidas.
- [x] Bloquear usuario al superar limite.
- [x] Definir limite de intentos: 5.
- [x] Definir bloqueo de 30 minutos.
- [x] Si `lockedUntil` esta vigente, rechazar login.
- [x] Devolver mensaje con tiempo restante.
- [x] Resetear intentos si login exitoso.
- [x] Resetear bloqueo si expiro.
- [x] Agregar tests de bloqueo.

## 7. Frontend login

- [x] Agregar enlace "Olvide mi contrasena" en `/login`.
- [x] Enlazar a `/recuperar-clave`.
- [x] Mejorar mensaje cuando cuenta esta bloqueada.
- [x] Mostrar tiempo de espera si backend lo devuelve.
- [x] No romper login actual.

## 8. Frontend recuperar clave

- [x] Crear ruta `/recuperar-clave`.
- [x] Crear formulario de email.
- [x] Validar email requerido.
- [x] Validar formato email.
- [x] Llamar `POST /api/auth/forgot-password`.
- [x] Mostrar loading.
- [x] Mostrar mensaje generico de exito.
- [x] Mostrar error tecnico si corresponde.
- [x] Link para volver a login.

## 9. Frontend resetear clave

- [x] Crear ruta `/resetear-clave`.
- [x] Leer token desde query param.
- [x] Validar token con endpoint.
- [x] Mostrar error si token falta.
- [x] Mostrar error si token invalido.
- [x] Mostrar error si token expirado.
- [x] Crear formulario nueva contrasena.
- [x] Crear campo confirmar contrasena.
- [x] Validar minimo 6 caracteres.
- [x] Validar mayuscula.
- [x] Validar minuscula.
- [x] Validar caracter especial.
- [x] Validar coincidencia.
- [x] Llamar `POST /api/auth/reset-password`.
- [x] Mostrar exito.
- [x] Ofrecer volver a login.

## 10. Variables de entorno

- [x] Confirmar `FRONTEND_URL`.
- [x] No agregar variables de email real porque email queda fuera de alcance.
- [x] Documentar modo development sin email.
- [x] Actualizar `.env.example` revisado sin nuevas variables requeridas.

## 11. Swagger

- [x] Documentar `POST /api/auth/forgot-password`.
- [x] Documentar `POST /api/auth/validate-reset-token`.
- [x] Documentar `POST /api/auth/reset-password`.
- [x] Documentar request/response.
- [x] Documentar errores 400.
- [x] Documentar bloqueo temporal en login.
- [x] Validar `/api/docs`.

## 12. Tests backend

- [x] Test forgot password email existente.
- [x] Test forgot password email inexistente respuesta generica.
- [x] Test token hasheado.
- [x] Test validate token valido.
- [x] Test validate token invalido.
- [x] Test validate token expirado.
- [x] Test reset password valido.
- [x] Test reset token usado.
- [x] Test password menor a 6 caracteres.
- [x] Test password sin mayuscula.
- [x] Test password sin minuscula.
- [x] Test password sin caracter especial.
- [x] Test confirmPassword no coincide.
- [x] Test login bloquea tras intentos fallidos.
- [x] Test login bloqueado informa espera.
- [x] Test login despues de 30 minutos.
- [x] Test reset exitoso desbloquea cuenta.

## 13. Tests frontend

- [x] Test login muestra link.
- [x] Test recuperar clave renderiza/ruta.
- [x] Test recuperar clave valida email por input type email.
- [x] Test resetear clave renderiza/ruta.
- [x] Test resetear clave valida contrasena.
- [x] Test resetear clave valida confirmacion.
- [x] Test reset exitoso muestra mensaje por implementacion.
- [x] Test bloqueo muestra mensaje si backend lo devuelve por store.

## 14. Validacion manual

- [x] Solicitar reset con email existente cubierto por test.
- [x] Solicitar reset con email inexistente cubierto por test.
- [x] Confirmar respuesta publica generica.
- [x] Obtener link en development/test.
- [x] Resetear contrasena con token valido.
- [x] Intentar resetear con token usado.
- [x] Intentar resetear con token expirado.
- [x] Probar contrasena insegura.
- [x] Login con nueva contrasena.
- [x] Probar bloqueo por intentos fallidos.
- [x] Confirmar mensaje de espera 30 minutos.
- [x] Confirmar desbloqueo por reset.

## 15. Build y cierre

- [x] Ejecutar migracion.
- [x] Ejecutar build backend.
- [x] Ejecutar build frontend.
- [x] Ejecutar tests backend relacionados.
- [x] Ejecutar tests frontend existentes.
- [x] Validar Swagger HTTP 200.
- [x] Actualizar tasks.md.
- [x] Crear `current-state.md`.
