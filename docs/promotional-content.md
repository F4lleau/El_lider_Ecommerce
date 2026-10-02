# Contenido promocional y carrito persistente

## Admin

El panel admin incluye la seccion `Promociones`:

- Slides del carousel de home.
- Pop-ups promocionales.

Los slides permiten configurar:

- titulo;
- subtitulo;
- imagen y texto alternativo;
- CTA;
- destino;
- badge;
- prioridad;
- destacado;
- fechas de inicio y fin;
- estado activo/inactivo.

Los pop-ups permiten configurar:

- titulo;
- descripcion;
- imagen y texto alternativo;
- CTA opcional;
- destino opcional;
- fechas de inicio y fin;
- productos/categorias asociadas por id;
- prioridad;
- frecuencia de aparicion;
- estado activo/inactivo.

## Destinos disponibles

- `OFFERS`: `/productos/ofertas`
- `BEST_SELLERS`: `/productos/mas-vendidos`
- `CATEGORY`: `/productos/categorias?categoria=<valor>`
- `PRODUCT`: `/productos/<valor>`
- `SEARCH`: `/productos?q=<valor>`
- `INTERNAL_URL`: ruta interna que empieza con `/`

## Prioridad

El backend devuelve slides activos y vigentes ordenados por:

1. destacado;
2. prioridad;
3. fecha de inicio;
4. fecha de creacion.

Esto permite que una promocion exclusiva de evento, por ejemplo Dia de la Madre, aparezca primero mientras este vigente.

## Pop-up y frecuencia

El frontend guarda el estado del pop-up en storage local:

- `ONCE`: no vuelve a aparecer para ese usuario/navegador.
- `ONCE_PER_DAY`: aparece como maximo una vez por dia.
- `ONCE_PER_SESSION`: aparece como maximo una vez por sesion.
- `ALWAYS`: puede aparecer en cada visita.

El pop-up se puede cerrar con boton visible y esta preparado para mobile.

## Carrito persistente

- Invitado: se guarda en `localStorage` con la key `el-lider:guest-cart`.
- Compatibilidad: si existe un carrito viejo en `guest-cart`, se migra automaticamente.
- Usuario logueado: se guarda en backend/base de datos usando `Cart` y `CartItem`.
- Al iniciar sesion: el carrito invitado se sincroniza con el carrito del usuario.
- Al cerrar sesion: no se borra el carrito persistente del usuario.

## QA

Despues del deploy QA validar:

- home con y sin slides activos;
- CTA de cada tipo de destino;
- pop-up en mobile y desktop;
- cierre/frecuencia del pop-up;
- login admin;
- ABM de slides y pop-ups;
- carrito invitado persistente;
- sync de carrito al iniciar sesion;
- checkout y Mercado Pago sin regresiones.
