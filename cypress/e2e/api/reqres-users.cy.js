/**
 * Módulo API - Pruebas funcionales ReqRes.in
 * Prueba Técnica Makers - Contrato https://reqres.in/api/
 *
 * Usa mock local (server/mock-reqres.js) para evitar 403 de Cloudflare.
 * Requisitos: POST 201, GET 200, name/job coinciden, casos adicionales.
 */
const MOCK_PORT = 4545;
const API_BASE = `http://localhost:${MOCK_PORT}/api`;

describe('Módulo API - ReqRes.in Users', () => {
  describe('Flujo principal: Crear usuario y consultarlo', () => {
    const userPayload = {
      name: 'Test User',
      job: 'Automation Engineer'
    };

    it('POST /users - Crear usuario y verificar 201', () => {
      cy.requestAndRecord('POST /users - Crear usuario', {
        method: 'POST',
        url: `${API_BASE}/users`,
        body: userPayload,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('name', userPayload.name);
        expect(response.body).to.have.property('job', userPayload.job);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('createdAt');
        cy.wrap(response.body.id).as('createdUserId');
        cy.wrap(response.body).as('createResponse');
      });
    });

    it('GET /users/{id} - Consultar usuario creado con ID del POST', () => {
      cy.requestAndRecord('POST /users', { method: 'POST', url: `${API_BASE}/users`, body: userPayload }).then((postRes) => {
        expect(postRes.status).to.eq(201);
        const userId = postRes.body.id;

        cy.requestAndRecord('GET /users/{id}', { method: 'GET', url: `${API_BASE}/users/${userId}` }).then((getRes) => {
          expect(getRes.status).to.eq(200);
          expect(getRes.body.data).to.exist;
          expect(getRes.body.data.id).to.eq(Number(userId) || userId);
          expect(getRes.body.data.first_name).to.eq('Test');
          expect(getRes.body.data.last_name).to.eq('User');
        });
      });
    });

    it('Flujo completo: POST 201 -> extraer ID -> GET 200 y validar name/job coinciden', () => {
      cy.requestAndRecord('POST /users', { method: 'POST', url: `${API_BASE}/users`, body: userPayload }).then((postRes) => {
        expect(postRes.status).to.eq(201);
        const createdId = postRes.body.id;
        expect(postRes.body.name).to.eq(userPayload.name);
        expect(postRes.body.job).to.eq(userPayload.job);

        cy.requestAndRecord('GET /users/{id}', { method: 'GET', url: `${API_BASE}/users/${createdId}` }).then((getRes) => {
          expect(getRes.status).to.eq(200);
          expect(getRes.body.data.first_name).to.eq('Test');
          expect(getRes.body.data.last_name).to.eq('User');
        });
      });
    });
  });

  describe('Casos adicionales - GET /users', () => {
    it('GET /users - Listar usuarios página 1 (200)', () => {
      cy.requestAndRecord('GET /users?page=1', { method: 'GET', url: `${API_BASE}/users?page=1` }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('page', 1);
        expect(res.body).to.have.property('per_page');
        expect(res.body).to.have.property('total');
        expect(res.body).to.have.property('data').that.is.an('array');
        expect(res.body.data.length).to.be.greaterThan(0);
      });
    });

    it('GET /users?page=2 - Paginación', () => {
      cy.requestAndRecord('GET /users?page=2', { method: 'GET', url: `${API_BASE}/users?page=2` }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.page).to.eq(2);
      });
    });

    it('GET /users/1 - Usuario existente (200)', () => {
      cy.requestAndRecord('GET /users/1', { method: 'GET', url: `${API_BASE}/users/1` }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.have.property('id', 1);
        expect(res.body.data).to.have.property('email');
      });
    });

    it('GET /users/23 - Usuario inexistente (404)', () => {
      cy.requestAndRecord('GET /users/23 - 404', {
        method: 'GET',
        url: `${API_BASE}/users/23`,
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
  });

  describe('Casos adicionales - POST /users', () => {
    it('POST con payload vacío - Validar manejo', () => {
      cy.requestAndRecord('POST /users vacío', {
        method: 'POST',
        url: `${API_BASE}/users`,
        body: {},
        failOnStatusCode: false
      }).then((res) => {
        expect([201, 400]).to.include(res.status);
        if (res.status === 201) {
          expect(res.body).to.have.property('id');
        }
      });
    });

    it('POST con campos personalizados', () => {
      const customUser = { name: 'Automation QA', job: 'QA Engineer' };
      cy.requestAndRecord('POST /users personalizado', { method: 'POST', url: `${API_BASE}/users`, body: customUser }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.name).to.eq(customUser.name);
        expect(res.body.job).to.eq(customUser.job);
      });
    });
  });

  describe('Casos adicionales - PUT y PATCH', () => {
    it('PUT /users/2 - Actualizar usuario completo', () => {
      cy.requestAndRecord('PUT /users/2', {
        method: 'PUT',
        url: `${API_BASE}/users/2`,
        body: { name: 'Updated User', job: 'Senior Engineer' },
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.name).to.eq('Updated User');
        expect(res.body.job).to.eq('Senior Engineer');
        expect(res.body).to.have.property('updatedAt');
      });
    });

    it('PATCH /users/2 - Actualización parcial', () => {
      cy.requestAndRecord('PATCH /users/2', {
        method: 'PATCH',
        url: `${API_BASE}/users/2`,
        body: { job: 'Tech Lead' },
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.job).to.eq('Tech Lead');
      });
    });
  });

  describe('DELETE', () => {
    it('DELETE /users/2 - Eliminar usuario (204)', () => {
      cy.requestAndRecord('DELETE /users/2', {
        method: 'DELETE',
        url: `${API_BASE}/users/2`,
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(204);
      });
    });
  });
});
