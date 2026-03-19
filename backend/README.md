# Backend - Ecommerce Pastelería y Repostería

API REST modular, escalable y lista para producción, construida con Node.js, Express, TypeScript, Prisma y PostgreSQL (Neon cloud).

## Tecnologías principales

- **Node.js + Express 5** (ESM, modular)
- **TypeScript** (estricto, sin errores de compilación)
- **Prisma ORM v7** (adaptado a PostgreSQL cloud, migraciones y seeds)
- **PostgreSQL** (Neon cloud, conexión remota)
- **Zod** (validaciones de entrada)
- **JWT** (autenticación y rutas protegidas)
- **dotenv** (variables de entorno)
- **Swagger UI** (documentación interactiva en `/api/docs`)

## Estructura de carpetas

```txt
src/
  config/         # Configuración de entorno y DB
  lib/            # PrismaClient centralizado
  middlewares/    # Middlewares globales (auth, error, not-found)
  modules/        # Módulos por dominio (auth, users, categories, products, cart, orders, site-content)
    auth/
    users/
    categories/
    products/
    cart/
    orders/
    site-content/
  routes/         # Router principal
  types/          # Tipados extendidos
  utils/          # Helpers (api-error, async-handler, hash, jwt, slug)
  app.ts          # Configuración principal de Express
  server.ts       # Arranque del servidor
swagger.yaml      # Especificación OpenAPI/Swagger
```

## Modelos principales (Prisma)

- **User**: id, firstName, lastName, email, passwordHash, role, createdAt, updatedAt
- **Category**: id, name, slug, description, isActive, createdAt, updatedAt
- **Product**: id, name, slug, description, price, compareAtPrice, stock, isFeatured, isOffer, isNew, isActive, categoryId, createdAt, updatedAt
- **ProductImage**: id, productId, url, alt, isPrimary
- **Cart/CartItem**: carrito por usuario, items, cantidad, stock
- **Order/OrderItem**: checkout, dirección, items, total, estado
- **Address**: direcciones de usuario para órdenes
- **SiteContent**: contenido editable del sitio

## Endpoints principales

| Método | Ruta                           | Auth (Bearer) | Descripción                               |
| ------ | ------------------------------ | ------------- | ----------------------------------------- |
| GET    | /api/health                    | No            | Health check                              |
| POST   | /api/auth/register             | No            | Registro de usuario                       |
| POST   | /api/auth/login                | No            | Login, devuelve JWT                       |
| GET    | /api/users/me                  | Sí            | Perfil del usuario autenticado            |
| GET    | /api/categories                | No            | Listar categorías                         |
| GET    | /api/categories/:slug/products | No            | Productos de una categoría                |
| GET    | /api/products                  | No            | Listar productos                          |
| GET    | /api/products/:id              | No            | Detalle de producto                       |
| GET    | /api/products/featured         | No            | Productos destacados                      |
| GET    | /api/products/offers           | No            | Productos en oferta                       |
| GET    | /api/products/new              | No            | Productos nuevos                          |
| GET    | /api/site-content/:key         | No            | Contenido editable del sitio              |
| GET    | /api/cart                      | Sí            | Ver carrito propio                        |
| POST   | /api/cart/items                | Sí            | Agregar producto al carrito               |
| PATCH  | /api/cart/items/:itemId        | Sí            | Modificar cantidad de un item del carrito |
| DELETE | /api/cart/items/:itemId        | Sí            | Eliminar item del carrito                 |
| DELETE | /api/cart                      | Sí            | Vaciar carrito                            |
| GET    | /api/orders                    | Sí            | Listar órdenes propias                    |
| GET    | /api/orders/:id                | Sí            | Detalle de orden propia                   |
| POST   | /api/orders/checkout           | Sí            | Checkout y crear orden                    |

**Nota:** Para endpoints con `Auth (Bearer) = Sí`, enviar header: `Authorization: Bearer <token>`

## Respuestas JSON

**Éxito:**

```json
{
  "ok": true,
  "data": {}
}
```

**Error:**

```json
{
  "ok": false,
  "message": "Mensaje de error"
}
```

## Documentación interactiva (Swagger UI)

- Acceso: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- Archivo fuente: `backend/swagger.yaml`
- Permite probar todos los endpoints y ver contratos de request/response.

## Seguridad y buenas prácticas

- Autenticación JWT centralizada
- Manejo global de errores y validaciones Zod
- PrismaClient singleton (conexión eficiente)
- Arquitectura desacoplada por dominio (`routes/controller/service/schema`)
- Seeds automáticos para desarrollo/pruebas
- Listo para escalar y agregar features (pagos, admin, etc)

## Cómo empezar (backend y frontend)

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd el_lider
```

### 2. Instalar dependencias

- **Backend:**
  ```bash
  cd backend
  npm install
  ```
- **Frontend:**
  ```bash
  cd ../frontend
  npm install
  ```

### 3. Configurar variables de entorno

- Copiar `.env.example` a `.env` en `backend/` y completar con tu `DATABASE_URL` de Neon.

### 4. Preparar la base de datos (backend)

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

### 5. Levantar el backend

```bash
npm run dev
# Acceder a http://localhost:3000/api/docs para probar la API
```

### 6. Levantar el frontend

```bash
cd ../frontend
npm run dev
# Acceder a http://localhost:5173
```

---

## Cómo correr solo el backend

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Configurar variables de entorno (`.env`):
   - Usar ejemplo de `.env.example` y completar con tu DATABASE_URL de Neon.
3. Generar cliente Prisma:
   ```bash
   npm run prisma:generate
   ```
4. Ejecutar migraciones:
   ```bash
   npm run prisma:migrate
   ```
5. Cargar datos de prueba:
   ```bash
   npm run seed
   ```
6. Levantar servidor en desarrollo:
   ```bash
   npm run dev
   ```
7. Acceder a la doc interactiva:
   - [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Siguiente fase sugerida

- El backend está listo para conectar con el frontend (React, Next.js, etc).
- Si necesitas endpoints extra, integración de pagos, o panel admin, se puede agregar fácilmente.
