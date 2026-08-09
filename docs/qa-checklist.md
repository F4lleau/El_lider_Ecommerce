# Checklist QA

Usar este checklist sobre la URL QA antes de aprobar producción. Registrar cada error con captura, dispositivo, navegador, usuario usado y pasos para reproducir.

## Datos de prueba

- URL frontend QA: `https://URL_FRONTEND_QA`
- URL backend QA: `https://URL_BACKEND_QA`
- Swagger: `https://URL_BACKEND_QA/api/docs`
- Healthcheck: `https://URL_BACKEND_QA/api/health`
- Rama esperada: `develop`
- Base esperada: Neon QA, separada de producción.

## Público

- [ ] Home carga sin login.
- [ ] Header muestra marca, navegación, buscador, cuenta y carrito.
- [ ] Hero/home banner se ve correcto en desktop.
- [ ] Hero/home banner se ve correcto en mobile.
- [ ] Catálogo carga productos.
- [ ] Cards muestran precio, imagen, categoría y unidades disponibles.
- [ ] Categorías permiten navegar o filtrar productos.
- [ ] Búsqueda encuentra productos por nombre.
- [ ] Búsqueda muestra empty state si no hay resultados.
- [ ] Ofertas carga productos en oferta.
- [ ] Más vendidos/destacados carga correctamente.
- [ ] Footer muestra dirección, horario, Instagram, teléfono y email.

## Auth

- [ ] Login con credenciales válidas entra correctamente.
- [ ] Login con credenciales inválidas muestra error controlado.
- [ ] Registro crea usuario.
- [ ] Registro valida datos obligatorios.
- [ ] Recuperar contraseña responde mensaje genérico.
- [ ] Recuperar contraseña no revela si el email existe.
- [ ] Reset de contraseña permite ver/ocultar clave.
- [ ] Formularios de clave tienen botón de ojo para mostrar/ocultar.
- [ ] Logout cierra sesión y protege rutas privadas.

## Carrito

- [ ] Invitado agrega producto al carrito.
- [ ] Invitado incrementa y reduce cantidades.
- [ ] Invitado no supera stock disponible.
- [ ] Invitado elimina producto.
- [ ] Invitado vacía carrito.
- [ ] Usuario logueado agrega producto al carrito.
- [ ] Usuario logueado ve carrito persistente.
- [ ] Usuario logueado no supera stock disponible.
- [ ] Al agregar producto logueado, el stock disponible baja.
- [ ] Al eliminar producto logueado, el stock se libera.
- [ ] Al iniciar sesión, el carrito invitado se sincroniza.

## Checkout

- [ ] Checkout invitado CASH + PICKUP crea pedido confirmado.
- [ ] Checkout invitado CASH + SHIPPING crea pedido confirmado con datos de envío.
- [ ] Checkout invitado MERCADOPAGO + PICKUP crea orden pendiente de pago.
- [ ] Checkout invitado MERCADOPAGO + SHIPPING crea orden pendiente de pago.
- [ ] Checkout usuario CASH + PICKUP precarga datos del perfil.
- [ ] Checkout usuario CASH + SHIPPING precarga dirección por defecto.
- [ ] Usuario puede cambiar datos de quien recibe o retira.
- [ ] Usuario puede cambiar dirección de envío.
- [ ] Totales se recalculan desde backend.
- [ ] Costo de envío aparece solo cuando corresponde.
- [ ] Confirmación muestra número de orden y tracking.
- [ ] No se crea orden si el carrito está vacío.
- [ ] Error de stock se muestra de forma clara.

## Pagos

- [ ] Mercado Pago usa credenciales TEST en QA.
- [ ] Crear preferencia redirige a Mercado Pago.
- [ ] Resultado aprobado actualiza estado de pago.
- [ ] Resultado pendiente mantiene orden pendiente.
- [ ] Resultado rechazado/cancelado se informa correctamente.
- [ ] Webhook duplicado no duplica descuento ni emails.
- [ ] Swagger documenta endpoints de pagos.

## Tracking público

- [ ] Tracking por código muestra pedido existente.
- [ ] Tracking con código inexistente muestra error controlado.
- [ ] Tracking no expone datos sensibles.
- [ ] Estado de pedido se muestra en español.
- [ ] Método de entrega y pago se muestran en español.

## Mi cuenta

- [ ] Resumen carga datos del usuario.
- [ ] Perfil permite ver datos personales.
- [ ] Perfil guarda cambios permitidos.
- [ ] Direcciones muestra formulario directo si no hay direcciones.
- [ ] Direcciones permite agregar una dirección.
- [ ] Direcciones permite editar una dirección.
- [ ] Direcciones permite marcar dirección por defecto.
- [ ] Direcciones usa labels en español.
- [ ] Pedidos lista historial del usuario.
- [ ] Detalle de pedido muestra items, totales y tracking.
- [ ] Solicitudes de stock lista solicitudes propias.
- [ ] Usuario puede cancelar una solicitud pendiente.

## Admin

- [ ] Admin no es accesible sin login.
- [ ] Usuario no admin no puede entrar a `/admin`.
- [ ] Dashboard carga métricas.
- [ ] Productos lista catálogo.
- [ ] Productos permite crear producto con unidades disponibles.
- [ ] Productos permite editar producto.
- [ ] Productos permite cambiar stock.
- [ ] Productos permite cambiar precio.
- [ ] Productos permite activar/desactivar.
- [ ] Categorías lista categorías.
- [ ] Categorías permite crear, editar y desactivar.
- [ ] Pedidos lista órdenes.
- [ ] Pedidos permite cambiar estado válido.
- [ ] Cambio a listo para retirar funciona.
- [ ] Cambio a enviado funciona.
- [ ] Solicitudes de stock lista solicitudes.
- [ ] Solicitudes de stock permite cambiar estado.

## Responsive

- [ ] Home funciona en mobile chico.
- [ ] Catálogo mantiene grilla usable en mobile.
- [ ] Header mobile no tapa contenido.
- [ ] Menú mobile abre y cierra.
- [ ] Carrito es usable en mobile.
- [ ] Checkout es usable en mobile.
- [ ] Login y recuperación no generan scroll innecesario.
- [ ] Mi cuenta/direcciones es responsive.
- [ ] Admin es usable en desktop.

## Infra QA

- [ ] Frontend QA responde HTTP 200.
- [ ] Backend QA `/api/health` responde HTTP 200.
- [ ] Backend QA `/api/docs` responde HTTP 200.
- [ ] Frontend apunta a `VITE_API_URL` QA.
- [ ] Backend apunta a DB QA.
- [ ] QA no usa DB producción.
- [ ] Frontend no tiene secretos.
- [ ] Backend tiene `EMAIL_ENABLED=false` si no hay email real.
- [ ] Logs de Render no muestran secretos.

## Texto corto para pedir feedback

Te comparto la versión QA para probar:

`URL_QA`

Es una versión de prueba. Por favor revisá navegación, productos, carrito, checkout, seguimiento y las secciones de cuenta/admin que correspondan. Si encontrás algo, mandame captura, dispositivo, navegador y los pasos para reproducirlo.
