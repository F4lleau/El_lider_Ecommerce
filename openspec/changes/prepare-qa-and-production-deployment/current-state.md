# Current State: prepare-qa-and-production-deployment

Fecha de actualización: 2026-08-09

## Resumen

Se preparó la documentación necesaria para publicar un ambiente QA de El Líder y dejar claro el camino a producción. No se hizo deploy real ni se implementaron nuevas features.

Archivos creados:

- `docs/deployment-guide.md`
- `docs/qa-checklist.md`

Archivos actualizados:

- `openspec/changes/prepare-qa-and-production-deployment/tasks.md`
- `frontend/tests/user-private-profile.test.ts`

## Diagnóstico confirmado

- Rama local: `develop`.
- Commit local verificado: `5347e76`.
- Commit informado en el pedido: `8221858`.
- Estado Git antes de documentar: solo estaba sin trackear el directorio OpenSpec de este change.
- Backend: Node/Express/TypeScript.
- Frontend: React/Vite/TypeScript.
- Base: Prisma/PostgreSQL.
- Swagger local: `/api/docs`.
- Healthcheck local: `/api/health`.

## Scripts confirmados

Backend:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm test`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:deploy`
- `npm run seed`
- `npm run admin:create`

Frontend:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm run test:cart`

Además, los tests frontend existentes se ejecutaron con:

```bash
npx tsx --test tests\cart.test.ts tests\order-labels.test.ts tests\password-recovery.test.ts tests\user-private-profile.test.ts
```

## Variables y seguridad

- `backend/.env.example` existe.
- `frontend/.env.example` existe.
- `backend/.env` y `frontend/.env` existen localmente, pero no están trackeados.
- `backend/.gitignore` ignora `.env` y `.env.*`, excepto `.env.example`.
- `frontend/.gitignore` ignora `.env` y `.env.*`, excepto `.env.example`.
- No se detectaron `.env` trackeados.
- Se documentó que el frontend nunca debe llevar `DATABASE_URL`, `JWT_SECRET`, `MERCADOPAGO_ACCESS_TOKEN` ni `SMTP_PASS`.

## CORS

Estado actual: el backend usa `app.use(cors())`, por lo tanto CORS está abierto.

Para QA esto permite una prueba rápida, pero antes de producción se recomienda restringir orígenes por `FRONTEND_URL` o lista explícita.

## Validaciones ejecutadas

- Backend build: OK.
- Frontend build: OK.
- Backend tests críticos: OK, 46 tests pasados.
- Frontend tests existentes: OK, 14 tests pasados.
- Healthcheck local `http://localhost:3000/api/health`: HTTP 200.
- Swagger local `http://localhost:3000/api/docs`: HTTP 200.

Notas de validación:

- El build frontend mostró aviso de Browserslist/caniuse-lite desactualizado. No bloquea build.
- Los tests backend mostraron warnings de SSL mode de `pg` y una deprecación de `client.query()` en ejecución concurrente. No bloquearon la suite.
- El primer intento de tests falló por restricción de sandbox `EPERM`; se repitió con permisos elevados y pasó.
- Se ajustó un test frontend para aceptar `Dirección principal` con tilde, alineado con la UI en español.

## Documentación generada

`docs/deployment-guide.md` incluye:

- ambiente local;
- ambiente QA;
- ambiente producción;
- Vercel frontend QA;
- Render backend QA;
- Neon DB QA;
- variables frontend QA;
- variables backend QA;
- migraciones Prisma en QA;
- CORS;
- Mercado Pago QA;
- producción futura;
- texto sugerido para enviar al cliente.

`docs/qa-checklist.md` incluye checklist para:

- home;
- catálogo;
- categorías;
- búsqueda;
- ofertas;
- login;
- registro;
- recuperar contraseña;
- carrito invitado;
- carrito usuario;
- checkout efectivo/retiro;
- checkout efectivo/envío;
- checkout Mercado Pago/retiro;
- checkout Mercado Pago/envío;
- tracking público;
- mi cuenta;
- perfil;
- direcciones;
- pedidos;
- solicitudes de stock;
- admin productos;
- admin categorías;
- admin pedidos;
- admin solicitudes de stock;
- responsive mobile.

## Pendientes fuera de este change

- Crear proyectos reales en Vercel, Render y Neon.
- Cargar variables reales de QA en cada plataforma.
- Ejecutar migraciones en Neon QA.
- Crear usuario admin QA si corresponde.
- Configurar credenciales TEST reales de Mercado Pago.
- Compartir URL QA con el cliente.
- Hacer validación manual completa de login, checkout y admin en la URL QA.
- Restringir CORS antes de producción.
- No publicar producción hasta cerrar QA y correcciones del cliente.
