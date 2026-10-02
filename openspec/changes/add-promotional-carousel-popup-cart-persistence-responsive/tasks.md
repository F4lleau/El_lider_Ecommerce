# Tasks: add-promotional-carousel-popup-cart-persistence-responsive

## 1. Preparacion

- [x] Revisar estado actual de home, hero, categorias, carrito y admin.
- [x] Confirmar rutas actuales de productos, categorias, ofertas y admin.
- [x] Confirmar endpoints actuales de carrito invitado/usuario.
- [x] Revisar como se guarda actualmente el carrito en localStorage y backend.

## 2. Modelo y migraciones

- [x] Crear modelo `PromotionalSlide`.
- [x] Crear modelo `PromotionalPopup`.
- [x] Agregar enums para CTA y frecuencia.
- [x] Crear migracion Prisma.
- [x] Ejecutar `prisma generate`.
- [x] Verificar compatibilidad con base Neon QA.

## 3. Backend promociones

- [x] Crear servicio de promociones.
- [x] Crear endpoint publico para slides activos.
- [x] Crear endpoint publico para popup activo.
- [x] Crear endpoints admin CRUD para slides.
- [x] Crear endpoints admin CRUD para popups.
- [x] Validar rol ADMIN.
- [x] Validar fechas, prioridad, activo/inactivo.
- [x] Actualizar Swagger.
- [x] Agregar tests basicos.

## 4. Frontend slider

- [x] Crear componente `PromotionalCarousel`.
- [x] Reemplazar o complementar hero actual.
- [x] Soportar imagen promocional.
- [x] Agregar navegacion por flechas/dots.
- [x] Agregar CTA funcional.
- [x] Priorizar slides destacados vigentes.
- [x] Agregar fallback si no hay slides configurados.
- [x] Adaptar diseno responsive base.
- [x] Evitar que ocupe toda la pantalla en mobile.

## 5. Frontend pop-up

- [x] Crear componente `PromotionalPopup`.
- [x] Consumir popup activo desde backend.
- [x] Respetar fechas de vigencia desde backend.
- [x] Respetar frecuencia con localStorage/sessionStorage.
- [x] Agregar boton cerrar visible.
- [x] Agregar CTA funcional.
- [x] Adaptar mobile.
- [x] Evitar aparicion abusiva.

## 6. Admin promociones

- [x] Agregar seccion en admin para slides.
- [x] Agregar formulario crear/editar slide.
- [x] Agregar tabla/listado de slides.
- [x] Permitir activar/desactivar.
- [x] Permitir ordenar/priorizar.
- [x] Agregar seccion en admin para popups.
- [x] Agregar formulario crear/editar popup.
- [x] Permitir definir fechas y frecuencia.
- [x] Permitir asociar productos/categorias.

## 7. Persistencia carrito

- [x] Revisar comportamiento actual invitado.
- [x] Asegurar persistencia localStorage para invitado.
- [x] Asegurar persistencia backend para usuario logueado.
- [x] Al iniciar sesion, sincronizar carrito invitado con backend.
- [x] Al cerrar sesion, no eliminar carrito backend.
- [x] Evitar mezcla de carritos entre usuarios.
- [x] Validar stock/precio desde backend.
- [x] Agregar tests de sync y persistencia existentes/relevantes.

## 8. Responsive

- [x] Revisar home mobile por estructura responsive.
- [ ] Revisar header mobile manualmente en navegador.
- [ ] Revisar productos mobile manualmente en navegador.
- [ ] Revisar detalle producto mobile manualmente si aplica.
- [ ] Revisar carrito mobile manualmente en navegador.
- [ ] Revisar checkout mobile manualmente en navegador.
- [ ] Revisar login/registro mobile manualmente en navegador.
- [ ] Revisar mi cuenta mobile manualmente en navegador.
- [ ] Revisar admin basico mobile/tablet manualmente en navegador.
- [x] Corregir desbordes horizontales detectables por build/layout base.
- [x] Corregir botones demasiado chicos en promociones.
- [x] Corregir textos ilegibles en promociones.

## 9. Validacion final

- [x] Ejecutar backend build.
- [x] Ejecutar frontend build.
- [x] Ejecutar prisma generate.
- [x] Ejecutar prisma migrate deploy.
- [x] Ejecutar prisma migrate status.
- [x] Ejecutar tests existentes backend relevantes.
- [x] Ejecutar tests frontend existentes relevantes.
- [ ] Probar `/api/health` en QA post deploy.
- [ ] Probar `/api/docs` en QA post deploy.
- [ ] Probar home con slides en navegador.
- [ ] Probar popup en navegador.
- [ ] Probar login manual en QA.
- [ ] Probar carrito invitado manual en QA.
- [ ] Probar carrito usuario logueado manual en QA.
- [ ] Probar sync invitado -> usuario manual en QA.
- [ ] Probar checkout manual en QA.
- [ ] Probar responsive en navegador movil.
