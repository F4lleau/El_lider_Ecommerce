# Tasks: add-email-notifications

## 1. Auditoria inicial

- [x] Revisar auth forgot-password actual.
- [x] Revisar variables de entorno actuales.
- [x] Revisar config/env actual.
- [x] Revisar checkout/order service.
- [x] Revisar webhook Mercado Pago.
- [x] Revisar cambio de estado admin.
- [x] Revisar stock requests admin.
- [x] Revisar tests actuales.
- [x] Revisar Swagger.

## 2. Configuracion email

- [x] Agregar `EMAIL_ENABLED`.
- [x] Agregar `EMAIL_PROVIDER`.
- [x] Agregar `EMAIL_FROM_NAME`.
- [x] Agregar `EMAIL_FROM_ADDRESS`.
- [x] Agregar `SMTP_HOST`.
- [x] Agregar `SMTP_PORT`.
- [x] Agregar `SMTP_SECURE`.
- [x] Agregar `SMTP_USER`.
- [x] Agregar `SMTP_PASS`.
- [x] Agregar `EMAIL_DEV_LOG`.
- [x] Actualizar `.env.example`.
- [x] Validar que no se commiteen credenciales reales.

## 3. Servicio email

- [x] Crear servicio centralizado de email.
- [x] Implementar transporte SMTP.
- [x] Soportar `EMAIL_ENABLED=false`.
- [x] Soportar modo development/test.
- [x] No loguear credenciales.
- [x] Manejar errores controladamente.
- [x] Permitir mocks en tests.

## 4. Templates

- [x] Crear template password reset.
- [x] Crear template order confirmed.
- [x] Crear template payment approved.
- [x] Crear template ready for pickup.
- [x] Crear template shipped.
- [x] Crear template stock available.
- [x] Incluir version texto.
- [x] Incluir version HTML basica.
- [x] Mantener textos en espanol.

## 5. Recuperacion de contrasena

- [x] Integrar email en `forgot-password`.
- [x] Enviar resetUrl si usuario existe.
- [x] Mantener respuesta generica.
- [x] No revelar si email existe.
- [x] En production no devolver resetUrl.
- [x] En development/test permitir fallback logueado si corresponde.
- [x] Manejar error de email con mensaje controlado.

## 6. Pedido confirmado

- [x] Enviar email al crear orden CASH.
- [x] Enviar email al crear orden MERCADOPAGO pendiente.
- [x] Incluir numero de orden.
- [x] Incluir numero de seguimiento.
- [x] Incluir metodo de entrega.
- [x] Incluir metodo de pago.
- [x] Incluir total.
- [x] Incluir link de seguimiento.
- [x] No romper creacion de orden si falla email.

## 7. Pago aprobado

- [x] Integrar email en webhook Mercado Pago approved.
- [x] Enviar solo cuando el pago cambia por primera vez a approved.
- [x] Evitar email duplicado con webhook repetido.
- [x] Incluir numero de orden.
- [x] Incluir numero de seguimiento.
- [x] Incluir total pagado.
- [x] Incluir link de seguimiento.
- [x] No romper actualizacion de pago si falla email.

## 8. Estados de pedido

- [x] Enviar email cuando pedido pasa a `READY_FOR_PICKUP`.
- [x] Enviar email cuando pedido pasa a `SHIPPED`.
- [x] Evitar duplicados si el estado ya era el mismo.
- [x] No enviar si no hay email del cliente.
- [x] No romper cambio de estado si falla email.

## 9. Solicitudes de stock

- [x] Enviar email cuando solicitud pasa a `NOTIFIED`.
- [x] Enviar email cuando solicitud pasa a `CONTACTED`.
- [x] Incluir nombre del producto.
- [x] Incluir link al producto si existe.
- [x] No enviar si no hay email.
- [x] No romper cambio de estado si falla email.

## 10. Tests backend

- [x] Test config email disabled.
- [x] Test forgot password envia email con usuario existente.
- [x] Test forgot password no revela usuario inexistente.
- [x] Test order confirmed llama email service.
- [x] Test payment approved llama email service.
- [x] Test webhook duplicado no duplica email.
- [x] Test ready for pickup llama email service.
- [x] Test shipped llama email service.
- [x] Test stock request notified llama email service.
- [x] Test error de email no revierte orden.
- [x] Test error de email no revierte pago.

## 11. Validacion manual

- [ ] Configurar Gmail de prueba con app password.
- [ ] Configurar `.env`.
- [ ] Solicitar recuperar contrasena.
- [ ] Confirmar llegada del email.
- [ ] Crear pedido CASH.
- [ ] Confirmar email de pedido.
- [ ] Crear pedido MERCADOPAGO.
- [ ] Confirmar email correspondiente.
- [ ] Cambiar pedido a listo para retirar.
- [ ] Confirmar email.
- [ ] Cambiar pedido a enviado.
- [ ] Confirmar email.
- [ ] Cambiar solicitud stock a notificada.
- [ ] Confirmar email.

## 12. Swagger y documentacion

- [x] Revisar Swagger. No se agregaron endpoints ni cambios de response contract.
- [x] Validar Swagger HTTP 200.
- [x] Documentar Gmail test en `current-state.md`.
- [x] Documentar limitaciones.
- [x] Documentar que la cuenta oficial queda pendiente.

## 13. Build y cierre

- [x] Ejecutar build backend.
- [x] Ejecutar build frontend.
- [x] Ejecutar tests backend relacionados.
- [x] Ejecutar tests frontend existentes.
- [x] Validar Swagger HTTP 200.
- [x] Actualizar `tasks.md`.
- [x] Crear `current-state.md`.
