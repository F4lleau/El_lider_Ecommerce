# 1. `proposal.md`

Ruta:

```txt
openspec/changes/add-user-private-profile-complete/proposal.md
```

Contenido:

```md
# Change: add-user-private-profile-complete

## Summary

Completar el perfil privado del usuario registrado, incorporando dashboard de cuenta, edición de datos personales, gestión de direcciones, historial de pedidos, detalle de pedido, estado de pago, estado de entrega, seguimiento y solicitudes de stock.

## Motivation

El sistema ya cuenta con autenticación, roles, carrito, checkout, órdenes, pagos con Mercado Pago/efectivo, tracking público, solicitudes de stock y panel admin MVP.

Después de comprar, el usuario registrado necesita una zona privada donde pueda:

- Ver sus datos.
- Editar su perfil.
- Administrar direcciones.
- Ver sus pedidos.
- Ver el detalle de cada pedido.
- Consultar número de seguimiento.
- Ver método de pago y estado de pago.
- Ver método de entrega y estado del pedido.
- Consultar o cancelar solicitudes de stock.

Sin esta sección, la experiencia queda incompleta: el usuario puede comprar, pero no tiene un historial claro ni una cuenta funcional.

## Scope

Este cambio incluye:

- Crear o completar layout privado de usuario.
- Crear dashboard `/mi-cuenta`.
- Crear perfil `/mi-cuenta/perfil`.
- Crear direcciones `/mi-cuenta/direcciones`.
- Crear pedidos `/mi-cuenta/pedidos`.
- Crear detalle de pedido `/mi-cuenta/pedidos/:id`.
- Crear solicitudes de stock `/mi-cuenta/solicitudes-stock`.
- Reutilizar labels en español para estados, pagos y entregas.
- Proteger rutas con usuario autenticado.
- Evitar acceso a pedidos o datos de otros usuarios.
- Crear o ajustar endpoints de perfil si faltan.
- Crear o ajustar endpoints de direcciones si faltan.
- Crear o ajustar endpoints de pedidos del usuario si faltan.
- Crear o ajustar endpoints de solicitudes de stock del usuario si faltan.
- Mejorar UX responsive de la zona privada.
- Agregar tests.
- Actualizar Swagger si cambian endpoints.
- Crear `current-state.md`.

## Out of Scope

Este cambio no incluye:

- Recupero de contraseña.
- Emails transaccionales.
- Notificaciones por WhatsApp.
- Panel admin avanzado.
- Reportes.
- Facturación.
- Cambios de email con verificación.
- Borrado físico de usuario.
- Métodos de pago nuevos.
- Reembolsos.
- Devoluciones.
- Reviews o calificaciones de productos.

## Acceptance Criteria

- El usuario autenticado puede entrar a `/mi-cuenta`.
- Usuario no autenticado es redirigido a `/login`.
- `/mi-cuenta` muestra resumen de cuenta.
- `/mi-cuenta/perfil` permite ver y editar datos básicos.
- `/mi-cuenta/direcciones` permite crear, editar, eliminar y marcar dirección principal, si backend lo soporta.
- `/mi-cuenta/pedidos` lista pedidos propios.
- `/mi-cuenta/pedidos/:id` muestra detalle de pedido propio.
- El usuario no puede ver pedidos de otro usuario.
- Las órdenes muestran número de orden y número de seguimiento.
- Las órdenes muestran método de entrega en español.
- Las órdenes muestran método de pago en español.
- Las órdenes muestran estado de pedido en español.
- Las órdenes muestran estado de pago en español.
- El detalle de pedido muestra productos, SKU, cantidad, precio unitario, subtotal, envío y total.
- Si el pedido es Mercado Pago pendiente, se muestra acción para pagar si corresponde.
- Si el pedido es efectivo, se informa pago pendiente al retirar o recibir.
- `/mi-cuenta/solicitudes-stock` lista solicitudes propias.
- Las solicitudes de stock muestran estado en español.
- Se manejan loading, error y empty states.
- Build backend pasa.
- Build frontend pasa.
- Tests relacionados pasan.
- Swagger responde HTTP 200.
```

---

# 2. `design.md`

Ruta:

```txt
openspec/changes/add-user-private-profile-complete/design.md
```

Contenido:

````md
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
````

Opcional:

```txt
/mi-cuenta/pagos
```

Para MVP, pagos puede estar integrado dentro del detalle del pedido.

## Route protection

Todas las rutas `/mi-cuenta/*` requieren:

```txt
usuario autenticado
rol USER o ADMIN si se permite acceso general
token válido
```

Si no está autenticado:

```txt
redirigir a /login
```

Si el token expiró:

```txt
limpiar sesión
redirigir a /login
mostrar mensaje de sesión vencida si existe mecanismo
```

## User account layout

Se debe crear o completar un layout para la cuenta:

Elementos sugeridos:

```txt
Header o título: Mi cuenta
Nombre del usuario
Menú lateral o tabs responsive
Contenido principal
Botón volver a la tienda
Botón cerrar sesión
```

Menú:

```txt
Resumen
Mis datos
Mis direcciones
Mis pedidos
Solicitudes de stock
Cerrar sesión
```

En mobile puede mostrarse como lista, dropdown o tabs.

## Dashboard `/mi-cuenta`

Objetivo:

Dar una vista rápida del estado de la cuenta.

Debe mostrar:

```txt
Hola, {nombre}
Últimos pedidos
Solicitudes de stock pendientes
Dirección principal, si existe
Accesos rápidos
```

Cards sugeridas:

```txt
Mis pedidos
Mis direcciones
Solicitudes de stock
Datos personales
```

Acciones:

```txt
Ver mis pedidos
Editar mis datos
Administrar direcciones
Ver solicitudes de stock
```

Empty state:

```txt
Todavía no realizaste pedidos.
```

## Profile `/mi-cuenta/perfil`

Campos visibles/editables:

```txt
Nombre
Apellido
Email
Teléfono
```

Reglas:

* Email puede mostrarse como solo lectura en MVP.
* Si se permite editar email, debe validarse unicidad.
* No exponer password en esta pantalla.
* Cambio de contraseña ya se maneja por recupero de clave, no mezclar en este change salvo que ya exista función.

Validaciones:

```txt
nombre requerido
apellido opcional o requerido según modelo actual
email formato válido
teléfono opcional
```

Endpoints sugeridos:

```txt
GET   /api/users/me
PATCH /api/users/me
```

Si ya existen endpoints equivalentes, reutilizarlos.

## Addresses `/mi-cuenta/direcciones`

Objetivo:

Que el usuario registrado pueda guardar direcciones para checkout.

Campos sugeridos:

```txt
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
```

Acciones:

```txt
Crear dirección
Editar dirección
Eliminar dirección
Marcar como principal
```

Reglas:

* Una sola dirección principal por usuario.
* El usuario solo puede gestionar sus direcciones.
* No permitir editar direcciones de otro usuario.
* Si se elimina la dirección principal, otra puede quedar como principal o ninguna, según decisión.
* En checkout futuro, el usuario debería poder seleccionar dirección guardada.

Endpoints sugeridos:

```txt
GET    /api/users/me/addresses
POST   /api/users/me/addresses
PATCH  /api/users/me/addresses/:id
DELETE /api/users/me/addresses/:id
PATCH  /api/users/me/addresses/:id/default
```

Si ya existen direcciones en otro módulo, adaptar sin duplicar.

## Orders `/mi-cuenta/pedidos`

Debe listar solo pedidos propios del usuario autenticado.

Columnas/cards:

```txt
Número de orden
Número de seguimiento
Fecha
Total
Método de entrega
Método de pago
Estado del pedido
Estado del pago
Acción Ver detalle
```

Labels en español:

```txt
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
```

Estados:

* Loading.
* Error.
* Empty state.
* Paginación si hay muchos pedidos.

Endpoint sugerido:

```txt
GET /api/users/me/orders
```

Si ya existe:

```txt
GET /api/orders/me
GET /api/me/orders
```

usar el existente.

## Order detail `/mi-cuenta/pedidos/:id`

Debe mostrar:

### Datos generales

```txt
Número de orden
Número de seguimiento
Fecha
Estado del pedido
Estado del pago
Método de pago
Método de entrega
```

### Productos

```txt
Imagen
Nombre
SKU
Cantidad
Precio unitario
Subtotal
```

### Totales

```txt
Subtotal productos
Costo de envío
Total
```

### Entrega

Si `PICKUP`:

```txt
Retiro en sucursal
Mensaje: Te avisaremos cuando esté listo para retirar.
```

Si `SHIPPING`:

```txt
Dirección de entrega
Referencia
Estado de envío
```

### Pago

Si `CASH + PICKUP`:

```txt
Pago pendiente en efectivo al retirar.
```

Si `CASH + SHIPPING`:

```txt
Pago pendiente en efectivo al recibir.
```

Si `MERCADOPAGO + PENDING`:

```txt
Pago pendiente con Mercado Pago.
Botón: Pagar con Mercado Pago.
```

Si `MERCADOPAGO + APPROVED`:

```txt
Pago aprobado.
```

Endpoint sugerido:

```txt
GET /api/users/me/orders/:id
```

Seguridad:

* No permitir ver pedidos de otro usuario.
* Si el pedido no pertenece al usuario, devolver 404 o 403 según patrón actual.
* No exponer información sensible del pago.

## Stock requests `/mi-cuenta/solicitudes-stock`

Debe listar solicitudes propias del usuario.

Campos:

```txt
Producto
Imagen
Fecha de solicitud
Estado
Email/teléfono usado, si corresponde
Acciones
```

Acciones:

```txt
Ver producto
Cancelar solicitud, si está pendiente
```

Estados en español:

```txt
PENDING -> Pendiente
CONTACTED -> Contactado
NOTIFIED -> Notificado
CANCELLED -> Cancelado
```

Endpoint sugerido:

```txt
GET   /api/users/me/stock-requests
PATCH /api/users/me/stock-requests/:id/cancel
```

Si ya existe endpoint equivalente, reutilizar.

## Labels reuse

Reutilizar helpers ya creados en el change anterior:

```txt
orderStatusLabel
paymentStatusLabel
paymentMethodLabel
deliveryMethodLabel
```

Agregar si falta:

```txt
stockRequestStatusLabel
```

## Frontend UX

Cada pantalla debe manejar:

```txt
loading
error
empty
success toast
form validation
responsive layout
```

Mensajes sugeridos:

```txt
No tenés pedidos todavía.
No tenés direcciones cargadas.
No tenés solicitudes de stock.
No se pudo cargar la información de tu cuenta.
Tus datos fueron actualizados.
Dirección guardada correctamente.
```

## Backend security

Reglas:

* Los endpoints `me` usan el usuario del token.
* Nunca aceptar `userId` desde frontend para consultar datos privados.
* El usuario solo accede a sus recursos.
* Admin no es objetivo de esta sección, salvo que el sistema permita admin como usuario.
* Validar ownership en pedidos, direcciones y solicitudes.

## Data model

Revisar si existe modelo `Address`.

Si no existe, crear modelo sugerido:

```prisma
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
```

Adaptar nombres a los patrones existentes del proyecto.

## Swagger

Documentar si se agregan o cambian endpoints:

```txt
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
```

## Testing

Backend:

* Usuario puede ver su perfil.
* Usuario puede editar su perfil.
* Usuario no puede ver datos de otro usuario.
* Usuario puede crear dirección.
* Usuario puede editar dirección propia.
* Usuario no puede editar dirección ajena.
* Usuario puede marcar dirección principal.
* Usuario puede listar pedidos propios.
* Usuario no puede ver pedido ajeno.
* Usuario puede ver detalle de pedido propio.
* Usuario puede listar solicitudes propias.
* Usuario puede cancelar solicitud propia pendiente.

Frontend:

* `/mi-cuenta` renderiza.
* `/mi-cuenta/perfil` renderiza y valida.
* `/mi-cuenta/direcciones` renderiza.
* `/mi-cuenta/pedidos` renderiza.
* `/mi-cuenta/pedidos/:id` renderiza.
* `/mi-cuenta/solicitudes-stock` renderiza.
* Usuario no autenticado redirige a login.

## Decisions

* Este change completa la zona privada del usuario.
* No se implementa email real.
* No se implementan notificaciones.
* No se implementa cambio de contraseña dentro del perfil.
* No se implementan reviews.
* Pagos puede mostrarse dentro del detalle del pedido.
* Todas las etiquetas visibles deben estar en español.

````

---

# 3. `tasks.md`

Ruta:

```txt
openspec/changes/add-user-private-profile-complete/tasks.md
````

Contenido:

```md
# Tasks: add-user-private-profile-complete

## 1. Auditoría inicial

- [ ] Revisar rutas frontend actuales de usuario.
- [ ] Revisar `ProtectedRoute`.
- [ ] Revisar auth store/context.
- [ ] Revisar endpoints actuales de usuario.
- [ ] Revisar endpoints actuales de pedidos del usuario.
- [ ] Revisar endpoints actuales de stock requests del usuario.
- [ ] Revisar si existe modelo de direcciones.
- [ ] Revisar helpers de labels existentes.
- [ ] Revisar tests actuales.
- [ ] Revisar Swagger.

## 2. Layout privado de usuario

- [ ] Crear o completar layout de `/mi-cuenta`.
- [ ] Agregar navegación interna.
- [ ] Agregar link a resumen.
- [ ] Agregar link a perfil.
- [ ] Agregar link a direcciones.
- [ ] Agregar link a pedidos.
- [ ] Agregar link a solicitudes de stock.
- [ ] Agregar botón cerrar sesión si corresponde.
- [ ] Hacer layout responsive.
- [ ] Proteger rutas con usuario autenticado.

## 3. Dashboard `/mi-cuenta`

- [ ] Crear pantalla resumen.
- [ ] Mostrar saludo con nombre.
- [ ] Mostrar últimos pedidos.
- [ ] Mostrar solicitudes de stock pendientes.
- [ ] Mostrar dirección principal si existe.
- [ ] Mostrar accesos rápidos.
- [ ] Manejar loading.
- [ ] Manejar error.
- [ ] Manejar empty states.

## 4. Perfil `/mi-cuenta/perfil`

- [ ] Crear pantalla perfil.
- [ ] Cargar datos del usuario autenticado.
- [ ] Mostrar nombre.
- [ ] Mostrar apellido si existe.
- [ ] Mostrar email.
- [ ] Mostrar teléfono si existe.
- [ ] Permitir editar datos básicos.
- [ ] Validar campos.
- [ ] Guardar cambios.
- [ ] Mostrar mensaje de éxito.
- [ ] Mostrar errores claros.
- [ ] No permitir modificar datos de otro usuario.

## 5. Backend perfil

- [ ] Crear o reutilizar `GET /api/users/me`.
- [ ] Crear o reutilizar `PATCH /api/users/me`.
- [ ] Validar token.
- [ ] Tomar usuario desde token.
- [ ] No aceptar `userId` desde frontend.
- [ ] Validar email si es editable.
- [ ] Validar teléfono si corresponde.
- [ ] Actualizar Swagger si corresponde.
- [ ] Agregar tests.

## 6. Direcciones backend

- [ ] Revisar si existe modelo de direcciones.
- [ ] Crear modelo si no existe.
- [ ] Crear migración si corresponde.
- [ ] Crear `GET /api/users/me/addresses`.
- [ ] Crear `POST /api/users/me/addresses`.
- [ ] Crear `PATCH /api/users/me/addresses/:id`.
- [ ] Crear `DELETE /api/users/me/addresses/:id`.
- [ ] Crear `PATCH /api/users/me/addresses/:id/default`.
- [ ] Validar ownership.
- [ ] Permitir una sola dirección principal.
- [ ] Actualizar Swagger.
- [ ] Agregar tests.

## 7. Direcciones frontend

- [ ] Crear pantalla `/mi-cuenta/direcciones`.
- [ ] Listar direcciones.
- [ ] Crear formulario de dirección.
- [ ] Editar dirección.
- [ ] Eliminar dirección.
- [ ] Marcar dirección principal.
- [ ] Mostrar empty state.
- [ ] Mostrar loading.
- [ ] Mostrar errores.
- [ ] Mostrar éxito.

## 8. Pedidos backend

- [ ] Crear o reutilizar `GET /api/users/me/orders`.
- [ ] Crear o reutilizar `GET /api/users/me/orders/:id`.
- [ ] Listar solo pedidos propios.
- [ ] Validar ownership en detalle.
- [ ] Incluir items.
- [ ] Incluir SKU.
- [ ] Incluir totales.
- [ ] Incluir método de pago.
- [ ] Incluir estado de pago.
- [ ] Incluir método de entrega.
- [ ] Incluir estado de pedido.
- [ ] Incluir número de seguimiento.
- [ ] Actualizar Swagger.
- [ ] Agregar tests.

## 9. Pedidos frontend

- [ ] Crear pantalla `/mi-cuenta/pedidos`.
- [ ] Listar pedidos propios.
- [ ] Mostrar número de orden.
- [ ] Mostrar número de seguimiento.
- [ ] Mostrar fecha.
- [ ] Mostrar total.
- [ ] Mostrar método de entrega en español.
- [ ] Mostrar método de pago en español.
- [ ] Mostrar estado de pedido en español.
- [ ] Mostrar estado de pago en español.
- [ ] Crear botón ver detalle.
- [ ] Manejar loading.
- [ ] Manejar error.
- [ ] Manejar empty state.

## 10. Detalle de pedido frontend

- [ ] Crear pantalla `/mi-cuenta/pedidos/:id`.
- [ ] Mostrar datos generales.
- [ ] Mostrar productos.
- [ ] Mostrar imagen si existe.
- [ ] Mostrar SKU.
- [ ] Mostrar cantidad.
- [ ] Mostrar precio unitario.
- [ ] Mostrar subtotal por item.
- [ ] Mostrar subtotal productos.
- [ ] Mostrar costo de envío.
- [ ] Mostrar total.
- [ ] Mostrar dirección de entrega si es envío.
- [ ] Mostrar mensaje para retiro si es pickup.
- [ ] Mostrar pago pendiente efectivo si corresponde.
- [ ] Mostrar botón pagar con Mercado Pago si corresponde.
- [ ] Manejar pedido no encontrado.
- [ ] Manejar acceso no autorizado.

## 11. Solicitudes de stock backend

- [ ] Crear o reutilizar `GET /api/users/me/stock-requests`.
- [ ] Crear o reutilizar `PATCH /api/users/me/stock-requests/:id/cancel`.
- [ ] Listar solo solicitudes propias.
- [ ] Validar ownership.
- [ ] Permitir cancelar solo si corresponde.
- [ ] Incluir datos del producto.
- [ ] Actualizar Swagger.
- [ ] Agregar tests.

## 12. Solicitudes de stock frontend

- [ ] Crear pantalla `/mi-cuenta/solicitudes-stock`.
- [ ] Listar solicitudes propias.
- [ ] Mostrar producto.
- [ ] Mostrar imagen si existe.
- [ ] Mostrar fecha.
- [ ] Mostrar estado en español.
- [ ] Botón ver producto.
- [ ] Botón cancelar si corresponde.
- [ ] Manejar loading.
- [ ] Manejar error.
- [ ] Manejar empty state.

## 13. Labels y UX

- [ ] Reutilizar `orderStatusLabel`.
- [ ] Reutilizar `paymentStatusLabel`.
- [ ] Reutilizar `paymentMethodLabel`.
- [ ] Reutilizar `deliveryMethodLabel`.
- [ ] Crear `stockRequestStatusLabel` si falta.
- [ ] Asegurar textos en español.
- [ ] Revisar responsive.
- [ ] Revisar mensajes de error.
- [ ] Revisar botones y navegación.

## 14. Seguridad

- [ ] Verificar rutas protegidas frontend.
- [ ] Verificar endpoints protegidos backend.
- [ ] Evitar acceso a datos de otro usuario.
- [ ] No aceptar `userId` desde frontend para recursos privados.
- [ ] Validar ownership en direcciones.
- [ ] Validar ownership en pedidos.
- [ ] Validar ownership en stock requests.
- [ ] Agregar tests de acceso denegado.

## 15. Swagger

- [ ] Documentar perfil.
- [ ] Documentar direcciones.
- [ ] Documentar pedidos del usuario.
- [ ] Documentar detalle de pedido.
- [ ] Documentar solicitudes de stock.
- [ ] Documentar errores 400.
- [ ] Documentar errores 401.
- [ ] Documentar errores 403.
- [ ] Documentar errores 404.
- [ ] Validar `/api/docs`.

## 16. Tests backend

- [ ] Test ver perfil propio.
- [ ] Test editar perfil propio.
- [ ] Test crear dirección.
- [ ] Test editar dirección propia.
- [ ] Test rechazar dirección ajena.
- [ ] Test marcar dirección principal.
- [ ] Test listar pedidos propios.
- [ ] Test rechazar pedido ajeno.
- [ ] Test detalle pedido propio.
- [ ] Test listar solicitudes propias.
- [ ] Test cancelar solicitud propia.
- [ ] Test rechazar solicitud ajena.

## 17. Tests frontend

- [ ] Test render `/mi-cuenta`.
- [ ] Test render `/mi-cuenta/perfil`.
- [ ] Test render `/mi-cuenta/direcciones`.
- [ ] Test render `/mi-cuenta/pedidos`.
- [ ] Test render `/mi-cuenta/pedidos/:id`.
- [ ] Test render `/mi-cuenta/solicitudes-stock`.
- [ ] Test usuario no autenticado redirige a login.
- [ ] Test labels en español si existe setup.

## 18. Validación manual

- [ ] Login como usuario registrado.
- [ ] Entrar a `/mi-cuenta`.
- [ ] Editar perfil.
- [ ] Crear dirección.
- [ ] Marcar dirección principal.
- [ ] Crear pedido como usuario registrado.
- [ ] Ver pedido en `/mi-cuenta/pedidos`.
- [ ] Ver detalle de pedido.
- [ ] Confirmar labels en español.
- [ ] Crear solicitud de stock como usuario.
- [ ] Ver solicitud en mi cuenta.
- [ ] Cancelar solicitud si corresponde.
- [ ] Confirmar que invitado no entra a `/mi-cuenta`.

## 19. Build y cierre

- [ ] Ejecutar migración si aplica.
- [ ] Ejecutar `prisma generate` si aplica.
- [ ] Ejecutar build backend.
- [ ] Ejecutar build frontend.
- [ ] Ejecutar tests backend.
- [ ] Ejecutar tests frontend existentes.
- [ ] Validar Swagger HTTP 200.
- [ ] Actualizar `tasks.md`.
- [ ] Crear `current-state.md`.
```

---

# 4. `specs/user-account/spec.md`

Ruta:

```txt
openspec/changes/add-user-private-profile-complete/specs/user-account/spec.md
```

Contenido:

```md
# User Account Spec Delta

## ADDED Requirements

### Requirement: Authenticated users can access private account area

The system SHALL provide a private account area for authenticated users.

#### Scenario: Authenticated user opens account

Given a user is authenticated  
When the user opens `/mi-cuenta`  
Then the system displays the private account dashboard.

#### Scenario: Guest opens account

Given a user is not authenticated  
When the user opens `/mi-cuenta`  
Then the system redirects to `/login`.

---

### Requirement: Private account dashboard shows user summary

The system SHALL show a summary of the user's account.

#### Scenario: User has account activity

Given an authenticated user has orders or stock requests  
When the user opens `/mi-cuenta`  
Then the system displays recent orders, stock request summary and quick actions.

#### Scenario: User has no activity

Given an authenticated user has no orders  
When the user opens `/mi-cuenta`  
Then the system displays an empty state.

---

### Requirement: User can view and update profile

The system SHALL allow authenticated users to view and update their own profile data.

#### Scenario: User views profile

Given a user is authenticated  
When the user opens `/mi-cuenta/perfil`  
Then the system displays the user's profile information.

#### Scenario: User updates profile

Given a user is authenticated  
When the user updates valid profile data  
Then the system saves the changes.

#### Scenario: User cannot update another user's profile

Given a user is authenticated  
When the user attempts to update another user's profile  
Then the system rejects the request.

---

### Requirement: User account labels are displayed in Spanish

The system SHALL display all account navigation and messages in Spanish.

#### Scenario: Account menu is displayed

Given a user is authenticated  
When the account menu is shown  
Then the labels are displayed in Spanish.
```

---

# 5. `specs/user-addresses/spec.md`

Ruta:

```txt
openspec/changes/add-user-private-profile-complete/specs/user-addresses/spec.md
```

Contenido:

```md
# User Addresses Spec Delta

## ADDED Requirements

### Requirement: Users can manage saved addresses

The system SHALL allow authenticated users to manage their own saved addresses.

#### Scenario: User lists addresses

Given a user is authenticated  
When the user opens `/mi-cuenta/direcciones`  
Then the system displays the user's saved addresses.

#### Scenario: User creates address

Given a user is authenticated  
When the user submits a valid address  
Then the system saves the address for that user.

#### Scenario: User edits address

Given a user owns an address  
When the user updates valid address data  
Then the system saves the changes.

#### Scenario: User deletes address

Given a user owns an address  
When the user deletes it  
Then the system removes the address or marks it inactive according to implementation.

---

### Requirement: Users can set default address

The system SHALL allow users to mark one address as default.

#### Scenario: User sets default address

Given a user owns multiple addresses  
When the user marks one address as default  
Then that address becomes the user's default address  
And other addresses are no longer default.

---

### Requirement: Users cannot access addresses owned by others

The system SHALL prevent users from reading or modifying addresses owned by other users.

#### Scenario: User edits another user's address

Given a user is authenticated  
And an address belongs to another user  
When the user attempts to edit that address  
Then the system rejects the request.

#### Scenario: User deletes another user's address

Given a user is authenticated  
And an address belongs to another user  
When the user attempts to delete that address  
Then the system rejects the request.
```

---

# 6. `specs/user-orders/spec.md`

Ruta:

```txt
openspec/changes/add-user-private-profile-complete/specs/user-orders/spec.md
```

Contenido:

```md
# User Orders Spec Delta

## ADDED Requirements

### Requirement: Users can list their own orders

The system SHALL allow authenticated users to view only their own orders.

#### Scenario: User opens order history

Given a user is authenticated  
When the user opens `/mi-cuenta/pedidos`  
Then the system displays only orders belonging to that user.

#### Scenario: User has no orders

Given a user is authenticated  
And the user has no orders  
When the user opens `/mi-cuenta/pedidos`  
Then the system displays an empty state.

---

### Requirement: Users can view their own order detail

The system SHALL allow authenticated users to view details of their own orders.

#### Scenario: User opens own order detail

Given a user is authenticated  
And the order belongs to that user  
When the user opens `/mi-cuenta/pedidos/:id`  
Then the system displays the order detail.

#### Scenario: User opens another user's order

Given a user is authenticated  
And the order belongs to another user  
When the user attempts to open that order  
Then the system rejects the request.

---

### Requirement: User order list displays commercial information

The system SHALL display user-friendly order information in the order list.

#### Scenario: Order list item is displayed

Given a user has an order  
When the order list is displayed  
Then the system shows order number, follow-up number, date, total, delivery method, payment method, order status and payment status.

---

### Requirement: User order detail displays products and totals

The system SHALL display products, snapshots and totals in order detail.

#### Scenario: Order detail is displayed

Given a user opens an order detail  
When the order is displayed  
Then the system shows products, SKU, quantity, unit price, item subtotal, shipping cost and final total.

---

### Requirement: Pending Mercado Pago orders can be paid from account

The system SHOULD allow users to continue payment for pending Mercado Pago orders.

#### Scenario: Mercado Pago order is pending

Given a user has a Mercado Pago order with pending payment  
When the user opens the order detail  
Then the system shows an action to pay with Mercado Pago.

---

### Requirement: Cash orders explain payment timing

The system SHALL explain when cash payment is due.

#### Scenario: Cash pickup order

Given a cash pickup order exists  
When the user opens order detail  
Then the system explains that payment is due when picking up the order.

#### Scenario: Cash shipping order

Given a cash shipping order exists  
When the user opens order detail  
Then the system explains that payment is due when receiving the order.
```

---

# 7. `specs/stock-requests/spec.md`

Ruta:

```txt
openspec/changes/add-user-private-profile-complete/specs/stock-requests/spec.md
```

Contenido:

```md
# User Stock Requests Spec Delta

## ADDED Requirements

### Requirement: Users can view their own stock requests

The system SHALL allow authenticated users to view their own stock requests.

#### Scenario: User opens stock requests

Given a user is authenticated  
When the user opens `/mi-cuenta/solicitudes-stock`  
Then the system displays only stock requests belonging to that user.

#### Scenario: User has no stock requests

Given a user has no stock requests  
When the user opens `/mi-cuenta/solicitudes-stock`  
Then the system displays an empty state.

---

### Requirement: Users can cancel pending stock requests

The system SHOULD allow authenticated users to cancel their own pending stock requests.

#### Scenario: User cancels own pending request

Given a user owns a pending stock request  
When the user cancels it  
Then the request status changes to cancelled.

#### Scenario: User cancels another user's request

Given a stock request belongs to another user  
When the user attempts to cancel it  
Then the system rejects the request.

---

### Requirement: Stock request statuses are displayed in Spanish

The system SHALL display stock request statuses in Spanish.

#### Scenario: Pending stock request

Given a stock request has status `PENDING`  
When it is displayed  
Then the UI shows `Pendiente`.

#### Scenario: Cancelled stock request

Given a stock request has status `CANCELLED`  
When it is displayed  
Then the UI shows `Cancelado`.
```
