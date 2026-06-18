# Tasks: add-product-sku-code

## 1. AuditorÃ­a inicial

* [x] Revisar modelo `Product`.
* [x] Revisar modelo `OrderItem`.
* [x] Revisar seed actual de productos.
* [x] Revisar endpoints pÃºblicos de productos.
* [x] Revisar endpoints admin de productos.
* [x] Revisar formularios admin de producto.
* [x] Revisar listado admin de producto.
* [x] Revisar bÃºsqueda admin de productos.
* [x] Revisar creaciÃ³n de order items en checkout.
* [x] Revisar Swagger actual de productos y Ã³rdenes.
* [x] Revisar tests existentes de productos, admin y checkout.

## 2. Modelo y migraciÃ³n

* [x] Agregar `sku String? @unique` al modelo `Product`.
* [x] Evaluar si agregar `productSku String?` al modelo `OrderItem`.
* [x] Crear migraciÃ³n Prisma.
* [x] Ejecutar migraciÃ³n local.
* [x] Generar Prisma Client.
* [x] Verificar que productos existentes soportan `sku` null.
* [x] Verificar unicidad de `sku`.

## 3. Seed

* [x] Actualizar seed para incluir SKU en todos los productos.
* [x] Definir prefijos por categorÃ­a.
* [x] Confirmar que los SKU sean Ãºnicos.
* [x] Mantener seed idempotente.
* [x] Ejecutar seed.
* [x] Verificar productos con SKU en base de datos.

## 4. Backend productos pÃºblicos

* [x] Incluir `sku` en `GET /api/products`.
* [x] Incluir `sku` en `GET /api/products/:id`.
* [x] Incluir `sku` en `GET /api/products/slug/:slug`.
* [x] Incluir `sku` en `GET /api/products/offers`.
* [x] Incluir `sku` en `GET /api/products/featured`.
* [x] Incluir `sku` en `GET /api/products/new`.
* [x] Incluir `sku` en `GET /api/products/best-sellers`.
* [x] Verificar que productos sin SKU no rompen responses.

## 5. Backend admin productos

* [x] Incluir `sku` en `GET /api/admin/products`.
* [x] Incluir `sku` en `GET /api/admin/products/:id`.
* [x] Permitir `sku` en `POST /api/admin/products`.
* [x] Permitir `sku` en `PATCH /api/admin/products/:id`.
* [x] Validar SKU duplicado.
* [x] Normalizar espacios del SKU.
* [x] Decidir si convertir SKU a mayÃºsculas.
* [x] Permitir bÃºsqueda por SKU.
* [x] Agregar tests de SKU duplicado.
* [x] Agregar tests de bÃºsqueda por SKU.

## 6. Order item snapshot

* [x] Si se agrega `productSku`, actualizar creaciÃ³n de `OrderItem`.
* [x] Copiar `product.sku` a `orderItem.productSku`.
* [x] Permitir null si producto no tiene SKU.
* [x] Incluir `productSku` en detalle de pedido usuario.
* [x] Incluir `productSku` en detalle de pedido admin.
* [x] Incluir `productSku` en tracking pÃºblico si corresponde.
* [x] Agregar test de snapshot `productSku`.

## 7. Frontend admin productos

* [x] Mostrar columna SKU en `/admin/productos`.
* [x] Agregar campo SKU en `/admin/productos/nuevo`.
* [x] Agregar campo SKU en `/admin/productos/:id/editar`.
* [x] Enviar SKU al crear producto.
* [x] Enviar SKU al editar producto.
* [x] Mostrar error si SKU estÃ¡ duplicado.
* [x] Permitir bÃºsqueda por SKU.
* [x] Validar que SKU no rompa filtros existentes.

## 8. Frontend pÃºblico

* [x] Evaluar mostrar SKU en detalle de producto.
* [x] Si se muestra, usar etiqueta â€œCÃ³digoâ€.
* [x] No mostrar SKU en cards salvo decisiÃ³n visual.
* [x] Verificar que catÃ¡logo no se rompa si `sku` es null.

## 9. Swagger

* [x] Actualizar schema `Product`.
* [x] Actualizar schema `CreateProductRequest`.
* [x] Actualizar schema `UpdateProductRequest`.
* [x] Actualizar schema `AdminProductResponse`.
* [x] Actualizar schema de `OrderItem` si incluye `productSku`.
* [x] Documentar error por SKU duplicado.
* [x] Validar `/api/docs`.

## 10. Tests

* [x] Test crear producto con SKU.
* [x] Test crear producto sin SKU.
* [x] Test rechazar SKU duplicado.
* [x] Test editar SKU.
* [x] Test listar productos con SKU.
* [x] Test buscar producto por SKU.
* [x] Test order item guarda productSku si se implementa.
* [x] Test build backend.
* [x] Test build frontend.
* [x] Test frontend existentes.

## 11. ValidaciÃ³n manual

* [x] Ver producto con SKU en admin.
* [x] Crear producto con SKU.
* [x] Editar SKU.
* [x] Buscar por SKU.
* [x] Confirmar que SKU duplicado muestra error.
* [x] Crear orden y verificar snapshot productSku si aplica.
* [x] Confirmar que catÃ¡logo pÃºblico sigue funcionando.
* [x] Confirmar que checkout sigue funcionando.
* [x] Confirmar que panel admin sigue funcionando.

## 12. Cierre

* [x] Confirmar SKU agregado a Product.
* [x] Confirmar seed actualizado.
* [x] Confirmar admin actualizado.
* [x] Confirmar bÃºsqueda por SKU.
* [x] Confirmar Swagger actualizado.
* [x] Confirmar tests/builds.
* [x] Crear `current-state.md`.
* [x] Confirmar que se puede retomar `add-mercadopago-payments`.

