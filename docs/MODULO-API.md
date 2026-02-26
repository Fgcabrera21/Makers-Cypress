# Módulo 3 - API ReqRes.in

Documentación del tercer módulo de la Prueba Técnica Makers: pruebas funcionales sobre la API compatible con https://reqres.in/api/

## Ubicación en el proyecto

| Elemento | Ruta |
|----------|------|
| Tests | `cypress/e2e/api/reqres-users.cy.js` |
| Mock API | `server/mock-reqres.js` |
| Runner (evita wmic) | `scripts/run-api-tests.js` |
| Comando `requestAndRecord` | `cypress/support/commands.js` |
| Task `recordApiStep` | `cypress/plugins/report-plugin.js` |
| Generador PDF (pasos API) | `cypress/utils/pdf-report-generator.js` |

## Alcance

Se usa un **mock local** (`server/mock-reqres.js`) que replica el contrato de ReqRes.in. Así se evita el bloqueo 403 de Cloudflare en entornos headless/CI. Los tests se ejecutan contra `http://localhost:4545/api`.

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

## Casos de prueba implementados

### Flujo principal
- POST /users - Crear usuario y verificar 201
- GET /users/{id} - Consultar usuario creado con ID del POST
- Flujo completo: POST 201 → extraer ID → GET 200 y validar name/job

### GET /users
- Listar usuarios página 1 (200)
- Paginación (page=2)
- Usuario existente /users/1 (200)
- Usuario inexistente /users/23 (404)

### POST /users
- Payload vacío - Validar manejo
- Campos personalizados

### PUT y PATCH
- PUT /users/2 - Actualización completa
- PATCH /users/2 - Actualización parcial

### DELETE
- DELETE /users/2 - Eliminación (204)

## Reportes del Módulo API

Cada test API genera un **PDF** en `test-results/pdf-reports/` con:

- Portada: "ReqRes.in API - Tests de Contrato", nombre del caso, estado
- Páginas por petición: método, URL, body enviado, código HTTP, respuesta JSON

El reporte HTML (Mochawesome) incluye todos los tests en `test-results/html-report/index.html`.

## Ejecución

```bash
# Solo API (recomendado) - inicia mock y ejecuta tests
npm run test:api

# Mock manual (en otra terminal)
npm run mock:api

# Suite completa (Smoke + API)
npm test
```

`npm run test:api` usa `scripts/run-api-tests.js` para iniciar el mock, esperar que esté listo y ejecutar Cypress. Al finalizar, cierra el mock correctamente (compatible con Windows 11, sin depender de wmic).

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│  npm run test:api                                                │
│  scripts/run-api-tests.js                                        │
└─────────────────────────┬───────────────────────────────────────┘
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
┌─────────────────────┐          ┌─────────────────────────────┐
│  server/            │          │  cypress run                 │
│  mock-reqres.js     │◄─────────│  cypress/e2e/api/            │
│  localhost:4545     │  HTTP    │  reqres-users.cy.js          │
└─────────────────────┘          └──────────────┬──────────────┘
                                               │
                                               │ cy.requestAndRecord()
                                               ▼
                                    ┌─────────────────────────────┐
                                    │  recordApiStep → PDF report │
                                    │  test-results/pdf-reports/  │
                                    └─────────────────────────────┘
```

## Uso del comando requestAndRecord

En lugar de `cy.request()` directo, usar `cy.requestAndRecord()` para que cada petición quede documentada en el PDF:

```javascript
cy.requestAndRecord('POST /users', {
  method: 'POST',
  url: `${API_BASE}/users`,
  body: { name: 'Test User', job: 'Automation Engineer' },
  failOnStatusCode: false
}).then((response) => {
  expect(response.status).to.eq(201);
  // ...
});
```
