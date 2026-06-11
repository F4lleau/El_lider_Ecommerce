# Tasks: fix-encoding-and-project-baseline

## 1. Auditoría inicial

- [x] Revisar estructura de carpetas backend.
- [x] Revisar estructura de carpetas frontend.
- [x] Revisar `.env.example`.
- [x] Revisar `package.json` raíz si existe.
- [x] Revisar `backend/package.json`.
- [x] Revisar `frontend/package.json`.
- [x] Revisar Prisma schema.
- [x] Revisar seeds.
- [x] Revisar rutas backend actuales.
- [x] Revisar servicios frontend.
- [x] Revisar errores de consola.
- [x] Revisar documentación Swagger actual.

## 2. Encoding

- [x] Buscar textos con `Ã`.
- [x] Buscar textos con `Â`.
- [x] Buscar textos con caracteres rotos en frontend.
- [x] Buscar textos con caracteres rotos en backend.
- [x] Buscar textos con caracteres rotos en seeds.
- [x] Corregir textos hardcodeados. No aplica: no se encontraron en código fuente.
- [x] Corregir seed si contiene caracteres mal guardados. No aplica: no se encontraron en seeds.
- [x] Confirmar UTF-8 en archivos fuente.
- [x] Confirmar encoding correcto en respuestas API.
- [x] Confirmar encoding correcto en base de datos.

## 3. Validación backend

- [x] Instalar dependencias si es necesario.
- [x] Ejecutar backend.
- [x] Validar `/api/health`.
- [x] Validar `/api/docs`.
- [x] Validar endpoint de productos.
- [x] Validar endpoint de categorías.
- [x] Validar endpoint de auth si existe.
- [x] Validar conexión Prisma.
- [x] Validar seed.
- [x] Registrar errores encontrados.

## 4. Validación frontend

- [x] Instalar dependencias si es necesario.
- [x] Ejecutar frontend.
- [x] Validar home `/`.
- [x] Validar productos `/productos`.
- [x] Validar categorías `/productos/categorias`.
- [x] Validar ofertas `/productos/ofertas`.
- [x] Validar más vendidos `/productos/mas-vendidos`.
- [x] Validar login `/login`.
- [x] Validar registro `/registro`.
- [x] Validar carrito `/carrito`.
- [x] Revisar errores de consola.
- [x] Revisar errores de red.

## 5. Documentación del estado real

- [x] Crear resumen del estado real del backend.
- [x] Crear resumen del estado real del frontend.
- [x] Registrar endpoints existentes.
- [x] Registrar endpoints faltantes.
- [x] Registrar páginas conectadas a API.
- [x] Registrar páginas estáticas.
- [x] Registrar módulos incompletos.
- [x] Definir siguiente change a implementar.

## 6. Cierre del change

- [x] Confirmar que no quedan textos rotos.
- [x] Confirmar que backend levanta.
- [x] Confirmar que frontend levanta.
- [x] Confirmar que Swagger abre.
- [x] Confirmar que catálogo público funciona.
- [x] Marcar tareas completadas.
