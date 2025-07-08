const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fixRouter = require('../src/routes/fix');
const Response = require('../src/models/Response');

// Mock auth middleware
jest.mock('../src/middleware/authMiddleware', () => (req, res, next) => {
  req.user = { id: 'mock-user-id' };
  next();
});

// Mock the correct AI service function your route uses
jest.mock('../src/services/openaiService', () => ({
  sendPrompt: jest.fn().mockResolvedValue('Fixed code goes here'),
}));

const app = express();
app.use(express.json());
app.use('/fix', fixRouter);

describe('/fix route', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Response.deleteMany();
  });

  it('returns fixedCode and saves record to DB', async () => {
    const res = await request(app)
      .post('/fix')
      .send({ codeSnippet: 'function broken() {' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('fixedCode', 'Fixed code goes here');

    // Validate DB save if your route saves to DB, else skip this
    const saved = await Response.findOne({ userId: 'mock-user-id' });
    expect(saved).toBeTruthy();
    expect(saved.input).toBe('function broken() {');
    expect(saved.output).toBe('Fixed code goes here');
  });

  it('returns 500 if AI or DB fails', async () => {
    const { sendPrompt } = require('../src/services/openaiService');
    sendPrompt.mockRejectedValueOnce(new Error('OpenAI failure'));

    const res = await request(app)
      .post('/fix')
      .send({ codeSnippet: 'broken code' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Failed to generate fixed code');
  });
});
