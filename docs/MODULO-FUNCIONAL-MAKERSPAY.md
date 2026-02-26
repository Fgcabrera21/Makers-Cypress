# Módulo Funcional - MakersPay

Documentación del proceso de testing para **MakersPay**, billetera digital ficticia (Prueba Técnica Makers).

## Producto

**MakersPay** es una billetera digital donde el usuario puede:

- Iniciar sesión
- Ver su saldo
- Enviar dinero a otro usuario usando su número de celular

### Requerimiento principal

> Un usuario autenticado puede enviar dinero a otro usuario registrado usando su número de celular.

### Reglas de negocio

| # | Regla |
|---|-------|
| 1 | Monto mínimo por transacción: **$5.000 COP** |
| 2 | Monto máximo por transacción: **$2.000.000 COP** |
| 3 | El usuario no puede enviar más dinero del saldo disponible |
| 4 | No se permiten envíos al mismo número de celular |
| 5 | Si la transacción es exitosa: se descuenta el saldo del remitente, se incrementa el del destinatario y se registra en el historial de ambos |
| 6 | Si la transacción falla: se muestra un mensaje de error claro y no se afecta el saldo |

---

## 1. Escenarios de prueba

### Escenario 1: Login
**Objetivo:** Validar el inicio de sesión en la aplicación.

| ID | Descripción |
|----|-------------|
| E1.1 | Usuario ingresa credenciales válidas y accede al saldo |
| E1.2 | Usuario ingresa credenciales inválidas y recibe mensaje de error |
| E1.3 | Usuario intenta acceder sin credenciales |

### Escenario 2: Consulta de saldo
**Objetivo:** Validar la visualización del saldo del usuario.

| ID | Descripción |
|----|-------------|
| E2.1 | Usuario autenticado ve su saldo actual correcto |
| E2.2 | Saldo se actualiza tras una transacción exitosa |
| E2.3 | Saldo se mantiene igual tras una transacción fallida |

### Escenario 3: Envío de dinero exitoso
**Objetivo:** Validar el flujo completo de transferencia correcta.

| ID | Descripción |
|----|-------------|
| E3.1 | Usuario envía monto válido a otro usuario registrado |
| E3.2 | Saldo del remitente disminuye correctamente |
| E3.3 | Saldo del destinatario aumenta correctamente |
| E3.4 | El movimiento aparece en el historial de ambos usuarios |

### Escenario 4: Envío de dinero fallido
**Objetivo:** Validar que las validaciones impidan transacciones inválidas.

| ID | Descripción |
|----|-------------|
| E4.1 | Usuario intenta enviar menos del mínimo ($5.000) |
| E4.2 | Usuario intenta enviar más del máximo ($2.000.000) |
| E4.3 | Usuario intenta enviar más de su saldo disponible |
| E4.4 | Usuario intenta enviar a su propio número |
| E4.5 | Usuario intenta enviar a número no registrado |
| E4.6 | Mensaje de error claro y saldo sin cambios |

---

## 2. Casos de prueba detallados

### CP-001: Login exitoso con credenciales válidas

| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Precondiciones** | Usuario registrado en MakersPay |
| **Datos de entrada** | Email y contraseña válidos |
| **Pasos** | 1. Ir a login. 2. Ingresar credenciales. 3. Clic en "Iniciar sesión". |
| **Resultado esperado** | Redirección a pantalla de saldo. Saldo visible. |
| **Criterios de aceptación** | Usuario autenticado, sesión activa |

---

### CP-002: Login fallido con credenciales inválidas

| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Precondiciones** | Aplicación en pantalla de login |
| **Datos de entrada** | Email o contraseña incorrectos |
| **Pasos** | 1. Ingresar credenciales inválidas. 2. Clic en "Iniciar sesión". |
| **Resultado esperado** | Mensaje "Credenciales incorrectas" o similar. Permanece en login. |
| **Criterios de aceptación** | No se crea sesión |

---

### CP-003: Envío exitoso - Monto dentro de límites

| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Precondiciones** | Remitente: saldo ≥ $50.000. Destinatario: número 3001234567 registrado. |
| **Datos de entrada** | Monto: $25.000. Número destino: 3001234567 |
| **Pasos** | 1. Login. 2. Ir a "Enviar dinero". 3. Ingresar número y monto. 4. Confirmar. |
| **Resultado esperado** | Mensaje "Transacción exitosa". Saldo remitente -$25.000. Saldo destinatario +$25.000. Historial actualizado. |
| **Criterios de aceptación** | Reglas 5 aplicadas correctamente |

---

### CP-004: Rechazo - Monto menor al mínimo

| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Precondiciones** | Usuario autenticado con saldo > $5.000 |
| **Datos de entrada** | Monto: $3.000. Número destino: 3009876543 |
| **Pasos** | 1. Ir a "Enviar dinero". 2. Ingresar monto $3.000. 3. Confirmar. |
| **Resultado esperado** | Mensaje "El monto mínimo es $5.000 COP". Saldo sin cambios. |
| **Criterios de aceptación** | Regla 1. No se ejecuta transacción |

---

### CP-005: Rechazo - Monto mayor al máximo

| Campo | Valor |
|-------|-------|
| **Prioridad** | Media |
| **Precondiciones** | Usuario autenticado |
| **Datos de entrada** | Monto: $2.500.000. Número destino: 3001112233 |
| **Pasos** | 1. Ir a "Enviar dinero". 2. Ingresar monto $2.500.000. 3. Confirmar. |
| **Resultado esperado** | Mensaje "El monto máximo es $2.000.000 COP". Saldo sin cambios. |
| **Criterios de aceptación** | Regla 2 |

---

### CP-006: Rechazo - Monto mayor al saldo disponible

| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Precondiciones** | Usuario con saldo $10.000 |
| **Datos de entrada** | Monto: $50.000. Número destino: 3004445566 |
| **Pasos** | 1. Ir a "Enviar dinero". 2. Ingresar monto $50.000. 3. Confirmar. |
| **Resultado esperado** | Mensaje "Saldo insuficiente". Saldo permanece $10.000. |
| **Criterios de aceptación** | Regla 3 |

---

### CP-007: Rechazo - Envío al propio número

| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Precondiciones** | Usuario autenticado con número 3007778899 |
| **Datos de entrada** | Monto: $10.000. Número destino: 3007778899 (propio) |
| **Pasos** | 1. Ir a "Enviar dinero". 2. Ingresar número propio. 3. Monto. 4. Confirmar. |
| **Resultado esperado** | Mensaje "No puede enviar dinero a su propio número". Saldo sin cambios. |
| **Criterios de aceptación** | Regla 4 |

---

### CP-008: Rechazo - Número destinatario no registrado

| Campo | Valor |
|-------|-------|
| **Prioridad** | Media |
| **Precondiciones** | Usuario autenticado |
| **Datos de entrada** | Monto: $20.000. Número: 3100000000 (no registrado) |
| **Pasos** | 1. Ir a "Enviar dinero". 2. Ingresar número no registrado. 3. Monto. 4. Confirmar. |
| **Resultado esperado** | Mensaje "El número ingresado no está registrado". Saldo sin cambios. |
| **Criterios de aceptación** | Regla 6 |

---

### CP-009: Historial de transacciones

| Campo | Valor |
|-------|-------|
| **Prioridad** | Media |
| **Precondiciones** | Usuario con al menos una transacción previa |
| **Datos de entrada** | N/A |
| **Pasos** | 1. Login. 2. Ir a "Historial". |
| **Resultado esperado** | Lista de movimientos: fecha, monto, tipo (envío/recepción), contraparte. |
| **Criterios de aceptación** | Regla 5 - historial consistente |

---

## 3. Reportes de bugs (ejemplos)

### BUG-001: Permite enviar monto menor al mínimo

| Campo | Valor |
|-------|-------|
| **Título** | La aplicación permite enviar $1.000 cuando el mínimo es $5.000 COP |
| **Severidad** | Alta |
| **Prioridad** | Alta |
| **Módulo** | Envío de dinero |
| **Precondiciones** | Usuario autenticado, saldo > $5.000 |
| **Pasos para reproducir** | 1. Ir a Enviar dinero. 2. Ingresar monto $1.000. 3. Ingresar número destino. 4. Confirmar. |
| **Resultado actual** | Transacción se ejecuta. Saldo se descuenta. |
| **Resultado esperado** | Mensaje "El monto mínimo es $5.000 COP". Transacción rechazada. |
| **Regla de negocio violada** | Monto mínimo $5.000 COP |

---

### BUG-002: Permite enviar al propio número

| Campo | Valor |
|-------|-------|
| **Título** | Usuario puede enviar dinero a su mismo número de celular |
| **Severidad** | Alta |
| **Prioridad** | Alta |
| **Módulo** | Envío de dinero |
| **Precondiciones** | Usuario con número 3001234567 |
| **Pasos para reproducir** | 1. Ir a Enviar dinero. 2. Destinatario: 3001234567. 3. Monto $10.000. 4. Confirmar. |
| **Resultado actual** | Transacción exitosa. Saldo no cambia (o se duplica inconsistente). |
| **Resultado esperado** | Mensaje "No puede enviar dinero a su propio número". Transacción rechazada. |
| **Regla de negocio violada** | No envíos al mismo número |

---

### BUG-003: Saldo se descuenta aunque transacción falle

| Campo | Valor |
|-------|-------|
| **Título** | Al fallar transacción (ej. número inválido), el saldo del remitente se descuenta |
| **Severidad** | Crítica |
| **Prioridad** | Crítica |
| **Módulo** | Envío de dinero |
| **Precondiciones** | Usuario con saldo $50.000 |
| **Pasos para reproducir** | 1. Enviar $20.000 a número no registrado. 2. Sistema muestra error. |
| **Resultado actual** | Saldo pasa a $30.000. Dinero "perdido". |
| **Resultado esperado** | Mensaje de error. Saldo permanece $50.000. |
| **Regla de negocio violada** | Si falla, no se afecta el saldo |

---

## 4. Técnicas de prueba aplicadas

| Técnica | Aplicación en MakersPay |
|---------|-------------------------|
| **Partición de equivalencia** | Montos: válidos (5.000 - 2.000.000), inválidos (< 5.000), inválidos (> 2.000.000) |
| **Valores límite** | $4.999, $5.000, $5.001 / $1.999.999, $2.000.000, $2.000.001 |
| **Casos de uso** | Flujos: login → ver saldo; login → enviar → ver historial |
| **Pruebas de estado** | Estados: no autenticado, autenticado, en transacción, post-transacción |
| **Pruebas exploratorias** | Navegación, mensajes de error, comportamiento con datos extremos |
| **Pruebas de regresión** | Tras cambios en validaciones, verificar que casos previos siguen funcionando |

---

## 5. Tipos de prueba recomendados

| Tipo | Alcance |
|------|---------|
| **Funcional** | Login, saldo, envío, validaciones de reglas de negocio |
| **No funcional - Usabilidad** | Claridad de mensajes de error, flujo intuitivo |
| **No funcional - Seguridad** | Autenticación, no bypass de validaciones |
| **Integración** | Saldo vs historial vs base de datos consistente |
| **Regresión** | Suite de casos críticos tras cada release |

---

## 6. Matriz de trazabilidad (resumen)

| Requisito / Regla | Casos de prueba | Tipo |
|-------------------|-----------------|------|
| Login | CP-001, CP-002 | Funcional |
| Ver saldo | CP-003, E2.x | Funcional |
| Enviar dinero (éxito) | CP-003 | Funcional |
| Monto mínimo $5.000 | CP-004, BUG-001 | Funcional / Límite |
| Monto máximo $2.000.000 | CP-005 | Funcional / Límite |
| Saldo insuficiente | CP-006 | Funcional |
| No envío a sí mismo | CP-007, BUG-002 | Funcional |
| Número no registrado | CP-008 | Funcional |
| Transacción fallida = saldo intacto | BUG-003 | Funcional / Integración |
| Historial | CP-009 | Funcional |
