## Context

El sistema ya crea órdenes desde checkout. Ahora se completa el flujo comercial real con dos decisiones del cliente:

```txt
deliveryMethod = PICKUP | SHIPPING
paymentMethod = MERCADOPAGO | CASH

El usuario puede comprar como invitado o registrado.

Business flow
Carrito
→ Datos del comprador
→ Método de entrega: retiro / envío
→ Método de pago: Mercado Pago / efectivo
→ Backend calcula subtotal, envío y total
→ Backend crea orden
→ Si Mercado Pago: crear preferencia y redirigir
→ Si efectivo: confirmar pedido sin pago online
Delivery methods
PICKUP

Reglas:

Retiro en sucursal.
No requiere dirección de envío.
shippingCost = 0.
SHIPPING

Reglas:

Envío a domicilio.
Requiere dirección.
shippingCost se toma desde configuración backend/admin.
El costo se suma al total final.
Payment methods
MERCADOPAGO

Reglas:

order.status = PENDING_PAYMENT
paymentStatus = PENDING
paymentMethod = MERCADOPAGO

Flujo:

Checkout crea orden.
Frontend muestra botón “Pagar con Mercado Pago”.
Frontend llama al backend para crear preferencia.
Backend crea preferencia usando el total guardado de la orden.
Frontend redirige a Mercado Pago usando initPoint o sandboxInitPoint.
Mercado Pago redirige a success/pending/failure.
El frontend consulta estado real al backend.
El webhook confirma el pago real.
Si el pago queda aprobado:
paymentStatus = APPROVED;
order.status = PAID;
se descuenta stock.
CASH

Reglas:

paymentMethod = CASH
paymentStatus = PENDING

Para retiro:

deliveryMethod = PICKUP
shippingCost = 0

Para envío:

deliveryMethod = SHIPPING
shippingCost = costo configurado

Flujo:

Checkout crea orden.
No se crea preferencia Mercado Pago.
La orden queda CONFIRMED o PENDING_CONFIRMATION, según enums existentes.
El stock se descuenta al crear/confirmar orden.
El admin gestiona el pedido desde el panel.
Si el pedido se cancela, se debe reponer stock o dejar documentado como pendiente si aún no existe esa lógica.
Shipping cost configuration

Objetivo:

El costo de envío a domicilio debe ser definido por admin.

Implementación MVP aceptada:

Opción preferida

Crear configuración mínima:

ShippingSettings

Campos sugeridos:

id
shippingCost
freeShippingFrom?
isShippingEnabled
createdAt
updatedAt

Endpoints sugeridos:

GET   /api/settings/shipping
PATCH /api/admin/settings/shipping

Vista admin mínima:

/admin/configuracion/envios
Fallback permitido

Si no hay tiempo para configuración administrable, usar:

DEFAULT_SHIPPING_COST=3000

Pero debe quedar documentado en current-state.md como pendiente para admin.

Order model

Agregar o confirmar:

paymentMethod
paymentStatus
deliveryMethod
shippingCost
subtotal
total

Valores sugeridos:

paymentMethod = MERCADOPAGO | CASH
deliveryMethod = PICKUP | SHIPPING
Payment model

Si no existe, crear:

id
orderId
provider
providerPaymentId
providerPreferenceId
externalReference
status
amount
currency
rawResponse
paidAt
createdAt
updatedAt

Provider:

MERCADOPAGO

Estados:

PENDING
APPROVED
REJECTED
CANCELLED
REFUNDED
IN_PROCESS
Preference creation

Endpoint:

POST /api/payments/mercadopago/preference

El frontend envía solo identificadores:

{
  "orderId": 123,
  "trackingCode": "EL-2026-XXXX",
  "email": "cliente@email.com"
}

Reglas:

El frontend nunca envía total a cobrar.
El backend busca la orden.
El backend usa order.total.
Si la orden es de usuario autenticado, validar order.userId === auth.user.id.
Si la orden es de invitado, validar orderId + trackingCode + email o mecanismo equivalente.
No crear preferencia para órdenes ya pagadas.
No crear preferencia para órdenes con paymentMethod = CASH.
Back URLs

Usar:

FRONTEND_URL/checkout/success
FRONTEND_URL/checkout/pending
FRONTEND_URL/checkout/failure

El retorno frontend solo consulta estado al backend. No confirma pagos por sí mismo.

Webhook

Endpoint:

POST /api/payments/mercadopago/webhook

Reglas:

Recibir notificación.
Extraer payment id.
Consultar pago real a Mercado Pago.
Buscar orden por external_reference.
Actualizar Payment.
Actualizar Order.
Descontar stock si pago aprobado.
Ser idempotente.
Webhook signature

Si MERCADOPAGO_WEBHOOK_SECRET está definido:

Validar firma usando headers de Mercado Pago.
Usar x-signature.
Usar x-request-id cuando corresponda.

Si MERCADOPAGO_WEBHOOK_SECRET está vacío en local/test:

Permitir tests mockeados.
Documentar limitación en current-state.md.
Stock rules
MERCADOPAGO
checkout valida stock
checkout no descuenta stock
webhook approved descuenta stock
webhook duplicado no descuenta dos veces
CASH
checkout valida stock
orden confirmada descuenta stock
si se cancela, reponer stock o documentar pendiente
Frontend checkout

La pantalla /checkout debe mostrar:

Datos del comprador
Método de entrega:
  - Retiro en sucursal
  - Envío a domicilio

Si envío:
  - Dirección
  - Costo de envío

Método de pago:
  - Mercado Pago online
  - Efectivo al retirar / recibir

Resumen:
  - Subtotal
  - Envío
  - Total

Botones:

Si Mercado Pago: Crear pedido y pagar
Si efectivo: Confirmar pedido
Admin panel

Agregar visualización de:

paymentMethod
paymentStatus
deliveryMethod
shippingCost

En:

/admin/pedidos
/admin/pedidos/:id

Si se implementa configuración de envío:

/admin/configuracion/envios
Swagger

Documentar:

Checkout con paymentMethod.
Crear preferencia.
Webhook.
Estado de pago.
Configuración de envío.
Errores 400, 401, 403, 404, 409.
Decisions
Se usará Checkout Pro.
La orden existe antes de pagar.
El backend crea la preferencia.
El backend usa el total guardado de la orden.
El frontend nunca manda el total a cobrar.
El webhook actualiza el estado real.
El stock de Mercado Pago se descuenta al pago aprobado.
El stock de efectivo se descuenta al crear/confirmar orden.
El retorno frontend solo consulta estado al backend.
Para MVP, paymentMethod = MERCADOPAGO | CASH.
CASH significa efectivo al retirar si es pickup y efectivo al recibir si es shipping.