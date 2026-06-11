# Current State: add-public-cart

## Resultado

El carrito público quedó implementado para invitados y usuarios autenticados sin incorporar checkout, pagos, órdenes, envíos ni panel administrativo.

## Backend

- Se reutilizaron los modelos Prisma `Cart` y `CartItem`; no fue necesaria una migración.
- Los endpoints autenticados permiten obtener, agregar, actualizar, eliminar y vaciar el carrito.
- `POST /api/cart/sync` fusiona el carrito invitado con el carrito autenticado sin duplicar productos.
- `POST /api/cart/validate` es público e hidrata items mínimos del invitado usando datos actuales.
- El backend valida producto existente, activo y stock.
- Los precios y subtotales se recalculan siempre desde PostgreSQL.
- Los items de otro usuario no pueden modificarse ni eliminarse.
- Swagger documenta carrito, sync, validate, ejemplos y errores principales.

## Frontend

- El carrito invitado persiste en `localStorage` guardando únicamente `productId` y `quantity`.
- El carrito autenticado se carga y modifica mediante backend.
- Login y registro sincronizan el carrito invitado; el almacenamiento local se limpia solo tras sync exitoso.
- `ProductCard` agrega productos, bloquea productos sin stock y muestra feedback.
- El contador del header usa el estado real del carrito.
- `/carrito` muestra estado vacío, items, imagen, precio actual, cantidad, subtotal por item y subtotal general.
- La página permite sumar, restar, eliminar y vaciar.
- El botón de checkout se muestra deshabilitado porque queda fuera de alcance.

## Validación

- Build backend: exitoso.
- Build frontend: exitoso.
- Suite backend completa: 13 tests exitosos.
- Tests frontend de operaciones invitado: 4 tests exitosos.
- Checklist OpenSpec: 109 de 113 tareas completadas.
- Swagger responde `200`.
- Chrome headless confirmó agregado invitado, persistencia local, página real y sync al login.
- El sync manual fusionó cantidades y produjo cantidad total `3`.
- El lint frontend conserva los mismos 15 errores preexistentes, sin errores nuevos del carrito.

## Pendiente

No existe actualmente un harness de tests de componentes React. Quedan pendientes pruebas automatizadas específicas de `ProductCard` y render de `CartPage`; los flujos fueron validados mediante tests de operaciones, backend y Chrome headless.
