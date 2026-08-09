design.md
# Design: prepare-qa-and-production-deployment

## Context

El proyecto está en rama `develop` y ya fue pusheado a GitHub.

Stack:

- Frontend React/Vite.
- Backend Node/Express/TypeScript.
- Prisma.
- PostgreSQL.
- Swagger.
- Mercado Pago.
- JWT.
- Panel admin.
- Zona privada usuario.

## Recommended free QA stack

Para QA se recomienda:

```txt
Frontend: Vercel
Backend: Render
Database: Neon PostgreSQL
Branch: develop
Environments
Local development
Frontend local: http://localhost:5173
Backend local: http://localhost:3000
Database: local o Neon dev
QA
Frontend QA: https://el-lider-qa.vercel.app
Backend QA: https://el-lider-api-qa.onrender.com
Database QA: Neon project separado
Production
Frontend PROD: https://el-lider.vercel.app o dominio propio
Backend PROD: https://el-lider-api.onrender.com
Database PROD: Neon project separado
Environment variable rule

Frontend solo puede tener variables públicas:

VITE_API_URL
VITE_MERCADOPAGO_PUBLIC_KEY

Backend tiene secretos:

DATABASE_URL
JWT_SECRET
MERCADOPAGO_ACCESS_TOKEN
MERCADOPAGO_WEBHOOK_SECRET
SMTP_PASS

Nunca poner secretos en frontend.

QA backend variables
NODE_ENV=production
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=https://el-lider-qa.vercel.app
BACKEND_URL=https://el-lider-api-qa.onrender.com

MERCADOPAGO_ACCESS_TOKEN=TEST-...
MERCADOPAGO_PUBLIC_KEY=TEST-...
MERCADOPAGO_WEBHOOK_SECRET=

EMAIL_ENABLED=false
QA frontend variables
VITE_API_URL=https://el-lider-api-qa.onrender.com/api
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-...
Production backend variables
NODE_ENV=production
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=https://url-produccion
BACKEND_URL=https://api-produccion

MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_WEBHOOK_SECRET=

EMAIL_ENABLED=false
Production frontend variables
VITE_API_URL=https://api-produccion/api
VITE_MERCADOPAGO_PUBLIC_KEY=
Database strategy

Usar bases separadas:

el-lider-dev
el-lider-qa
el-lider-prod

No compartir QA con producción.

Render backend setup

Configuración esperada:

Service type: Web Service
Repository: El_lider_Ecommerce
Branch: develop
Root directory: backend
Build command: npm install && npm run build
Start command: npm run start

El agente debe revisar los scripts reales del package.json y corregir esta documentación si difiere.

Vercel frontend setup

Configuración esperada:

Project: el-lider-qa
Repository: El_lider_Ecommerce
Branch: develop
Root directory: frontend
Build command: npm run build
Output directory: dist

El agente debe verificar scripts reales.

Prisma migrations

En QA debe ejecutarse:

prisma migrate deploy
prisma generate

Puede hacerse desde script de build/start o manualmente en Render según la configuración final.

CORS

Backend debe aceptar:

http://localhost:5173
https://el-lider-qa.vercel.app
https://url-produccion

Idealmente desde FRONTEND_URL o lista de orígenes permitidos.

Mercado Pago QA

QA debe usar credenciales TEST.

Back URLs:

https://el-lider-qa.vercel.app/checkout/success
https://el-lider-qa.vercel.app/checkout/pending
https://el-lider-qa.vercel.app/checkout/failure

Webhook QA:

https://el-lider-api-qa.onrender.com/api/payments/mercadopago/webhook
QA checklist

Validar:

Home.
Catálogo.
Categorías.
Login.
Registro.
Recuperar contraseña.
Carrito invitado.
Carrito usuario.
Checkout efectivo retiro.
Checkout efectivo envío.
Checkout Mercado Pago.
Tracking público.
Mi cuenta.
Direcciones.
Pedidos.
Solicitudes de stock.
Admin productos.
Admin categorías.
Admin pedidos.
Admin solicitudes de stock.
Swagger.
Healthcheck.
Client handoff

Preparar un mensaje para el cliente con:

URL QA.
Aclaración de que es ambiente de prueba.
Qué probar.
Cómo reportar correcciones.
Solicitar capturas y dispositivo usado.
Decisions
QA se hará antes de producción.
QA usará Vercel + Render + Neon.
Producción se documenta pero no se publica hasta validar QA.
Emails reales pueden quedar apagados inicialmente.
No se usan servidores propios.