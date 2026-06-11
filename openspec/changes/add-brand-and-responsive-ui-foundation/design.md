# Design: add-brand-and-responsive-ui-foundation

## Context

El frontend actual funciona, pero necesita una mejora visual importante antes de avanzar con checkout y pagos.

La marca "El Líder" corresponde a un comercio orientado a repostería, descartables, cotillón, envases y gastronomía. La identidad debe transmitir variedad, cercanía, confianza, compra rápida y estética moderna.

## Visual direction

La app debe sentirse:

- Comercial.
- Moderna.
- Clara.
- Amigable.
- Confiable.
- Mobile first.
- Orientada a conversión.

## Logo direction

Se propone repensar el logo con una identidad más simple y adaptable.

Opciones conceptuales:

### Opción A: Logo tipográfico comercial

Texto principal:

`El Líder`

Con un detalle gráfico sutil relacionado a:

- manga pastelera;
- batidor;
- caja de producto;
- bolsa de compra;
- estrella/oferta;
- utensilio gastronómico.

### Opción B: Logo con isotipo

Isotipo simple que pueda usarse solo:

- inicial `L`;
- bolsa de compras con detalle pastelero;
- cupcake minimalista;
- batidor dentro de una bolsa;
- caja/envase estilizado.

### Opción C: Logo mixto

Isotipo + texto:

`El Líder`

Subtexto opcional:

`Repostería · Envases · Cotillón`

Para el MVP se recomienda crear una versión simple con texto + isotipo, usable en header, favicon y redes.

## Color palette

Se propone una paleta cálida/comercial, evitando que la app se vea genérica.

### Paleta principal sugerida

- Primario: rojo/frutilla o bordó cálido.
- Secundario: crema o vainilla.
- Acento: dorado/miel.
- Neutro oscuro: marrón profundo o gris carbón.
- Fondo: blanco cálido.

Ejemplo conceptual:

```txt
Primary: #C73535
Primary dark: #982727
Cream: #FFF4E6
Honey: #F4B942
Chocolate: #3A2520
Soft background: #FFF9F2
Border: #E8D8C3

La paleta final puede ajustarse según el logo elegido.

Typography

Se recomienda:

Fuente principal sans serif moderna para legibilidad.
Peso fuerte para títulos.
Buena escala tipográfica responsive.
Evitar textos chicos en cards y botones.

Ejemplos de estilo:

Títulos grandes y claros.
Botones con buen contraste.
Precios destacados.
Categorías visuales.
Responsive rules

La UI debe respetar:

Mobile first.
Header mobile con menú hamburguesa.
Carrito visible.
Botones grandes y táctiles.
Cards en una columna en mobile.
Grid de 2 columnas en tablet.
Grid de 3 o 4 columnas en desktop.
Hero adaptable.
Evitar overflow horizontal.
Components to improve
Header

Debe incluir:

Logo.
Buscador o acceso a productos.
Links principales.
Login/mi cuenta.
Carrito con contador.
Menú mobile.
Home

Debe incluir:

Hero atractivo.
CTA principal.
Categorías destacadas.
Ofertas.
Más vendidos.
Bloque de confianza: retiro, envíos, pagos.
WhatsApp/contacto visible.
ProductCard

Debe incluir:

Imagen clara.
Badge de oferta si aplica.
Nombre.
Categoría opcional.
Precio.
Precio anterior si aplica.
Stock/sin stock.
Botón agregar al carrito.
Feedback al agregar.
Product listing

Debe incluir:

Título claro.
Filtros simples.
Grid responsive.
Loading state.
Empty state.
Error state.
Cart page

Debe incluir:

Estado vacío atractivo.
Lista clara de productos.
Controles de cantidad.
Subtotal.
CTA a checkout.
CTA a seguir comprando.
Diseño mobile usable.
Technical approach
Mantener Tailwind.
Reutilizar componentes existentes.
Evitar refactor masivo innecesario.
No romper lógica de auth ni carrito.
Mantener nombres de rutas actuales.
Crear tokens visuales si es posible.
Centralizar constantes visuales si aplica.
Revisar clases responsive en todas las páginas públicas.
Risks
Un rediseño demasiado grande puede retrasar checkout.
Cambiar demasiada estructura puede romper funcionalidad existente.
El logo definitivo puede requerir iteración con el cliente.
Si no se define paleta ahora, cada nueva pantalla puede quedar inconsistente.
Decisions
Se prioriza una mejora visual MVP, no una identidad corporativa completa.
Se define una dirección de logo inicial.
Se mejora responsive antes de checkout.
No se cambia stack frontend.
No se implementa checkout en este change.