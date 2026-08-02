# Design: add-password-recovery

## Context

El sistema ya cuenta con:

- Registro.
- Login.
- JWT.
- Roles `ADMIN` y `USER`.
- Rutas protegidas.
- Panel admin.
- Checkout y compras.

Falta completar el flujo de recuperación de contraseña para usuarios que no recuerdan su clave.

## User flow

### 1. Login

En la pantalla `/login` se debe mostrar:

```txt
¿Olvidaste tu contraseña?

Ese enlace lleva a:

/recuperar-clave
2. Request password reset

El usuario ingresa su email.

Frontend llama:

POST /api/auth/forgot-password

Body:

{
  "email": "usuario@email.com"
}

Respuesta pública recomendada:

Si el email existe, te enviaremos instrucciones para recuperar tu contraseña.
Security note: email enumeration

Aunque el backend debe validar internamente si el email existe, no debe responder públicamente:

El email no existe

Motivo: eso permitiría descubrir qué emails están registrados.

Regla:

Si el email existe, generar token.
Si el email no existe, responder el mismo mensaje genérico.
Loguear internamente si corresponde.
No revelar existencia de cuenta al público.
Reset token

Crear modelo sugerido:

model PasswordResetToken {
  id        Int      @id @default(autoincrement())
  userId    Int
  tokenHash String
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([tokenHash])
}

Si el proyecto usa UUID en vez de Int, respetar el patrón existente.

Token rules
Generar token aleatorio seguro.
Guardar solo hash del token.
No guardar token plano en base de datos.
Expiración sugerida: 30 minutos.
Un token usado no puede reutilizarse.
Al generar un nuevo token, se pueden invalidar tokens anteriores del mismo usuario.
Delivery of token

Para MVP local se aceptan dos opciones:

Opción A: email real si ya existe servicio de email

Enviar email con link:

FRONTEND_URL/resetear-clave?token=...
Opción B: modo desarrollo

Si no existe email real todavía:

registrar el link en consola de backend;
devolver el link solo en entorno development o test;
documentar la limitación en current-state.md.

No exponer links de reset en producción.

Reset password screen

Ruta frontend:

/resetear-clave

Puede recibir token por query param:

/resetear-clave?token=abc123

La pantalla debe pedir:

Nueva contraseña
Confirmar nueva contraseña

Frontend llama:

POST /api/auth/reset-password

Body:

{
  "token": "abc123",
  "password": "NuevaClave1!",
  "confirmPassword": "NuevaClave1!"
}
Password policy

La nueva contraseña debe cumplir:

mínimo 6 caracteres
al menos una letra mayúscula
al menos una letra minúscula
al menos un carácter especial

Regex sugerido:

^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$

Mensajes de error sugeridos:

La contraseña debe tener al menos 6 caracteres.
La contraseña debe incluir una mayúscula.
La contraseña debe incluir una minúscula.
La contraseña debe incluir un carácter especial.
Las contraseñas no coinciden.
Successful reset

Cuando el cambio es correcto:

hashear nueva contraseña;
actualizar password del usuario;
marcar token como usado;
opcionalmente invalidar otros tokens del mismo usuario;
resetear intentos fallidos de login si existen;
quitar bloqueo si corresponde;
redirigir a /login;
mostrar mensaje:
Tu contraseña fue actualizada. Ya podés iniciar sesión.
Login lockout

Si el proyecto ya tiene control de intentos fallidos, ajustar.

Si no existe, agregar campos sugeridos a User:

failedLoginAttempts
lockedUntil
lastFailedLoginAt

Reglas:

Si el usuario falla varios intentos de login, bloquear cuenta.
Cantidad sugerida: 5 intentos fallidos.
Duración del bloqueo: 30 minutos.
Durante el bloqueo, el login debe responder:
Tu cuenta está bloqueada temporalmente. Intentá nuevamente en X minutos.
No permitir login hasta que lockedUntil expire.
Si login exitoso, resetear intentos fallidos.
Si password reset exitoso, resetear bloqueo e intentos fallidos.
Locked account and password recovery

Si la cuenta está bloqueada y el usuario solicita recuperación:

Se puede permitir solicitar reset.
El cambio de contraseña exitoso puede desbloquear la cuenta.
Alternativamente, se puede mantener bloqueo hasta que expire.

Decisión MVP recomendada:

Si el usuario cambia correctamente la contraseña desde reset, se desbloquea la cuenta.
Backend endpoints
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/validate-reset-token

validate-reset-token es opcional, pero útil para que el frontend sepa si el link está vencido antes de mostrar el formulario.

Frontend routes
/recuperar-clave
/resetear-clave

Opcional:

/resetear-clave?token=...
UI states
Forgot password

Estados:

formulario inicial;
loading;
mensaje enviado/genérico;
error técnico.
Reset password

Estados:

validando token;
formulario nueva contraseña;
error token inválido;
error token expirado;
error contraseña insegura;
éxito.
Swagger

Documentar:

POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/validate-reset-token
errores 400, 401, 404, 409, 429 si corresponde;
ejemplos de request y response.
Tests

Backend:

forgot password con email existente.
forgot password con email inexistente responde genérico.
token se guarda hasheado.
reset con token válido.
reset con token inválido.
reset con token expirado.
reset con token usado.
password insegura rechazada.
password confirm no coincide.
login bloqueado por intentos.
login desbloqueado después de 30 minutos.
reset exitoso desbloquea usuario si corresponde.

Frontend:

login muestra link.
recuperar clave muestra formulario.
resetear clave valida campos.
reset exitoso redirige a login.
error token inválido se muestra claro.
Risks
Revelar si un email existe puede permitir enumeración de usuarios.
Guardar token plano es inseguro.
No expirar tokens permitiría uso tardío.
No marcar token como usado permitiría reutilización.
Bloquear cuenta sin mensaje claro afecta experiencia.
En local, sin email real, hay que documentar cómo obtener el link de recuperación.
Decisions
El flujo se llama “Olvidé mi contraseña”.
El backend valida email internamente.
La respuesta pública será genérica.
La contraseña tendrá mínimo 6 caracteres, una mayúscula, una minúscula y un carácter especial.
El token de recuperación expira.
El token se guarda hasheado.
El bloqueo por intentos dura 30 minutos.
Si el usuario cambia correctamente la contraseña, se puede desbloquear la cuenta.
En desarrollo se puede mostrar/loguear el link de reset si no existe servicio de email.