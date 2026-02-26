# Makers - Prueba Técnica Cypress

Proyecto de pruebas para la Prueba Técnica Makers:
- **Módulo 1:** Smoke Test Login (SauceDemo)
- **Módulo 2:** API Tests (ReqRes.in)

Con sistema de reportería: PDF, HTML, capturas por paso.

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

# Solo Smoke Login
npm run test:smoke

# Solo API (ReqRes)
npm run test:api
```

## Sistema de reportería

Tras cada ejecución se generan:

### 1. Reportes PDF (por cada test)
- **Ubicación:** `test-results/pdf-reports/`
- Cada test genera un PDF con:
  - Portada con nombre del caso, estado (PASSED/FAILED), duración
  - Una página por paso con:
    - Título del paso
    - Descripción legible (para perfiles no QA)
    - Captura de pantalla del estado de la app

### 2. Reporte HTML (Mochawesome)
- **Ubicación:** `test-results/html-report/index.html`
- Abrir en el navegador para ver:
  - Resumen de pruebas
  - Capturas de cada paso
  - Videos de la ejecución

### 3. Capturas y videos
- **Capturas por paso:** `test-results/step-screenshots/`
- **Videos:** `cypress/videos/`

## Tests incluidos

1. **Login exitoso con credenciales válidas**
2. **Login fallido con contraseña incorrecta**
3. **Validación de campos obligatorios**

## Documentar nuevos pasos

Usa el comando `cy.step()` en los tests:

```javascript
cy.step('nombre_paso', 'Descripción legible para no-QA de lo que se hizo');
```

## Estructura del proyecto

```
Makers Cypress/
├── cypress/
│   ├── e2e/
│   │   └── smoke-login.cy.js    # Tests con cy.step()
│   ├── page-objects/
│   ├── fixtures/
│   │   └── credentials.js
│   ├── plugins/
│   │   └── report-plugin.js     # Generador de PDFs
│   ├── utils/
│   │   └── pdf-report-generator.js
│   └── support/
├── test-results/                 # Generado al ejecutar
│   ├── pdf-reports/             # PDFs por test
│   ├── html-report/             # Reporte HTML
│   └── step-screenshots/        # Fotos de cada paso
└── cypress.config.js
```
