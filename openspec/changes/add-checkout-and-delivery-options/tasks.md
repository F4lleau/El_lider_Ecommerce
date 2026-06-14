# Tasks: add-checkout-and-delivery-options

## 1. AuditorÃ­a inicial

- [x] Revisar modelo `Order` en Prisma.
- [x] Revisar modelo `OrderItem` en Prisma.
- [x] Revisar si existe modelo `Shipment`.
- [x] Revisar enums existentes de estado de orden.
- [x] Revisar enums existentes de estado de pago.
- [x] Revisar endpoints actuales de checkout.
- [x] Revisar endpoints actuales de Ã³rdenes.
- [x] Revisar servicios actuales de carrito.
- [x] Revisar lÃ³gica actual de stock.
- [x] Revisar frontend actual de `/checkout`.
- [x] Revisar frontend actual de `/carrito`.
- [x] Revisar rutas de usuario `/mi-cuenta`.
- [x] Revisar Swagger actual.

## 2. Modelo de datos

- [x] Confirmar campos de `Order`.
- [x] Confirmar campos de `OrderItem`.
- [x] Agregar `orderNumber` si no existe.
- [x] Agregar `trackingCode` si no existe.
- [x] Agregar `deliveryMethod` si no existe.
- [x] Agregar `shippingCost` si no existe.
- [x] Agregar `subtotal` si no existe.
- [x] Agregar `total` si no existe.
- [x] Agregar datos de invitado si no existen.
- [x] Agregar snapshot de direcciÃ³n o modelo `Shipment` si corresponde.
- [x] Crear migraciÃ³n Prisma si hace falta.
- [x] Generar Prisma Client.

## 3. Checkout backend

- [x] Implementar o ajustar `POST /api/checkout/validate`.
- [x] Implementar o ajustar `POST /api/checkout`.
- [x] Validar carrito invitado.
- [x] Validar carrito autenticado.
- [x] Validar carrito no vacÃ­o.
- [x] Validar producto existente.
- [x] Validar producto activo.
- [x] Validar stock suficiente.
- [x] Validar cantidades positivas.
- [x] Recalcular precio desde base de datos.
- [x] Calcular subtotal.
- [x] Calcular costo de envÃ­o.
- [x] Calcular total.
- [x] Crear orden.
- [x] Crear order items con snapshot.
- [x] Generar order number.
- [x] Generar tracking code.
- [x] Asociar orden a user si estÃ¡ autenticado.
- [x] Guardar datos de invitado si no estÃ¡ autenticado.
- [x] Vaciar carrito backend luego de crear orden, si corresponde.
- [x] Definir comportamiento del carrito invitado luego de orden creada.

## 4. MÃ©todos de entrega

- [x] Implementar `PICKUP`.
- [x] Implementar `SHIPPING`.
- [x] Validar que `PICKUP` tenga shippingCost 0.
- [x] Validar que `SHIPPING` requiera direcciÃ³n.
- [x] Implementar costo fijo de envÃ­o configurable.
- [x] Guardar direcciÃ³n de envÃ­o.
- [x] Devolver desglose subtotal/envÃ­o/total.
- [x] Mostrar datos de retiro en sucursal en response si corresponde.

## 5. Ã“rdenes pÃºblicas

- [x] Implementar `GET /api/orders/track/:trackingCode`.
- [x] Validar tracking code existente.
- [x] Definir si requiere email/telÃ©fono adicional.
- [x] Devolver estado de pedido.
- [x] Devolver estado de pago.
- [x] Devolver mÃ©todo de entrega.
- [x] Devolver productos.
- [x] Devolver totales.
- [x] No exponer datos sensibles innecesarios.

## 6. Ã“rdenes usuario registrado

- [x] Implementar `GET /api/me/orders`.
- [x] Implementar `GET /api/me/orders/:id`.
- [x] Proteger endpoints con `requireAuth`.
- [x] Filtrar pedidos por `userId`.
- [x] Evitar que usuario vea pedidos de otro usuario.
- [x] Devolver detalle con productos, totales, estado y tracking.

## 7. Ã“rdenes admin bÃ¡sicas

- [x] Implementar o ajustar `GET /api/admin/orders`.
- [x] Implementar o ajustar `GET /api/admin/orders/:id`.
- [x] Implementar o ajustar `PATCH /api/admin/orders/:id/status`.
- [x] Proteger endpoints con `requireRole("ADMIN")`.
- [x] Agregar filtros bÃ¡sicos por estado, fecha y mÃ©todo de entrega.
- [x] Permitir cambio de estado bÃ¡sico.
- [x] Validar transiciones mÃ­nimas.
- [x] Documentar limitaciones si el panel frontend no se implementa aÃºn.

## 8. Frontend checkout

- [x] Crear o ajustar ruta `/checkout`.
- [x] Redirigir a carrito si carrito estÃ¡ vacÃ­o.
- [x] Mostrar resumen del carrito.
- [x] Mostrar datos del comprador.
- [x] Permitir checkout invitado.
- [x] Permitir checkout usuario registrado.
- [x] Permitir selecciÃ³n retiro/envÃ­o.
- [x] Mostrar formulario de direcciÃ³n si envÃ­o.
- [x] Mostrar subtotal.
- [x] Mostrar costo de envÃ­o.
- [x] Mostrar total.
- [x] Enviar checkout al backend.
- [x] Manejar errores de stock.
- [x] Manejar errores de validaciÃ³n.
- [x] Mostrar confirmaciÃ³n con tracking code.

## 9. Frontend seguimiento

- [x] Crear o ajustar ruta `/pedido/:trackingCode`.
- [x] Crear o ajustar ruta `/seguimiento` si aplica.
- [x] Permitir buscar tracking code.
- [x] Mostrar estado de pedido.
- [x] Mostrar estado de pago.
- [x] Mostrar productos.
- [x] Mostrar mÃ©todo de entrega.
- [x] Mostrar totales.
- [x] Mostrar mensaje si no se encuentra pedido.

## 10. Frontend usuario registrado

- [x] Crear o ajustar `/mi-cuenta/pedidos`.
- [x] Crear o ajustar `/mi-cuenta/pedidos/:id`.
- [x] Mostrar listado de pedidos del usuario.
- [x] Mostrar fecha, total, estado y tracking.
- [x] Mostrar detalle del pedido.
- [x] Validar que requiere login.
- [x] Manejar estado vacÃ­o.

## 11. Swagger

- [x] Documentar `POST /api/checkout/validate`.
- [x] Documentar `POST /api/checkout`.
- [x] Documentar `GET /api/orders/track/:trackingCode`.
- [x] Documentar `GET /api/me/orders`.
- [x] Documentar `GET /api/me/orders/:id`.
- [x] Documentar `GET /api/admin/orders`.
- [x] Documentar `GET /api/admin/orders/:id`.
- [x] Documentar `PATCH /api/admin/orders/:id/status`.
- [x] Documentar schemas de checkout.
- [x] Documentar schemas de order.
- [x] Documentar errores 400.
- [x] Documentar errores 401.
- [x] Documentar errores 403.
- [x] Documentar errores 404.
- [x] Documentar errores 409.
- [x] Validar `/api/docs`.

## 12. Tests backend

- [x] Test checkout invitado con retiro.
- [x] Test checkout invitado con envÃ­o.
- [x] Test checkout usuario con retiro.
- [x] Test checkout usuario con envÃ­o.
- [x] Test carrito vacÃ­o.
- [x] Test producto inexistente.
- [x] Test producto inactivo.
- [x] Test producto sin stock.
- [x] Test cantidad mayor a stock.
- [x] Test subtotal calculado desde backend.
- [x] Test shipping cost pickup = 0.
- [x] Test shipping cost shipping > 0.
- [x] Test tracking code Ãºnico.
- [x] Test consulta pÃºblica por tracking.
- [x] Test usuario lista sus pedidos.
- [x] Test usuario no ve pedido ajeno.
- [x] Test admin lista pedidos.
- [x] Test admin cambia estado.

## 13. Tests frontend / E2E

- [ ] Test checkout muestra carrito.
- [ ] Test checkout valida datos obligatorios.
- [ ] Test checkout retiro no muestra direcciÃ³n.
- [ ] Test checkout envÃ­o exige direcciÃ³n.
- [ ] Test checkout muestra subtotal/envÃ­o/total.
- [ ] Test checkout crea orden.
- [ ] Test seguimiento por tracking.
- [ ] Test pedidos de usuario autenticado.
- [ ] Validar con Chrome headless flujo invitado.
- [ ] Validar con Chrome headless flujo usuario.

## 14. ValidaciÃ³n manual

- [x] Crear orden como invitado con retiro.
- [x] Crear orden como invitado con envÃ­o.
- [x] Crear orden como usuario con retiro.
- [x] Crear orden como usuario con envÃ­o.
- [x] Ver tracking code.
- [x] Consultar pedido por tracking.
- [ ] Ver pedido en `/mi-cuenta/pedidos`.
- [ ] Ver detalle de pedido en usuario.
- [x] Ver pedido desde endpoint admin.
- [x] Cambiar estado desde endpoint admin.
- [x] Confirmar que carrito vacÃ­o no permite checkout.
- [x] Confirmar errores de stock.
- [x] Confirmar build backend.
- [x] Confirmar build frontend.
- [x] Confirmar tests.
- [x] Confirmar Swagger.

## 15. Cierre

- [x] Confirmar checkout funcional.
- [x] Confirmar Ã³rdenes persistidas.
- [x] Confirmar tracking pÃºblico.
- [x] Confirmar pedidos del usuario.
- [x] Confirmar endpoints admin bÃ¡sicos.
- [x] Confirmar Swagger actualizado.
- [x] Crear `current-state.md`.
- [x] Confirmar que se puede avanzar a Mercado Pago.
