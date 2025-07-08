/**
 * fix.test.js
 * 
 * Integration tests for the /fix route.
 * Covers:
 * - Successful AI fix generation
 * - Authenticated user context
 * - Error handling when OpenAI or DB fails
 */

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fixRouter = require('../src/routes/fix');
const Response = require('../src/models/Response');

// --- Mock authMiddleware to inject req.user ---
jest.mock('../src/middleware/authMiddleware', () => (req, res, next) => {
  req.user = { id: 'mock-user-id' };
  next();
});

// --- Mock OpenAI ---
jest.mock('../src/lib/openai', () => ({
  getOpenAIResponse: jest.fn().mockResolvedValue('Fixed code goes here')
}));

const app = express();
app.use(express.json());
app.use('/fix', fixRouter);

describe('/fix route', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Response.deleteMany();
  });

  it('returns a fixed version of input code and saves to DB', async () => {
    const res = await request(app)
      .post('/fix')
      .send({ input: 'function broken() {' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('input', 'function broken() {');
    expect(res.body).toHaveProperty('output', 'Fixed code goes here');

    // Validate DB save
    const saved = await Response.findOne({ userId: 'mock-user-id' });
    expect(saved).toBeTruthy();
    expect(saved.input).toBe('function broken() {');
    expect(saved.output).toBe('Fixed code goes here');
  });

  it('returns 500 if OpenAI or DB fails', async () => {
    const { getOpenAIResponse } = require('../src/lib/openai');
    getOpenAIResponse.mockRejectedValueOnce(new Error('OpenAI is down'));

    const res = await request(app)
      .post('/fix')
      .send({ input: 'broken code' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Failed to fix code');
  });
});
