# Tasks: add-mercadopago-payments

## 1. Auditoría inicial

- [x] Revisar modelo `Order`.
- [x] Revisar modelo `OrderItem`.
- [x] Revisar modelo `Payment` si existe.
- [x] Revisar enums de orden y pago.
- [x] Revisar checkout actual.
- [x] Revisar frontend `/checkout`.
- [x] Revisar frontend success/pending/failure.
- [x] Revisar panel admin pedidos.
- [x] Revisar variables `.env`.
- [x] Revisar Swagger.
- [x] Revisar tests existentes.

## 2. Variables y credenciales

- [x] Confirmar `MERCADOPAGO_ACCESS_TOKEN`.
- [x] Confirmar `MERCADOPAGO_PUBLIC_KEY`.
- [x] Configurar `MERCADOPAGO_WEBHOOK_SECRET` opcional.
- [x] Confirmar `FRONTEND_URL`.
- [x] Confirmar `BACKEND_URL`.
- [x] Confirmar o agregar `DEFAULT_SHIPPING_COST`.
- [x] Actualizar `.env.example`.
- [x] Documentar credenciales de prueba.

## 3. Modelo y migraciones

- [x] Aplicar migración `Payment`.
- [x] Verificar que tabla `Payment` exista.
- [x] Agregar o confirmar `paymentMethod` en `Order`.
- [x] Agregar o confirmar `paymentStatus` en `Order`.
- [x] Agregar o confirmar `deliveryMethod`.
- [x] Agregar o confirmar `shippingCost`.
- [x] Crear migración si falta.
- [x] Ejecutar `prisma generate`.
- [x] Ejecutar `prisma migrate status`.

## 4. Configuración de envío

- [x] Implementar configuración mínima de envío si no existe.
- [x] Crear endpoint público `GET /api/settings/shipping` si corresponde.
- [x] Crear endpoint admin `PATCH /api/admin/settings/shipping` si corresponde.
- [x] Agregar vista admin básica de costo de envío si corresponde.
- [x] Si se usa fallback `DEFAULT_SHIPPING_COST`, documentarlo.
- [x] Garantizar que `PICKUP` tenga costo 0.
- [x] Garantizar que `SHIPPING` tome costo desde backend.

## 5. Checkout backend

- [x] Aceptar `paymentMethod`.
- [x] Validar `paymentMethod = MERCADOPAGO | CASH`.
- [x] Validar `deliveryMethod = PICKUP | SHIPPING`.
- [x] Recalcular subtotal desde backend.
- [x] Calcular envío desde backend.
- [x] Calcular total desde backend.
- [x] Si `PICKUP`, shippingCost = 0.
- [x] Si `SHIPPING`, exigir dirección.
- [x] Si `SHIPPING`, aplicar costo configurado.
- [x] Si `MERCADOPAGO`, crear orden `PENDING_PAYMENT`.
- [x] Si `MERCADOPAGO`, paymentStatus `PENDING`.
- [x] Si `CASH`, no crear preferencia.
- [x] Si `CASH`, crear orden `CONFIRMED` o `PENDING_CONFIRMATION`.
- [x] Si `CASH`, paymentStatus `PENDING`.
- [x] Si `CASH`, descontar stock al crear/confirmar orden.
- [x] Evitar sobreventa.
- [x] Devolver response clara para frontend.

## 6. Checkout frontend

- [x] Mostrar método de entrega.
- [x] Mostrar retiro en sucursal.
- [x] Mostrar envío a domicilio.
- [x] Mostrar dirección si envío.
- [x] Mostrar costo de envío si envío.
- [x] Mostrar método de pago.
- [x] Mostrar Mercado Pago.
- [x] Mostrar efectivo.
- [x] Mostrar subtotal/envío/total.
- [x] Botón “Crear pedido y pagar” si Mercado Pago.
- [x] Botón “Confirmar pedido” si efectivo.
- [x] Si Mercado Pago, dirigir a pantalla de pago o crear preferencia.
- [x] Si efectivo, mostrar confirmación de pedido.
- [x] Manejar errores de stock.
- [x] Manejar errores de validación.

## 7. Mercado Pago preferencia

- [x] Crear o ajustar endpoint `POST /api/payments/mercadopago/preference`.
- [x] Validar orden existente.
- [x] Validar orden `PENDING_PAYMENT`.
- [x] Validar `paymentMethod = MERCADOPAGO`.
- [x] Rechazar orden `CASH`.
- [x] Rechazar orden ya pagada.
- [x] Usar `order.total`.
- [x] No aceptar total desde frontend.
- [x] Configurar items desde `OrderItem`.
- [x] Configurar payer email.
- [x] Configurar external_reference.
- [x] Configurar notification_url.
- [x] Configurar back_urls.
- [x] Guardar preferenceId.
- [x] Crear/actualizar Payment.
- [x] Devolver initPoint/sandboxInitPoint.

## 8. Seguridad preferencia

- [x] Usuario autenticado solo puede pagar órdenes propias.
- [x] Invitado debe validar `orderId + trackingCode + email` o equivalente.
- [x] Admin puede consultar si corresponde.
- [x] No exponer órdenes ajenas.
- [x] No exponer rawResponse.
- [x] Tests de acceso permitido.
- [x] Tests de acceso denegado.

## 9. Webhook

- [x] Crear o ajustar webhook Mercado Pago.
- [x] Extraer payment id.
- [x] Consultar pago real en Mercado Pago.
- [x] Buscar orden por external_reference.
- [x] Mapear estados.
- [x] Actualizar Payment.
- [x] Actualizar Order.
- [x] Descontar stock si approved.
- [x] No descontar stock si pending/in_process/rejected.
- [x] Idempotencia para webhook duplicado.
- [x] Validar firma si `MERCADOPAGO_WEBHOOK_SECRET` existe.
- [x] Permitir modo test si secret vacío.
- [x] Responder 200 a eventos soportados.
- [x] Manejar eventos no soportados sin romper.

## 10. Estados

- [x] Mapear approved a `APPROVED` y `PAID`.
- [x] Mapear pending a `PENDING` y `PENDING_PAYMENT`.
- [x] Mapear in_process a `IN_PROCESS` y `PENDING_PAYMENT`.
- [x] Mapear rejected a `REJECTED`.
- [x] Mapear cancelled a `CANCELLED`.
- [x] Mapear refunded a `REFUNDED`.
- [x] Permitir reintento si rejected.
- [x] No duplicar Payment.

## 11. Panel admin

- [x] Mostrar `paymentMethod` en listado de pedidos.
- [x] Mostrar `paymentStatus` en listado de pedidos.
- [x] Mostrar `paymentMethod` en detalle de pedido.
- [x] Mostrar `paymentStatus` en detalle de pedido.
- [x] Mostrar `deliveryMethod`.
- [x] Mostrar `shippingCost`.
- [x] Si se implementa shipping settings, agregar pantalla admin mínima.
- [x] Permitir ver pedidos CASH y MERCADOPAGO claramente.

## 12. Tracking y usuario

- [x] Tracking público muestra método de pago.
- [x] Tracking público muestra estado de pago.
- [x] Mis pedidos muestra método de pago.
- [x] Mis pedidos muestra estado de pago.
- [x] Detalle de pedido usuario muestra método de pago.
- [x] Detalle de pedido usuario muestra estado de pago.
- [x] Success/pending/failure consultan backend.
- [x] No confiar en query params de Mercado Pago como confirmación final.

## 13. Swagger

- [x] Documentar checkout con `paymentMethod`.
- [x] Documentar checkout con `deliveryMethod`.
- [x] Documentar configuración de envío.
- [x] Documentar crear preferencia.
- [x] Documentar webhook.
- [x] Documentar estado de pago.
- [x] Documentar Payment schema.
- [x] Documentar errores 400.
- [x] Documentar errores 401.
- [x] Documentar errores 403.
- [x] Documentar errores 404.
- [x] Documentar errores 409.
- [x] Validar `/api/docs`.

## 14. Tests backend

- [x] Test CASH + PICKUP.
- [x] Test CASH + SHIPPING.
- [x] Test MERCADOPAGO + PICKUP.
- [x] Test MERCADOPAGO + SHIPPING.
- [x] Test CASH descuenta stock al crear/confirmar orden.
- [x] Test MERCADOPAGO no descuenta stock en checkout.
- [x] Test MERCADOPAGO descuenta stock con webhook approved.
- [x] Test webhook duplicado no descuenta doble.
- [x] Test preferencia usa `order.total`.
- [x] Test frontend no puede mandar total.
- [x] Test usuario no paga orden ajena.
- [x] Test invitado requiere validación.
- [x] Test Swagger.

## 15. Tests frontend / validación manual

- [x] Validar checkout muestra métodos de entrega.
- [x] Validar checkout muestra métodos de pago.
- [x] Validar CASH pickup.
- [x] Validar CASH shipping.
- [x] Validar Mercado Pago pickup.
- [x] Validar Mercado Pago shipping.
- [x] Validar success.
- [x] Validar pending.
- [x] Validar failure.
- [x] Validar admin pedidos.
- [x] Validar tracking.

## 16. Cierre

- [x] Ejecutar build backend.
- [x] Ejecutar build frontend.
- [x] Ejecutar tests backend.
- [x] Ejecutar tests frontend existentes.
- [x] Validar Swagger HTTP 200.
- [x] Marcar tasks completadas.
- [x] Crear `current-state.md`.
- [x] Documentar limitaciones de webhook real si no hay URL pública.
- [x] Confirmar que se puede cerrar `add-mercadopago-payments`.