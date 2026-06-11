# Change: add-public-cart

## Summary

Implementar carrito funcional para visitantes y usuarios autenticados, con persistencia local para invitados y persistencia en backend para usuarios logueados.

## Motivation

Actualmente el catálogo y las cards de producto existen, pero el botón de agregar al carrito todavía no está completamente conectado y la página de carrito no representa un flujo real de compra.

El carrito es una pieza central antes de implementar checkout, envíos y pagos.

## Scope

Este cambio incluye:

- Agregar productos al carrito desde el catálogo.
- Mostrar cantidad de productos en el carrito.
- Página `/carrito` funcional.
- Incrementar cantidad.
- Disminuir cantidad.
- Eliminar producto del carrito.
- Vaciar carrito.
- Persistir carrito invitado en frontend.
- Persistir carrito de usuario autenticado en backend.
- Sincronizar carrito invitado al iniciar sesión.
- Validar stock disponible.
- Recalcular precios desde backend.
- Documentar endpoints de carrito en Swagger.
- Agregar tests críticos de carrito.

## Out of Scope

Este cambio no incluye:

- Checkout.
- Mercado Pago.
- Creación de órdenes.
- Cálculo de envío.
- Historial de pedidos.
- Panel admin.
- Cupones de descuento.
- Favoritos.

## Acceptance Criteria

- Un visitante puede agregar productos al carrito sin login.
- El carrito invitado persiste al refrescar la página.
- Un usuario logueado puede agregar productos al carrito.
- Al iniciar sesión, el carrito invitado se sincroniza con el carrito del usuario.
- El usuario puede modificar cantidades.
- El usuario puede eliminar productos.
- El usuario puede vaciar el carrito.
- La página `/carrito` muestra productos reales.
- El subtotal se calcula correctamente.
- El backend valida stock.
- El backend recalcula precios y no confía en precios enviados desde frontend.
- Swagger documenta los endpoints de carrito.
- Existen tests mínimos para agregar, actualizar, eliminar y vaciar carrito.