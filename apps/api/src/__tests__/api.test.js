const request = require('supertest');
const app = require('../server');

describe('API Service', () => {
  describe('GET /v1/status', () => {
    it('should return status', async () => {
      const response = await request(app).get('/v1/status');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'api');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });
  });
});

