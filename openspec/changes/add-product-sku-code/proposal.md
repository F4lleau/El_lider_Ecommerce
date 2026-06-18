# Change: add-product-sku-code

## Summary

Agregar un código interno de producto usando el campo `sku`, para mejorar la gestión administrativa, búsqueda interna, identificación de productos en pedidos y trazabilidad comercial.

## Motivation

El catálogo ya tiene productos reales, stock, precios, ofertas, checkout, órdenes y panel admin MVP. Sin embargo, los productos todavía no tienen un código interno propio.

Para operar un negocio real, el administrador necesita identificar productos no solo por nombre, sino también por un código único. Esto facilita:

* búsqueda rápida en el panel admin;
* control de stock;
* gestión de pedidos;
* comunicación interna;
* futura importación desde Excel;
* integración con sistemas externos;
* impresión de pedidos;
* trazabilidad histórica.

El campo recomendado es `sku`, porque es un estándar común en e-commerce e inventario.

## Scope

Este cambio incluye:

* Agregar campo `sku` al modelo `Product`.
* Hacer que `sku` sea único.
* Mantener `sku` opcional inicialmente para no romper productos existentes.
* Actualizar seed para que los productos actuales tengan SKU.
* Actualizar endpoints públicos de productos para devolver `sku`.
* Actualizar endpoints admin de productos para crear y editar `sku`.
* Actualizar formulario admin de producto.
* Actualizar listado admin de productos.
* Permitir búsqueda por SKU en admin.
* Agregar `productSku` al snapshot de `OrderItem`, si el modelo y la migración lo permiten.
* Actualizar Swagger de productos y órdenes si corresponde.
* Agregar tests mínimos.
* Ejecutar migración.
* Ejecutar seed.
* Documentar resultado en `current-state.md`.

## Out of Scope

Este cambio no incluye:

* Códigos de barras.
* Lectura con scanner.
* QR.
* Importación Excel.
* Integración con sistema externo.
* Generación automática avanzada de SKU.
* Variantes de producto.
* Stock por sucursal.
* Historial avanzado de cambios de SKU.
* Cambios de Mercado Pago.

## Acceptance Criteria

* El modelo `Product` tiene campo `sku`.
* `sku` es único.
* `sku` puede ser opcional inicialmente.
* Los productos del seed tienen SKU.
* El admin puede crear producto con SKU.
* El admin puede editar SKU.
* El listado admin muestra SKU.
* El admin puede buscar producto por SKU.
* Los endpoints públicos devuelven SKU.
* Los endpoints admin devuelven SKU.
* Si se implementa snapshot, `OrderItem` guarda `productSku`.
* Swagger documenta `sku`.
* Tests relacionados pasan.
* Build backend pasa.
* Build frontend pasa.
* El cambio queda documentado en `current-state.md`.
