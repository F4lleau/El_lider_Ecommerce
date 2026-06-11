# Change: add-brand-and-responsive-ui-foundation

## Summary

Rediseñar la base visual del frontend de El Líder para lograr una experiencia moderna, responsive y comercialmente atractiva.

## Motivation

La app ya cuenta con catálogo, autenticación y carrito funcionales, pero la interfaz actual no tiene suficiente calidad visual, no es completamente responsive y el logo no representa adecuadamente la identidad del comercio.

Antes de avanzar con checkout, pagos y panel admin, se necesita consolidar una base visual clara para no construir nuevas pantallas sobre una interfaz débil.

## Scope

Este cambio incluye:

- Definir nueva identidad visual base.
- Proponer nuevo logo o dirección visual para el logo.
- Definir paleta de colores.
- Definir criterios tipográficos.
- Mejorar layout general responsive.
- Mejorar header.
- Mejorar navegación desktop.
- Mejorar navegación mobile.
- Mejorar home.
- Mejorar cards de producto.
- Mejorar página de productos.
- Mejorar página de carrito.
- Mejorar botones y llamadas a la acción.
- Mejorar estados vacíos.
- Mejorar consistencia de espaciados.
- Mejorar feedback visual del carrito.
- Mantener la funcionalidad existente sin romper auth ni carrito.

## Out of Scope

Este cambio no incluye:

- Checkout.
- Mercado Pago.
- Órdenes.
- Panel admin.
- ABM productos.
- ABM categorías.
- Integración con IA.
- Cambio de lógica backend.
- Reemplazo completo del stack frontend.

## Acceptance Criteria

- La app se ve correctamente en mobile, tablet y desktop.
- El header es usable en mobile.
- El catálogo se adapta correctamente a distintos anchos.
- Las cards de producto tienen mejor jerarquía visual.
- El carrito se ve claro y profesional.
- Los botones principales son consistentes.
- La identidad visual transmite comercio gastronómico/repostero moderno.
- No se rompe login, registro, sesión ni carrito.
- El build frontend pasa.
- Se documenta la propuesta visual aplicada.