El sistema ya tiene:

- Registro y login.
- Rec
uperación de contraseña con token seguro.
- Checkout para invitados y usuarios registrados.
- Mercado Pago y efectivo.
- Pedidos y estados.
- Solicitudes de stock.
- Panel admin.
- Zona privada de usuario.

Falta una capa real de emails transaccionales.

## Main decision

Se implementará un servicio de email centralizado y configurable.

Para MVP se usará SMTP. En development/test podrá configurarse Gmail con contraseña de aplicación.

No se debe usar la contraseña normal de Gmail.

## Gmail test account

Para usar Gmail SMTP en pruebas:

- activar verificación en 2 pasos;
- generar contraseña de aplicación;
- usar esa contraseña en `SMTP_PASS`;
- no commitear credenciales.

Variables sugeridas:

```env
EMAIL_ENABLED=true
EMAIL_PROVIDER=smtp
EMAIL_FROM_NAME=El Líder
EMAIL_FROM_ADDRESS=cuenta.prueba@gmail.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=cuenta.prueba@gmail.com
SMTP_PASS=contraseña_de_aplicacion

Opcional:

EMAIL_DEV_LOG=true
Email service

Crear un servicio reusable, por ejemplo:

src/modules/email/email.service.ts

o según estructura existente:

src/services/email.service.ts

Funciones sugeridas:

sendEmail
sendPasswordResetEmail
sendOrderConfirmedEmail
sendPaymentApprovedEmail
sendOrderReadyForPickupEmail
sendOrderShippedEmail
sendStockAvailableEmail
Error strategy

El email no debe romper flujos críticos.

Ejemplo:

si se crea una orden y falla el email, la orden debe seguir creada;
si Mercado Pago aprueba y falla el email, el pago y stock deben quedar correctos;
si recuperación de contraseña genera token y falla el email, responder error controlado o fallback según entorno.

Regla recomendada:

Operaciones comerciales no se revierten por error de email.

Para recuperación de contraseña:

si EMAIL_ENABLED=true y falla el envío, responder mensaje controlado;
en development/test, loguear el link como fallback;
en production, no devolver ni loguear link sensible.
Templates MVP

Los templates pueden ser simples en texto y HTML básico.

No se requiere diseño avanzado.

Password reset email

Subject:

Recuperación de contraseña - El Líder

Contenido:

Recibimos una solicitud para recuperar tu contraseña.
Hacé clic en el siguiente enlace para crear una nueva contraseña.
Este enlace vence en 30 minutos.
Si no solicitaste este cambio, podés ignorar este mensaje.

Debe incluir:

resetUrl
Order confirmed email

Subject:

Pedido confirmado - El Líder

Debe incluir:

Número de orden
Número de seguimiento
Método de entrega
Método de pago
Total
Link de seguimiento

Para CASH + PICKUP:

Tu pedido fue registrado para retirar en sucursal y pagar en efectivo al retirar.

Para CASH + SHIPPING:

Tu pedido fue registrado para envío a domicilio y pago en efectivo al recibir.

Para MERCADOPAGO pendiente:

Tu pedido fue creado y está pendiente de pago con Mercado Pago.
Payment approved email

Subject:

Pago aprobado - El Líder

Debe incluir:

Número de orden
Número de seguimiento
Total pagado
Link de seguimiento
Ready for pickup email

Subject:

Tu pedido está listo para retirar - El Líder

Debe incluir:

Número de orden
Número de seguimiento
Mensaje indicando que ya puede retirar en sucursal
Shipped email

Subject:

Tu pedido está en camino - El Líder

Debe incluir:

Número de orden
Número de seguimiento
Mensaje indicando que el pedido fue enviado
Stock available email

Subject:

Producto nuevamente disponible - El Líder

Debe incluir:

Nombre del producto
Link al producto
Mensaje indicando que puede volver a consultarlo/comprarlo
Trigger points
Password recovery

En:

POST /api/auth/forgot-password

Si usuario existe:

generar token
generar resetUrl
enviar email
Order confirmed

Cuando se crea una orden:

CASH: enviar email de pedido confirmado.
MERCADOPAGO: enviar email de pedido creado/pendiente de pago, si corresponde.
Payment approved

En webhook Mercado Pago cuando el pago pasa a approved y se procesa por primera vez.

Debe respetar idempotencia: no enviar email duplicado si el webhook llega dos veces.

MVP aceptado:

si no existe tabla de eventos/email logs, evitar duplicados usando estado previo de orden/pago antes de actualizar;
si ya estaba approved, no volver a enviar.
Ready for pickup

Cuando admin cambia estado a:

READY_FOR_PICKUP

Enviar email si el cliente tiene email.

Shipped

Cuando admin cambia estado a:

SHIPPED

Enviar email si el cliente tiene email.

Stock request

Cuando admin cambia solicitud a:

CONTACTED
NOTIFIED

Enviar email al email de la solicitud si existe.

Email logging

Para MVP se puede loguear:

email enviado
tipo de email
destinatario
orderId si corresponde
stockRequestId si corresponde

No loguear:

SMTP_PASS
tokens completos
credenciales
Optional model

Si el agente ve necesario controlar duplicados mejor, puede crear:

model EmailLog {
  id          Int      @id @default(autoincrement())
  type        String
  recipient   String
  status      String
  error       String?
  orderId     Int?
  userId      Int?
  createdAt   DateTime @default(now())
}

Pero para MVP no es obligatorio salvo que ayude a idempotencia.

Swagger

Actualizar solo si cambian respuestas o se agregan endpoints.

Probablemente no se necesitan endpoints públicos nuevos. El email se dispara desde flujos existentes.

Tests

Usar mocks. No enviar emails reales en tests.

Tests mínimos:

forgot password llama email service cuando email existe.
forgot password no revela email inexistente.
password reset email no expone token plano en logs.
order confirmed llama email service.
payment approved llama email service una sola vez.
ready for pickup llama email service.
shipped llama email service.
stock request notified llama email service.
si email service falla, orden/pago no se revierte.
config EMAIL_ENABLED=false no intenta enviar.
Decisions
Se implementa SMTP configurable.
Gmail será solo para development/test.
No se implementa proveedor profesional todavía.
No se implementan templates avanzados.
No se implementan colas persistentes.
No se implementa WhatsApp.
Los emails no deben romper operaciones comerciales si fallan.