# Makers - Prueba Técnica Cypress

Proyecto de pruebas E2E y API para la Prueba Técnica Makers.

| Módulo | Descripción | Ubicación principal |
|--------|-------------|---------------------|
| **Módulo 1** | Smoke Test Login (SauceDemo) | `cypress/e2e/smoke-login.cy.js` |
| **Módulo 2** | Funcional - MakersPay (documentación) | `docs/MODULO-FUNCIONAL-MAKERSPAY.md` |
| **Módulo 3** | API Tests (ReqRes.in) | `cypress/e2e/api/reqres-users.cy.js` |

Incluye sistema de reportería: PDF por test, HTML (Mochawesome), capturas y videos.

## Requisitos

- Node.js 18+
- npm
- Chrome o Edge

## Instalación

```bash
npm install
```

## Ejecutar pruebas

```bash
# Suite completa (Smoke + API) - inicia mock automáticamente
npm test

# Solo Módulo 1 - Smoke Login (SauceDemo)
npm run test:smoke

# Solo Módulo 2 - API ReqRes
npm run test:api

# Modo interactivo (Cypress UI)
npm run test:open

# Mock API manual (otra terminal) - útil para debug
npm run mock:api
```

## Sistema de reportería

Tras cada ejecución se generan:

### 1. Reportes PDF (por cada test)

**Ubicación:** `test-results/pdf-reports/`

Cada test genera un PDF independiente:

- **Módulo 1 (Smoke):** Portada + página por paso con captura de pantalla
- **Módulo 3 (API):** Portada + página por petición con método, URL, body y respuesta JSON

### 2. Reporte HTML (Mochawesome)

**Ubicación:** `test-results/html-report/index.html`

Abrir en el navegador para ver resumen, gráficos, capturas y videos.

### 3. Capturas y videos

| Contenido | Ubicación |
|-----------|-----------|
| Capturas por paso (Smoke) | `test-results/step-screenshots/` |
| Videos de ejecución | `cypress/videos/` |

## Estructura del proyecto

```
Makers Cypress/
├── cypress/
│   ├── e2e/
│   │   ├── smoke-login.cy.js      # Módulo 1: Smoke Login (3 tests)
│   │   └── api/
│   │       └── reqres-users.cy.js # Módulo 3: API ReqRes (12 tests)
│   ├── page-objects/              # POM para SauceDemo
│   ├── fixtures/
│   │   └── credentials.js         # Credenciales públicas SauceDemo
│   ├── plugins/
│   │   └── report-plugin.js       # Generador PDF + tasks recordStep/recordApiStep
│   ├── utils/
│   │   └── pdf-report-generator.js
│   └── support/
│       ├── commands.js            # cy.step(), cy.requestAndRecord(), cy.login()
│       └── e2e.js
├── server/
│   └── mock-reqres.js             # Mock API ReqRes (puerto 4545)
├── scripts/
│   └── run-api-tests.js           # Runner API (evita wmic en Windows 11)
├── docs/
│   ├── MODULO-FUNCIONAL-MAKERSPAY.md  # Módulo 2: Escenarios, casos, bugs, técnicas
│   └── MODULO-API.md              # Módulo 3: API ReqRes
├── test-results/                  # Generado al ejecutar
│   ├── pdf-reports/
│   ├── html-report/
│   └── step-screenshots/
├── cypress.config.js
└── package.json
```

## Documentación adicional

- **[docs/MODULO-FUNCIONAL-MAKERSPAY.md](docs/MODULO-FUNCIONAL-MAKERSPAY.md)** — Módulo 2: MakersPay (billetera digital). Escenarios, casos de prueba, reportes de bugs, técnicas y tipos de prueba.
- **[docs/MODULO-API.md](docs/MODULO-API.md)** — Módulo 3: API ReqRes, ubicación de archivos, requisitos y casos de prueba.

## Tests incluidos

### Módulo 1 - Smoke Login (3 tests)
1. Login exitoso con credenciales válidas
2. Login fallido con contraseña incorrecta
3. Validación de campos obligatorios

### Módulo 2 - Funcional MakersPay (documentación)
Escenarios de prueba, casos de prueba, reportes de bugs de ejemplo, técnicas y tipos de prueba para la billetera digital MakersPay. Ver `docs/MODULO-FUNCIONAL-MAKERSPAY.md`.

### Módulo 3 - API ReqRes (12 tests)
- Flujo principal: POST crear usuario, GET consultar, validación name/job
- Casos GET: listado, paginación, 200, 404
- Casos POST: payload vacío, campos personalizados
- PUT y PATCH: actualización completa y parcial
- DELETE: 204

## Comandos para documentar pasos

**Módulo 1 (E2E con UI):**
```javascript
cy.step('nombre_paso', 'Descripción legible para no-QA');
```

**Módulo 3 (API):**
```javascript
cy.requestAndRecord('POST /users', { method: 'POST', url: '...', body: {...} });
```
