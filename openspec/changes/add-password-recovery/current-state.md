# Current State: add-password-recovery

## Estado general

El change queda implementado para recuperacion de contrasena y bloqueo temporal por intentos fallidos.

## Backend

- Se agrego el modelo `PasswordResetToken`.
- Se agregaron a `User`:
  - `failedLoginAttempts`;
  - `lockedUntil`;
  - `lastFailedLoginAt`.
- `POST /api/auth/forgot-password`:
  - valida email;
  - no revela si el email existe;
  - responde siempre el mensaje generico;
  - genera token seguro para usuarios existentes;
  - guarda solo hash SHA-256 del token;
  - expira en 30 minutos;
  - invalida tokens anteriores pendientes;
  - en development/test loguea y devuelve `resetUrl`.
- `POST /api/auth/validate-reset-token` valida token existente, no usado y no expirado.
- `POST /api/auth/reset-password`:
  - valida token;
  - valida confirmacion;
  - exige minimo 6 caracteres, mayuscula, minuscula y caracter especial;
  - hashea la nueva contrasena;
  - marca token como usado;
  - invalida tokens pendientes;
  - limpia intentos fallidos y bloqueo.
- Login bloquea cuenta por 30 minutos al llegar a 5 intentos fallidos.
- Login exitoso limpia intentos y bloqueo expirado.

## Frontend

- `/login` muestra enlace `Olvidé mi contraseña`.
- `/recuperar-clave` permite solicitar recuperacion por email.
- `/resetear-clave?token=...` valida token, permite definir nueva contrasena y ofrece volver al login.
- El mensaje de cuenta bloqueada se muestra desde la respuesta del backend.

## Swagger

- Se documentaron:
  - `POST /api/auth/forgot-password`;
  - `POST /api/auth/validate-reset-token`;
  - `POST /api/auth/reset-password`;
  - bloqueo temporal `423` en login.

## Validaciones ejecutadas

- `npm run prisma:deploy`: OK, migracion aplicada.
- `npm run prisma:generate`: OK.
- `npm run build` backend: OK.
- `npm run build` frontend: OK.
- `npx tsx --test --test-concurrency=1 tests/auth.test.ts`: OK, 11 tests.
- `npm run test:cart` frontend: OK, 4 tests.
- `npx tsx --test tests/password-recovery.test.ts`: OK, 3 tests.
- Swagger YAML parse: OK.
- `/api/docs/` con app en puerto efimero: HTTP 200.

## Limitaciones

- No se implemento envio real de email. En development/test el backend loguea el link y devuelve `resetUrl` para pruebas locales.
- No se implemento autenticacion social, 2FA, SMS, WhatsApp ni panel admin de reset.
- `npx prisma migrate status` quedo colgado por timeout en esta sesion, pero `prisma migrate deploy` aplico correctamente la migracion `20260621000000_add_password_recovery`.
