# Módulo API - ReqRes.in

## Alcance

Pruebas funcionales para la API compatible con https://reqres.in/api/ según la Prueba Técnica Makers.

**Implementación profesional:** Se usa un mock local (`server/mock-reqres.js`) que replica el contrato de ReqRes, evitando bloqueos por Cloudflare (403) en entornos headless/CI.

## Requisitos cumplidos

| # | Requisito | Estado |
|---|-----------|--------|
| 1 | POST /users con `{"name": "Test User", "job": "Automation Engineer"}` | ✅ |
| 2 | Verificar código HTTP 201 en POST | ✅ |
| 3 | Extraer ID del usuario creado de la respuesta | ✅ |
| 4 | GET /users/{id} con el ID extraído | ✅ |
| 5 | Verificar código HTTP 200 en GET | ✅ |
| 6 | Verificar que nombre y trabajo coincidan con el POST | ✅ |
| 7 | Casos de prueba adicionales | ✅ |

## Casos adicionales implementados

- **GET /users** - Listado paginado (page=1, page=2)
- **GET /users/1** - Usuario existente (200)
- **GET /users/23** - Usuario inexistente (404)
- **POST** con payload vacío y con campos personalizados
- **PUT /users/2** - Actualización completa
- **PATCH /users/2** - Actualización parcial
- **DELETE /users/2** - Eliminación (204)

## Arquitectura

```
server/mock-reqres.js   → Mock Express que replica ReqRes
cypress/e2e/api/        → Tests contra localhost:4545
```

## Ejecución

```bash
# Todos los tests (Smoke + API) - inicia mock automáticamente
npm test

# Solo API (con mock)
npm run test:api

# Solo Smoke (sin mock)
npm run test:smoke

# Iniciar mock manualmente (otra terminal)
npm run mock:api
```
