Contenido:

# Design: fix-order-payment-ux-and-status-labels

## Context

El sistema ya permite:

- Crear órdenes como invitado o usuario registrado.
- Elegir retiro en sucursal o envío a domicilio.
- Elegir Mercado Pago o efectivo.
- Confirmar pedidos en efectivo.
- Crear preferencias Mercado Pago.
- Ver pedidos en panel admin.
- Ver seguimiento público.

El problema actual no es de arquitectura principal, sino de experiencia, labels, errores visibles y consistencia de estados.

## Main decision

Los enums técnicos deben mantenerse en backend y base de datos, pero nunca deben mostrarse crudos al usuario final ni al administrador.

Ejemplo:

```txt
PICKUP           -> Retiro en sucursal
SHIPPING         -> Envío a domicilio
CASH             -> Efectivo
MERCADOPAGO      -> Mercado Pago
PENDING_PAYMENT  -> Pendiente de pago
CONFIRMED        -> Pedido confirmado
Label helpers

Crear helpers centralizados, por ejemplo:

orderStatusLabel
paymentStatusLabel
paymentMethodLabel
deliveryMethodLabel

Ubicación sugerida frontend:

frontend/src/utils/order-labels.ts

o según estructura existente:

frontend/src/shared/utils/order-labels.ts
Required mappings
OrderStatus
PENDING_PAYMENT      -> Pendiente de pago
PAID                 -> Pago aprobado
CONFIRMED            -> Pedido confirmado
PENDING_CONFIRMATION -> Pendiente de confirmación
PREPARING            -> En preparación
READY_FOR_PICKUP     -> Listo para retirar
SHIPPED              -> En camino
DELIVERED            -> Entregado
CANCELLED            -> Cancelado
REFUNDED             -> Reembolsado

Si algún estado no existe en el proyecto, no agregarlo al backend sin necesidad; solo mapear los existentes.

PaymentStatus
PENDING    -> Pago pendiente
APPROVED   -> Pago aprobado
IN_PROCESS -> Pago en proceso
REJECTED   -> Pago rechazado
CANCELLED  -> Pago cancelado
REFUNDED   -> Pago reembolsado
PaymentMethod
CASH        -> Efectivo
MERCADOPAGO -> Mercado Pago
DeliveryMethod
PICKUP   -> Retiro en sucursal
SHIPPING -> Envío a domicilio
User-facing text changes

Reemplazar:

Tracking
tracking code

por:

Número de seguimiento
Código de seguimiento

Mensaje sugerido:

Guardá este código para consultar el estado de tu pedido.
Cash order confirmation
CASH + PICKUP

Título:

Pedido confirmado

Mensaje:

Tu pedido fue registrado para retirar en sucursal y pagar en efectivo al retirar.

Mostrar:

Número de orden
Número de seguimiento
Método de entrega: Retiro en sucursal
Método de pago: Efectivo
Estado: Pedido confirmado

Botón:

Ver seguimiento
CASH + SHIPPING

Mensaje:

Tu pedido fue registrado para envío a domicilio y pago en efectivo al recibir.

Mostrar además:

Costo de envío
Total
Dirección de entrega
Mercado Pago payment page

Para órdenes MERCADOPAGO:

Título:

Pagar pedido

Mensaje:

Para confirmar tu compra, completá el pago online con Mercado Pago.

Botón:

Pagar con Mercado Pago

Si falla la creación de preferencia:

Mostrar mensaje claro.
Mostrar botón Reintentar.
Mostrar botón Ver seguimiento.
No mostrar solo “error desconocido” si el backend devuelve un detalle.

Mensaje sugerido:

No se pudo iniciar el pago con Mercado Pago. Revisá la configuración o intentá nuevamente.
Mercado Pago 502 audit

Revisar endpoint:

POST /api/payments/mercadopago/preference

Auditar:

MERCADOPAGO_ACCESS_TOKEN.
Que el token se lea desde .env.
Que el token de prueba empiece con TEST-.
Que FRONTEND_URL esté definido.
Que BACKEND_URL esté definido.
Que la orden tenga paymentMethod = MERCADOPAGO.
Que la orden esté PENDING_PAYMENT.
Que el backend use order.total.
Que back_urls sean válidas.
Que notification_url no rompa en local.
Que si BACKEND_URL es localhost y Mercado Pago rechaza webhook local, se pueda omitir notification_url en desarrollo o usar BACKEND_PUBLIC_URL.

Variable sugerida:

BACKEND_PUBLIC_URL=

Regla:

Si BACKEND_PUBLIC_URL existe, usarla para notification_url.
Si no existe y el entorno es local, permitir crear preferencia sin notification_url o documentar la limitación.
Checkout validate 400 audit

Revisar errores:

POST /api/checkout/validate 400

Posibles causas:

Carrito vacío después de crear orden.
El frontend no limpia carrito después del checkout.
Payment page dispara validación de carrito cuando ya existe orden.
Se hacen requests innecesarios a validate al entrar a success/payment.
Carrito local queda desfasado.

Reglas deseadas:

Después de crear una orden exitosa, limpiar carrito si corresponde.
La página de pago debe cargar por orderId/tracking/email, no depender de carrito.
Si el carrito está vacío, mostrar mensaje claro y no spamear requests.
No ejecutar validate repetidamente si ya hay error.
Admin 409 audit

Revisar endpoint:

PATCH /api/admin/orders/:id/status

Si backend responde 409:

La UI debe mostrar mensaje claro.
No debe quedar como error silencioso en consola.
No debe ofrecer transiciones inválidas si se pueden determinar.

Mensaje sugerido:

No se puede cambiar el pedido a ese estado desde el estado actual.
Status transitions by delivery method
PICKUP

Estados disponibles:

CONFIRMED
PREPARING
READY_FOR_PICKUP
DELIVERED
CANCELLED

Labels para usuario:

CONFIRMED        -> Pedido confirmado
PREPARING        -> En preparación
READY_FOR_PICKUP -> Listo para retirar
DELIVERED        -> Retirado
CANCELLED        -> Cancelado
SHIPPING

Estados disponibles:

CONFIRMED
PREPARING
SHIPPED
DELIVERED
CANCELLED

Labels para usuario:

CONFIRMED -> Pedido confirmado
PREPARING -> En preparación
SHIPPED   -> En camino
DELIVERED -> Entregado
CANCELLED -> Cancelado
MERCADOPAGO pending

Antes de pago aprobado:

PENDING_PAYMENT -> Pendiente de pago
UI locations to update

Actualizar labels en:

/checkout/confirmacion
/checkout/payment/:orderId
/checkout/success
/checkout/pending
/checkout/failure
/pedido/:trackingCode
/seguimiento
/mi-cuenta/pedidos
/mi-cuenta/pedidos/:id
/admin/pedidos
/admin/pedidos/:id
Backend error handling

Mejorar respuestas controladas para preferencia Mercado Pago:

{
  "message": "No se pudo crear la preferencia de Mercado Pago",
  "detail": "Motivo controlado para desarrollo"
}

No exponer tokens ni información sensible.

Testing

Agregar tests para:

Helpers de labels.
Confirmación cash pickup.
Confirmación cash shipping.
Admin status options por delivery method.
Error 409 visible/controlado.
Preferencia Mercado Pago con error controlado.
Que payment page no dependa del carrito.
Que tracking muestre Número de seguimiento.
Decisions
No se cambia la lógica central de pagos.
No se implementa recupero de contraseña.
No se implementan emails.
No se implementan reportes.
Este change es de estabilización UX/bugfix.
Los enums técnicos se mantienen internamente.
La UI siempre muestra labels en español.