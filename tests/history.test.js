const request = require('supertest');
const app = require('../index'); // your Express app
const mongoose = require('mongoose');
const Response = require('../models/Response');

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DB_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /history', () => {
  beforeEach(async () => {
    await Response.deleteMany();
    await Response.create([
      { userId: 'user1', input: 'error A', output: 'fix A' },
      { userId: 'user1', input: 'error B', output: 'fix B' },
      { userId: 'user2', input: 'error X', output: 'fix X' },
    ]);
  });

  it('should fetch history for user1', async () => {
    const res = await request(app).get('/history?userId=user1');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].userId).toBe('user1');
  });

  it('should return limited results', async () => {
    const res = await request(app).get('/history?userId=user1&limit=1');
    expect(res.body.data.length).toBe(1);
  });
});
