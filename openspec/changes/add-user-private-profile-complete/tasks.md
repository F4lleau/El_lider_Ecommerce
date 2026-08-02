# Tasks: add-user-private-profile-complete

## 1. Auditoria inicial

- [x] Revisar rutas frontend actuales de usuario.
- [x] Revisar `ProtectedRoute`.
- [x] Revisar auth store/context.
- [x] Revisar endpoints actuales de usuario.
- [x] Revisar endpoints actuales de pedidos del usuario.
- [x] Revisar endpoints actuales de stock requests del usuario.
- [x] Revisar si existe modelo de direcciones.
- [x] Revisar helpers de labels existentes.
- [x] Revisar tests actuales.
- [x] Revisar Swagger.

## 2. Layout privado de usuario

- [x] Crear o completar layout de `/mi-cuenta`.
- [x] Agregar navegacion interna.
- [x] Agregar link a resumen.
- [x] Agregar link a perfil.
- [x] Agregar link a direcciones.
- [x] Agregar link a pedidos.
- [x] Agregar link a solicitudes de stock.
- [x] Agregar boton cerrar sesion si corresponde.
- [x] Hacer layout responsive.
- [x] Proteger rutas con usuario autenticado.

## 3. Dashboard `/mi-cuenta`

- [x] Crear pantalla resumen.
- [x] Mostrar saludo con nombre.
- [x] Mostrar ultimos pedidos.
- [x] Mostrar solicitudes de stock pendientes.
- [x] Mostrar direccion principal si existe.
- [x] Mostrar accesos rapidos.
- [x] Manejar loading.
- [x] Manejar error.
- [x] Manejar empty states.

## 4. Perfil `/mi-cuenta/perfil`

- [x] Crear pantalla perfil.
- [x] Cargar datos del usuario autenticado.
- [x] Mostrar nombre.
- [x] Mostrar apellido si existe.
- [x] Mostrar email.
- [x] Mostrar telefono si existe en modelo. No aplica: `User` no tiene telefono.
- [x] Permitir editar datos basicos.
- [x] Validar campos.
- [x] Guardar cambios.
- [x] Mostrar mensaje de exito.
- [x] Mostrar errores claros.
- [x] No permitir modificar datos de otro usuario.

## 5. Backend perfil

- [x] Crear o reutilizar `GET /api/users/me`.
- [x] Crear o reutilizar `PATCH /api/users/me`.
- [x] Validar token.
- [x] Tomar usuario desde token.
- [x] No aceptar `userId` desde frontend.
- [x] Validar email si es editable. No aplica: email solo lectura.
- [x] Validar telefono si corresponde. No aplica: `User` no tiene telefono.
- [x] Actualizar Swagger si corresponde.
- [x] Agregar tests.

## 6. Direcciones backend

- [x] Revisar si existe modelo de direcciones.
- [x] Crear modelo si no existe. No aplica: ya existia `Address`.
- [x] Crear migracion si corresponde. No aplica: no hubo cambio de schema.
- [x] Crear `GET /api/users/me/addresses`.
- [x] Crear `POST /api/users/me/addresses`.
- [x] Crear `PATCH /api/users/me/addresses/:id`.
- [x] Crear `DELETE /api/users/me/addresses/:id`.
- [x] Crear `PATCH /api/users/me/addresses/:id/default`.
- [x] Validar ownership.
- [x] Permitir una sola direccion principal.
- [x] Actualizar Swagger.
- [x] Agregar tests.

## 7. Direcciones frontend

- [x] Crear pantalla `/mi-cuenta/direcciones`.
- [x] Listar direcciones.
- [x] Crear formulario de direccion.
- [x] Editar direccion.
- [x] Eliminar direccion.
- [x] Marcar direccion principal.
- [x] Mostrar empty state.
- [x] Mostrar loading.
- [x] Mostrar errores.
- [x] Mostrar exito.

## 8. Pedidos backend

- [x] Crear o reutilizar `GET /api/users/me/orders`.
- [x] Crear o reutilizar `GET /api/users/me/orders/:id`.
- [x] Listar solo pedidos propios.
- [x] Validar ownership en detalle.
- [x] Incluir items.
- [x] Incluir SKU.
- [x] Incluir totales.
- [x] Incluir metodo de pago.
- [x] Incluir estado de pago.
- [x] Incluir metodo de entrega.
- [x] Incluir estado de pedido.
- [x] Incluir numero de seguimiento.
- [x] Actualizar Swagger.
- [x] Agregar tests.

## 9. Pedidos frontend

- [x] Crear pantalla `/mi-cuenta/pedidos`.
- [x] Listar pedidos propios.
- [x] Mostrar numero de orden.
- [x] Mostrar numero de seguimiento.
- [x] Mostrar fecha.
- [x] Mostrar total.
- [x] Mostrar metodo de entrega en espanol.
- [x] Mostrar metodo de pago en espanol.
- [x] Mostrar estado de pedido en espanol.
- [x] Mostrar estado de pago en espanol.
- [x] Crear boton ver detalle.
- [x] Manejar loading.
- [x] Manejar error.
- [x] Manejar empty state.

## 10. Detalle de pedido frontend

- [x] Crear pantalla `/mi-cuenta/pedidos/:id`.
- [x] Mostrar datos generales.
- [x] Mostrar productos.
- [x] Mostrar imagen si existe.
- [x] Mostrar SKU.
- [x] Mostrar cantidad.
- [x] Mostrar precio unitario.
- [x] Mostrar subtotal por item.
- [x] Mostrar subtotal productos.
- [x] Mostrar costo de envio.
- [x] Mostrar total.
- [x] Mostrar direccion de entrega si es envio.
- [x] Mostrar mensaje para retiro si es pickup.
- [x] Mostrar pago pendiente efectivo si corresponde.
- [x] Mostrar boton pagar con Mercado Pago si corresponde.
- [x] Manejar pedido no encontrado.
- [x] Manejar acceso no autorizado.

## 11. Solicitudes de stock backend

- [x] Crear o reutilizar `GET /api/users/me/stock-requests`.
- [x] Crear o reutilizar `PATCH /api/users/me/stock-requests/:id/cancel`.
- [x] Listar solo solicitudes propias.
- [x] Validar ownership.
- [x] Permitir cancelar solo si corresponde.
- [x] Incluir datos del producto.
- [x] Actualizar Swagger.
- [x] Agregar tests.

## 12. Solicitudes de stock frontend

- [x] Crear pantalla `/mi-cuenta/solicitudes-stock`.
- [x] Listar solicitudes propias.
- [x] Mostrar producto.
- [x] Mostrar imagen si existe.
- [x] Mostrar fecha.
- [x] Mostrar estado en espanol.
- [x] Boton ver producto.
- [x] Boton cancelar si corresponde.
- [x] Manejar loading.
- [x] Manejar error.
- [x] Manejar empty state.

## 13. Labels y UX

- [x] Reutilizar `orderStatusLabel`.
- [x] Reutilizar `paymentStatusLabel`.
- [x] Reutilizar `paymentMethodLabel`.
- [x] Reutilizar `deliveryMethodLabel`.
- [x] Crear `stockRequestStatusLabel` si falta.
- [x] Asegurar textos en espanol.
- [x] Revisar responsive.
- [x] Revisar mensajes de error.
- [x] Revisar botones y navegacion.

## 14. Seguridad

- [x] Verificar rutas protegidas frontend.
- [x] Verificar endpoints protegidos backend.
- [x] Evitar acceso a datos de otro usuario.
- [x] No aceptar `userId` desde frontend para recursos privados.
- [x] Validar ownership en direcciones.
- [x] Validar ownership en pedidos.
- [x] Validar ownership en stock requests.
- [x] Agregar tests de acceso denegado.

## 15. Swagger

- [x] Documentar perfil.
- [x] Documentar direcciones.
- [x] Documentar pedidos del usuario.
- [x] Documentar detalle de pedido.
- [x] Documentar solicitudes de stock.
- [x] Documentar errores 400.
- [x] Documentar errores 401.
- [x] Documentar errores 403. No aplica a endpoints propios: se responde 404 para recursos ajenos.
- [x] Documentar errores 404.
- [x] Validar `/api/docs`.

## 16. Tests backend

- [x] Test ver perfil propio.
- [x] Test editar perfil propio.
- [x] Test crear direccion.
- [x] Test editar direccion propia.
- [x] Test rechazar direccion ajena.
- [x] Test marcar direccion principal.
- [x] Test listar pedidos propios.
- [x] Test rechazar pedido ajeno.
- [x] Test detalle pedido propio.
- [x] Test listar solicitudes propias.
- [x] Test cancelar solicitud propia.
- [x] Test rechazar solicitud ajena.

## 17. Tests frontend

- [x] Test render `/mi-cuenta`.
- [x] Test render `/mi-cuenta/perfil`.
- [x] Test render `/mi-cuenta/direcciones`.
- [x] Test render `/mi-cuenta/pedidos`.
- [x] Test render `/mi-cuenta/pedidos/:id`.
- [x] Test render `/mi-cuenta/solicitudes-stock`.
- [x] Test usuario no autenticado redirige a login.
- [x] Test labels en espanol si existe setup.

## 18. Validacion manual

- [ ] Login como usuario registrado.
- [ ] Entrar a `/mi-cuenta`.
- [ ] Editar perfil.
- [ ] Crear direccion.
- [ ] Marcar direccion principal.
- [ ] Crear pedido como usuario registrado.
- [ ] Ver pedido en `/mi-cuenta/pedidos`.
- [ ] Ver detalle de pedido.
- [ ] Confirmar labels en espanol.
- [ ] Crear solicitud de stock como usuario.
- [ ] Ver solicitud en mi cuenta.
- [ ] Cancelar solicitud si corresponde.
- [ ] Confirmar que invitado no entra a `/mi-cuenta`.

## 19. Build y cierre

- [x] Ejecutar migracion si aplica. No aplica: no hubo cambio Prisma.
- [x] Ejecutar `prisma generate` si aplica. No aplica: no hubo cambio Prisma.
- [x] Ejecutar build backend.
- [x] Ejecutar build frontend.
- [x] Ejecutar tests backend.
- [x] Ejecutar tests frontend existentes.
- [x] Validar Swagger HTTP 200.
- [x] Actualizar `tasks.md`.
- [x] Crear `current-state.md`.
