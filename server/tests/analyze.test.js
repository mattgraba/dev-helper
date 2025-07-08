/**
 * analyze.test.js
 * 
 * Unit + Integration tests for the /analyze route.
 * Covers validation, OpenAI integration mock, DB save mock,
 * and response correctness.
 */

const request = require('supertest');
const express = require('express');
const analyzeRouter = require('../src/routes/analyze');
const Response = require('../src/models/Response');
const extractExplanationAndFix = require('../src/utils/extractExplanationAndFix');

// Mock OpenAI Service module
jest.mock('../src/services/openaiService', () => ({
  getAIResponse: jest.fn(),
}));

// Mock extractExplanationAndFix utility
jest.mock('../src/utils/extractExplanationAndFix', () => jest.fn());

const { getAIResponse } = require('../src/services/openaiService');

const app = express();
app.use(express.json());
app.use('/analyze', analyzeRouter);

describe('/analyze route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock DB create method to prevent actual DB writes
  beforeAll(() => {
    jest.spyOn(Response, 'create').mockImplementation(async (doc) => doc);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('returns 400 if errorText is missing', async () => {
    const res = await request(app).post('/analyze').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Missing errorText');
  });

  it('returns 500 if OpenAI service throws', async () => {
    getAIResponse.mockRejectedValueOnce(new Error('OpenAI API failure'));

    const res = await request(app)
      .post('/analyze')
      .send({ errorText: 'some error', userId: 'user123' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Failed to analyze error');
  });

  it('returns explanation and fix, saves response on success', async () => {
    // Mock AI response format
    const fakeAIResponse = { choices: [{ message: { content: 'Explanation\nFix' } }] };
    getAIResponse.mockResolvedValueOnce(fakeAIResponse);

    // Mock extractExplanationAndFix to parse that response
    extractExplanationAndFix.mockReturnValue({
      explanation: 'Explanation',
      fix: 'Fix',
    });

    const payload = { errorText: 'buggy code', userId: 'user123' };
    const res = await request(app).post('/analyze').send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('explanation', 'Explanation');
    expect(res.body).toHaveProperty('fix', 'Fix');

    // Confirm DB create called with correct fields
    expect(Response.create).toHaveBeenCalledWith({
      input: payload.errorText,
      output: fakeAIResponse,
      userId: payload.userId,
    });
  });

  it('handles missing userId gracefully (optional)', async () => {
    const fakeAIResponse = { choices: [{ message: { content: 'Explanation\nFix' } }] };
    getAIResponse.mockResolvedValueOnce(fakeAIResponse);
    extractExplanationAndFix.mockReturnValue({
      explanation: 'Explanation',
      fix: 'Fix',
    });

    const payload = { errorText: 'buggy code' };
    const res = await request(app).post('/analyze').send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('explanation', 'Explanation');
    expect(res.body).toHaveProperty('fix', 'Fix');
    expect(Response.create).toHaveBeenCalledWith({
      input: payload.errorText,
      output: fakeAIResponse,
      userId: undefined,
    });
  });
});

