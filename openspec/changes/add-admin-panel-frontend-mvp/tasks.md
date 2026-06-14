# Tasks: add-admin-panel-frontend-mvp

## 1. AuditorÃ­a inicial

- [x] Revisar ruta actual `/admin`.
- [x] Revisar `AdminRoute`.
- [x] Revisar auth store/context.
- [x] Revisar layout pÃºblico actual.
- [x] Revisar si existe layout admin.
- [x] Revisar servicios frontend existentes.
- [x] Revisar endpoints admin disponibles.
- [x] Revisar componentes UI reutilizables.
- [x] Revisar manejo de tokens en requests.
- [x] Revisar estado actual de `/admin` placeholder.
- [x] Revisar tests frontend existentes.

## 2. Rutas admin

- [x] Redirigir `/admin` a `/admin/dashboard`.
- [x] Crear ruta `/admin/dashboard`.
- [x] Crear ruta `/admin/productos`.
- [x] Crear ruta `/admin/productos/nuevo`.
- [x] Crear ruta `/admin/productos/:id/editar`.
- [x] Crear ruta `/admin/categorias`.
- [x] Crear ruta `/admin/categorias/nueva`.
- [x] Crear ruta `/admin/categorias/:id/editar`.
- [x] Crear ruta `/admin/pedidos`.
- [x] Crear ruta `/admin/pedidos/:id`.
- [x] Crear ruta `/admin/solicitudes-stock`.
- [x] Proteger todas con `AdminRoute`.

## 3. Admin layout

- [x] Crear o ajustar `AdminLayout`.
- [x] Crear sidebar admin.
- [x] Crear header admin.
- [x] Mostrar nombre/email del admin.
- [x] Agregar logout.
- [x] Agregar link volver a tienda.
- [x] Agregar navegaciÃ³n a Dashboard.
- [x] Agregar navegaciÃ³n a Productos.
- [x] Agregar navegaciÃ³n a CategorÃ­as.
- [x] Agregar navegaciÃ³n a Pedidos.
- [x] Agregar navegaciÃ³n a Solicitudes de stock.
- [x] Implementar responsive bÃ¡sico.
- [x] Evitar overflow horizontal.

## 4. Servicios frontend admin

- [x] Crear o ajustar servicio admin productos.
- [x] Crear o ajustar servicio admin categorÃ­as.
- [x] Crear o ajustar servicio admin pedidos.
- [x] Crear o ajustar servicio admin solicitudes de stock.
- [x] Crear o ajustar servicio dashboard.
- [x] Asegurar envÃ­o de token.
- [x] Manejar errores 401.
- [x] Manejar errores 403.
- [x] No usar datos mock.

## 5. Dashboard

- [x] Crear dashboard admin.
- [x] Mostrar productos activos.
- [x] Mostrar categorÃ­as activas.
- [x] Mostrar pedidos pendientes.
- [x] Mostrar solicitudes de stock pendientes.
- [x] Mostrar productos sin stock.
- [x] Mostrar accesos rÃ¡pidos.
- [x] Mostrar loading state.
- [x] Mostrar error state.
- [x] Mostrar empty state si corresponde.

## 6. Productos listado

- [x] Crear pÃ¡gina productos admin.
- [x] Listar productos desde API.
- [x] Mostrar imagen.
- [x] Mostrar nombre.
- [x] Mostrar categorÃ­a.
- [x] Mostrar precio.
- [x] Mostrar compareAtPrice.
- [x] Mostrar stock.
- [x] Mostrar flags oferta/nuevo/destacado.
- [x] Mostrar estado activo/inactivo.
- [x] Agregar bÃºsqueda por nombre.
- [x] Agregar filtro categorÃ­a.
- [x] Agregar filtro estado.
- [x] Agregar filtro stock.
- [x] Agregar filtro oferta.
- [x] Agregar acciones.
- [x] Implementar activar/desactivar.
- [x] Implementar ajuste rÃ¡pido stock.
- [x] Implementar ajuste rÃ¡pido precio.
- [x] Mostrar loading/error/empty.

## 7. Producto formulario

- [x] Crear formulario reutilizable producto.
- [x] Crear producto.
- [x] Editar producto.
- [x] Cargar categorÃ­as para select.
- [x] Validar nombre requerido.
- [x] Validar categorÃ­a requerida.
- [x] Validar precio positivo.
- [x] Validar stock no negativo.
- [x] Validar compareAtPrice si oferta.
- [x] Manejar imagen URL o estructura existente.
- [x] Guardar flags isOffer/isNew/isFeatured/isActive.
- [x] Mostrar feedback Ã©xito.
- [x] Mostrar feedback error.
- [x] Redirigir al listado al guardar.

## 8. CategorÃ­as listado

- [x] Crear pÃ¡gina categorÃ­as admin.
- [x] Listar categorÃ­as desde API.
- [x] Mostrar nombre.
- [x] Mostrar slug.
- [x] Mostrar estado.
- [x] Mostrar cantidad de productos si API lo permite.
- [x] Agregar acciones.
- [x] Implementar activar/desactivar.
- [x] Mostrar loading/error/empty.

## 9. CategorÃ­a formulario

- [x] Crear formulario reutilizable categorÃ­a.
- [x] Crear categorÃ­a.
- [x] Editar categorÃ­a.
- [x] Validar nombre requerido.
- [x] Validar slug si se ingresa.
- [x] Guardar descripciÃ³n si existe.
- [x] Guardar imagen si existe.
- [x] Guardar estado activo/inactivo.
- [x] Mostrar feedback Ã©xito.
- [x] Mostrar feedback error.
- [x] Redirigir al listado al guardar.

## 10. Pedidos listado

- [x] Crear pÃ¡gina pedidos admin.
- [x] Listar pedidos desde API.
- [x] Mostrar orderNumber.
- [x] Mostrar trackingCode.
- [x] Mostrar cliente.
- [x] Mostrar fecha.
- [x] Mostrar total.
- [x] Mostrar status.
- [x] Mostrar paymentStatus.
- [x] Mostrar deliveryMethod.
- [x] Agregar filtro por estado.
- [x] Agregar filtro por mÃ©todo de entrega.
- [x] Agregar bÃºsqueda por tracking/cliente.
- [x] Agregar link a detalle.
- [x] Mostrar loading/error/empty.

## 11. Pedido detalle

- [x] Crear pÃ¡gina detalle de pedido admin.
- [x] Mostrar datos generales.
- [x] Mostrar datos del cliente.
- [x] Mostrar productos.
- [x] Mostrar subtotal.
- [x] Mostrar envÃ­o.
- [x] Mostrar total.
- [x] Mostrar tracking.
- [x] Mostrar direcciÃ³n si shipping.
- [x] Permitir cambio de estado.
- [x] Mostrar feedback Ã©xito.
- [x] Mostrar feedback error.
- [x] Volver al listado.

## 12. Solicitudes de stock

- [x] Crear pÃ¡gina solicitudes de stock admin.
- [x] Listar solicitudes desde API.
- [x] Mostrar producto.
- [x] Mostrar cliente/invitado.
- [x] Mostrar email.
- [x] Mostrar telÃ©fono.
- [x] Mostrar estado.
- [x] Mostrar fecha.
- [x] Filtrar por estado.
- [x] Cambiar estado.
- [x] Mostrar feedback Ã©xito.
- [x] Mostrar feedback error.
- [x] Mostrar loading/error/empty.

## 13. Seguridad frontend

- [x] Confirmar que visitante no entra a `/admin`.
- [x] Confirmar que usuario `USER` no entra a `/admin`.
- [x] Confirmar que usuario `ADMIN` entra.
- [x] Confirmar que token se envÃ­a en endpoints admin.
- [x] Manejar 401 con redirecciÃ³n a login.
- [x] Manejar 403 con acceso denegado.

## 14. ValidaciÃ³n visual y funcional

- [x] Validar `/admin/dashboard`.
- [x] Validar `/admin/productos`.
- [ ] Validar crear producto.
- [ ] Validar editar producto.
- [ ] Validar activar/desactivar producto.
- [ ] Validar ajuste rÃ¡pido stock.
- [ ] Validar ajuste rÃ¡pido precio.
- [x] Validar `/admin/categorias`.
- [ ] Validar crear categorÃ­a.
- [ ] Validar editar categorÃ­a.
- [x] Validar `/admin/pedidos`.
- [x] Validar `/admin/pedidos/:id`.
- [ ] Validar cambio estado pedido.
- [x] Validar `/admin/solicitudes-stock`.
- [ ] Validar cambio estado solicitud.
- [ ] Validar responsive bÃ¡sico.
- [x] Validar que rutas pÃºblicas no se rompen.
- [ ] Validar login/logout admin.

## 15. Build y tests

- [x] Ejecutar build frontend.
- [x] Ejecutar tests frontend existentes.
- [x] Ejecutar build backend si se tocÃ³ algo compartido.
- [x] Confirmar que no aumentan errores de lint existentes.
- [x] Registrar limitaciones de testing si no hay harness frontend completo.

## 16. Cierre

- [x] Confirmar panel admin MVP funcional.
- [x] Confirmar que no queda placeholder en `/admin`.
- [x] Confirmar que se usan endpoints reales.
- [x] Confirmar que se puede operar productos.
- [x] Confirmar que se puede operar categorÃ­as.
- [x] Confirmar que se pueden ver pedidos.
- [x] Confirmar que se pueden gestionar solicitudes de stock.
- [x] Crear `current-state.md`.
- [x] Confirmar que se puede continuar con Mercado Pago.
