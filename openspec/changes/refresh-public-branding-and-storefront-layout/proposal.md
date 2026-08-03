# Change: refresh-public-branding-and-storefront-layout

## Summary

Actualizar la identidad visual y el layout público del ecommerce para alinearlo con la imagen real del negocio “El Líder”, mejorando logo, colores, copy principal, footer informativo y home pública, con foco en una experiencia más clara, más comercial y más orientada al catálogo.

## Motivation

La app ya tiene una base funcional sólida, pero la parte pública todavía necesita una mejora visual y de contenido para representar mejor al comercio real.

Observaciones detectadas:

- El branding actual no refleja bien la identidad real del negocio.
- El claim “Todo para crear” no representa tan bien al comercio como “Todo en insumos”.
- La comunicación “artículos descartables” resulta demasiado limitada; el negocio es un polirrubro mayorista.
- El hero principal ocupa demasiado alto de pantalla y retrasa la visualización del catálogo.
- Faltan datos reales de contacto, ubicación y horarios en el footer.
- Es necesario armonizar header y footer con una misma línea visual.
- Se debe incorporar información comercial real vista en la cartelería y descripción del negocio.

## Scope

Este cambio incluye:

- Rediseñar el branding visual del frontend público.
- Mejorar el logo visual o wordmark de “El Líder”.
- Reemplazar el claim por “Todo en insumos”.
- Actualizar textos públicos para comunicar que es un polirrubro mayorista.
- Ajustar paleta de colores según referencias reales del negocio.
- Reducir la altura del hero/banner de home.
- Dar más protagonismo al catálogo y productos sobre el fold.
- Mejorar estructura y contenido del footer.
- Incorporar ubicación real.
- Incorporar horarios de atención reales.
- Incorporar categorías/insumos principales del negocio en la comunicación pública.
- Mantener armonía visual entre header y footer.
- Mejorar responsive de la home y layout público.
- Ajustar copies visibles donde hoy el branding esté desalineado.
- Crear o ajustar assets visuales simples necesarios para branding.
- Crear `current-state.md`.

## Out of Scope

Este cambio no incluye:

- Nuevas integraciones backend.
- Cambios en checkout.
- Cambios en admin.
- Cambios en Mercado Pago.
- Emails.
- WhatsApp.
- Reportes.
- Reviews.
- Facturación.
- Reembolsos.
- Reestructuración grande del catálogo.
- Nueva lógica de negocio.

## Acceptance Criteria

- El frontend público muestra una identidad visual más alineada con el negocio real.
- El branding principal usa “El Líder”.
- El claim visible pasa a ser “Todo en insumos”.
- Se elimina el enfoque limitado de “artículos descartables” como descriptor central.
- La home comunica al negocio como polirrubro mayorista.
- El hero principal ocupa menos altura que antes.
- En desktop el catálogo queda más visible sin tener que desplazarse tanto.
- El header conserva armonía con el footer.
- El footer muestra información real de ubicación.
- El footer muestra horarios de atención reales.
- El footer muestra categorías/rubros principales o navegación útil.
- La paleta pública se alinea con los colores reales del negocio.
- La home se ve mejor en mobile y desktop.
- Los textos públicos principales están actualizados.
- Build frontend pasa.
- Build backend sigue pasando si no se toca.