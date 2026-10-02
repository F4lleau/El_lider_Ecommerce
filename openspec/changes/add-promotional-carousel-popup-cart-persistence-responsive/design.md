# Diseño técnico

## 1. Slider promocional

Se agregará una sección principal en la home para reemplazar o complementar el hero actual.

Cada slide deberá soportar:

- título
- subtítulo
- descripción breve
- imagen desktop
- imagen mobile opcional
- texto del botón CTA
- destino del botón
- tipo de destino:
  - CATEGORY
  - PRODUCT
  - OFFERS
  - SEARCH
  - INTERNAL_URL
- categoría asociada opcional
- producto asociado opcional
- búsqueda asociada opcional
- fecha de inicio
- fecha de fin
- prioridad
- activo/inactivo
- etiqueta visual:
  - Oferta
  - Novedad
  - 2x1
  - Evento especial
  - Día de la Madre
  - Más vendido
- estilo visual opcional:
  - azul
  - naranja
  - celeste
  - especial/evento

## 2. Priorización

Los slides activos se ordenarán por:

1. promociones marcadas como destacadas/exclusivas vigentes
2. prioridad manual
3. fecha de creación o actualización

Si hay un slide de evento especial activo, debe aparecer primero.

## 3. Admin de slides

El admin podrá:

- crear slide
- editar slide
- activar/desactivar slide
- definir fechas de vigencia
- definir prioridad
- asociar categoría/producto
- configurar CTA
- cargar o referenciar imagen
- previsualizar estado básico

## 4. Pop-up promocional

Se agregará un pop-up administrable para campañas especiales.

Campos sugeridos:

- título
- subtítulo/descripción
- imagen
- texto CTA
- destino CTA
- fecha de inicio
- fecha de fin
- activo/inactivo
- frecuencia:
  - ONCE_PER_SESSION
  - ONCE_PER_DAY
  - ONCE_PER_CAMPAIGN
  - ALWAYS
- delay en segundos
- mostrar en:
  - HOME
  - PRODUCT_LIST
  - PRODUCT_DETAIL
  - CART
  - CHECKOUT
- productos asociados opcionales
- categorías asociadas opcionales
- prioridad
- permitir cierre

Buenas prácticas obligatorias:

- botón de cierre visible
- no bloquear toda la pantalla en mobile
- no mostrarse repetidamente si el usuario lo cerró
- respetar localStorage para frecuencia
- no aparecer en checkout si afecta la conversión, salvo configuración explícita
- diseño responsive

## 5. Persistencia del carrito

### Invitado

El carrito invitado debe persistir en localStorage.

Debe conservar:

- productId
- quantity
- fecha de última actualización
- variante si existiera a futuro

Al volver a entrar, el carrito debe restaurarse.

### Usuario logueado

El carrito del usuario debe persistir en backend/base de datos.

Reglas:

- cerrar sesión no elimina el carrito del usuario
- iniciar sesión recupera el carrito guardado
- si el usuario tenía carrito invitado, se debe sincronizar con el carrito backend
- si el mismo producto existe en ambos carritos, sumar cantidades o aplicar estrategia segura validada por stock
- validar stock y precio actual siempre desde backend
- no congelar precios del carrito como definitivos; el checkout recalcula

### Logout

Al cerrar sesión:

- no borrar el carrito persistente del usuario en backend
- decidir si se conserva o limpia el carrito local invitado según flujo actual
- evitar que datos de un usuario queden visibles para otro usuario en el mismo navegador

Recomendación:
- al logout, limpiar vista del carrito autenticado en frontend
- mantener backend cart guardado
- dejar carrito invitado vacío para evitar mezcla entre usuarios en dispositivos compartidos
- si se desea conservar carrito invitado, debe quedar separado explícitamente

## 6. Responsive

Revisar:

- header
- menú mobile
- home
- slider promocional
- cards de categorías
- productos
- filtros/búsqueda
- detalle de producto
- carrito
- checkout
- login/registro
- mi cuenta
- admin básico

Breakpoints mínimos:

- mobile: 320px-480px
- tablet: 768px
- desktop: 1024px+

El slider no debe ocupar toda la pantalla del celular. Debe mostrar contenido claro, botón visible e imagen adaptada.

## 7. API sugerida

Público:

- GET /api/promotions/slides
- GET /api/promotions/popups/active

Admin:

- GET /api/admin/promotions/slides
- POST /api/admin/promotions/slides
- PATCH /api/admin/promotions/slides/:id
- DELETE /api/admin/promotions/slides/:id
- GET /api/admin/promotions/popups
- POST /api/admin/promotions/popups
- PATCH /api/admin/promotions/popups/:id
- DELETE /api/admin/promotions/popups/:id

Carrito:

- revisar endpoints actuales
- asegurar persistencia backend para usuario logueado
- asegurar sync carrito invitado al login
- asegurar recuperación del carrito activo al entrar

## 8. Modelo de datos sugerido

PromotionSlide:

- id
- title
- subtitle
- description
- badgeLabel
- ctaLabel
- ctaType
- ctaValue
- imageUrl
- mobileImageUrl
- categoryId
- productId
- isActive
- isFeatured
- priority
- startsAt
- endsAt
- theme
- createdAt
- updatedAt

PromotionPopup:

- id
- title
- description
- imageUrl
- ctaLabel
- ctaType
- ctaValue
- categoryId
- productId
- isActive
- priority
- frequency
- delaySeconds
- startsAt
- endsAt
- showOn
- createdAt
- updatedAt

## 9. Seguridad

- Endpoints admin protegidos por rol ADMIN.
- Endpoints públicos solo devuelven promociones activas y vigentes.
- Validar fechas.
- Validar destinos CTA.
- No permitir URLs externas arbitrarias salvo decisión explícita.
- No exponer datos internos.