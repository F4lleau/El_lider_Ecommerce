# Change: add-role-based-auth

## Summary

Implementar autenticación real basada en JWT con roles `admin` y `user`, protegiendo rutas privadas del usuario y rutas administrativas.

## Motivation

El e-commerce necesita diferenciar tres niveles de acceso:

- Visitante/invitado: puede navegar catálogo, usar carrito y comprar sin login.
- Usuario registrado: puede iniciar sesión, comprar, gestionar perfil e historial de pedidos.
- Admin: debe iniciar sesión para administrar productos, categorías, precios, pedidos, pagos y envíos.

Antes de conectar carrito, checkout, perfil de usuario y panel admin, es necesario dejar resuelta la autenticación y autorización.

## Scope

Este cambio incluye:

- Registro real de usuarios.
- Login real.
- JWT con información mínima del usuario.
- Rol `user`.
- Rol `admin`.
- Middleware backend de autenticación.
- Middleware backend de autorización por rol.
- Endpoint `GET /api/auth/me`.
- Protección de rutas privadas frontend.
- Protección de rutas admin frontend.
- Seed o script para crear admin inicial.
- Documentación Swagger de endpoints de auth.
- Tests mínimos de autenticación y autorización.

## Out of Scope

Este cambio no incluye:

- Carrito real.
- Checkout.
- Mercado Pago.
- Perfil completo de usuario.
- Panel admin completo.
- ABM de productos.
- ABM de categorías.
- Recuperación de contraseña.

## Acceptance Criteria

- Un visitante puede navegar catálogo sin login.
- Un usuario puede registrarse con rol `user`.
- Un usuario puede iniciar sesión.
- Un admin puede iniciar sesión.
- El token incluye el rol del usuario.
- El endpoint `/api/auth/me` devuelve el usuario autenticado.
- Una ruta privada rechaza usuarios sin token.
- Una ruta admin rechaza usuarios sin rol `admin`.
- Un usuario común no puede acceder a rutas admin.
- Un admin puede acceder a rutas admin.
- Swagger documenta registro, login y me.
- Existen tests mínimos para registro, login y roles.