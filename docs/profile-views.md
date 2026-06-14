# Definición de vistas por perfil — El Líder E-commerce

## Objetivo

Definir las vistas principales de la aplicación según el tipo de usuario:

* Visitante / invitado
* Usuario registrado
* Administrador

Este documento sirve como guía funcional para implementar las rutas, pantallas, permisos, acciones y prioridades de desarrollo del frontend.

---

# 1. Panel Admin

## Objetivo del perfil admin

El administrador necesita operar el negocio día a día sin depender de un técnico. Desde el panel debe poder ver el estado general de la tienda, gestionar productos, categorías, stock, pedidos, envíos, solicitudes de stock, usuarios y reportes básicos.

Todas las rutas del panel admin requieren:

* Usuario autenticado.
* Rol `ADMIN`.
* Protección frontend mediante `AdminRoute`.
* Protección backend mediante `requireAuth` + `requireRole("ADMIN")`.

---

## 1.1 Layout general admin

### Ruta base

```txt
/admin
```

### Redirección sugerida

```txt
/admin -> /admin/dashboard
```

### Elementos comunes

El layout admin debe incluir:

* Sidebar o menú lateral.
* Header superior.
* Nombre del usuario admin.
* Botón de logout.
* Acceso rápido al sitio público.
* Badge de pedidos nuevos.
* Badge de solicitudes de stock pendientes.
* Navegación responsive para tablet/mobile.
* Breadcrumb o título de sección.

### Menú principal admin

```txt
Dashboard
Productos
Categorías
Pedidos
Envíos
Solicitudes de stock
Usuarios
Reportes
Configuración / Contenido
```

---

# 2. Dashboard Admin

## Ruta

```txt
/admin/dashboard
```

## Objetivo

Dar una vista rápida del estado operativo del negocio.

## Debe mostrar sí o sí

### Resumen comercial

* Ventas del día.
* Ventas de la semana.
* Ventas del mes.
* Cantidad de pedidos del día.
* Total vendido.
* Ticket promedio, si es posible.

### Alertas operativas

* Pedidos nuevos sin atender.
* Solicitudes de stock pendientes.
* Productos sin stock.
* Productos con stock bajo.
* Pagos pendientes o rechazados, cuando exista Mercado Pago.

### Accesos rápidos

Botones directos a:

```txt
Crear producto
Ver pedidos nuevos
Ver productos sin stock
Ver solicitudes de stock
Crear categoría
```

## Cards sugeridas

```txt
Ventas hoy
Pedidos nuevos
Pedidos en preparación
Solicitudes de stock
Productos sin stock
Productos bajo stock
```

## Endpoints necesarios

```txt
GET /api/admin/dashboard/summary
GET /api/admin/dashboard/sales
GET /api/admin/dashboard/low-stock
GET /api/admin/dashboard/recent-orders
GET /api/admin/stock-requests?status=PENDING
```

## Prioridad

MVP alta.

---

# 3. Gestión de productos

## Ruta principal

```txt
/admin/productos
```

## Rutas relacionadas

```txt
/admin/productos/nuevo
/admin/productos/:id
/admin/productos/:id/editar
/admin/productos/sin-stock
/admin/productos/mas-vendidos
```

## Objetivo

Permitir al admin administrar el catálogo sin tocar base de datos.

## Listado de productos

Debe mostrar:

* Imagen principal.
* Nombre.
* Categoría.
* Precio actual.
* Precio anterior.
* Stock.
* Estado: activo/inactivo.
* Flags: oferta, nuevo, destacado.
* Fecha de actualización.
* Acciones rápidas.

## Filtros requeridos

* Buscar por nombre.
* Categoría.
* Estado: activo/inactivo.
* Stock:

  * con stock
  * sin stock
  * stock bajo
* Oferta.
* Nuevo.
* Destacado.

## Acciones desde el listado

* Ver detalle.
* Editar.
* Activar/desactivar.
* Ajustar stock rápido.
* Ajustar precio rápido.
* Marcar/quitar oferta.
* Marcar/quitar destacado.
* Marcar/quitar nuevo.

## Crear / editar producto

Campos requeridos:

```txt
Nombre
Slug
Descripción corta
Descripción larga
Precio actual
Precio anterior / compareAtPrice
Stock
Categoría
Imagen principal
Galería de imágenes
Activo
Oferta
Nuevo
Destacado
```

## Reglas

* El precio debe ser positivo.
* El stock no puede ser negativo.
* El slug debe ser único.
* Si el producto tiene historial de pedidos, no debe eliminarse físicamente.
* La eliminación debe ser soft delete mediante `isActive`.
* Si `stock` es 0, el producto aparece como sin stock en público.
* Si `isOffer` es true, debe existir `compareAtPrice` mayor a `price`.

## Endpoints necesarios

```txt
GET    /api/admin/products
POST   /api/admin/products
GET    /api/admin/products/:id
PATCH  /api/admin/products/:id
DELETE /api/admin/products/:id
PATCH  /api/admin/products/:id/stock
PATCH  /api/admin/products/:id/price
```

## Prioridad

MVP alta.

---

# 4. Gestión de categorías

## Ruta principal

```txt
/admin/categorias
```

## Rutas relacionadas

```txt
/admin/categorias/nueva
/admin/categorias/:id/editar
```

## Objetivo

Permitir administrar la estructura comercial del catálogo.

## Listado de categorías

Debe mostrar:

* Nombre.
* Slug.
* Cantidad de productos asociados.
* Estado activo/inactivo.
* Orden de visualización.
* Acciones.

## Acciones

* Crear categoría.
* Editar categoría.
* Reordenar categoría.
* Desactivar categoría.
* Reactivar categoría.
* Eliminar solo si no tiene productos asociados, si se decide permitirlo.

## Campos

```txt
Nombre
Slug
Descripción
Imagen
Orden
Estado activo/inactivo
Categoría padre, opcional en etapa posterior
```

## Reglas

* No permitir slug duplicado.
* No eliminar físicamente categorías con productos asociados.
* Si una categoría está inactiva, no debe mostrarse en el catálogo público.
* Si una categoría está inactiva, sus productos no deberían aparecer en el listado público por esa categoría.

## Endpoints necesarios

```txt
GET    /api/admin/categories
POST   /api/admin/categories
GET    /api/admin/categories/:id
PATCH  /api/admin/categories/:id
DELETE /api/admin/categories/:id
```

## Prioridad

MVP alta.

---

# 5. Pedidos

## Ruta principal

```txt
/admin/pedidos
```

## Rutas relacionadas

```txt
/admin/pedidos/:id
/admin/pedidos/nuevos
/admin/pedidos/preparacion
/admin/pedidos/listos
/admin/pedidos/cancelados
```

## Objetivo

Permitir gestionar todas las compras realizadas en la tienda.

## Listado de pedidos

Debe mostrar:

* Número de pedido.
* Tracking code.
* Cliente.
* Email / teléfono.
* Fecha.
* Total.
* Estado del pedido.
* Estado del pago.
* Método de entrega.
* Método de pago.
* Acciones.

## Filtros

* Estado del pedido.
* Estado del pago.
* Método de entrega:

  * retiro
  * envío
* Fecha desde / hasta.
* Cliente.
* Tracking code.

## Detalle del pedido

Debe mostrar:

### Datos generales

* Número de pedido.
* Tracking code.
* Fecha.
* Estado actual.
* Estado del pago.
* Método de pago.
* Método de entrega.

### Datos del cliente

* Nombre.
* Email.
* Teléfono.
* Usuario registrado o invitado.

### Productos

* Imagen.
* Nombre.
* Cantidad.
* Precio unitario.
* Subtotal por item.

### Totales

* Subtotal productos.
* Costo de envío.
* Total final.

### Entrega

Si es retiro:

* Estado de preparación.
* Estado listo para retirar.
* Fecha estimada de retiro, si aplica.

Si es envío:

* Dirección.
* Referencias.
* Estado del envío.
* Fecha estimada de entrega.

## Cambio de estado

Estados sugeridos:

```txt
PENDING_PAYMENT
PAID
CONFIRMED
PREPARING
READY_FOR_PICKUP
SHIPPED
DELIVERED
CANCELLED
REFUNDED
```

## Reglas

* El admin puede cambiar el estado operativo.
* No debería poder marcar como entregado un pedido no pagado, salvo decisión manual.
* Si el pedido se cancela, debe definirse si se repone stock.
* Cada cambio de estado debería registrarse en historial en una etapa posterior.

## Endpoints necesarios

```txt
GET   /api/admin/orders
GET   /api/admin/orders/:id
PATCH /api/admin/orders/:id/status
PATCH /api/admin/orders/:id/notes
```

## Prioridad

MVP alta, pero depende de implementar checkout y órdenes.

---

# 6. Envíos

## Ruta principal

```txt
/admin/envios
```

## Objetivo

Separar los pedidos con envío a domicilio para facilitar la operación diaria.

## Debe mostrar

* Pedidos con método de entrega `SHIPPING`.
* Cliente.
* Teléfono.
* Dirección.
* Estado del pedido.
* Estado del envío.
* Fecha estimada de entrega.
* Total.
* Acciones.

## Acciones

* Ver pedido.
* Programar fecha estimada.
* Marcar como enviado.
* Marcar como entregado.
* Agregar observaciones.

## Endpoints necesarios

```txt
GET   /api/admin/shipments
PATCH /api/admin/orders/:id/shipping
```

## Prioridad

MVP media/alta. Se implementa después del checkout.

---

# 7. Solicitudes de stock

## Ruta principal

```txt
/admin/solicitudes-stock
```

## Objetivo

Permitir al admin responder a clientes que pidieron aviso por productos sin stock.

## Listado

Debe mostrar:

* Producto solicitado.
* Cliente.
* Tipo de cliente:

  * usuario registrado
  * invitado
* Email.
* Teléfono.
* Fecha de solicitud.
* Estado.
* Acciones.

## Estados

```txt
PENDING
CONTACTED
NOTIFIED
CANCELLED
```

## Acciones

* Ver detalle del producto.
* Ver datos del cliente.
* Cambiar estado.
* Marcar como contactado.
* Marcar como notificado.
* Cancelar solicitud.

## Reglas

* Si el producto vuelve a tener stock, las solicitudes pendientes deben quedar visibles para contactar.
* En etapa posterior se podrá enviar email o WhatsApp automático.
* Un mismo email no debería generar solicitudes duplicadas excesivas para el mismo producto.

## Endpoints necesarios

```txt
GET   /api/admin/stock-requests
GET   /api/admin/stock-requests/:id
PATCH /api/admin/stock-requests/:id/status
```

## Prioridad

MVP alta, porque ya existe la funcionalidad backend y frontend público.

---

# 8. Usuarios

## Ruta principal

```txt
/admin/usuarios
```

## Objetivo

Permitir consultar usuarios registrados y desactivar cuentas si fuera necesario.

## Listado

Debe mostrar:

* Nombre.
* Email.
* Teléfono.
* Rol.
* Estado activo/inactivo.
* Fecha de registro.
* Cantidad de pedidos.
* Última actividad, si existe.

## Acciones

* Ver detalle.
* Desactivar usuario.
* Reactivar usuario.
* Ver pedidos del usuario.
* Ver solicitudes de stock del usuario.

## Reglas

* No permitir que un admin se desactive a sí mismo accidentalmente.
* No eliminar físicamente usuarios con historial comercial.
* El soft delete debe conservar historial de pedidos.

## Endpoints necesarios

```txt
GET   /api/admin/users
GET   /api/admin/users/:id
PATCH /api/admin/users/:id/status
GET   /api/admin/users/:id/orders
GET   /api/admin/users/:id/stock-requests
```

## Prioridad

MVP media.

---

# 9. Reportes

## Ruta principal

```txt
/admin/reportes
```

## Objetivo

Dar información básica para tomar decisiones comerciales.

## Reportes mínimos

* Ventas por período.
* Productos más vendidos.
* Pedidos por estado.
* Productos sin stock.
* Productos con stock bajo.
* Solicitudes de stock por producto.

## Filtros

* Fecha desde.
* Fecha hasta.
* Categoría.
* Estado de pedido.

## Endpoints necesarios

```txt
GET /api/admin/reports/sales
GET /api/admin/reports/best-sellers
GET /api/admin/reports/orders-by-status
GET /api/admin/reports/stock
GET /api/admin/reports/stock-requests
```

## Prioridad

MVP media. Puede comenzar básico.

---

# 10. Configuración / Contenido

## Ruta principal

```txt
/admin/contenido
```

## Objetivo

Permitir editar contenido institucional o comercial sin tocar código.

## Contenido editable

* Texto del hero.
* Banner de ofertas.
* WhatsApp.
* Dirección.
* Horarios.
* Redes sociales.
* Mensajes de envío.
* Mensajes de retiro en sucursal.
* Políticas de cambio.
* Políticas de contacto.

## Endpoints necesarios

```txt
GET   /api/admin/content
PATCH /api/admin/content/:key
```

## Prioridad

MVP media/baja.

---

# 11. Prioridad de implementación del Panel Admin

## MVP Admin obligatorio

```txt
/admin/dashboard
/admin/productos
/admin/productos/nuevo
/admin/productos/:id/editar
/admin/categorias
/admin/pedidos
/admin/pedidos/:id
/admin/solicitudes-stock
```

## MVP Admin recomendable

```txt
/admin/envios
/admin/usuarios
/admin/reportes
```

## Etapa posterior

```txt
/admin/contenido
/admin/configuracion
reportes avanzados
historial de cambios
importación Excel
notificaciones automáticas por email/WhatsApp
```

---

# 12. Dependencias de implementación

Antes de implementar el panel admin completo se requiere:

```txt
Auth y roles
ABM backend de productos
ABM backend de categorías
Carrito
Checkout y órdenes
Solicitudes de stock
```

Actualmente ya están resueltos:

```txt
Auth y roles
ABM backend de productos
ABM backend de categorías
Carrito
Solicitudes de stock
```

Pendiente antes de operar pedidos reales:

```txt
Checkout y órdenes
Mercado Pago
Estados de pedidos
```

---

# 13. Orden recomendado

Aunque el panel admin está definido, el orden de implementación recomendado es:

```txt
1. Checkout + órdenes
2. Mercado Pago
3. Panel admin frontend
4. Perfil usuario registrado
```

Motivo: sin checkout y órdenes, el admin todavía no tiene pedidos reales para gestionar.


---

# 14. Visitante / Invitado

## Objetivo del perfil visitante

El visitante o invitado debe poder recorrer el catálogo, agregar productos al carrito y completar una compra sin necesidad de registrarse. La experiencia debe ser simple, rápida y sin fricción.

El objetivo principal de este perfil es convertir visitas en ventas.

El visitante puede:

* Ver productos.
* Filtrar y buscar productos.
* Ver ofertas, nuevos, destacados y más vendidos.
* Agregar productos al carrito.
* Solicitar aviso de stock.
* Comprar como invitado.
* Consultar un pedido mediante tracking code.

El visitante no puede:

* Ver historial de compras.
* Guardar direcciones.
* Ver solicitudes de stock anteriores.
* Acceder a `/mi-cuenta`.
* Acceder a `/admin`.

---

## 14.1 Home pública

### Ruta

```txt
/
```

### Objetivo

Presentar rápidamente la propuesta comercial de El Líder y llevar al usuario al catálogo o a productos destacados.

### Debe mostrar

* Hero principal con llamada a la acción.
* Acceso a categorías principales.
* Productos en oferta.
* Productos destacados.
* Productos nuevos.
* Más vendidos, cuando existan ventas reales.
* Beneficios de compra:

  * retiro en sucursal;
  * envíos;
  * pago online;
  * atención por WhatsApp.
* Acceso visible al carrito.
* Acceso a login/registro.

### Acciones

* Ir al catálogo.
* Ver ofertas.
* Ver categorías.
* Agregar productos destacados al carrito.
* Contactar por WhatsApp, si está configurado.

### Endpoints necesarios

```txt
GET /api/categories
GET /api/products/featured
GET /api/products/offers
GET /api/products/new
GET /api/products/best-sellers
```

### Prioridad

MVP alta.

---

## 14.2 Catálogo de productos

### Ruta

```txt
/productos
```

### Objetivo

Permitir que el visitante vea todos los productos disponibles de la tienda.

### Debe mostrar

* Listado de productos desde base de datos.
* Imagen.
* Nombre.
* Categoría.
* Precio actual.
* Precio anterior tachado si está en oferta.
* Badges:

  * Oferta
  * Nuevo
  * Destacado
  * Sin stock
* Botón “Agregar al carrito”.
* Botón “Avisarme cuando haya stock” si no hay stock.

### Filtros

* Categoría.
* Oferta.
* Nuevo.
* Destacado.
* Más vendidos.
* Con stock / sin stock.
* Rango de precio, etapa posterior.

### Buscador

Debe permitir buscar por nombre de producto.

### Reglas

* Solo se muestran productos activos.
* Los productos sin stock se pueden mostrar, pero no se pueden agregar al carrito.
* El frontend no debe usar datos mock.
* Los precios vienen desde API.
* El backend es la fuente de verdad del precio y stock.

### Endpoints necesarios

```txt
GET /api/products
GET /api/categories
GET /api/products/offers
GET /api/products/featured
GET /api/products/new
GET /api/products/best-sellers
```

### Prioridad

MVP alta.

---

## 14.3 Categorías

### Ruta

```txt
/productos/categorias
/productos/categorias/:slug
```

### Objetivo

Permitir navegar productos agrupados por categoría.

### Categorías principales actuales

```txt
Repostería
Descartables
Cotillón
Envases
Gastronomía
```

### Debe mostrar

* Listado de categorías.
* Imagen o ícono de categoría.
* Cantidad de productos, si está disponible.
* Productos de la categoría seleccionada.
* Estado vacío si no hay productos.

### Endpoints necesarios

```txt
GET /api/categories
GET /api/categories/:id/products
GET /api/categories/slug/:slug/products
```

### Prioridad

MVP alta.

---

## 14.4 Ofertas

### Ruta

```txt
/productos/ofertas
```

### Objetivo

Mostrar productos con precio promocional.

### Debe mostrar

* Productos con `isOffer = true`.
* Precio actual.
* Precio anterior `compareAtPrice` tachado.
* Porcentaje de descuento, si se decide calcular.
* Botón agregar al carrito.
* Botón de aviso de stock si corresponde.

### Reglas

* Para mostrarse como oferta, el producto debe estar activo.
* Si tiene `compareAtPrice`, debe ser mayor al `price`.
* Si no hay ofertas, debe mostrar estado vacío amigable.

### Endpoints necesarios

```txt
GET /api/products/offers
```

### Prioridad

MVP alta.

---

## 14.5 Nuevos productos

### Ruta

```txt
/productos/nuevos
```

### Objetivo

Mostrar productos marcados como nuevos.

### Debe mostrar

* Productos con `isNew = true`.
* Badge “Nuevo”.
* Imagen.
* Precio.
* Stock.
* Acción de carrito o aviso de stock.

### Endpoints necesarios

```txt
GET /api/products/new
```

### Prioridad

MVP media.

---

## 14.6 Más vendidos

### Ruta

```txt
/productos/mas-vendidos
```

### Objetivo

Mostrar productos ordenados según cantidad vendida real.

### Reglas

* Los más vendidos deben calcularse desde `OrderItem`.
* No deberían depender de un flag manual.
* Mientras no existan pedidos, se puede mostrar:

  * estado vacío;
  * o fallback temporal con productos destacados, si se documenta.

### Debe mostrar

* Producto.
* Imagen.
* Precio.
* Cantidad vendida, si se decide mostrar públicamente.
* Botón de carrito.
* Badge “Más vendido”.

### Endpoints necesarios

```txt
GET /api/products/best-sellers
```

### Prioridad

MVP media. Gana importancia después del checkout.

---

## 14.7 Detalle de producto

### Ruta

```txt
/productos/:slug
```

### Objetivo

Permitir al visitante revisar información completa antes de comprar.

### Debe mostrar

* Galería de imágenes.
* Nombre.
* Categoría.
* Descripción completa.
* Precio actual.
* Precio anterior si aplica.
* Estado de stock.
* Cantidad a agregar.
* Botón “Agregar al carrito”.
* Botón “Avisarme cuando haya stock” si stock es 0.
* Productos relacionados, etapa posterior.

### Reglas

* Si el producto está inactivo, no debe mostrarse públicamente.
* Si no hay stock, no se puede agregar al carrito.
* La solicitud de stock debe estar disponible para invitados y usuarios logueados.

### Endpoints necesarios

```txt
GET /api/products/slug/:slug
POST /api/products/:productId/stock-requests
```

### Prioridad

MVP alta.

---

## 14.8 Solicitud de aviso de stock como invitado

### Ruta / interacción

Puede ser un modal desde:

```txt
/productos
/productos/:slug
/carrito
```

### Objetivo

Permitir que un visitante deje sus datos para ser contactado cuando vuelva un producto sin stock.

### Debe solicitar

```txt
Nombre
Email
Teléfono
```

### Debe mostrar

* Producto solicitado.
* Mensaje claro de confirmación.
* Estado de error si el email no es válido.
* Estado de error si falta un dato obligatorio.

### Reglas

* No requiere login.
* Debe evitar duplicados excesivos por producto/email.
* Debe generar solicitud visible para el admin.
* No reserva stock.
* No crea pedido.

### Endpoints necesarios

```txt
POST /api/products/:productId/stock-requests
```

### Prioridad

MVP alta, porque ya existe base funcional de solicitudes de stock.

---

## 14.9 Carrito público

### Ruta

```txt
/carrito
```

### Objetivo

Permitir al visitante revisar y modificar su compra antes del checkout.

### Debe mostrar

* Productos agregados.
* Imagen.
* Nombre.
* Precio unitario.
* Cantidad.
* Subtotal por producto.
* Subtotal general.
* Botón sumar cantidad.
* Botón restar cantidad.
* Botón eliminar.
* Botón vaciar carrito.
* Botón seguir comprando.
* Botón ir a checkout.

### Reglas

* El carrito invitado persiste en `localStorage`.
* El carrito no debe guardar precios como fuente definitiva.
* Si el producto cambia de precio, prevalece el precio del backend.
* Si el producto queda sin stock, debe informarse.
* Si el visitante inicia sesión, el carrito se sincroniza automáticamente.

### Endpoints necesarios

```txt
POST /api/cart/validate
POST /api/cart/sync
```

Además, para usuario autenticado:

```txt
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:itemId
DELETE /api/cart/items/:itemId
DELETE /api/cart
```

### Prioridad

MVP alta. Ya implementado funcionalmente.

---

## 14.10 Checkout como invitado

### Ruta

```txt
/checkout
```

### Objetivo

Permitir comprar sin crear cuenta.

### Debe solicitar

```txt
Nombre
Email
Teléfono
Método de entrega
```

Si elige envío:

```txt
Dirección
Ciudad
Provincia
Código postal
Referencias
```

### Debe mostrar

* Resumen de productos.
* Subtotal.
* Costo de envío.
* Total final.
* Método de entrega.
* Método de pago.
* Botón pagar.

### Métodos de entrega

```txt
Retiro en sucursal
Envío a domicilio
```

### Reglas

* Si elige retiro, costo de envío = 0.
* Si elige envío, debe cargar dirección.
* El backend recalcula subtotal, envío y total.
* La orden debe crearse antes del pago.
* El pago se completa con Mercado Pago en el change correspondiente.

### Endpoints necesarios

```txt
POST /api/checkout
POST /api/payments/mercadopago/preference
```

### Prioridad

MVP crítica. Próximo bloque funcional.

---

## 14.11 Confirmación de compra

### Ruta sugerida

```txt
/checkout/success
/checkout/pending
/checkout/failure
```

### Objetivo

Informar el resultado del pago y entregar al usuario su tracking code.

### Debe mostrar

* Estado de la operación.
* Número de pedido.
* Tracking code.
* Estado inicial del pedido.
* Método de entrega.
* Total.
* Botón para consultar seguimiento.
* Botón para volver al inicio.

### Prioridad

MVP alta, junto con checkout y Mercado Pago.

---

## 14.12 Seguimiento de pedido público

### Ruta

```txt
/pedido/:trackingCode
```

o formulario:

```txt
/seguimiento
```

### Objetivo

Permitir que un comprador invitado consulte el estado de su pedido sin iniciar sesión.

### Debe permitir

* Buscar por tracking code.
* Opcionalmente validar email o teléfono para mayor seguridad.

### Debe mostrar

* Estado del pedido.
* Estado del pago.
* Método de entrega.
* Fecha del pedido.
* Productos comprados.
* Total.
* Estado de envío o retiro.

### Endpoints necesarios

```txt
GET /api/orders/track/:trackingCode
```

### Prioridad

MVP alta.

---

## 14.13 Páginas institucionales

### Rutas

```txt
/nosotros
/direccion
/contacto
```

### Objetivo

Dar confianza y canales de contacto.

### Deben mostrar

#### Nosotros

* Breve historia del comercio.
* Rubros principales.
* Mensaje de confianza.

#### Dirección

* Dirección de sucursal.
* Mapa, si se integra.
* Horarios.
* Datos de retiro.

#### Contacto

* Teléfono.
* WhatsApp.
* Email.
* Redes sociales.
* Formulario simple, etapa posterior.

### Prioridad

MVP media.

---

# 15. Usuario Registrado

## Objetivo del perfil usuario registrado

El usuario registrado debe tener una experiencia más cómoda que el visitante. Debe poder comprar más rápido, guardar direcciones, ver pedidos anteriores, consultar pagos y revisar solicitudes de stock.

El registro no debe ser obligatorio para comprar, pero sí debe aportar valor.

El usuario registrado puede:

* Hacer todo lo que hace el visitante.
* Mantener sesión.
* Sincronizar carrito invitado al iniciar sesión.
* Ver y editar sus datos.
* Guardar direcciones.
* Ver historial de pedidos.
* Ver detalle de pedidos.
* Ver pagos.
* Ver solicitudes de stock.
* Comprar más rápido usando direcciones guardadas.

---

## 15.1 Acceso y sesión

### Rutas

```txt
/login
/registro
```

### Objetivo

Permitir al usuario ingresar o crear cuenta.

### Login

Debe solicitar:

```txt
Email
Contraseña
```

### Registro

Debe solicitar:

```txt
Nombre
Email
Teléfono, si se decide obligatorio
Contraseña
Confirmación de contraseña
```

### Reglas

* El registro público crea usuarios con rol `USER`.
* El rol `ADMIN` no puede crearse desde registro público.
* Si el usuario tenía carrito como invitado, se sincroniza al iniciar sesión.
* Luego del login, el usuario vuelve a la página anterior o a `/mi-cuenta`.

### Endpoints necesarios

```txt
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
POST /api/cart/sync
```

### Prioridad

MVP alta. Ya implementado funcionalmente.

---

## 15.2 Layout de Mi cuenta

### Ruta base

```txt
/mi-cuenta
```

### Rutas internas

```txt
/mi-cuenta
/mi-cuenta/perfil
/mi-cuenta/direcciones
/mi-cuenta/pedidos
/mi-cuenta/pedidos/:id
/mi-cuenta/pagos
/mi-cuenta/solicitudes-stock
```

### Elementos comunes

* Menú lateral o tabs.
* Resumen del usuario.
* Acceso a pedidos.
* Acceso a direcciones.
* Acceso a solicitudes de stock.
* Acceso a pagos.
* Botón logout.
* Diseño responsive.

### Reglas

* Requiere usuario autenticado.
* No permite acceso a datos de otros usuarios.
* Si no hay sesión, redirige a login.

### Prioridad

MVP media/alta. Puede implementarse después de checkout.

---

## 15.3 Mi cuenta — resumen

### Ruta

```txt
/mi-cuenta
```

### Objetivo

Dar una vista rápida del estado del usuario.

### Debe mostrar

* Datos básicos del usuario.
* Últimos pedidos.
* Estado del pedido más reciente.
* Solicitudes de stock pendientes.
* Accesos rápidos.

### Accesos rápidos

```txt
Mis pedidos
Mis direcciones
Mis solicitudes de stock
Editar mis datos
Ir al catálogo
```

### Endpoints necesarios

```txt
GET /api/auth/me
GET /api/me/orders
GET /api/me/stock-requests
```

### Prioridad

MVP media.

---

## 15.4 Mis datos

### Ruta

```txt
/mi-cuenta/perfil
```

### Objetivo

Permitir al usuario consultar y actualizar sus datos.

### Debe mostrar

```txt
Nombre
Email
Teléfono
Fecha de registro
```

### Acciones

* Editar nombre.
* Editar teléfono.
* Cambiar email, etapa posterior o con validación adicional.
* Cambiar contraseña, etapa posterior.

### Endpoints necesarios

```txt
GET   /api/me/profile
PATCH /api/me/profile
```

### Prioridad

MVP media.

---

## 15.5 Mis direcciones

### Ruta

```txt
/mi-cuenta/direcciones
```

### Objetivo

Permitir guardar direcciones para acelerar futuras compras.

### Debe mostrar

* Listado de direcciones guardadas.
* Dirección predeterminada.
* Botón agregar dirección.
* Editar dirección.
* Eliminar dirección.
* Marcar como predeterminada.

### Campos de dirección

```txt
Nombre destinatario
Teléfono
Calle
Número
Piso/departamento
Ciudad
Provincia
Código postal
Referencias
Predeterminada
```

### Reglas

* El usuario solo puede ver sus propias direcciones.
* En checkout, el usuario puede elegir una dirección guardada.
* Si elimina la dirección predeterminada, debe poder elegir otra.

### Endpoints necesarios

```txt
GET    /api/me/addresses
POST   /api/me/addresses
PATCH  /api/me/addresses/:id
DELETE /api/me/addresses/:id
```

### Prioridad

MVP media/alta. Importante para checkout de usuario registrado.

---

## 15.6 Mis pedidos

### Ruta

```txt
/mi-cuenta/pedidos
```

### Objetivo

Permitir al usuario ver su historial de compras.

### Debe mostrar por pedido

* Número de pedido.
* Fecha.
* Monto total.
* Estado del pedido.
* Estado del pago.
* Método de entrega.
* Tracking code.
* Acción ver detalle.

### Filtros

* Estado.
* Fecha.
* Método de entrega.

### Reglas

* Solo se muestran pedidos del usuario autenticado.
* Los pedidos como invitado no se asocian automáticamente salvo que el email coincida y se defina una estrategia posterior.

### Endpoints necesarios

```txt
GET /api/me/orders
```

### Prioridad

MVP media/alta. Depende de checkout y órdenes.

---

## 15.7 Detalle de pedido

### Ruta

```txt
/mi-cuenta/pedidos/:id
```

### Objetivo

Mostrar información completa de una compra realizada por el usuario.

### Debe mostrar

### Datos generales

* Número de pedido.
* Tracking code.
* Fecha.
* Estado del pedido.
* Estado del pago.
* Método de entrega.
* Método de pago.

### Productos

* Imagen.
* Nombre.
* Cantidad.
* Precio unitario.
* Subtotal.

### Totales

* Subtotal productos.
* Costo de envío.
* Total.

### Entrega

Si es retiro:

* Estado de preparación.
* Listo para retirar.
* Dirección de sucursal.

Si es envío:

* Dirección.
* Estado de envío.
* Fecha estimada.

### Reglas

* El usuario no puede ver pedidos de otro usuario.
* Si el pedido fue hecho como invitado, se consulta desde tracking público.

### Endpoints necesarios

```txt
GET /api/me/orders/:id
```

### Prioridad

MVP media/alta.

---

## 15.8 Mis pagos

### Ruta

```txt
/mi-cuenta/pagos
```

### Objetivo

Permitir consultar pagos realizados o pendientes.

### Debe mostrar

* Fecha.
* Número de pedido.
* Monto.
* Proveedor de pago.
* Estado:

  * aprobado
  * pendiente
  * rechazado
  * cancelado
  * reembolsado
* Link al pedido.

### Endpoints necesarios

```txt
GET /api/me/payments
```

### Prioridad

MVP media. Depende de Mercado Pago.

---

## 15.9 Mis solicitudes de stock

### Ruta

```txt
/mi-cuenta/solicitudes-stock
```

### Objetivo

Permitir que el usuario vea los productos sobre los cuales pidió aviso de disponibilidad.

### Debe mostrar

* Producto.
* Imagen.
* Fecha de solicitud.
* Estado.
* Datos de contacto usados.
* Botón ver producto.
* Botón cancelar solicitud, si se decide permitir.

### Estados

```txt
PENDING
CONTACTED
NOTIFIED
CANCELLED
```

### Reglas

* Solo se muestran solicitudes del usuario autenticado.
* Las solicitudes de invitado no aparecen salvo que se cree una asociación posterior.
* Si el producto vuelve a tener stock, puede mostrarse una acción para ir al producto.

### Endpoints necesarios

```txt
GET /api/me/stock-requests
PATCH /api/me/stock-requests/:id/cancel
```

### Prioridad

MVP media. Ya existe base funcional de solicitudes.

---

# 16. Comparación rápida por perfil

| Funcionalidad            |      Invitado |  Usuario registrado |                   Admin |
| ------------------------ | ------------: | ------------------: | ----------------------: |
| Ver catálogo             |            Sí |                  Sí |                      Sí |
| Agregar al carrito       |            Sí |                  Sí |                      Sí |
| Persistir carrito        |  LocalStorage |             Backend |               No aplica |
| Comprar                  |            Sí |                  Sí | No como flujo principal |
| Checkout                 |      Invitado | Con datos guardados |                      No |
| Ver historial            |            No |                  Sí |       Sí, desde pedidos |
| Guardar direcciones      |            No |                  Sí |                      No |
| Solicitar aviso de stock | Sí, con datos |      Sí, con cuenta |                Gestiona |
| Ver solicitudes de stock |            No |                  Sí |                      Sí |
| Gestionar productos      |            No |                  No |                      Sí |
| Gestionar categorías     |            No |                  No |                      Sí |
| Gestionar pedidos        |            No |                  No |                      Sí |
| Gestionar usuarios       |            No |                  No |                      Sí |
| Ver reportes             |            No |                  No |                      Sí |

---

# 17. Orden recomendado de implementación por impacto

## Ya implementado

```txt
Auth y roles
Carrito invitado
Carrito autenticado
Sync al login
ABM backend productos
ABM backend categorías
Stock
Solicitudes de stock
Seed real
Swagger base
```

## Próximo bloque recomendado

```txt
1. Checkout + órdenes
2. Mercado Pago
3. Panel admin frontend
4. Perfil usuario registrado
```

## Motivo

El checkout y las órdenes son el núcleo comercial. Sin eso no hay ventas reales. Mercado Pago cierra la compra. Luego el panel admin permite operar los pedidos y el perfil de usuario mejora fidelización y autogestión.

---
