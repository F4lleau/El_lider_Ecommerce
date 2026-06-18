# Current State: add-product-sku-code

## Resultado

El change `add-product-sku-code` fue implementado.

- `Product.sku` es opcional y unico.
- Los SKU enviados por admin se limpian y normalizan a mayusculas.
- `OrderItem.productSku` conserva el snapshot historico al crear una orden.
- Los endpoints publicos y admin devuelven `sku`.
- `GET /api/admin/products?q=...` busca por nombre o SKU.
- El formulario y listado admin permiten gestionar y buscar SKU.
- Tracking, detalle de pedido del usuario y detalle admin muestran el snapshot SKU cuando existe.
- Swagger documenta SKU de productos y order items.

## Seed y base de datos

- Migracion `20260615000000_add_product_sku_code` aplicada.
- Prisma Client generado.
- Seed ejecutado correctamente.
- Los 25 productos administrados por el seed tienen 25 SKU unicos.
- Existen 3 productos historicos con `sku = null`; es valido porque SKU es opcional inicialmente.

## Validaciones

- Build backend: correcto.
- Build frontend: correcto.
- Tests backend: 31/31 correctos.
- Tests frontend existentes: 4/4 correctos.
- Tests relacionados verifican creacion, normalizacion, edicion, duplicados, busqueda y snapshot SKU.
- Swagger YAML carga correctamente y contiene `Product.sku` y `OrderItem.productSku`.

## Nota

Al aplicar las migraciones pendientes tambien se aplico la migracion ya existente
`20260614000000_add_mercadopago_payments`. No se modifico la logica de Mercado Pago
como parte de este change.
