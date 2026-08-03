# Current State: refresh-public-branding-and-storefront-layout

## Estado general

El cambio público de branding y layout quedó implementado en el frontend. No se tocaron flujos de negocio, pagos, checkout, admin ni backend.

## Decisiones de branding

- Se reemplazó el branding público hacia “El Líder” con el claim “Todo en insumos”.
- Se incorporó el asset `el_lider_logo.png` desde `frontend/public` y se usa en el header/footer mediante el componente `BrandLogo`.
- La paleta pública se movió a una identidad más cercana al local/cartelería: azules, blancos y tonos claros, con acento rojo controlado.
- La comunicación principal presenta a El Líder como polirrubro mayorista, no como tienda centrada únicamente en descartables.

## Cambios de copy

- Se reemplazó “Todo para crear” por “Todo en insumos”.
- Se incorporaron textos de polirrubro mayorista en home, header, footer, páginas institucionales y shell de autenticación.
- Se usaron los rubros confirmados: artículos descartables, repostería, pastelería, panificación, limpieza y golosinas.
- Se quitaron datos no confirmados de contacto visibles previamente, como teléfono, email o WhatsApp inventados.

## Hero y layout público

- El hero de la home se redujo a una composición más compacta y comercial.
- El primer scroll ahora da mayor protagonismo a rubros/categorías.
- La home mantiene ofertas, destacados y módulos de confianza con una estética más clara y consistente.
- Las cards de categorías se compactaron para mejorar densidad y visibilidad del catálogo.

## Header y footer

- El header usa el nuevo logo `el_lider_logo.png`, el claim “Todo en insumos” y copy superior de polirrubro mayorista.
- El logo del header se amplió para que el asset real tenga mayor presencia y no se perciba como miniatura.
- El footer incluye:
  - El Líder
  - Todo en insumos
  - Av. Manuel Belgrano, La Leonesa, Chaco
  - Frente del salón ex fantasía
  - Lunes a sábado
  - 8:00 a 12:30
  - 16:30 a 20:30
  - rubros principales confirmados

## Validaciones ejecutadas

- `npm run build` en `frontend`: OK.
- Tests existentes del frontend con `npx tsx --test tests/cart.test.ts tests/order-labels.test.ts tests/password-recovery.test.ts tests/user-private-profile.test.ts`: 14 tests OK.
- Preview local de frontend en `http://127.0.0.1:4173/`: HTTP 200.
- Verificación estática de textos nuevos en `frontend/src` y `frontend/dist`: OK.
- Verificación estática de textos/contactos viejos (`Todo para crear`, `wa.me`, teléfono/email/dirección inventados): sin coincidencias.
- Asset `frontend/dist/el_lider_logo.png`: presente.
- Favicon `frontend/dist/favicon.png` y título “El Líder · Todo en insumos”: presentes.

## Correcciones de diseño posteriores

- Se conectó `frontend/public/favicon.png` como favicon de la pestaña.
- Se actualizó el color de tema del documento al naranja de acción.
- Se cambió el botón principal global al tono naranja para unificar CTAs y acciones en toda la web.
- Se rediseñó el hero principal con fondo oscuro, grilla sutil, badge superior, título centrado con acento celeste/azul y botón principal naranja.
- Se quitó el recuadro blanco del logo en el header para darle mayor tamaño visual.
- Las tags de categorías del hero ahora tienen texto blanco y hover naranja.
- El footer usa el mismo fondo oscuro del hero.
- El bloque de beneficios previo al footer quedó más compacto y sin fondo sólido.

## Limitaciones

- No se ejecutó build backend porque este change no modificó backend ni código compartido.
- La revisión visual con screenshot en navegador integrado no pudo ejecutarse porque el browser in-app no estuvo disponible en esta sesión (`iab`). Se compensó con build, preview HTTP 200 y revisión estática/responsive del código.
