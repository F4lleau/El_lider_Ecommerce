Ruta:

openspec/changes/add-email-notifications/proposal.md

Contenido:

# Change: add-email-notifications

## Summary

Implementar infraestructura básica de emails transaccionales para el e-commerce, usando SMTP configurable. En desarrollo y pruebas se podrá usar una cuenta Gmail de prueba con contraseña de aplicación. El objetivo inicial es reemplazar el link logueado de recuperación de contraseña por un email real y agregar notificaciones básicas de pedidos y stock.

## Motivation

La aplicación ya cuenta con autenticación, recuperación de contraseña, checkout, pagos, pedidos, seguimiento, panel admin y zona privada de usuario.

Actualmente la recuperación de contraseña funciona, pero en development/test el backend devuelve o loguea el link de recuperación porque todavía no existe envío real de emails.

Para que el flujo sea más cercano a producción, se necesita implementar un servicio de email configurable que permita enviar:

- recuperación de contraseña;
- pedido confirmado;
- pago aprobado;
- pedido listo para retirar;
- pedido enviado;
- aviso de stock disponible.

Como todavía no hay cuenta oficial de la empresa, el MVP usará una cuenta Gmail de prueba mediante SMTP.

## Scope

Este cambio incluye:

- Crear un servicio de email reusable.
- Configurar SMTP por variables de entorno.
- Soportar Gmail SMTP en development/test.
- Usar contraseña de aplicación, no contraseña normal de Gmail.
- Agregar `.env.example` con variables de email.
- Enviar email de recuperación de contraseña.
- Dejar de devolver `resetUrl` en respuestas normales salvo development/test si se mantiene como fallback.
- Enviar email de pedido confirmado.
- Enviar email de pago aprobado cuando Mercado Pago confirme pago.
- Enviar email cuando pedido pase a listo para retirar.
- Enviar email cuando pedido pase a enviado.
- Enviar email cuando una solicitud de stock sea marcada como notificada/contactada.
- Agregar manejo de errores sin romper el flujo principal.
- Agregar logging controlado.
- Actualizar Swagger si cambia alguna respuesta.
- Agregar tests unitarios/mocks.
- Crear `current-state.md`.

## Out of Scope

Este cambio no incluye:

- Cuenta oficial corporativa.
- Configuración DNS SPF/DKIM/DMARC.
- Servicio profesional tipo SendGrid, Resend, Mailgun o Amazon SES.
- Cola de trabajos avanzada.
- Reintentos automáticos persistentes.
- Panel para editar templates.
- Templates visuales complejos.
- WhatsApp.
- SMS.
- Newsletter o marketing.
- Preferencias avanzadas de notificación.
- Adjuntos.
- Facturación por email.

## Acceptance Criteria

- Existe un servicio centralizado para enviar emails.
- El servicio usa SMTP configurable por variables de entorno.
- En development/test puede usarse Gmail SMTP con contraseña de aplicación.
- `.env.example` documenta variables de email.
- El flujo de recuperación de contraseña envía email real si `EMAIL_ENABLED=true`.
- Si el email falla, el backend maneja el error de forma controlada.
- En development/test puede mantenerse fallback logueado para poder probar.
- Pedido confirmado dispara email al cliente si hay email disponible.
- Pago aprobado dispara email al cliente.
- Pedido listo para retirar dispara email al cliente.
- Pedido enviado dispara email al cliente.
- Solicitud de stock notificada/contactada puede disparar email.
- No se exponen credenciales SMTP en logs.
- Tests críticos pasan.
- Build backend pasa.
- Build frontend pasa.
- Swagger sigue respondiendo HTTP 200.