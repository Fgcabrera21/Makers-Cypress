/**
 * Mock API compatible con ReqRes.in para tests
 * https://reqres.in/api/
 * Permite ejecutar pruebas sin depender de la API externa (Cloudflare bloquea headless)
 */
const express = require('express');
const app = express();
const PORT = process.env.MOCK_API_PORT || 4545;

app.use(express.json());

// Datos base como ReqRes (usuarios 1-12)
const baseUsers = [
  { id: 1, email: 'george.bluth@reqres.in', first_name: 'George', last_name: 'Bluth', avatar: 'https://reqres.in/img/faces/1-image.jpg' },
  { id: 2, email: 'janet.weaver@reqres.in', first_name: 'Janet', last_name: 'Weaver', avatar: 'https://reqres.in/img/faces/2-image.jpg' },
  { id: 3, email: 'emma.wong@reqres.in', first_name: 'Emma', last_name: 'Wong', avatar: 'https://reqres.in/img/faces/3-image.jpg' },
  { id: 4, email: 'eve.holt@reqres.in', first_name: 'Eve', last_name: 'Holt', avatar: 'https://reqres.in/img/faces/4-image.jpg' },
  { id: 5, email: 'charles.morris@reqres.in', first_name: 'Charles', last_name: 'Morris', avatar: 'https://reqres.in/img/faces/5-image.jpg' },
  { id: 6, email: 'tracey.ramos@reqres.in', first_name: 'Tracey', last_name: 'Ramos', avatar: 'https://reqres.in/img/faces/6-image.jpg' },
];

// Usuarios creados via POST (persistencia en memoria)
let createdUsers = {};
let nextId = 1000;

// GET /api/users - listado paginado
app.get('/api/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 6;
  const start = (page - 1) * perPage;
  const paginated = baseUsers.slice(start, start + perPage);
  res.json({
    page,
    per_page: perPage,
    total: baseUsers.length,
    total_pages: Math.ceil(baseUsers.length / perPage),
    data: paginated
  });
});

// GET /api/users/:id
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (createdUsers[id]) {
    return res.json({ data: createdUsers[id] });
  }
  const user = baseUsers.find(u => u.id === id);
  if (user) {
    return res.json({ data: user });
  }
  return res.status(404).json({});
});

// POST /api/users
app.post('/api/users', (req, res) => {
  const { name = '', job = '' } = req.body || {};
  const id = nextId++;
  const [first_name, ...lastParts] = (name || 'Unknown').split(' ');
  const last_name = lastParts.join(' ') || 'User';
  const newUser = {
    id,
    email: `user${id}@reqres.in`,
    first_name,
    last_name,
    avatar: `https://reqres.in/img/faces/${id}-image.jpg`
  };
  createdUsers[id] = newUser;
  res.status(201).json({
    id,
    name: name || 'Unknown',
    job: job || 'Unknown',
    createdAt: new Date().toISOString()
  });
});

// PUT /api/users/:id
app.put('/api/users/:id', (req, res) => {
  const { name, job } = req.body || {};
  res.json({
    name: name || 'Updated',
    job: job || 'Updated',
    updatedAt: new Date().toISOString()
  });
});

// PATCH /api/users/:id
app.patch('/api/users/:id', (req, res) => {
  const { name, job } = req.body || {};
  res.json({
    name: name || 'Patched',
    job: job || 'Patched',
    updatedAt: new Date().toISOString()
  });
});

// DELETE /api/users/:id
app.delete('/api/users/:id', (req, res) => {
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Mock ReqRes API: http://localhost:${PORT}/api`);
});
