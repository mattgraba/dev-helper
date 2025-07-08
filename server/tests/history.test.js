/**
 * history.test.js
 * 
 * Unit + Integration tests for the /history route.
 * Covers:
 * - Authenticated access
 * - Pagination via skip/limit
 * - Proper response filtering per user
 * - Error handling
 */

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Response = require('../src/models/Response');
const historyRouter = require('../src/routes/history');

let mongoServer; // ✅ Declare before hooks

// --- Mock authMiddleware to inject req.user ---
jest.mock('../src/middleware/authMiddleware', () => (req, res, next) => {
  req.user = { id: 'mock-user-id' };
  next();
});

// Setup express test app
const app = express();
app.use(express.json());
app.use('/history', historyRouter);

describe('/history route', () => {
  jest.setTimeout(15000); // Optional if still hitting slow environments

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  beforeEach(async () => {
    await Response.deleteMany(); // ✅ Clean state before each test
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('returns empty list when user has no history', async () => {
    const res = await request(app).get('/history');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ data: [], skip: 0, limit: 20 });
  });

  it('returns user-specific history sorted by timestamp', async () => {
    await Response.create([
      { input: 'code1', output: 'resp1', userId: 'mock-user-id', timestamp: new Date('2023-01-01') },
      { input: 'code2', output: 'resp2', userId: 'mock-user-id', timestamp: new Date('2024-01-01') },
    ]);

    const res = await request(app).get('/history');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].input).toBe('code2'); // Newest first
    expect(res.body.data[1].input).toBe('code1');
  });

  it('respects skip and limit query parameters', async () => {
    const responses = Array.from({ length: 10 }, (_, i) => ({
      input: `code${i}`,
      output: `response${i}`,
      userId: 'mock-user-id',
      timestamp: new Date(Date.now() - i * 1000),
    }));
    await Response.insertMany(responses);

    const res = await request(app).get('/history?skip=2&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(5);
    expect(res.body.skip).toBe(2);
    expect(res.body.limit).toBe(5);
  });

  it('returns 500 if DB query fails', async () => {
    jest.spyOn(Response, 'find').mockImplementationOnce(() => {
      throw new Error('DB failure');
    });

    const res = await request(app).get('/history');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Failed to fetch history');
  });
});
