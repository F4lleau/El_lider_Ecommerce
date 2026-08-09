# Guía de despliegue QA y producción

Esta guía prepara el camino para publicar una URL QA de El Líder sin hacer todavía el despliegue productivo. La estrategia recomendada es:

- Frontend QA: Vercel.
- Backend QA: Render.
- Base QA: Neon PostgreSQL.
- Rama: `develop`.

## Estado técnico confirmado

- Frontend: React, Vite, TypeScript.
- Backend: Node, Express, TypeScript.
- ORM/Base: Prisma con PostgreSQL.
- Swagger: disponible en `/api/docs`.
- Healthcheck: disponible en `/api/health`.
- Commit local verificado al preparar esta guía: `5347e76`.
- El commit informado en el pedido fue `8221858`; antes de desplegar conviene confirmar que `develop` local y remoto apunten al commit deseado.

## Ambiente local

Backend:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

URLs locales:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`
- Healthcheck: `http://localhost:3000/api/health`

## Scripts reales

Backend:

- Desarrollo: `npm run dev`
- Build: `npm run build`
- Start producción: `npm run start`
- Tests críticos: `npm test`
- Prisma generate: `npm run prisma:generate`
- Prisma migrate dev: `npm run prisma:migrate`
- Prisma migrate deploy: `npm run prisma:deploy`
- Seed: `npm run seed`
- Crear admin: `npm run admin:create`

Frontend:

- Desarrollo: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint`
- Test disponible por script: `npm run test:cart`

## Variables por entorno

El frontend solo debe recibir variables públicas. Nunca poner en Vercel frontend:

- `DATABASE_URL`
- `JWT_SECRET`
- `MERCADOPAGO_ACCESS_TOKEN`
- `SMTP_PASS`

Variables frontend QA:

```env
VITE_API_URL=https://URL_BACKEND_QA/api
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-...
```

Variables backend QA:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=7d
DEFAULT_SHIPPING_COST=3000
PICKUP_ADDRESS=Av. Manuel Belgrano 203, La Leonesa, Chaco
FRONTEND_URL=https://URL_FRONTEND_QA
BACKEND_URL=https://URL_BACKEND_QA
MERCADOPAGO_ACCESS_TOKEN=TEST-...
MERCADOPAGO_PUBLIC_KEY=TEST-...
MERCADOPAGO_WEBHOOK_SECRET=
EMAIL_ENABLED=false
```

Notas:

- `JWT_SECRET` debe ser largo, aleatorio y diferente al local.
- `DATABASE_URL` debe apuntar a la base QA, no a producción.
- En QA se recomiendan credenciales TEST de Mercado Pago.
- `EMAIL_ENABLED=false` evita depender de SMTP real durante QA.

## Neon PostgreSQL QA

1. Crear un proyecto Neon separado para QA.
2. Crear una base, por ejemplo `el_lider_qa`.
3. Copiar el connection string PostgreSQL.
4. Configurar ese valor como `DATABASE_URL` en Render.
5. Ejecutar migraciones con:

```bash
npm run prisma:deploy
npm run prisma:generate
```

Si se necesita un usuario admin inicial, ejecutar en Render Shell o local apuntando a QA:

```bash
npm run admin:create
```

con `ADMIN_EMAIL`, `ADMIN_NAME` y `ADMIN_PASSWORD` configurados temporalmente.

## Render backend QA

Crear un Web Service:

- Repository: repo del proyecto.
- Branch: `develop`.
- Root directory: `backend`.
- Build command:

```bash
npm install && npm run prisma:generate && npm run build && npm run prisma:deploy
```

- Start command:

```bash
npm run start
```

Validaciones post deploy:

- `https://URL_BACKEND_QA/api/health` debe responder HTTP 200.
- `https://URL_BACKEND_QA/api/docs` debe responder HTTP 200.
- Revisar logs de Render si Prisma no conecta o si faltan variables.

## Vercel frontend QA

Crear proyecto:

- Repository: repo del proyecto.
- Branch: `develop`.
- Root directory: `frontend`.
- Build command: `npm run build`.
- Output directory: `dist`.

Variables:

```env
VITE_API_URL=https://URL_BACKEND_QA/api
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-...
```

Después del deploy, abrir la home, catálogo y checkout para confirmar que el frontend llama al backend QA.

## CORS

Estado actual del backend: CORS está abierto con `app.use(cors())`.

Para QA esto desbloquea pruebas rápidas, pero antes de producción se recomienda restringir orígenes permitidos usando `FRONTEND_URL` o una lista explícita:

- `http://localhost:5173`
- `https://URL_FRONTEND_QA`
- `https://URL_FRONTEND_PROD`

No promover a producción con CORS abierto si la API va a quedar pública.

## Mercado Pago QA

Usar credenciales TEST:

- Backend: `MERCADOPAGO_ACCESS_TOKEN=TEST-...`
- Frontend: `VITE_MERCADOPAGO_PUBLIC_KEY=TEST-...`

URLs esperadas:

- Success: `https://URL_FRONTEND_QA/checkout/success`
- Pending: `https://URL_FRONTEND_QA/checkout/pending`
- Failure: `https://URL_FRONTEND_QA/checkout/failure`
- Webhook: `https://URL_BACKEND_QA/api/payments/mercadopago/webhook`

El webhook secret puede quedar vacío para pruebas controladas, pero en producción debe configurarse y validarse.

## Producción futura

Producción no debe publicarse hasta validar QA con el cliente.

Preparación recomendada:

- Crear base Neon separada, por ejemplo `el_lider_prod`.
- Crear servicios Vercel/Render separados de QA.
- Usar credenciales productivas de Mercado Pago.
- Usar `JWT_SECRET` productivo nuevo.
- Restringir CORS al dominio final.
- Configurar backups y política de recuperación de base.
- Definir dominio antes de compartir URL final.

Variables frontend producción:

```env
VITE_API_URL=https://URL_BACKEND_PROD/api
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-...
```

Variables backend producción:

```env
NODE_ENV=production
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=https://URL_FRONTEND_PROD
BACKEND_URL=https://URL_BACKEND_PROD
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
MERCADOPAGO_PUBLIC_KEY=APP_USR-...
MERCADOPAGO_WEBHOOK_SECRET=
EMAIL_ENABLED=false
```

## Mensaje sugerido para el cliente

Hola, te comparto la URL de prueba del ecommerce:

`URL_QA`

Es un ambiente de QA, es decir, una versión de prueba antes de publicar producción. Podés revisar la home, catálogo, búsqueda, productos, carrito, checkout, seguimiento de pedido, mi cuenta y las pantallas administrativas que correspondan.

Si encontrás algo para corregir, por favor enviame:

- captura de pantalla;
- dispositivo usado, por ejemplo celular o computadora;
- navegador, por ejemplo Chrome, Safari o Edge;
- pasos para reproducir el problema;
- qué esperabas que pasara.

La idea es validar esta versión primero y después avanzar a producción.
