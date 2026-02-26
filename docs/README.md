# Documentación - Makers Cypress

Índice de la documentación del proyecto.

## Documentos

| Documento | Contenido |
|-----------|-----------|
| [../README.md](../README.md) | Documentación principal: instalación, comandos, estructura, reportes |
| [MODULO-FUNCIONAL-MAKERSPAY.md](MODULO-FUNCIONAL-MAKERSPAY.md) | Módulo 2: MakersPay — escenarios, casos de prueba, bugs, técnicas |
| [MODULO-API.md](MODULO-API.md) | Módulo 3: API ReqRes.in — ubicaciones, requisitos, arquitectura |

## Resumen por módulo

### Módulo 1 - Smoke Login (SauceDemo)
- **Tests:** `cypress/e2e/smoke-login.cy.js`
- **Reportes PDF:** `test-results/pdf-reports/` (portada + captura por paso)
- **Comando:** `cy.step()` para documentar pasos con screenshot

### Módulo 2 - Funcional MakersPay (documentación)
- **Documento:** `docs/MODULO-FUNCIONAL-MAKERSPAY.md`
- **Contenido:** Escenarios, casos de prueba, reportes de bugs, técnicas y tipos de prueba para billetera digital MakersPay

### Módulo 3 - API ReqRes.in
- **Tests:** `cypress/e2e/api/reqres-users.cy.js`
- **Mock:** `server/mock-reqres.js` (puerto 4545)
- **Runner:** `scripts/run-api-tests.js`
- **Reportes PDF:** `test-results/pdf-reports/` (portada + request/response por petición)
- **Comando:** `cy.requestAndRecord()` para registrar peticiones en el PDF
