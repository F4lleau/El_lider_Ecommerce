# Design: add-catalog-admin-inventory-and-stock-requests

## Context

El e-commerce ya tiene catálogo público, autenticación y carrito funcional. Sin embargo, todavía falta una base administrativa real para productos, categorías, precios y stock.

El checkout necesita productos reales y stock confiable para poder validar compras, calcular totales y descontar unidades cuando corresponda.

## Data model decisions

### Product price

Para el MVP, el precio se mantiene como propiedad directa del producto:

- `price`: precio actual.
- `compareAtPrice`: precio anterior o precio de referencia para mostrar oferta.
- `isOffer`: indica si el producto debe mostrarse como oferta.

Esto permite implementar ABM de precios sin crear todavía un módulo complejo de historial.

En una etapa posterior se podrá agregar:

- `ProductPriceHistory`
- motivo del cambio
- usuario que modificó
- fecha de modificación

### Product stock

Para el MVP, el stock se mantiene como propiedad directa del producto:

- `stock`

Este stock representa stock disponible en sucursal.

Reglas:

- El stock no baja al agregar al carrito.
- El stock debe validarse al crear la orden.
- El stock debe descontarse cuando la orden quede confirmada o pagada, según se defina en checkout.
- Si el stock es `0`, el producto se muestra sin stock.
- Si el producto está sin stock, el usuario puede solicitar aviso.

En una etapa posterior se podrá agregar:

- `StockMovement`
- stock reservado
- stock por sucursal
- stock mínimo
- historial de ajustes

### Best sellers

Los productos más vendidos deben calcularse por ventas reales.

Cuando existan órdenes, el endpoint de más vendidos debe agrupar por `OrderItem.productId` y ordenar por cantidad vendida.

Mientras no existan órdenes, el endpoint puede devolver una lista vacía o usar productos destacados como fallback temporal, siempre documentado.

### Stock requests

Se agregará una entidad para solicitudes de aviso de stock.

Modelo conceptual:

```ts
StockRequest {
  id
  productId
  userId?
  name?
  email
  phone?
  status
  createdAt
  updatedAt
  notifiedAt?
}

Estados sugeridos:

PENDING
CONTACTED
NOTIFIED
CANCELLED

Reglas:

Si el usuario está logueado, se usa userId.
Si el usuario no está logueado, debe ingresar nombre, email y teléfono.
Se debe evitar duplicados excesivos para el mismo producto y mismo email.
El admin debe poder ver solicitudes pendientes.
El usuario registrado debe poder ver sus solicitudes.
Backend endpoints
Public catalog

Endpoints esperados:

GET /api/products
GET /api/products/:id
GET /api/products/slug/:slug
GET /api/products/offers
GET /api/products/featured
GET /api/products/new
GET /api/products/best-sellers
GET /api/categories
GET /api/categories/:id/products
GET /api/categories/slug/:slug/products
Admin products

Endpoints esperados:

GET    /api/admin/products
POST   /api/admin/products
GET    /api/admin/products/:id
PATCH  /api/admin/products/:id
DELETE /api/admin/products/:id
PATCH  /api/admin/products/:id/stock
PATCH  /api/admin/products/:id/price

Reglas:

Todas las rutas admin requieren admin.
El delete puede ser soft delete si el producto ya fue vendido o usado en carrito/orden.
No se debe borrar físicamente información necesaria para historial comercial.
Admin categories

Endpoints esperados:

GET    /api/admin/categories
POST   /api/admin/categories
GET    /api/admin/categories/:id
PATCH  /api/admin/categories/:id
DELETE /api/admin/categories/:id

Reglas:

Todas las rutas admin requieren admin.
Si una categoría tiene productos asociados, se recomienda desactivar en lugar de eliminar.
Stock requests

Endpoints esperados:

POST /api/products/:productId/stock-requests
GET  /api/me/stock-requests
GET  /api/admin/stock-requests
PATCH /api/admin/stock-requests/:id/status

Reglas:

POST puede ser público.
GET /api/me/stock-requests requiere usuario autenticado.
Rutas admin requieren admin.
Seed data

El seed debe crear como mínimo:

5 categorías principales.
20 productos como mínimo.
Imágenes placeholder o URLs externas válidas.
Algunos productos en oferta.
Algunos productos destacados.
Algunos productos nuevos.
Al menos 1 producto sin stock.

Categorías:

Repostería
Descartables
Cotillón
Envases
Gastronomía
Frontend considerations

Este change no requiere panel admin completo, pero debe dejar el backend listo.

El frontend público debe:

Mostrar productos desde API.
Mostrar categorías desde API.
Mostrar productos en oferta desde API.
Mostrar productos destacados desde API.
Mostrar productos sin stock.
Mostrar botón para solicitar aviso de stock cuando corresponda.
Permitir solicitud como usuario registrado.
Permitir solicitud como invitado con datos de contacto.

El perfil completo puede implementarse luego, pero se debe dejar endpoint para:

GET /api/me/stock-requests
Swagger

Se deben documentar:

Productos públicos.
Categorías públicas.
Admin productos.
Admin categorías.
Solicitudes de stock.
Errores 400, 401, 403, 404 y 409.
Tests

Tests críticos:

Crear producto admin.
Editar producto admin.
Editar precio.
Editar stock.
Desactivar producto.
Crear categoría admin.
Editar categoría admin.
Solicitar aviso de stock como invitado.
Solicitar aviso de stock como usuario.
Listar solicitudes del usuario.
Bloquear endpoints admin para usuario común.
Calcular más vendidos desde órdenes cuando existan datos.
Risks
Si se implementa delete físico de productos puede romper historial futuro de órdenes.
Si el precio se duplica en varios lugares, puede haber inconsistencias.
Si el stock baja en carrito, se pueden bloquear productos sin compra real.
Si no hay órdenes todavía, más vendidos puede no tener datos reales.
Si no se valida admin en backend, el frontend no protege realmente.
Decisions
El precio será propiedad directa del producto para MVP.
El stock será propiedad directa del producto para MVP.
Más vendidos se calculará desde órdenes reales.
El seed inicial cargará productos reales variados.
Las rutas admin se implementan en backend ahora.
El panel admin frontend completo queda para un change posterior.
La solicitud de stock puede ser pública o autenticada.