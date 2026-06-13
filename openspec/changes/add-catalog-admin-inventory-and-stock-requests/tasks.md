# Tasks: add-catalog-admin-inventory-and-stock-requests

## 1. AuditorÃ­a actual

- [x] Revisar modelo `Product` en Prisma.
- [x] Revisar modelo `Category` en Prisma.
- [x] Revisar modelo `ProductImage` en Prisma.
- [x] Revisar si existe `OrderItem`.
- [x] Revisar rutas pÃºblicas de productos.
- [x] Revisar rutas pÃºblicas de categorÃ­as.
- [x] Revisar si existen rutas admin de productos.
- [x] Revisar si existen rutas admin de categorÃ­as.
- [x] Revisar servicios actuales de productos.
- [x] Revisar servicios actuales de categorÃ­as.
- [x] Revisar Swagger actual de productos.
- [x] Revisar seed actual.
- [x] Revisar frontend pÃºblico de productos/categorÃ­as.
- [x] Revisar si se usan datos mock en frontend.

## 2. Seed inicial

- [x] Crear o actualizar seed de categorÃ­as principales.
- [x] Crear categorÃ­a ReposterÃ­a.
- [x] Crear categorÃ­a Descartables.
- [x] Crear categorÃ­a CotillÃ³n.
- [x] Crear categorÃ­a Envases.
- [x] Crear categorÃ­a GastronomÃ­a.
- [x] Crear al menos 20 productos.
- [x] Incluir productos con oferta.
- [x] Incluir productos destacados.
- [x] Incluir productos nuevos.
- [x] Incluir al menos 1 producto sin stock.
- [x] Incluir imÃ¡genes por producto.
- [x] Validar que los slugs sean Ãºnicos.
- [x] Ejecutar seed.
- [x] Confirmar productos en API pÃºblica.
- [x] Confirmar categorÃ­as en API pÃºblica.

## 3. Modelo y migraciones

- [x] Confirmar `price` como Decimal/string en API.
- [x] Confirmar `compareAtPrice`.
- [x] Confirmar `stock`.
- [x] Confirmar `isFeatured`.
- [x] Confirmar `isOffer`.
- [x] Confirmar `isNew`.
- [x] Confirmar `isActive`.
- [x] Agregar modelo `StockRequest` si no existe.
- [x] Agregar enum/status de solicitud si corresponde.
- [x] Crear migraciÃ³n Prisma si hace falta.
- [x] Generar Prisma Client.

## 4. Productos pÃºblicos

- [x] Confirmar `GET /api/products`.
- [x] Confirmar `GET /api/products/:id`.
- [x] Implementar o confirmar `GET /api/products/slug/:slug`.
- [x] Implementar o confirmar `GET /api/products/offers`.
- [x] Implementar o confirmar `GET /api/products/featured`.
- [x] Implementar o confirmar `GET /api/products/new`.
- [x] Implementar o confirmar `GET /api/products/best-sellers`.
- [x] Confirmar que productos inactivos no aparecen en catÃ¡logo pÃºblico.
- [x] Confirmar que productos sin stock aparecen como sin stock.
- [x] Confirmar que precios Decimal se devuelven como string.

## 5. CategorÃ­as pÃºblicas

- [x] Confirmar `GET /api/categories`.
- [x] Implementar o confirmar `GET /api/categories/:id/products`.
- [x] Implementar o confirmar `GET /api/categories/slug/:slug/products`.
- [x] Confirmar que categorÃ­as inactivas no aparecen pÃºblicamente.
- [x] Confirmar que productos de categorÃ­as inactivas no aparecen pÃºblicamente si corresponde.

## 6. Admin productos

- [x] Implementar `GET /api/admin/products`.
- [x] Implementar `POST /api/admin/products`.
- [x] Implementar `GET /api/admin/products/:id`.
- [x] Implementar `PATCH /api/admin/products/:id`.
- [x] Implementar `DELETE /api/admin/products/:id`.
- [x] Implementar `PATCH /api/admin/products/:id/stock`.
- [x] Implementar `PATCH /api/admin/products/:id/price`.
- [x] Validar datos requeridos.
- [x] Validar categorÃ­a existente.
- [x] Validar precio positivo.
- [x] Validar stock no negativo.
- [x] Generar slug si no viene.
- [x] Evitar slug duplicado.
- [x] Proteger rutas con `admin`.

## 7. Admin categorÃ­as

- [x] Implementar `GET /api/admin/categories`.
- [x] Implementar `POST /api/admin/categories`.
- [x] Implementar `GET /api/admin/categories/:id`.
- [x] Implementar `PATCH /api/admin/categories/:id`.
- [x] Implementar `DELETE /api/admin/categories/:id`.
- [x] Validar nombre requerido.
- [x] Generar slug si no viene.
- [x] Evitar slug duplicado.
- [x] Proteger rutas con `admin`.
- [x] Definir soft delete/desactivaciÃ³n si tiene productos asociados.

## 8. Solicitudes de stock

- [x] Crear modelo `StockRequest`.
- [x] Crear endpoint `POST /api/products/:productId/stock-requests`.
- [x] Permitir solicitud como invitado.
- [x] Permitir solicitud como usuario registrado.
- [x] Validar producto existente.
- [x] Validar email en invitado.
- [x] Validar telÃ©fono en invitado si se decide obligatorio.
- [x] Evitar duplicados excesivos por producto/email.
- [x] Crear endpoint `GET /api/me/stock-requests`.
- [x] Crear endpoint `GET /api/admin/stock-requests`.
- [x] Crear endpoint `PATCH /api/admin/stock-requests/:id/status`.
- [x] Proteger rutas de usuario.
- [x] Proteger rutas admin.
- [x] Registrar solicitud para notificaciÃ³n admin.

## 9. Frontend pÃºblico

- [x] Confirmar que productos vienen de API.
- [x] Confirmar que categorÃ­as vienen de API.
- [x] Eliminar o aislar datos mock si existen.
- [x] Mostrar productos sin stock.
- [x] Cambiar botÃ³n a â€œAvisarme cuando haya stockâ€ si stock es 0.
- [x] Crear modal/form de solicitud de stock para invitado.
- [x] Crear acciÃ³n de solicitud rÃ¡pida para usuario logueado.
- [x] Mostrar feedback de solicitud enviada.
- [x] Validar que carrito no permita agregar producto sin stock.
- [x] Validar ofertas con `compareAtPrice`.
- [x] Validar secciones destacados/ofertas/nuevos.

## 10. Perfil usuario

- [x] Preparar endpoint de solicitudes del usuario.
- [x] Si existe perfil, agregar listado de productos solicitados.
- [x] Si no existe perfil completo, documentar pendiente para `add-user-private-profile`.
- [x] Confirmar que pedidos del usuario quedan para change posterior si aÃºn no existe checkout.

## 11. Swagger

- [x] Documentar productos pÃºblicos.
- [x] Documentar categorÃ­as pÃºblicas.
- [x] Documentar admin productos.
- [x] Documentar admin categorÃ­as.
- [x] Documentar solicitudes de stock.
- [x] Documentar schemas.
- [x] Documentar errores 400.
- [x] Documentar errores 401.
- [x] Documentar errores 403.
- [x] Documentar errores 404.
- [x] Documentar errores 409.
- [x] Validar `/api/docs`.

## 12. Tests backend

- [x] Test seed/categorÃ­as principales.
- [x] Test listado pÃºblico productos.
- [x] Test listado pÃºblico categorÃ­as.
- [x] Test productos en oferta.
- [x] Test productos destacados.
- [x] Test productos nuevos.
- [x] Test crear producto admin.
- [x] Test editar producto admin.
- [x] Test editar precio.
- [x] Test editar stock.
- [x] Test desactivar producto.
- [x] Test crear categorÃ­a admin.
- [x] Test editar categorÃ­a admin.
- [x] Test usuario comÃºn no accede admin productos.
- [x] Test solicitud stock invitado.
- [x] Test solicitud stock usuario.
- [x] Test listar solicitudes usuario.
- [x] Test admin lista solicitudes.

## 13. ValidaciÃ³n manual

- [x] Ejecutar seed.
- [x] Verificar al menos 20 productos en API.
- [x] Verificar 5 categorÃ­as en API.
- [x] Verificar productos en frontend.
- [x] Verificar ofertas en frontend.
- [x] Verificar producto sin stock.
- [x] Solicitar aviso como invitado.
- [x] Solicitar aviso como usuario logueado.
- [x] Ver solicitud en endpoint admin.
- [x] Crear producto como admin por API.
- [x] Editar producto como admin por API.
- [x] Editar precio como admin por API.
- [x] Editar stock como admin por API.
- [x] Crear categorÃ­a como admin por API.
- [x] Validar build backend.
- [x] Validar build frontend.
- [x] Validar tests.

## 14. Cierre

- [x] Confirmar catÃ¡logo real con datos de base.
- [x] Confirmar ABM backend productos.
- [x] Confirmar ABM backend categorÃ­as.
- [x] Confirmar stock editable.
- [x] Confirmar precios editables.
- [x] Confirmar solicitudes de stock.
- [x] Confirmar Swagger actualizado.
- [x] Crear `current-state.md`.
- [x] Confirmar que se puede avanzar a checkout.
