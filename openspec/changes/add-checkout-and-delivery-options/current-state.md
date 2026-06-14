# Estado actual: checkout and delivery options

## Resultado

El checkout y las órdenes quedaron implementados para invitados y usuarios registrados, con retiro en sucursal o envío a domicilio. Mercado Pago, webhooks y descuento definitivo de stock permanecen fuera de alcance.

## Modelo y reglas

- Se agregaron enums `OrderStatus`, `PaymentStatus` y `DeliveryMethod`.
- Las órdenes nuevas se crean con `PENDING_PAYMENT` y pago `PENDING`.
- `Order` guarda número de orden, tracking, comprador invitado, método de entrega, subtotal, envío, total y snapshot de dirección.
- `OrderItem` guarda snapshot de nombre, slug, precio unitario, cantidad y total.
- Se conservaron `totalAmount`, `addressId` y `paymentMethod` por compatibilidad con datos y código históricos.
- El costo fijo de envío usa `DEFAULT_SHIPPING_COST`; retiro usa costo cero.
- Checkout valida productos activos, cantidades y stock, pero no descuenta stock.
- El carrito backend se vacía después de crear la orden autenticada. El frontend limpia localStorage después de crear una orden invitada.

## Endpoints

- `POST /api/checkout/validate`
- `POST /api/checkout`
- `GET /api/orders/track/:trackingCode`
- `GET /api/me/orders`
- `GET /api/me/orders/:id`
- `GET /api/admin/orders`
- `GET /api/admin/orders/:id`
- `PATCH /api/admin/orders/:id/status`

## Frontend

- `/checkout`: resumen, comprador, retiro/envío, dirección condicional y totales.
- `/checkout/confirmacion`: número de orden y tracking.
- `/seguimiento` y `/pedido/:trackingCode`: seguimiento público.
- `/mi-cuenta/pedidos` y `/mi-cuenta/pedidos/:id`: pedidos privados.
- El carrito enlaza al checkout.

## Validación

- Migración aplicada y Prisma Client generado.
- Build backend: aprobado.
- Build frontend: aprobado.
- Tests backend: 25 aprobados.
- Tests frontend existentes: 4 aprobados.
- Swagger parseó correctamente con 39 paths.
- Flujo invitado con retiro: aprobado por test HTTP.
- Flujo invitado con envío: aprobado por test HTTP.
- Flujo usuario con retiro: aprobado por test HTTP.
- Flujo usuario con envío: aprobado por test HTTP.
- Tracking público, privacidad de pedidos y endpoints admin: aprobados por test HTTP.

## Pendientes fuera de alcance

- Mercado Pago y descuento definitivo de stock al aprobar pago.
- Panel admin frontend.
- Infraestructura E2E/browser headless para automatizar pantallas frontend.
