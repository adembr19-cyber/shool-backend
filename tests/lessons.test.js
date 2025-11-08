const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let app;
let mongod;

beforeAll(async ()=>{
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  app = require('../src/app');
  await require('../src/config/db')();
});

afterAll(async ()=>{
  await mongoose.disconnect();
  await mongod.stop();
});

test('create and list lessons', async ()=>{
  const server = request(app);
  // create admin user
  await server.post('/api/auth/register').send({ name:'T', email:'a@a', password:'secret', role:'admin' });
  const login = await server.post('/api/auth/login').send({ email:'a@a', password:'secret' });
  const token = login.body.token;
  const lesson = { title:'L1', datetime: new Date().toISOString() };
  const r = await server.post('/api/lessons').set('Authorization', `Bearer ${token}`).send(lesson);
  expect(r.status).toBe(201);
  const list = await server.get('/api/lessons').set('Authorization', `Bearer ${token}`);
  expect(list.status).toBe(200);
  expect(list.body.data.length).toBeGreaterThanOrEqual(1);
});
