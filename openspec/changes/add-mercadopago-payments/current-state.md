# Current State: add-mercadopago-payments

## Estado general

El change queda implementado para el flujo MVP de checkout con metodo de entrega y metodo de pago:

- `PICKUP` usa `shippingCost = 0`.
- `SHIPPING` usa el costo backend `DEFAULT_SHIPPING_COST`.
- `MERCADOPAGO` crea orden `PENDING_PAYMENT` con `paymentStatus = PENDING`.
- `CASH` crea orden `CONFIRMED` con `paymentStatus = PENDING` y descuenta stock al crear la orden.
- El frontend nunca envia total; backend recalcula subtotal, envio y total.

## Backend

- Se agrego `PaymentMethod` en Prisma con `MERCADOPAGO` y `CASH`.
- `Order.paymentMethod` queda tipado y con default `MERCADOPAGO`.
- `Order.stockProcessedAt` y `Order.stockRestoredAt` permiten controlar descuento/restauracion de stock.
- `Payment` existe y registra preferencias/pagos de Mercado Pago.
- Checkout acepta `paymentMethod`.
- Checkout CASH no crea preferencia Mercado Pago.
- Checkout MERCADOPAGO no descuenta stock hasta pago aprobado.
- Webhook Mercado Pago consulta el pago real, actualiza `Payment` y `Order`, y descuenta stock solo si el pago queda `APPROVED`.
- El webhook es idempotente: un evento duplicado no duplica descuento de stock.
- Si `MERCADOPAGO_WEBHOOK_SECRET` esta configurado, se valida `x-signature` y `x-request-id`; si esta vacio, se permite modo local/test.
- Crear preferencia valida acceso:
  - usuario autenticado solo puede pagar orden propia;
  - invitado requiere `orderId + trackingCode + email`;
  - admin puede consultar.

## Frontend

- `/checkout` permite elegir entrega `PICKUP | SHIPPING`.
- `/checkout` permite elegir pago `MERCADOPAGO | CASH`.
- La confirmacion muestra boton de pago solo para Mercado Pago.
- El flujo CASH muestra pedido confirmado y seguimiento.
- Success/pending/failure consultan backend para mostrar estado real.
- Tracking publico, mis pedidos y detalle de pedido muestran `paymentMethod` y `paymentStatus`.
- Panel admin de pedidos muestra `paymentMethod`, `paymentStatus`, `deliveryMethod`, `shippingCost` y totales.

## Swagger

- `swagger.yaml` documenta:
  - checkout con `paymentMethod` y `deliveryMethod`;
  - fallback de envio con `DEFAULT_SHIPPING_COST`;
  - crear preferencia Mercado Pago;
  - webhook Mercado Pago;
  - consulta de estado de pago;
  - schema `Payment`.

## Validaciones ejecutadas

- `npx prisma migrate status`: base al dia.
- `npm run build` backend: OK.
- `npm run build` frontend: OK.
- `npm run test:payments` backend: OK, 7 tests.
- `tests/checkout.test.ts`: OK, 9 tests.
- `tests/catalog.test.ts`: OK, 6 tests.
- `tests/auth.test.ts`: OK, 6 tests.
- `tests/cart.test.ts` backend aislado: OK, 7 tests.
- `npm run test:cart` frontend: OK, 4 tests.
- Swagger YAML parse: OK.
- `/api/docs/`: HTTP 200 en backend local.

## Notas y limitaciones

- No se implemento pantalla admin de configuracion de envio; para este MVP se usa `DEFAULT_SHIPPING_COST`, documentado en `.env.example`, Swagger y este estado.
- La validacion de webhook real con Mercado Pago requiere una URL publica accesible por Mercado Pago. Local/test queda cubierto por tests y por el modo sin `MERCADOPAGO_WEBHOOK_SECRET`.
- Si un pedido CASH se cancela desde admin y ya tenia stock descontado, el backend restaura stock una vez usando `stockRestoredAt`.
- La suite backend completa corrida en un unico comando quedo limitada por timeout/EPIPE del runner; los tests criticos se ejecutaron aislados y pasaron.
