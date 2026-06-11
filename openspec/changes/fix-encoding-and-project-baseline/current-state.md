# Current State: El Líder E-commerce

## Fecha

Validación ejecutada el 8 de junio de 2026 para el change `fix-encoding-and-project-baseline`.

## Resultado general

Backend y frontend levantan correctamente. Swagger, healthcheck y catálogo público responden. Las ocho rutas frontend solicitadas renderizan mediante Chrome headless sin errores de API visibles ni errores de red registrados.

No se encontraron textos con encoding roto en frontend, backend, seeds ni schema. Las coincidencias restantes son ejemplos intencionales dentro de la documentación OpenSpec.

El backend compila correctamente. El frontend también compila después de corregir dos imports de tipo de producto. El lint del frontend mantiene 15 errores preexistentes que deben resolverse en un change separado.

## Backend

### Estado validado

- Express levanta en `http://localhost:3000`.
- Prisma conecta con PostgreSQL al iniciar.
- `GET /api/health` responde `200`.
- Swagger abre en `GET /api/docs`.
- Los endpoints públicos de productos y categorías responden `200`.
- Auth existe: login y registro responden validación `400` ante cuerpos vacíos.
- Usuarios, carrito y órdenes existen y responden `401` sin token.
- `GET /api/site-content/home` responde `404` porque no existe contenido publicado con esa key.

### Endpoints existentes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/categories`
- `GET /api/categories/:slug/products`
- `GET /api/products`
- `GET /api/products/featured`
- `GET /api/products/offers`
- `GET /api/products/new`
- `GET /api/products/:id`
- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:itemId`
- `DELETE /api/cart/items/:itemId`
- `DELETE /api/cart`
- `POST /api/orders/checkout`
- `GET /api/orders`
- `GET /api/orders/:id`
- `GET /api/site-content/:key`

### Endpoints o módulos faltantes

- CRUD administrativo de productos y categorías.
- Gestión directa de direcciones del usuario.
- Panel y endpoints administrativos.
- Integración y webhooks de pagos.
- Gestión administrativa de contenido editable.
- Swagger no documenta las variantes `featured`, `offers`, `new` ni `site-content`.

## Frontend

### Estado validado

- Vite levanta en `http://localhost:5173`.
- `/`, `/productos`, `/productos/categorias`, `/productos/ofertas`, `/productos/mas-vendidos`, `/login`, `/registro` y `/carrito` responden `200` y renderizan.
- Chrome headless no registró errores de red ni mostró errores de API en las rutas validadas.
- `npm run build` finaliza correctamente.
- `npm run lint` reporta 15 errores preexistentes.

### Páginas conectadas a API

- `/`: consume productos destacados y ofertas.
- `/productos`: consume el listado de productos.
- `/productos/categorias`: reutiliza el listado de productos agrupado por categoría.
- `/productos/ofertas`: consume productos en oferta.
- `/productos/mas-vendidos`: consume productos destacados.

### Páginas estáticas o incompletas

- `/login`: formulario visual sin conexión a auth.
- `/registro`: formulario visual sin conexión a auth.
- `/carrito`: muestra un estado vacío fijo y no consume el carrito real.
- Los botones de agregar al carrito no reciben una acción.
- `/nosotros`, `/nosotros/direccion` y `/nosotros/contacto`: contenido estático.
- Existen servicios y módulos frontend duplicados o placeholder para auth, carrito, órdenes y contenido.

## Errores y deuda técnica

- El lint del frontend reporta 15 errores en router, componentes UI y hooks.
- Auth, carrito y órdenes están implementados en backend, pero no conectados a las páginas principales.
- `site-content` existe en backend, pero no tiene contenido `home` publicado y no se usa desde las páginas actuales.
- Swagger está incompleto respecto de las rutas implementadas.

## Próximo change recomendado

`connect-frontend-auth-and-cart`

El siguiente paso recomendado es conectar login y registro con auth real, persistir la sesión, proteger flujos autenticados y conectar los botones y la página de carrito con los endpoints existentes. La limpieza de lint puede incluirse como tarea inicial de ese change o resolverse en uno técnico separado.
