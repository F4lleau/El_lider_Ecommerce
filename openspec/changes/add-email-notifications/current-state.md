# Current State: add-email-notifications

## Estado general

El change queda implementado para emails transaccionales MVP usando SMTP configurable.

El backend puede enviar:

- recuperacion de contrasena;
- pedido confirmado;
- pago aprobado;
- pedido listo para retirar;
- pedido enviado;
- aviso de stock disponible.

## Configuracion

Se agregaron variables de entorno:

- `EMAIL_ENABLED`
- `EMAIL_PROVIDER`
- `EMAIL_FROM_NAME`
- `EMAIL_FROM_ADDRESS`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_DEV_LOG`

`.env.example` documenta Gmail SMTP de prueba:

```env
EMAIL_ENABLED=true
EMAIL_PROVIDER=smtp
EMAIL_FROM_NAME=El Lider
EMAIL_FROM_ADDRESS=cuenta.prueba@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=cuenta.prueba@gmail.com
SMTP_PASS=app_password_de_gmail
EMAIL_DEV_LOG=true
```

Para Gmail se debe usar contrasena de aplicacion, no la contrasena normal.

## Servicio

Se creo `backend/src/modules/email/email.service.ts` con:

- `sendEmail`
- `sendPasswordResetEmail`
- `sendOrderConfirmedEmail`
- `sendPaymentApprovedEmail`
- `sendOrderReadyForPickupEmail`
- `sendOrderShippedEmail`
- `sendStockAvailableEmail`

El transporte SMTP se inicializa de forma perezosa. Si `EMAIL_ENABLED=false`, el servicio no envia y el flujo principal continua.

Los tests usan `setEmailSenderForTests` y `resetEmailSenderForTests`, por lo que no envian emails reales.

## Recuperacion de contrasena

`POST /api/auth/forgot-password` ahora:

- mantiene respuesta publica generica;
- no revela si el email existe;
- genera token seguro como antes;
- envia email con `resetUrl` si el usuario existe;
- en production no devuelve `resetUrl`;
- en development/test puede devolver `resetUrl`;
- si `EMAIL_DEV_LOG=true` y no es production, loguea el link para pruebas locales.

## Pedidos

Al crear una orden correctamente se intenta enviar email al cliente si hay email disponible.

El email incluye:

- numero de orden;
- numero de seguimiento;
- metodo de entrega;
- metodo de pago;
- total;
- link de seguimiento.

Mensajes cubiertos:

- `CASH + PICKUP`: retiro en sucursal y pago al retirar.
- `CASH + SHIPPING`: envio a domicilio y pago al recibir.
- `MERCADOPAGO`: pedido creado pendiente de pago online.

Si falla el email, la orden queda creada.

## Pago aprobado

El webhook de Mercado Pago dispara email de pago aprobado cuando el pago pasa por primera vez a `APPROVED`.

La idempotencia evita duplicados: si llega el mismo webhook otra vez y el pago/orden ya estaba aprobado, no se vuelve a enviar.

Si falla el email, el pago, la orden y el stock quedan actualizados.

## Estados de pedido

Cuando admin cambia el estado:

- `READY_FOR_PICKUP`: envia "Tu pedido esta listo para retirar".
- `SHIPPED`: envia "Tu pedido esta en camino".

No se envia duplicado si el estado no cambio realmente.

Si falla el email, el cambio de estado queda aplicado.

## Solicitudes de stock

Cuando admin marca una solicitud como:

- `CONTACTED`
- `NOTIFIED`

se intenta enviar email si hay email disponible.

El email incluye el nombre del producto y link al producto cuando existe `slug`.

Si falla el email, el cambio de estado queda aplicado.

## Logging y seguridad

- No se loguea `SMTP_PASS`.
- No se loguean credenciales SMTP.
- Los errores de email se loguean de forma controlada con contexto.
- En production no se expone `resetUrl` en la respuesta.
- El link de reset solo se loguea fuera de production y con `EMAIL_DEV_LOG=true`.

## Validaciones ejecutadas

- `npm run typecheck` backend: OK.
- `npx tsx --test --test-concurrency=1 tests/auth.test.ts tests/checkout.test.ts tests/payments.test.ts tests/email-notifications.test.ts tests/user-private-profile.test.ts`: OK, 37 tests.
- `npm test` backend: OK, 46 tests.
- `npm run build` backend: OK.
- `npm run build` frontend: OK.
- `npx tsx --test tests/password-recovery.test.ts tests/user-private-profile.test.ts`: OK, 7 tests.
- Swagger HTTP 200: OK.

## Validacion manual Gmail

No se ejecuto envio real con Gmail desde esta sesion.

Para validarlo:

1. Activar verificacion en 2 pasos en la cuenta Gmail de prueba.
2. Crear contrasena de aplicacion.
3. Cargar `.env` con `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_SECURE=false`, `SMTP_USER` y `SMTP_PASS`.
4. Confirmar que `EMAIL_ENABLED=true`.
5. Ejecutar backend y solicitar recuperacion de contrasena.

## Limitaciones

- No se implemento cuenta oficial corporativa.
- No se implemento DNS SPF/DKIM/DMARC.
- No se implementaron SendGrid, Resend, Mailgun ni SES.
- No se agrego cola persistente de jobs ni reintentos persistentes.
- No se agregaron templates editables desde admin.
- No se implementaron WhatsApp, SMS, newsletter, adjuntos ni facturacion por email.
