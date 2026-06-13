# Estado actual: catalog admin, inventory and stock requests

## Resultado

El change quedó implementado sobre los módulos existentes de productos y categorías, sin incorporar checkout, pagos, envíos ni panel admin frontend completo.

## Catálogo y seed

- El seed es idempotente y conserva datos comerciales existentes.
- Crea o actualiza las categorías Reposteria, Descartables, Cotillon, Envases y Gastronomia.
- Crea o actualiza 25 productos del rubro con imagen, precio, stock y flags comerciales.
- Validación final en base: 28 productos activos, 5 categorías objetivo, 12 ofertas, 16 destacados, 15 nuevos y 4 sin stock.
- El catálogo público, ofertas, destacados, nuevos y categorías consumen datos de API.
- Más vendidos se calcula desde `OrderItem` de órdenes `PAID`, `CONFIRMED` o `COMPLETED`; devuelve lista vacía si aún no existen ventas confirmadas.

## Backend

- Se agregó ABM admin protegido para productos y categorías.
- Eliminar productos y categorías realiza soft delete mediante `isActive=false`.
- Precio y stock se editan con endpoints específicos y validaciones.
- Los productos públicos requieren producto y categoría activos.
- Se agregó `StockRequest` con estados `PENDING`, `CONTACTED`, `NOTIFIED` y `CANCELLED`.
- Invitados deben enviar nombre, email y teléfono.
- Usuarios autenticados usan su identidad y pueden listar sus solicitudes.
- Admin puede listar y actualizar estados de solicitudes.

## Frontend

- Los productos sin stock no se pueden agregar al carrito.
- El botón sin stock abre formulario para invitados o registra una solicitud rápida para usuarios autenticados.
- Mi cuenta muestra las solicitudes de stock del usuario.
- La página de más vendidos consume el endpoint calculado desde ventas.

## Swagger y validación

- Swagger documenta catálogo público, categorías, ABM admin y solicitudes de stock.
- `/api/docs/` respondió HTTP 200.
- El YAML OpenAPI parseó correctamente con 34 paths.
- Migración aplicada y Prisma Client generado.
- Build backend: aprobado.
- Build frontend: aprobado.
- Tests backend: 18 aprobados.
- Tests frontend existentes: 4 aprobados.

## Decisiones

- El stock continúa como propiedad directa de `Product`.
- El precio continúa como propiedad directa de `Product`.
- No se descuenta stock al agregar al carrito.
- Las solicitudes duplicadas pendientes para el mismo producto/email responden 409.
- El panel admin frontend completo permanece fuera de alcance.

## Próximo paso

La base de catálogo, inventario y solicitudes permite avanzar al change de checkout manteniendo validación final de precios y stock en backend.
