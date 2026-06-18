# Design: add-product-sku-code

## Context

El sistema ya cuenta con:

* Catálogo real.
* ABM backend de productos.
* Panel admin MVP.
* Checkout y órdenes.
* Snapshots de productos en `OrderItem`.

Actualmente los productos se identifican principalmente por:

* `id`
* `name`
* `slug`

Esto sirve para navegación y base de datos, pero no es suficiente para operación comercial diaria. El negocio necesita un código interno editable y visible para administración.

## Field name decision

Se usará el nombre:

```txt
sku
```

Motivo:

* Es un término estándar en e-commerce.
* Representa un código interno o código de stock.
* Es más claro que `code` para inventario.
* Permite futuras integraciones.

## Prisma model

Agregar en `Product`:

```prisma
sku String? @unique
```

Decisión inicial:

* `sku` será opcional para no romper productos existentes.
* `sku` será único cuando exista.
* En una etapa posterior puede volverse obligatorio.

## Example SKU format

Formato sugerido:

```txt
REP-CHOCO-001
DESC-VASO-001
COT-GLOBO-001
ENV-CAJA-001
GAST-FILM-001
```

Prefijos sugeridos por categoría:

```txt
REP  = Repostería
DESC = Descartables
COT  = Cotillón
ENV  = Envases
GAST = Gastronomía
```

El sistema no necesita generar el SKU automáticamente en este change. Puede permitirse carga manual desde admin y datos definidos en seed.

## Product API

Los endpoints públicos de productos deben devolver `sku`.

Endpoints afectados:

```txt
GET /api/products
GET /api/products/:id
GET /api/products/slug/:slug
GET /api/products/offers
GET /api/products/featured
GET /api/products/new
GET /api/products/best-sellers
```

## Admin product API

Los endpoints admin deben aceptar y devolver `sku`.

Endpoints afectados:

```txt
GET    /api/admin/products
POST   /api/admin/products
GET    /api/admin/products/:id
PATCH  /api/admin/products/:id
```

Reglas:

* Si se envía `sku`, debe ser único.
* Si se edita `sku`, no puede duplicar otro producto.
* Puede estar vacío/null en etapa inicial.
* Debe limpiarse trim si viene con espacios.
* Puede normalizarse a mayúsculas si se decide.

## Admin frontend

Actualizar:

```txt
/admin/productos
/admin/productos/nuevo
/admin/productos/:id/editar
```

### Listado

Debe mostrar columna:

```txt
SKU / Código
```

### Formulario

Debe incluir campo:

```txt
SKU / Código interno
```

### Búsqueda

La búsqueda admin debe permitir buscar por:

```txt
nombre
sku
```

## Public frontend

En catálogo público no es obligatorio mostrar SKU en cards.

En detalle de producto puede mostrarse de manera discreta:

```txt
Código: REP-CHOCO-001
```

Esto es opcional en el MVP.

## Order item snapshot

Para trazabilidad histórica, conviene agregar:

```txt
productSku
```

al snapshot de `OrderItem`.

Motivo:

* Si el SKU cambia luego, el pedido conserva el código usado al momento de la compra.
* El admin puede revisar pedidos con código interno.
* Mejora impresión y preparación de pedidos.

### Prisma sugerido

```prisma
productSku String?
```

Regla:

* Al crear order item, copiar `product.sku` en `productSku`.
* Si el producto no tiene SKU, guardar null.

## Seed

Actualizar seed de productos para que todos tengan SKU.

Ejemplos:

```txt
REP-CHOCO-001
REP-GRANA-001
REP-CONFI-001
DESC-VASO-001
DESC-PLATO-001
COT-GLOBO-001
ENV-CAJA-001
GAST-FILM-001
```

El seed debe seguir siendo idempotente.

## Swagger

Actualizar schemas de producto:

```txt
Product
CreateProductRequest
UpdateProductRequest
AdminProductResponse
OrderItemResponse, si se agrega productSku
```

## Tests

Backend:

* Crear producto con SKU.
* Rechazar SKU duplicado.
* Editar SKU.
* Listar producto con SKU.
* Buscar producto por SKU en admin.
* Crear orden y guardar productSku si se implementa snapshot.

Frontend:

* Formulario admin muestra campo SKU.
* Listado admin muestra SKU.
* Crear/editar producto envía SKU.

## Risks

* Si se hace obligatorio de entrada, puede romper seed o productos existentes.
* Si no se valida unicidad, pierde valor operativo.
* Si no se guarda snapshot en pedido, cambios futuros de SKU pueden afectar historial.
* Si se genera automáticamente sin reglas claras, puede crear códigos poco útiles.

## Decisions

* El campo se llamará `sku`.
* Será único.
* Será opcional inicialmente.
* El admin podrá cargarlo y editarlo.
* El seed lo completará en todos los productos.
* El listado admin lo mostrará.
* La búsqueda admin incluirá SKU.
* Se intentará guardar snapshot `productSku` en `OrderItem`.
* No se implementarán códigos de barra ni QR en este change.
