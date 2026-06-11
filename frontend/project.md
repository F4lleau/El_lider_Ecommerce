# Proyecto: El Líder E-commerce

## Descripción

El Líder es una aplicación e-commerce full-stack para venta de productos de repostería, descartables, cotillón, envases y gastronomía.

El sistema permite navegación pública del catálogo, carrito público, checkout como invitado o usuario registrado, pagos online, retiro en sucursal, envío a domicilio, seguimiento de pedidos y administración privada de productos, categorías, precios, pedidos y contenido.

## Stack actual

- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL.
- Frontend: React, Vite, TypeScript, Tailwind, React Router, React Query.
- Documentación API: Swagger.
- Base de datos: PostgreSQL.
- ORM: Prisma.

## Roles

### Invitado

Puede navegar catálogo, agregar productos al carrito y comprar sin iniciar sesión.

### Usuario

Puede comprar, iniciar sesión, gestionar perfil, direcciones e historial de pedidos.

### Admin

Debe iniciar sesión para acceder al panel privado. Puede administrar productos, categorías, precios, pedidos, pagos, envíos, contenido y notificaciones.

## Objetivo MVP

Sacar una primera versión funcional que permita:

- Catálogo público.
- Carrito real.
- Checkout invitado.
- Checkout usuario registrado.
- Retiro en sucursal.
- Envío con costo discriminado.
- Pago con Mercado Pago.
- Seguimiento de pedido.
- Panel admin básico.
- ABM productos.
- ABM categorías.
- Gestión de pedidos.
- Swagger actualizado.
- Tests críticos.

## Principios

- Mobile first.
- Compra rápida.
- No obligar a registrarse para comprar.
- El backend siempre recalcula precios y totales.
- El frontend nunca es fuente final del precio.
- Las rutas admin siempre requieren rol admin.
- Las rutas de usuario siempre requieren autenticación.
- Las specs son la fuente de verdad antes de programar.