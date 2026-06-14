# Estado actual: admin panel frontend MVP

## Resultado

El placeholder administrativo fue reemplazado por un panel admin MVP funcional y responsive básico. Todas las rutas están protegidas por `AdminRoute` y consumen endpoints reales.

## Rutas

- `/admin` redirige a `/admin/dashboard`.
- `/admin/dashboard`
- `/admin/productos`
- `/admin/productos/nuevo`
- `/admin/productos/:id/editar`
- `/admin/categorias`
- `/admin/categorias/nueva`
- `/admin/categorias/:id/editar`
- `/admin/pedidos`
- `/admin/pedidos/:id`
- `/admin/solicitudes-stock`

## Funcionalidad

- `AdminLayout` propio con sidebar, header, identidad del admin, logout y acceso a la tienda.
- Dashboard compuesto desde productos, categorías, pedidos y solicitudes reales.
- Productos: filtros, listado, alta, edición, activar/desactivar, ajuste rápido de stock y precio.
- Categorías: listado, alta, edición y activar/desactivar.
- Pedidos: filtros, listado, detalle, cliente, entrega, totales y cambio de estado.
- Solicitudes de stock: listado, filtro y cambio de estado.
- Loading, error y empty states compartidos.
- Manejo central de `401`; `403` se muestra como error o queda bloqueado por `AdminRoute`.
- El endpoint admin de pedidos ahora incluye el resumen del usuario registrado para mostrar el cliente.

## Validación

- Login admin real: HTTP 200.
- Endpoints admin productos, categorías, pedidos y solicitudes: HTTP 200.
- Usuario común accediendo a endpoint admin: HTTP 403.
- Build frontend: aprobado.
- Build backend: aprobado.
- Tests frontend existentes: 4 aprobados.
- Tests backend: 25 aprobados.
- Preview de producción: rutas admin y rutas públicas críticas respondieron HTTP 200.
- Lint: mantiene 15 errores históricos fuera de los archivos admin; el panel no agregó errores nuevos.

## Limitaciones

- No existe harness frontend de navegador/Playwright en el repositorio.
- Las interacciones visuales manuales, responsive y CRUD desde navegador quedan pendientes de una sesión manual.
- No se agregaron imágenes/orden a categorías porque el modelo y API actuales no exponen esos campos.
- No incluye Mercado Pago, usuarios, contenido editable, reportes ni gráficos avanzados.
