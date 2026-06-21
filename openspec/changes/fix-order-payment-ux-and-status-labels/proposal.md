Contenido:

# Change: fix-order-payment-ux-and-status-labels

## Summary

Corregir la experiencia de usuario del flujo de pedidos, pagos y seguimiento, traduciendo estados técnicos al español, mejorando los mensajes visibles para clientes y administradores, ajustando estados disponibles según método de entrega y revisando errores del flujo Mercado Pago, checkout validate y cambios de estado admin.

## Motivation

Después de implementar checkout, órdenes, pagos con Mercado Pago, efectivo, retiro en sucursal, envío a domicilio y panel admin, se detectaron problemas de experiencia y consistencia:

- El usuario invitado ve la palabra `Tracking`, que no es clara para un cliente común.
- Los métodos de pago, entrega y estados se muestran en inglés en distintas pantallas.
- El panel admin muestra estados técnicos en lugar de textos legibles.
- Los estados disponibles no siempre corresponden al tipo de entrega.
- Al intentar pagar con Mercado Pago aparece error 502 al crear la preferencia.
- El frontend muestra “error desconocido” en lugar de un mensaje útil.
- Al cambiar estados desde admin aparece 409 Conflict sin explicación clara.
- Se detectan llamadas 400 a `/api/checkout/validate`.
- No debe mezclarse este bugfix con recuperación de contraseña.

Este change busca estabilizar el flujo real de compra y hacerlo comprensible para usuarios finales y administradores.

## Scope

Este cambio incluye:

- Crear helpers de traducción de enums.
- Traducir estados de pedido.
- Traducir estados de pago.
- Traducir métodos de pago.
- Traducir métodos de entrega.
- Cambiar “Tracking” por “Número de seguimiento” o “Código de seguimiento”.
- Mejorar mensajes de confirmación para pedidos en efectivo.
- Mejorar mensajes de pago Mercado Pago.
- Mejorar manejo de errores al crear preferencia.
- Auditar y corregir error 502 en `POST /api/payments/mercadopago/preference`.
- Auditar y corregir o documentar errores 400 en `/api/checkout/validate`.
- Auditar y mejorar manejo de 409 en cambios de estado admin.
- Mostrar estados válidos según `deliveryMethod`.
- Usar labels en tracking público, mis pedidos, detalle de pedido y admin.
- Agregar tests relacionados.
- Documentar resultado en `current-state.md`.

## Out of Scope

Este cambio no incluye:

- Recupero de contraseña.
- Emails.
- WhatsApp.
- Reportes.
- Perfil usuario completo.
- Cambios visuales grandes.
- Nuevos métodos de pago.
- Nuevos métodos de entrega.
- Integración real de webhook con URL pública.
- Reembolsos.
- Facturación fiscal.

## Acceptance Criteria

- El usuario ya no ve la palabra `Tracking`.
- El usuario ve “Número de seguimiento” o “Código de seguimiento”.
- El usuario recibe un mensaje claro indicando que debe guardar el código para consultar su pedido.
- Los estados de pedido se muestran en español.
- Los estados de pago se muestran en español.
- Los métodos de pago se muestran en español.
- Los métodos de entrega se muestran en español.
- El admin no ve `CASH`, `PICKUP`, `SHIPPING`, `PENDING_PAYMENT` como texto principal.
- El tracking público muestra labels claros.
- Mis pedidos muestra labels claros.
- Admin pedidos muestra labels claros.
- Admin detalle de pedido muestra labels claros.
- Los estados disponibles en admin dependen del tipo de entrega.
- Para retiro en sucursal se muestran estados de retiro.
- Para envío a domicilio se muestran estados de envío.
- Si el backend devuelve 409 al cambiar estado, la UI muestra un mensaje claro.
- Si Mercado Pago falla al crear preferencia, se muestra un error útil y opción de reintento.
- El backend loguea o devuelve detalle controlado del error Mercado Pago.
- Se revisan los 400 de `/api/checkout/validate`.
- Build backend pasa.
- Build frontend pasa.
- Tests relacionados pasan.
- Swagger sigue respondiendo HTTP 200.