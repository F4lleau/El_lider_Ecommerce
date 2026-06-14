# Design: add-checkout-and-delivery-options

## Context

El proyecto ya cuenta con:

- Auth y roles.
- Catálogo real desde base de datos.
- Productos con precio y stock.
- Carrito invitado en localStorage.
- Carrito autenticado en backend.
- Sync de carrito al login.
- ABM backend de productos y categorías.
- Solicitudes de stock.

El checkout debe convertir un carrito válido en una orden persistida.

## Main decision

Este change crea órdenes, pero todavía no procesa pagos online.

Mercado Pago será implementado en el change:

```txt
add-mercadopago-payments

Por eso, la orden creada desde checkout quedará inicialmente en estado:

PENDING_PAYMENT

o equivalente según los enums existentes.

Checkout flow
Guest checkout

Flujo:

Usuario invitado tiene productos en carrito local.
Frontend valida carrito con backend.
Usuario ingresa datos personales.
Usuario elige retiro o envío.
Si elige envío, ingresa dirección.
Backend recalcula precios, stock, subtotal, envío y total.
Backend crea orden.
Backend crea order items con snapshot.
Backend genera order number y tracking code.
Backend devuelve orden creada.
Frontend muestra pantalla de confirmación pendiente de pago o continúa al paso de pago cuando Mercado Pago exista.
Authenticated checkout

Flujo:

Usuario logueado tiene carrito en backend.
Frontend abre checkout.
Usuario confirma datos.
Usuario puede usar dirección guardada o ingresar una nueva.
Backend recalcula carrito.
Backend crea orden asociada a userId.
Backend genera order number y tracking code.
Backend puede vaciar carrito luego de crear la orden, según decisión del MVP.
Delivery methods

Métodos permitidos:

PICKUP
SHIPPING
PICKUP

Reglas:

No requiere dirección de envío.
shippingCost = 0.
Debe mostrar datos de sucursal.
Estado operativo posterior puede ser READY_FOR_PICKUP.
SHIPPING

Reglas:

Requiere dirección.
Requiere teléfono de contacto.
Calcula costo de envío.
Guarda snapshot de dirección en la orden o shipment.
Estado operativo posterior puede ser SHIPPED.
Shipping cost

Para MVP se recomienda un cálculo simple y configurable.

Opciones:

Opción A: costo fijo
shippingCost = valor fijo desde configuración/env

Ejemplo:

DEFAULT_SHIPPING_COST=3000
Opción B: costo por ciudad/zona

Se puede implementar después.

Decisión MVP

Usar costo fijo configurable en backend.

El costo debe mostrarse discriminado:

Subtotal productos
Costo de envío
Total final
Order model

La orden debe guardar:

id
orderNumber
trackingCode
userId?
guestName?
guestEmail?
guestPhone?
status
paymentStatus
deliveryMethod
subtotal
shippingCost
total
notes?
createdAt
updatedAt
Order item model

Cada item debe guardar snapshot:

id
orderId
productId
productName
productSlug
quantity
unitPrice
total

Motivo: si luego cambia el precio o nombre del producto, el pedido histórico debe conservar lo comprado.

Shipping data

Para envío, se debe guardar snapshot de dirección:

recipientName
recipientPhone
street
number
floor?
apartment?
city
province
postalCode
references?
estimatedDeliveryDate?
shippingStatus?

Puede estar dentro de Order o en modelo separado Shipment.

Para MVP se acepta guardar datos de envío en la orden si el schema actual ya está así. Si ya existe Shipment, usarlo.

Stock behavior

Reglas:

Agregar al carrito no baja stock.
Crear orden debe validar stock.
Para MVP, el stock puede descontarse al crear la orden con estado PENDING_PAYMENT o recién al confirmar pago.
Recomendación: si Mercado Pago viene inmediatamente después, descontar stock cuando el pago sea aprobado.
Sin embargo, como este change todavía no tiene pago, se puede:
crear la orden sin descontar stock;
reservar stock con un estado futuro;
o descontar al crear orden y reponer si se cancela.
Stock decision for this change

Para evitar inconsistencias antes de Mercado Pago:

Este change valida stock al crear orden.
Este change no descuenta stock definitivamente.
El descuento definitivo se implementará en add-mercadopago-payments cuando el pago sea aprobado.
Si se necesita probar ventas sin pago, se podrá crear estado manual CONFIRMED en admin luego.
Order statuses

Estados sugeridos:

PENDING_PAYMENT
PAID
CONFIRMED
PREPARING
READY_FOR_PICKUP
SHIPPED
DELIVERED
CANCELLED
REFUNDED

Para este change se usan principalmente:

PENDING_PAYMENT
CANCELLED
Payment statuses

Estados sugeridos:

PENDING
APPROVED
REJECTED
CANCELLED
REFUNDED
IN_PROCESS

Para este change se usa:

PENDING
Tracking code

Debe ser único, legible y difícil de adivinar.

Ejemplo:

EL-2026-A8F42K

Reglas:

Debe ser único.
Debe guardarse en la orden.
Debe devolverse al cliente.
Debe usarse para seguimiento público.
Backend endpoints
Checkout
POST /api/checkout
POST /api/checkout/validate
Public tracking
GET /api/orders/track/:trackingCode
User orders
GET /api/me/orders
GET /api/me/orders/:id
Admin orders basic
GET /api/admin/orders
GET /api/admin/orders/:id
PATCH /api/admin/orders/:id/status
Frontend pages
Public
/checkout
/checkout/confirmacion
/pedido/:trackingCode
/seguimiento
User
/mi-cuenta/pedidos
/mi-cuenta/pedidos/:id
Admin later
/admin/pedidos
/admin/pedidos/:id

En este change se puede dejar admin por API y no construir panel frontend completo.

Checkout UI

Debe mostrar:

Paso 1: resumen del carrito.
Paso 2: datos del comprador.
Paso 3: método de entrega.
Paso 4: resumen final.
Paso 5: orden creada.

Para MVP puede ser una sola pantalla con secciones claras.

Validation

Validar:

Carrito no vacío.
Producto existente.
Producto activo.
Stock suficiente.
Cantidades positivas.
Email válido.
Teléfono obligatorio.
Nombre obligatorio.
Dirección obligatoria si deliveryMethod = SHIPPING.
Costo de envío calculado en backend.
Total calculado en backend.
Swagger

Documentar:

Checkout validate.
Checkout create order.
Tracking público.
User orders.
Admin orders básicos.
Schemas de request/response.
Errores 400, 401, 403, 404 y 409.
Tests

Backend:

Checkout invitado con retiro.
Checkout invitado con envío.
Checkout usuario con retiro.
Checkout usuario con envío.
Carrito vacío.
Producto sin stock.
Producto inactivo.
Total calculado correctamente.
Tracking code único.
Consulta pública por tracking.
Usuario no ve pedido ajeno.
Admin lista pedidos.

Frontend:

Checkout muestra carrito.
Checkout valida datos obligatorios.
Checkout muestra envío discriminado.
Checkout crea orden.
Seguimiento muestra pedido.
Risks
Si se descuenta stock antes del pago, puede haber stock bloqueado por órdenes impagas.
Si no se descuenta stock hasta el pago, puede haber sobreventa si muchos pagan a la vez.
Mercado Pago requiere que la orden exista antes de pagar.
Guest checkout debe guardar datos suficientes para seguimiento.
El usuario registrado no debe ver pedidos de otros usuarios.
Decisions
La orden se crea antes del pago.
El pago queda PENDING.
El estado inicial de orden es PENDING_PAYMENT.
El costo de envío inicial será fijo/configurable.
El backend siempre recalcula totales.
El stock se valida en checkout.
El descuento definitivo de stock se resolverá con Mercado Pago cuando el pago sea aprobado.
El panel admin frontend completo queda para change posterior.