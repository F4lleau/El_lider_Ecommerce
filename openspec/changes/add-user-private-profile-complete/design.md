Ruta:

openspec/changes/add-user-private-profile-complete/design.md

Contenido:

# Design: add-user-private-profile-complete

## Context

El sistema ya permite:

- Registro y login.
- Recuperación de contraseña.
- Roles.
- Carrito.
- Checkout.
- Pedidos.
- Pago con Mercado Pago o efectivo.
- Retiro en sucursal o envío a domicilio.
- Tracking público.
- Solicitudes de stock.
- Panel admin MVP.

Ahora se necesita completar la zona privada del cliente registrado.

## Main goal

Crear una experiencia clara de cuenta de usuario:

```txt
/mi-cuenta
/mi-cuenta/perfil
/mi-cuenta/direcciones
/mi-cuenta/pedidos
/mi-cuenta/pedidos/:id
/mi-cuenta/solicitudes-stock

Opcional:

/mi-cuenta/pagos

Para MVP, pagos puede estar integrado dentro del detalle del pedido.

Route protection

Todas las rutas /mi-cuenta/* requieren:

usuario autenticado
rol USER o ADMIN si se permite acceso general
token válido

Si no está autenticado:

redirigir a /login

Si el token expiró:

limpiar sesión
redirigir a /login
mostrar mensaje de sesión vencida si existe mecanismo
User account layout

Se debe crear o completar un layout para la cuenta:

Elementos sugeridos:

Header o título: Mi cuenta
Nombre del usuario
Menú lateral o tabs responsive
Contenido principal
Botón volver a la tienda
Botón cerrar sesión

Menú:

Resumen
Mis datos
Mis direcciones
Mis pedidos
Solicitudes de stock
Cerrar sesión

En mobile puede mostrarse como lista, dropdown o tabs.

Dashboard /mi-cuenta

Objetivo:

Dar una vista rápida del estado de la cuenta.

Debe mostrar:

Hola, {nombre}
Últimos pedidos
Solicitudes de stock pendientes
Dirección principal, si existe
Accesos rápidos

Cards sugeridas:

Mis pedidos
Mis direcciones
Solicitudes de stock
Datos personales

Acciones:

Ver mis pedidos
Editar mis datos
Administrar direcciones
Ver solicitudes de stock

Empty state:

Todavía no realizaste pedidos.
Profile /mi-cuenta/perfil

Campos visibles/editables:

Nombre
Apellido
Email
Teléfono

Reglas:

Email puede mostrarse como solo lectura en MVP.
Si se permite editar email, debe validarse unicidad.
No exponer password en esta pantalla.
Cambio de contraseña ya se maneja por recupero de clave, no mezclar en este change salvo que ya exista función.

Validaciones:

nombre requerido
apellido opcional o requerido según modelo actual
email formato válido
teléfono opcional

Endpoints sugeridos:

GET   /api/users/me
PATCH /api/users/me

Si ya existen endpoints equivalentes, reutilizarlos.

Addresses /mi-cuenta/direcciones

Objetivo:

Que el usuario registrado pueda guardar direcciones para checkout.

Campos sugeridos:

Nombre o alias de dirección
Calle
Número
Piso
Departamento
Localidad
Provincia
Código postal
Referencia
Teléfono de contacto
Es principal

Acciones:

Crear dirección
Editar dirección
Eliminar dirección
Marcar como principal

Reglas:

Una sola dirección principal por usuario.
El usuario solo puede gestionar sus direcciones.
No permitir editar direcciones de otro usuario.
Si se elimina la dirección principal, otra puede quedar como principal o ninguna, según decisión.
En checkout futuro, el usuario debería poder seleccionar dirección guardada.

Endpoints sugeridos:

GET    /api/users/me/addresses
POST   /api/users/me/addresses
PATCH  /api/users/me/addresses/:id
DELETE /api/users/me/addresses/:id
PATCH  /api/users/me/addresses/:id/default

Si ya existen direcciones en otro módulo, adaptar sin duplicar.

Orders /mi-cuenta/pedidos

Debe listar solo pedidos propios del usuario autenticado.

Columnas/cards:

Número de orden
Número de seguimiento
Fecha
Total
Método de entrega
Método de pago
Estado del pedido
Estado del pago
Acción Ver detalle

Labels en español:

CASH -> Efectivo
MERCADOPAGO -> Mercado Pago
PICKUP -> Retiro en sucursal
SHIPPING -> Envío a domicilio
PENDING_PAYMENT -> Pendiente de pago
CONFIRMED -> Pedido confirmado
PREPARING -> En preparación
READY_FOR_PICKUP -> Listo para retirar
SHIPPED -> En camino
DELIVERED -> Entregado
CANCELLED -> Cancelado
PENDING -> Pago pendiente
APPROVED -> Pago aprobado
REJECTED -> Pago rechazado

Estados:

Loading.
Error.
Empty state.
Paginación si hay muchos pedidos.

Endpoint sugerido:

GET /api/users/me/orders

Si ya existe:

GET /api/orders/me
GET /api/me/orders

usar el existente.

Order detail /mi-cuenta/pedidos/:id

Debe mostrar:

Datos generales
Número de orden
Número de seguimiento
Fecha
Estado del pedido
Estado del pago
Método de pago
Método de entrega
Productos
Imagen
Nombre
SKU
Cantidad
Precio unitario
Subtotal
Totales
Subtotal productos
Costo de envío
Total
Entrega

Si PICKUP:

Retiro en sucursal
Mensaje: Te avisaremos cuando esté listo para retirar.

Si SHIPPING:

Dirección de entrega
Referencia
Estado de envío
Pago

Si CASH + PICKUP:

Pago pendiente en efectivo al retirar.

Si CASH + SHIPPING:

Pago pendiente en efectivo al recibir.

Si MERCADOPAGO + PENDING:

Pago pendiente con Mercado Pago.
Botón: Pagar con Mercado Pago.

Si MERCADOPAGO + APPROVED:

Pago aprobado.

Endpoint sugerido:

GET /api/users/me/orders/:id

Seguridad:

No permitir ver pedidos de otro usuario.
Si el pedido no pertenece al usuario, devolver 404 o 403 según patrón actual.
No exponer información sensible del pago.
Stock requests /mi-cuenta/solicitudes-stock

Debe listar solicitudes propias del usuario.

Campos:

Producto
Imagen
Fecha de solicitud
Estado
Email/teléfono usado, si corresponde
Acciones

Acciones:

Ver producto
Cancelar solicitud, si está pendiente

Estados en español:

PENDING -> Pendiente
CONTACTED -> Contactado
NOTIFIED -> Notificado
CANCELLED -> Cancelado

Endpoint sugerido:

GET   /api/users/me/stock-requests
PATCH /api/users/me/stock-requests/:id/cancel

Si ya existe endpoint equivalente, reutilizar.

Labels reuse

Reutilizar helpers ya creados en el change anterior:

orderStatusLabel
paymentStatusLabel
paymentMethodLabel
deliveryMethodLabel

Agregar si falta:

stockRequestStatusLabel
Frontend UX

Cada pantalla debe manejar:

loading
error
empty
success toast
form validation
responsive layout

Mensajes sugeridos:

No tenés pedidos todavía.
No tenés direcciones cargadas.
No tenés solicitudes de stock.
No se pudo cargar la información de tu cuenta.
Tus datos fueron actualizados.
Dirección guardada correctamente.
Backend security

Reglas:

Los endpoints me usan el usuario del token.
Nunca aceptar userId desde frontend para consultar datos privados.
El usuario solo accede a sus recursos.
Admin no es objetivo de esta sección, salvo que el sistema permita admin como usuario.
Validar ownership en pedidos, direcciones y solicitudes.
Data model

Revisar si existe modelo Address.

Si no existe, crear modelo sugerido:

model UserAddress {
  id          Int      @id @default(autoincrement())
  userId      Int
  label       String?
  street      String
  number      String
  floor       String?
  apartment   String?
  city        String
  province    String
  postalCode  String?
  reference   String?
  phone       String?
  isDefault   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

Adaptar nombres a los patrones existentes del proyecto.

Swagger

Documentar si se agregan o cambian endpoints:

GET /api/users/me
PATCH /api/users/me
GET /api/users/me/addresses
POST /api/users/me/addresses
PATCH /api/users/me/addresses/:id
DELETE /api/users/me/addresses/:id
PATCH /api/users/me/addresses/:id/default
GET /api/users/me/orders
GET /api/users/me/orders/:id
GET /api/users/me/stock-requests
PATCH /api/users/me/stock-requests/:id/cancel
Testing

Backend:

Usuario puede ver su perfil.
Usuario puede editar su perfil.
Usuario no puede ver datos de otro usuario.
Usuario puede crear dirección.
Usuario puede editar dirección propia.
Usuario no puede editar dirección ajena.
Usuario puede marcar dirección principal.
Usuario puede listar pedidos propios.
Usuario no puede ver pedido ajeno.
Usuario puede ver detalle de pedido propio.
Usuario puede listar solicitudes propias.
Usuario puede cancelar solicitud propia pendiente.

Frontend:

/mi-cuenta renderiza.
/mi-cuenta/perfil renderiza y valida.
/mi-cuenta/direcciones renderiza.
/mi-cuenta/pedidos renderiza.
/mi-cuenta/pedidos/:id renderiza.
/mi-cuenta/solicitudes-stock renderiza.
Usuario no autenticado redirige a login.
Decisions
Este change completa la zona privada del usuario.
No se implementa email real.
No se implementan notificaciones.
No se implementa cambio de contraseña dentro del perfil.
No se implementan reviews.
Pagos puede mostrarse dentro del detalle del pedido.
Todas las etiquetas visibles deben estar en español.