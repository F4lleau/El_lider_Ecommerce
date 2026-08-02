# Current State: add-user-private-profile-complete

## Resultado

Se completo la zona privada del usuario registrado para el MVP.

Rutas frontend implementadas y protegidas:

- `/mi-cuenta`
- `/mi-cuenta/perfil`
- `/mi-cuenta/direcciones`
- `/mi-cuenta/pedidos`
- `/mi-cuenta/pedidos/:id`
- `/mi-cuenta/solicitudes-stock`

Todas las rutas cuelgan de `ProtectedRoute` y usan un layout privado con navegacion interna, cierre de sesion y link para volver a la tienda.

## Backend

Endpoints agregados o completados:

- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/users/me/addresses`
- `POST /api/users/me/addresses`
- `PATCH /api/users/me/addresses/:id`
- `DELETE /api/users/me/addresses/:id`
- `PATCH /api/users/me/addresses/:id/default`
- `GET /api/users/me/orders`
- `GET /api/users/me/orders/:id`
- `GET /api/users/me/stock-requests`
- `PATCH /api/users/me/stock-requests/:id/cancel`

Los endpoints privados toman el usuario desde el token. No aceptan `userId` desde frontend para consultar o modificar recursos privados.

Se reutilizaron endpoints existentes de pedidos y solicitudes, manteniendo compatibilidad con:

- `/api/me/orders`
- `/api/me/stock-requests`

## Direcciones

El modelo `Address` ya existia, por lo que no se agrego migracion.

La gestion de direcciones permite:

- listar propias;
- crear;
- editar;
- eliminar;
- marcar una direccion principal;
- mantener una sola direccion principal por usuario;
- rechazar acceso a direcciones ajenas con 404.

## Perfil

El usuario puede editar:

- nombre;
- apellido.

El email queda solo lectura. El modelo `User` no tiene telefono, por lo que no se agrego en este change.

## Pedidos

El usuario puede listar y ver detalle solo de pedidos propios.

El detalle muestra:

- numero de orden;
- numero de seguimiento;
- productos;
- SKU;
- cantidad;
- precio unitario;
- subtotal por item;
- subtotal productos;
- costo de envio;
- total;
- metodo de entrega;
- metodo de pago;
- estado del pedido;
- estado del pago;
- direccion de envio cuando corresponde;
- mensaje para retiro;
- mensaje para efectivo;
- accion para pagar con Mercado Pago cuando corresponde.

## Solicitudes de stock

El usuario puede ver sus solicitudes propias y cancelar solicitudes pendientes.

Se agrego `stockRequestStatusLabel` y se reutilizan los helpers existentes para pedidos, pagos y entrega.

## Swagger

Swagger fue actualizado con perfil, direcciones, pedidos propios y solicitudes propias.

Validaciones:

- `swagger.yaml` parsea correctamente.
- `/api/docs/` responde HTTP 200.

## Tests y builds ejecutados

- `backend npm run build`: OK
- `frontend npm run build`: OK
- `backend npx tsx --test --test-concurrency=1 tests/user-private-profile.test.ts`: OK, 4 tests
- `frontend npx tsx --test tests/user-private-profile.test.ts`: OK, 4 tests
- `frontend npm run test:cart`: OK, 4 tests
- `frontend npx tsx --test tests/order-labels.test.ts`: OK, 3 tests
- Swagger HTTP 200: OK

## Limitaciones

- No se agrego telefono al perfil porque el modelo `User` actual no lo tiene.
- No se agregaron campos nuevos a `Address`; se reutilizo el modelo existente.
- No se implemento `/mi-cuenta/pagos`; los pagos se muestran dentro del detalle de pedido.
- No se hizo recorrido manual en navegador. La validacion fue por build, tests backend/frontend y Swagger.
- No se implementaron emails, WhatsApp, reportes, reviews, facturacion, reembolsos, cambio de email ni cambio de contrasena desde perfil.
