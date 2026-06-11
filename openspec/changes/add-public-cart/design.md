# Design: add-public-cart

## Context

El proyecto ya cuenta con catálogo público, productos, categorías, autenticación real y roles `admin`/`user`.

El siguiente paso es conectar el carrito para que la app pueda avanzar luego hacia checkout y pagos.

El carrito debe funcionar para dos tipos de usuario:

- Invitado: sin login.
- Usuario autenticado: con sesión.

## Technical approach

### 1. Guest cart

El carrito invitado se manejará en frontend y se persistirá en `localStorage`.

Debe guardar solo datos mínimos:

```ts
type GuestCartItem = {
  productId: string;
  quantity: number;
};

No se debe confiar en nombre, precio o stock guardados en frontend.

Cuando se renderiza el carrito, se deben obtener los datos reales del producto desde backend o validar los items contra endpoint de carrito.

2. Authenticated cart

El usuario autenticado debe tener carrito persistido en backend.

Si el modelo Cart y CartItem ya existen en Prisma, se usarán.

Si no existen o están incompletos, se completarán.

3. Cart merge on login

Cuando un invitado inicia sesión y tiene productos en localStorage:

Frontend detecta carrito local.
Luego del login exitoso, llama a endpoint de sincronización.
Backend fusiona items con el carrito del usuario.
Si un producto ya existe, suma cantidades.
Backend valida stock.
Frontend limpia carrito local.
Frontend carga carrito del usuario.
4. Backend endpoints

Endpoints sugeridos:

GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:itemId
DELETE /api/cart/items/:itemId
DELETE /api/cart
POST   /api/cart/sync
POST   /api/cart/validate

Según la estructura actual del proyecto, se podrá adaptar la nomenclatura.

5. Price and stock rules

Reglas obligatorias:

El frontend nunca define el precio final.
El backend obtiene el precio actual desde la base.
El backend valida que el producto exista.
El backend valida que el producto esté activo.
El backend valida stock disponible.
El backend calcula subtotal.
Si no hay stock suficiente, devuelve error claro.
6. Frontend state

Se debe crear o ajustar una capa de estado para carrito.

Opciones posibles:

React Context.
Zustand.
Redux.
React Query + localStorage.

Se debe respetar la arquitectura existente del frontend.

7. UI

La página /carrito debe mostrar:

Estado vacío.
Lista de productos.
Imagen.
Nombre.
Precio unitario.
Cantidad.
Subtotal por producto.
Subtotal general.
Botón eliminar.
Botón vaciar carrito.
Botón continuar comprando.
Botón ir a checkout, aunque el checkout se implemente en otro change.
8. Swagger

Documentar:

Obtener carrito.
Agregar item.
Actualizar cantidad.
Eliminar item.
Vaciar carrito.
Sincronizar carrito.
Validar carrito.
9. Tests

Tests mínimos backend:

Agregar producto.
Agregar producto inexistente.
Agregar producto sin stock.
Actualizar cantidad.
Eliminar item.
Vaciar carrito.
Sincronizar carrito invitado.

Tests frontend:

ProductCard agrega producto.
Cart page muestra items.
Cart page muestra estado vacío.
Cart summary calcula subtotal.
Botones de cantidad funcionan.
Risks
Puede existir carrito parcial y no conviene duplicarlo.
La sincronización invitado/usuario puede generar duplicados si no se controla.
Si el precio cambia entre agregar al carrito y checkout, debe prevalecer el precio actual de backend.
El carrito local no debe guardar información sensible ni precios definitivos.
Decisions
El carrito invitado se persiste en localStorage.
El carrito autenticado se persiste en backend.
El backend es la fuente de verdad para precio, stock y subtotal.
Checkout no se implementa en este change.