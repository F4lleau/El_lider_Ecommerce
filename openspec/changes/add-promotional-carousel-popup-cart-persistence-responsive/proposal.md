# add-promotional-carousel-popup-cart-persistence-responsive

## Objetivo

Mejorar la experiencia comercial y visual de El Líder e-commerce incorporando una home más dinámica, promociones administrables, pop-ups de ofertas por eventos especiales, persistencia real del carrito y revisión responsive completa.

El cambio busca que la tienda pueda comunicar ofertas semanales, novedades, promociones 2x1, eventos especiales como Día de la Madre y accesos rápidos a categorías o productos destacados, sin depender de cambios manuales en código.

## Problemas actuales

- El hero actual es estático y ocupa demasiado espacio visual.
- No existe un slider administrable para ofertas, novedades o promociones.
- No existe pop-up promocional configurable desde admin.
- Las campañas especiales dependen de cambios manuales.
- El carrito puede perderse o quedar poco claro cuando el usuario abandona la sesión o no finaliza la compra.
- La app necesita una revisión responsive general para uso desde celular.

## Alcance

### Incluye

- Slider/carrousel promocional en la home.
- Administración de slides desde el panel admin.
- Priorización de promociones exclusivas por evento.
- Pop-up promocional administrable.
- Persistencia de carrito para invitado y usuario logueado.
- Sincronización de carrito invitado al iniciar sesión.
- Revisión responsive de vistas principales.
- Endpoints públicos y privados necesarios.
- Migraciones Prisma.
- Actualización Swagger.
- Tests básicos de backend/frontend cuando corresponda.

### No incluye

- Motor avanzado de cupones.
- Segmentación compleja por usuario.
- Email marketing.
- Notificaciones push.
- Analítica avanzada de campañas.
- AB testing.
- Integración con servicios externos de banners.
- Rediseño completo del admin fuera de lo necesario.

## Resultado esperado

La home debe verse más moderna y comercial, con un slider promocional configurable. El admin debe poder cargar campañas temporales sin tocar código. El carrito debe mantenerse aunque el usuario abandone la compra. La experiencia móvil debe ser usable y clara.