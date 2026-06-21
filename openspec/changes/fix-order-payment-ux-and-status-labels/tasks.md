# Tasks: fix-order-payment-ux-and-status-labels

## 1. Auditoria inicial

- [x] Revisar pantalla de confirmacion de pedido.
- [x] Revisar pantalla de pago Mercado Pago.
- [x] Revisar success/pending/failure.
- [x] Revisar tracking publico.
- [x] Revisar seguimiento.
- [x] Revisar mis pedidos.
- [x] Revisar detalle de pedido usuario.
- [x] Revisar admin pedidos.
- [x] Revisar admin detalle pedido.
- [x] Revisar endpoint preferencia Mercado Pago.
- [x] Revisar endpoint checkout validate.
- [x] Revisar endpoint admin order status.
- [x] Revisar tests existentes relacionados.

## 2. Helpers de labels

- [x] Crear helper `orderStatusLabel`.
- [x] Crear helper `paymentStatusLabel`.
- [x] Crear helper `paymentMethodLabel`.
- [x] Crear helper `deliveryMethodLabel`.
- [x] Mapear `PENDING_PAYMENT`.
- [x] Mapear `PAID`.
- [x] Mapear `CONFIRMED`.
- [x] Mapear `PENDING_CONFIRMATION` si existe.
- [x] Mapear `PREPARING`.
- [x] Mapear `READY_FOR_PICKUP`.
- [x] Mapear `SHIPPED`.
- [x] Mapear `DELIVERED`.
- [x] Mapear `CANCELLED`.
- [x] Mapear `REFUNDED`.
- [x] Mapear `PENDING`.
- [x] Mapear `APPROVED`.
- [x] Mapear `IN_PROCESS`.
- [x] Mapear `REJECTED`.
- [x] Mapear `CASH`.
- [x] Mapear `MERCADOPAGO`.
- [x] Mapear `PICKUP`.
- [x] Mapear `SHIPPING`.

## 3. Textos usuario

- [x] Reemplazar `Tracking` por `Numero de seguimiento`.
- [x] Reemplazar `tracking code` por `codigo de seguimiento`.
- [x] Agregar mensaje para guardar codigo de seguimiento.
- [x] Traducir metodo de pago en confirmacion.
- [x] Traducir metodo de entrega en confirmacion.
- [x] Traducir estado en confirmacion.
- [x] Mejorar mensaje CASH + PICKUP.
- [x] Mejorar mensaje CASH + SHIPPING.
- [x] Mostrar costo de envio y total en CASH + SHIPPING.
- [x] Mantener boton "Ver seguimiento".

## 4. Tracking y pedidos usuario

- [x] Usar labels en tracking publico.
- [x] Usar labels en seguimiento.
- [x] Usar labels en mis pedidos.
- [x] Usar labels en detalle pedido usuario.
- [x] Mostrar "Numero de seguimiento".
- [x] Mostrar metodo de pago en espanol.
- [x] Mostrar metodo de entrega en espanol.
- [x] Mostrar estado de pedido en espanol.
- [x] Mostrar estado de pago en espanol.

## 5. Admin pedidos

- [x] Usar labels en listado admin pedidos.
- [x] Usar labels en detalle admin pedido.
- [x] Mostrar metodo de pago en espanol.
- [x] Mostrar metodo de entrega en espanol.
- [x] Mostrar estado de pedido en espanol.
- [x] Mostrar estado de pago en espanol.
- [x] Implementar opciones de estado segun `deliveryMethod`.
- [x] Para PICKUP mostrar estados de retiro.
- [x] Para SHIPPING mostrar estados de envio.
- [x] Para PENDING_PAYMENT mostrar estado pendiente de pago.
- [x] Manejar 409 con mensaje claro.
- [x] Evitar mostrar transiciones invalidas si es posible.

## 6. Mercado Pago preferencia 502

- [x] Auditar lectura de `MERCADOPAGO_ACCESS_TOKEN`.
- [x] Verificar token de prueba `TEST-`.
- [x] Auditar `FRONTEND_URL`.
- [x] Auditar `BACKEND_URL`.
- [x] Evaluar agregar `BACKEND_PUBLIC_URL`.
- [x] Confirmar orden `paymentMethod = MERCADOPAGO`.
- [x] Confirmar orden `status = PENDING_PAYMENT`.
- [x] Confirmar uso de `order.total`.
- [x] Confirmar `back_urls`.
- [x] Confirmar `notification_url`.
- [x] Permitir omitir `notification_url` en local si corresponde.
- [x] Loguear error real controlado en backend.
- [x] Devolver mensaje de error util.
- [x] Mostrar error util en frontend.
- [x] Agregar boton reintentar.
- [x] Agregar boton ver seguimiento.

## 7. Checkout validate 400

- [x] Auditar cuando se llama `/api/checkout/validate`.
- [x] Detectar si se llama con carrito vacio.
- [x] Detectar si se llama despues de crear orden.
- [x] Evitar requests repetidos innecesarios.
- [x] Limpiar carrito despues de crear orden si corresponde.
- [x] Asegurar que payment page no dependa de carrito.
- [x] Mostrar mensaje claro si carrito vacio.
- [x] Evitar spam de errores 400.

## 8. Admin status 409

- [x] Auditar respuesta 409 del backend.
- [x] Revisar transiciones permitidas.
- [x] Ajustar UI para no ofrecer estados invalidos si corresponde.
- [x] Mostrar mensaje claro en 409.
- [x] No dejar error solo en consola.
- [x] Agregar test o validacion manual.

## 9. Tests

- [x] Test helpers de labels.
- [x] Test labels payment method.
- [x] Test labels delivery method.
- [x] Test labels order status.
- [x] Test CASH + PICKUP confirmation.
- [x] Test CASH + SHIPPING confirmation.
- [x] Test admin estados por pickup.
- [x] Test admin estados por shipping.
- [x] Test Mercado Pago error handling.
- [x] Test checkout validate no se repite innecesariamente.
- [x] Ejecutar tests backend relacionados.
- [x] Ejecutar tests frontend existentes.

## 10. Validacion manual

- [x] Crear pedido invitado CASH + PICKUP.
- [x] Ver confirmacion clara.
- [x] Ver numero de seguimiento.
- [x] Ver seguimiento publico.
- [x] Crear pedido invitado CASH + SHIPPING.
- [x] Ver costo de envio y total.
- [x] Crear pedido MERCADOPAGO.
- [x] Probar boton pagar.
- [x] Si Mercado Pago falla, ver error claro.
- [x] Ver pedido en admin.
- [x] Confirmar labels en admin.
- [x] Cambiar estado pickup.
- [x] Cambiar estado shipping.
- [x] Confirmar manejo 409.
- [x] Confirmar que rutas publicas siguen funcionando.

## 11. Build y documentacion

- [x] Ejecutar build backend.
- [x] Ejecutar build frontend.
- [x] Validar Swagger HTTP 200.
- [x] Actualizar Swagger si cambian responses.
- [x] Crear `current-state.md`.
- [x] Documentar errores corregidos.
- [x] Documentar limitaciones pendientes.

## 12. Cierre

- [x] Confirmar UX de seguimiento mejorada.
- [x] Confirmar labels en espanol.
- [x] Confirmar estados por tipo de entrega.
- [x] Confirmar error Mercado Pago mejorado o corregido.
- [x] Confirmar 400 checkout validate resuelto o documentado.
- [x] Confirmar 409 admin resuelto o manejado.
- [x] Confirmar que no se implemento recupero de contrasena.
