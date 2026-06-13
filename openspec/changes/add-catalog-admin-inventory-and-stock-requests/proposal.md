# Change: add-catalog-admin-inventory-and-stock-requests

## Summary

Implementar la base administrativa y operativa del catálogo: ABM de productos, categorías, precios, stock, seed inicial con productos reales y solicitudes de aviso cuando un producto no tiene stock.

## Motivation

La app ya cuenta con catálogo público, autenticación y carrito funcional, pero todavía no existe un flujo completo para administrar productos y categorías desde backend. Además, el catálogo necesita datos reales para probar correctamente carrito, diseño, checkout y futuras compras.

Antes de avanzar con checkout, envíos y pagos, se necesita consolidar:

- Catálogo real desde base de datos.
- Productos variados por categorías.
- Ofertas.
- Stock.
- Administración de productos y categorías.
- Solicitudes de aviso cuando no hay stock.
- Base para más vendidos según compras reales.

## Scope

Este cambio incluye:

- Seed inicial con al menos 20 productos distribuidos en:
  - Repostería
  - Descartables
  - Cotillón
  - Envases
  - Gastronomía
- Productos con oferta.
- Productos destacados.
- Productos nuevos.
- Productos sin stock para probar avisos.
- ABM backend de productos.
- ABM backend de categorías.
- Edición de precio como parte del producto.
- Edición de stock.
- Validación de productos activos.
- Validación de categorías activas.
- Endpoint público de productos desde base de datos.
- Endpoint público de categorías desde base de datos.
- Endpoint de productos en oferta.
- Endpoint de productos destacados.
- Endpoint de productos nuevos.
- Endpoint de productos más vendidos calculado desde órdenes.
- Solicitud de aviso cuando no hay stock.
- Solicitudes de stock para usuarios registrados.
- Solicitudes de stock para invitados con nombre, email y teléfono.
- Endpoint para que el usuario registrado vea sus productos solicitados.
- Notificación o registro para admin cuando exista una solicitud de stock.
- Swagger actualizado.
- Tests críticos.

## Out of Scope

Este cambio no incluye:

- Checkout.
- Mercado Pago.
- Creación de órdenes.
- Envíos.
- Panel admin frontend completo.
- Dashboard admin completo.
- Emails automáticos.
- WhatsApp automático.
- Generación de imágenes con IA.
- Historial avanzado de precios.

## Acceptance Criteria

- La base queda poblada con al menos 20 productos reales.
- Existen productos en las 5 categorías principales.
- Existen productos con oferta.
- Existen productos sin stock.
- El catálogo público usa datos desde base de datos.
- El admin puede crear, editar, desactivar y eliminar productos desde API.
- El admin puede crear, editar, desactivar y eliminar categorías desde API.
- El admin puede modificar precio y stock de un producto.
- El precio se mantiene como propiedad del producto.
- El stock se mantiene como propiedad del producto para el MVP.
- Los productos más vendidos se calculan desde compras reales cuando existan órdenes.
- Un usuario registrado puede solicitar aviso de stock.
- Un invitado puede solicitar aviso de stock ingresando datos de contacto.
- El usuario registrado puede ver sus solicitudes de stock en su perfil.
- Swagger documenta productos, categorías y solicitudes de stock.
- Existen tests mínimos para productos, categorías, stock y solicitudes.