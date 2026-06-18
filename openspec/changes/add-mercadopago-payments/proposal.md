# Change: add-mercadopago-payments

## Summary

Integrar Mercado Pago Checkout Pro y completar el flujo real de pago del e-commerce, incorporando métodos de pago online y efectivo, métodos de entrega retiro/envío, costo de envío configurable y actualización automática de estado de orden, pago y stock.

## Motivation

El sistema ya cuenta con carrito, checkout, órdenes, tracking público, panel admin MVP, productos con SKU y snapshots de productos en pedidos.

Para operar comercialmente, el cliente debe poder elegir:

- Método de entrega:
  - retiro en sucursal;
  - envío a domicilio.
- Método de pago:
  - Mercado Pago online;
  - efectivo al retirar o recibir.

Además, el costo de envío debe ser definido desde backend/admin, y el stock debe descontarse según el tipo de pago.

## Scope

Este cambio incluye:

- Configuración de SDK Mercado Pago.
- Variables de entorno Mercado Pago.
- Modelo `Payment` y migración.
- Método de pago en la orden: `MERCADOPAGO` o `CASH`.
- Entrega con `PICKUP` o `SHIPPING`.
- Costo de envío configurable desde backend/admin o fallback temporal documentado.
- Checkout con selección de método de entrega y método de pago.
- Flujo Mercado Pago:
  - orden `PENDING_PAYMENT`;
  - pago `PENDING`;
  - creación de preferencia;
  - redirección a Mercado Pago;
  - retorno success/pending/failure;
  - webhook;
  - consulta real del pago;
  - actualización de orden/pago;
  - descuento de stock al pago aprobado.
- Flujo efectivo:
  - no crea preferencia Mercado Pago;
  - orden confirmada o pendiente de confirmación;
  - pago pendiente;
  - descuento de stock al crear/confirmar orden.
- Seguridad para creación de preferencias.
- Firma de webhook si `MERCADOPAGO_WEBHOOK_SECRET` está configurado.
- Estado de pago y método de pago visible en tracking, usuario y admin.
- Swagger actualizado.
- Tests críticos.
- `tasks.md` y `current-state.md`.

## Out of Scope

Este cambio no incluye:

- Reembolsos.
- Facturación fiscal.
- Conciliación contable.
- Reportes avanzados.
- Emails automáticos.
- WhatsApp automático.
- Cupones.
- Checkout Bricks.
- Gestión avanzada de envíos por zona.
- Cambios visuales grandes.

## Acceptance Criteria

- El checkout permite elegir retiro o envío.
- El checkout permite elegir Mercado Pago o efectivo.
- Si elige retiro, `shippingCost = 0`.
- Si elige envío, `shippingCost` se toma desde configuración backend/admin o fallback documentado.
- El backend calcula subtotal, envío y total.
- El frontend nunca envía el total a cobrar.
- La orden existe antes de pagar.
- Si `paymentMethod = MERCADOPAGO`, la orden nace `PENDING_PAYMENT` y el pago `PENDING`.
- Si `paymentMethod = MERCADOPAGO`, se puede crear preferencia.
- Si Mercado Pago aprueba el pago, la orden pasa a `PAID`.
- Si Mercado Pago aprueba el pago, el stock se descuenta una sola vez.
- Si `paymentMethod = CASH`, no se crea preferencia Mercado Pago.
- Si `paymentMethod = CASH`, el pedido queda confirmado o pendiente de confirmación.
- Si `paymentMethod = CASH`, el stock se descuenta al crear/confirmar orden.
- El admin ve método de pago y estado de pago.
- Tracking público ve método de pago y estado de pago.
- Usuario registrado ve método de pago y estado de pago.
- Webhook duplicado no duplica pagos ni descuenta stock dos veces.
- Swagger documenta checkout, pagos, webhook y configuración de envío.
- Tests backend pasan.
- Build backend y frontend pasan.