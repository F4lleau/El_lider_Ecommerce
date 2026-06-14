# Change: add-admin-panel-frontend-mvp

## Summary

Implementar el panel administrador frontend MVP para reemplazar la pantalla placeholder actual de `/admin` por una interfaz operativa básica con dashboard, productos, categorías, pedidos y solicitudes de stock.

## Motivation

El login admin y las rutas protegidas ya funcionan, pero al ingresar a `/admin` actualmente se muestra una pantalla placeholder con el mensaje de que el acceso administrativo fue validado y que el panel completo queda fuera del change.

El negocio necesita que el administrador pueda operar la tienda desde una interfaz real, sin depender de un técnico ni de llamadas manuales a la API.

Ya existen funcionalidades backend importantes:

- Auth y roles.
- ABM backend de productos.
- ABM backend de categorías.
- Stock y precios editables.
- Solicitudes de stock.
- Checkout y órdenes.
- Endpoints admin básicos.
- Swagger actualizado.

Por eso corresponde implementar un panel admin frontend MVP antes de continuar con Mercado Pago, para que los pedidos y pagos futuros puedan visualizarse y gestionarse desde una interfaz real.

## Scope

Este cambio incluye:

- Redirección de `/admin` a `/admin/dashboard`.
- Layout admin con sidebar y header.
- Navegación admin protegida por rol `ADMIN`.
- Dashboard básico con resumen operativo.
- Vista de productos.
- Crear producto.
- Editar producto.
- Activar/desactivar producto.
- Ajuste rápido de stock.
- Ajuste rápido de precio.
- Vista de categorías.
- Crear categoría.
- Editar categoría.
- Activar/desactivar categoría.
- Vista de pedidos.
- Detalle básico de pedido.
- Cambio básico de estado de pedido.
- Vista de solicitudes de stock.
- Cambio de estado de solicitudes de stock.
- Estados de loading, error y empty state.
- Uso de endpoints reales.
- Responsive básico.
- Documentación del resultado en `current-state.md`.

## Out of Scope

Este cambio no incluye:

- Mercado Pago.
- Webhook de pago.
- Reportes avanzados.
- Gráficos complejos.
- Gestión completa de usuarios.
- Gestión de contenido editable.
- Emails automáticos.
- WhatsApp automático.
- Importación Excel.
- Historial avanzado de cambios.
- Panel admin mobile perfecto.
- Rediseño visual completo de marca.

## Acceptance Criteria

- `/admin` redirige a `/admin/dashboard`.
- Un usuario con rol `ADMIN` puede entrar al panel.
- Un usuario con rol `USER` no puede entrar al panel.
- Un visitante sin sesión no puede entrar al panel.
- El panel admin ya no muestra placeholder.
- El panel tiene layout con sidebar/header.
- El dashboard muestra métricas operativas básicas.
- El admin puede ver productos reales desde API.
- El admin puede crear producto.
- El admin puede editar producto.
- El admin puede activar/desactivar producto.
- El admin puede ajustar stock y precio.
- El admin puede ver categorías reales desde API.
- El admin puede crear y editar categorías.
- El admin puede activar/desactivar categorías.
- El admin puede ver pedidos reales desde API.
- El admin puede ver detalle básico de pedido.
- El admin puede cambiar estado básico de pedido.
- El admin puede ver solicitudes de stock.
- El admin puede cambiar estado de solicitud de stock.
- Todas las vistas tienen loading, error y empty state.
- El build frontend pasa.
- No se rompe auth, carrito, checkout ni rutas públicas.

