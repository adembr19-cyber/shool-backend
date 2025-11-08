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

test('register and login', async ()=>{
  const server = request(app);
  const user = { name:'Test', email:'t@test', password:'secret123', role:'admin' };
  const r1 = await server.post('/api/auth/register').send(user);
  expect(r1.status).toBe(200);
  expect(r1.body.token).toBeTruthy();

  const r2 = await server.post('/api/auth/login').send({ email:user.email, password:user.password });
  expect(r2.status).toBe(200);
  expect(r2.body.token).toBeTruthy();
});
