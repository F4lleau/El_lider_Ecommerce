# Design: refresh-public-branding-and-storefront-layout

## Context

La aplicación ya cuenta con:

- Home pública
- Catálogo
- Productos por categoría
- Ofertas
- Más vendidos
- Nosotros
- Header y footer
- Login, carrito, checkout y flujos funcionales

El problema actual es principalmente de identidad visual, contenido comercial y jerarquía del layout público.

## Referencias reales del negocio

Tomar como referencia las imágenes compartidas del negocio:

1. Frente del local.
2. Cartelería/logo actual del local.
3. Captura actual de la home.

Además, usar la descripción real del negocio:

- El Líder / polirrubro mayorista
- Todo en insumos para:
  - artículos descartables
  - repostería
  - pastelería
  - panificación
  - artículos de limpieza
  - golosinas
  - etc.

Ubicación:

```txt
Av. Manuel Belgrano, La Leonesa, Chaco
(Frente del salón ex fantasía)

Horarios de atención según cartelería:

Lunes a sábado
Por la mañana: 8:00 a 12:30
Por la tarde: 16:30 a 20:30
Main branding decision

El branding debe conservar el nombre:

El Líder

Pero debe mejorar su presentación visual.

Claim principal

Reemplazar:

Todo para crear

por:

Todo en insumos
Posicionamiento comercial

En vez de presentar la tienda como algo centrado solo en “artículos descartables”, comunicarla como:

Polirrubro mayorista

o como negocio de insumos para múltiples rubros.

Logo / wordmark

No es obligatorio crear una marca compleja desde cero.

Para MVP frontend se acepta:

un wordmark más limpio;
un isotipo o badge simple;
una composición tipográfica más prolija que la actual;
una versión en SVG o asset liviano.

Criterios:

Debe decir El Líder.
Debe convivir bien con el header.
Debe verse limpio en tamaños pequeños.
Puede conservar guiños al negocio real sin copiar literalmente la cartelería.
Debe acompañarse con el subtítulo Todo en insumos.
Color palette

La paleta debe inspirarse en el local/cartelería real.

Dirección recomendada:

azul principal como color de marca;
blanco o crema muy claro como base;
azul claro/celeste como apoyo;
rojo como acento puntual para CTA o badges, si combina con la línea actual;
evitar que el marrón oscuro domine la home si aleja la identidad real.

Objetivo:

que la web se sienta más cercana al comercio real;
que el look general sea limpio, comercial y legible.
Header

Mantener la estructura general del header si funciona, pero actualizar:

logo/wordmark;
subtítulo;
colores;
consistencia de hover y estado activo;
espaciados;
equilibrio visual con el footer.

El top bar puede conservar mensajes operativos cortos, pero revisar copy para que no compita con el branding.

Hero / home banner

Problema actual:

ocupa demasiado alto;
el usuario ve demasiado banner y poco catálogo.
Cambio requerido

Reducir el hero para que sea más compacto.

Lineamientos:

desktop: hero más corto, aproximadamente entre 38vh y 50vh, sin exagerar;
mobile: hero compacto, bien apilado;
no ocupar ~70% de la pantalla como ahora;
mantener un mensaje comercial claro;
priorizar CTA útiles;
dejar visibles más rápidamente categorías y productos.
Copy recomendado del hero

Evitar un mensaje genérico que no refleje al negocio real.

Orientación recomendada:

Polirrubro mayorista
Todo en insumos para tu negocio
Descartables, repostería, panificación, limpieza y más

o una variante equivalente, manteniendo “Todo en insumos”.

Home content hierarchy

Nueva prioridad visual:

Header
Hero compacto
Acceso a categorías/rubros
Ofertas o destacados
Más vendidos / catálogo
Footer

El catálogo debe ganar protagonismo “above the fold” o muy cerca del primer scroll.

Footer

El footer debe reforzar la identidad y resolver información útil.

Información que debe incluir
Marca
El Líder
Todo en insumos
Rubros o secciones

Ejemplo:

Artículos descartables
Repostería
Pastelería
Panificación
Limpieza
Golosinas
Ubicación
Av. Manuel Belgrano, La Leonesa, Chaco
(Frente del salón ex fantasía)
Horarios
Lunes a sábado
8:00 a 12:30
16:30 a 20:30
Contacto / redes

Si existen íconos sociales, mantenerlos.
Si no hay más datos reales aún, no inventar teléfonos nuevos.

Criterio visual
Debe verse consistente con el header.
Debe usar la misma paleta.
Debe tener buena legibilidad.
Debe evitar placeholders genéricos si ya se conocen datos reales.
Public copy updates

Actualizar copies visibles donde corresponda:

“Todo para crear” -> “Todo en insumos”
“Artículos descartables” como descriptor central -> reemplazar por “Polirrubro mayorista” o copy más amplio
textos de presentación -> incorporar rubros reales
Responsive design

Revisar especialmente:

header en mobile
tamaño del logo
legibilidad del hero
altura del hero
footer en mobile
espaciados entre bloques
cards de categorías/productos cercanas al hero
Scope boundaries

Este cambio es principalmente de:

UI pública
branding
copies
layout

No debe mezclar lógica compleja ni flujos internos.

Testing

Validar:

home desktop
home mobile
header
footer
branding actualizado
hero más compacto
visibilidad del catálogo
consistencia visual general
Decisions
Se mantiene el nombre “El Líder”.
El claim principal será “Todo en insumos”.
La web debe comunicar un polirrubro mayorista.
El hero se reduce para mostrar antes el catálogo.
Header y footer deben quedar armónicos.
La paleta se inspira en la estética real del local.
No se agregan cambios de negocio ni backend en este change.