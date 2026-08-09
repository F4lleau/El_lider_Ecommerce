# Tasks: prepare-qa-and-production-deployment

## 1. Diagnóstico inicial

- [x] Confirmar rama actual `develop`.
- [x] Confirmar estado del repo.
- [x] Revisar scripts backend.
- [x] Revisar scripts frontend.
- [x] Revisar Prisma scripts.
- [x] Revisar `.env.example` backend.
- [x] Revisar `.env.example` frontend.
- [x] Revisar CORS.
- [x] Revisar healthcheck.
- [x] Revisar Swagger.
- [x] Revisar Mercado Pago URLs.
- [x] Revisar si hay secretos commiteados.

## 2. Checklist anti-bugs

- [x] Ejecutar build backend.
- [x] Ejecutar build frontend.
- [x] Ejecutar tests backend críticos.
- [x] Ejecutar tests frontend existentes.
- [x] Validar Swagger local.
- [x] Validar healthcheck local.
- [ ] Validar login local manualmente.
- [ ] Validar checkout local manualmente.
- [ ] Validar admin local manualmente.
- [x] Documentar errores encontrados.

## 3. Documentación QA

- [x] Crear `docs/deployment-guide.md`.
- [x] Crear sección ambiente local.
- [x] Crear sección ambiente QA.
- [x] Crear sección ambiente producción.
- [x] Documentar Vercel frontend QA.
- [x] Documentar Render backend QA.
- [x] Documentar Neon DB QA.
- [x] Documentar variables frontend QA.
- [x] Documentar variables backend QA.
- [x] Documentar migraciones Prisma en QA.
- [x] Documentar CORS QA.
- [x] Documentar Mercado Pago QA.

## 4. Documentación producción

- [x] Documentar frontend producción.
- [x] Documentar backend producción.
- [x] Documentar DB producción separada.
- [x] Documentar variables producción.
- [x] Documentar diferencia entre TEST y PROD Mercado Pago.
- [x] Documentar que producción no debe usar credenciales de prueba.
- [x] Documentar que producción requiere validación final antes de publicar.

## 5. QA checklist

- [x] Crear `docs/qa-checklist.md`.
- [x] Agregar checklist público.
- [x] Agregar checklist auth.
- [x] Agregar checklist carrito.
- [x] Agregar checklist checkout.
- [x] Agregar checklist pagos.
- [x] Agregar checklist tracking.
- [x] Agregar checklist mi cuenta.
- [x] Agregar checklist admin.
- [x] Agregar checklist responsive.
- [x] Agregar checklist errores conocidos.

## 6. Cliente QA

- [x] Crear texto sugerido para enviar al cliente.
- [x] Incluir placeholder de URL QA.
- [x] Indicar que es ambiente de prueba.
- [x] Indicar qué probar.
- [x] Pedir capturas.
- [x] Pedir dispositivo usado.
- [x] Pedir descripción de correcciones.

## 7. Seguridad

- [x] Confirmar que frontend no tiene secretos.
- [x] Confirmar que backend `.env` no se commitea.
- [x] Documentar JWT_SECRET diferente para QA.
- [x] Documentar DB QA separada.
- [x] Documentar credenciales Mercado Pago TEST en QA.
- [x] Documentar EMAIL_ENABLED=false si no hay email real.
- [x] Documentar CORS restringido a frontend QA como requisito antes de producción.

## 8. Validaciones finales

- [x] Build backend OK.
- [x] Build frontend OK.
- [x] Tests backend críticos OK.
- [x] Tests frontend existentes OK.
- [x] Swagger HTTP 200.
- [x] Healthcheck HTTP 200.
- [x] `docs/deployment-guide.md` creado.
- [x] `docs/qa-checklist.md` creado.
- [x] `tasks.md` actualizado.
- [x] `current-state.md` creado.
