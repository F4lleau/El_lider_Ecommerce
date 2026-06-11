# Tasks: add-public-cart

## 1. Auditoría carrito existente

- [x] Revisar si existen modelos `Cart` y `CartItem` en Prisma.
- [x] Revisar si existen rutas backend de carrito.
- [x] Revisar si existen controllers de carrito.
- [x] Revisar si existen services de carrito.
- [x] Revisar si Swagger ya documenta carrito.
- [x] Revisar si frontend tiene página `/carrito`.
- [x] Revisar si existe store/context de carrito.
- [x] Revisar si ProductCard tiene botón de carrito.
- [x] Revisar si hay lógica localStorage existente.
- [x] Revisar tests existentes de carrito.

## 2. Prisma y backend model

- [x] Confirmar modelo `Cart`.
- [x] Confirmar modelo `CartItem`.
- [x] Confirmar relación con `User`.
- [x] Confirmar relación con `Product`.
- [x] Ajustar schema si hace falta.
- [x] Crear migración si hace falta.
- [x] Generar Prisma Client.
- [x] Validar seed si impacta productos/stock.

## 3. Backend endpoints

- [x] Implementar o ajustar `GET /api/cart`.
- [x] Implementar o ajustar `POST /api/cart/items`.
- [x] Implementar o ajustar `PATCH /api/cart/items/:itemId`.
- [x] Implementar o ajustar `DELETE /api/cart/items/:itemId`.
- [x] Implementar o ajustar `DELETE /api/cart`.
- [x] Implementar `POST /api/cart/sync`.
- [x] Implementar `POST /api/cart/validate` si se requiere para invitado.
- [x] Validar producto existente.
- [x] Validar producto activo.
- [x] Validar stock.
- [x] Recalcular precios desde backend.
- [x] Calcular subtotal.
- [x] Evitar devolver datos innecesarios.

## 4. Backend auth behavior

- [x] Permitir carrito invitado desde frontend local.
- [x] Permitir endpoints backend de carrito para usuario autenticado.
- [x] Definir comportamiento de `GET /api/cart` sin token.
- [x] Definir comportamiento de `POST /api/cart/sync` con token.
- [x] Rechazar sync sin token.
- [x] Asociar carrito a usuario autenticado.
- [x] Evitar que un usuario acceda al carrito de otro.

## 5. Swagger

- [x] Documentar `GET /api/cart`.
- [x] Documentar `POST /api/cart/items`.
- [x] Documentar `PATCH /api/cart/items/:itemId`.
- [x] Documentar `DELETE /api/cart/items/:itemId`.
- [x] Documentar `DELETE /api/cart`.
- [x] Documentar `POST /api/cart/sync`.
- [x] Documentar request/response examples.
- [x] Documentar errores 400, 401, 404 y 409.
- [x] Validar `/api/docs`.

## 6. Frontend cart state

- [x] Crear o ajustar estado global de carrito.
- [x] Persistir carrito invitado en localStorage.
- [x] Cargar carrito desde localStorage al iniciar.
- [x] Cargar carrito backend si hay usuario logueado.
- [x] Sincronizar carrito local después de login.
- [x] Limpiar carrito local luego del sync exitoso.
- [x] Actualizar contador de carrito.
- [x] Manejar loading.
- [x] Manejar errores.

## 7. Frontend ProductCard

- [x] Conectar botón “Agregar al carrito”.
- [x] Deshabilitar botón si producto sin stock.
- [x] Mostrar feedback visual al agregar.
- [x] Actualizar contador.
- [x] Evitar agregar cantidades inválidas.
- [x] Manejar error de stock.

## 8. Frontend página carrito

- [x] Crear o ajustar página `/carrito`.
- [x] Mostrar estado vacío.
- [x] Mostrar lista de items.
- [x] Mostrar imagen de producto.
- [x] Mostrar nombre.
- [x] Mostrar precio unitario.
- [x] Mostrar cantidad.
- [x] Mostrar subtotal por item.
- [x] Mostrar subtotal general.
- [x] Implementar sumar cantidad.
- [x] Implementar restar cantidad.
- [x] Implementar eliminar item.
- [x] Implementar vaciar carrito.
- [x] Agregar botón continuar comprando.
- [x] Agregar botón ir a checkout.

## 9. Tests backend

- [x] Test agregar producto al carrito.
- [x] Test agregar producto inexistente.
- [x] Test agregar producto inactivo.
- [x] Test agregar producto sin stock.
- [x] Test actualizar cantidad.
- [x] Test eliminar item.
- [x] Test vaciar carrito.
- [x] Test sync carrito invitado.
- [x] Test usuario no accede carrito ajeno.

## 10. Tests frontend

- [ ] Test automatizado React de ProductCard agrega producto. Pendiente: no existe harness de componentes React.
- [ ] Test automatizado React de carrito vacío. Pendiente: no existe harness de componentes React.
- [ ] Test automatizado React de carrito con items. Pendiente: no existe harness de componentes React.
- [x] Test sumar cantidad.
- [x] Test restar cantidad.
- [x] Test eliminar item.
- [x] Test vaciar carrito.
- [ ] Test automatizado React de subtotal. Cubierto en backend; pendiente harness de componentes React.
- [x] Test contador de carrito.

## 11. Validación manual

- [x] Agregar producto como invitado.
- [x] Refrescar página y confirmar persistencia.
- [x] Eliminar producto como invitado.
- [x] Vaciar carrito como invitado.
- [x] Login con carrito local y confirmar sync.
- [x] Agregar producto como usuario logueado.
- [x] Refrescar página y confirmar persistencia backend.
- [x] Validar producto sin stock.
- [x] Validar build backend.
- [x] Validar build frontend.
- [x] Validar Swagger.

## 12. Cierre del change

- [x] Confirmar carrito invitado funcional.
- [x] Confirmar carrito usuario funcional.
- [x] Confirmar sync login funcional.
- [x] Confirmar backend como fuente de precios.
- [x] Confirmar validación de stock.
- [x] Confirmar tests críticos.
- [x] Crear `current-state.md`.
