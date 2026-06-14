# Change: add-checkout-and-delivery-options

## Summary

Implementar checkout para invitados y usuarios registrados, con retiro en sucursal o envío a domicilio, creación persistente de órdenes y seguimiento público.

## Motivation

El catálogo y carrito ya son funcionales, pero todavía no convierten una selección de productos en una orden comercial. Este change crea esa base antes de integrar Mercado Pago.

## Scope

- Checkout invitado y autenticado.
- Entrega `PICKUP` y `SHIPPING`.
- Costo de envío fijo configurable.
- Cálculo de subtotal, envío y total en backend.
- Validación de productos activos y stock.
- Orden con estado `PENDING_PAYMENT` y pago `PENDING`.
- Snapshots de productos y dirección.
- Número de orden y tracking code únicos.
- Tracking público.
- Pedidos propios y endpoints admin básicos.
- Frontend, Swagger y tests críticos.

## Out of Scope

- Mercado Pago y webhooks.
- Descuento definitivo de stock.
- Emails, WhatsApp, cupones y reportes.
- Panel admin frontend completo.
