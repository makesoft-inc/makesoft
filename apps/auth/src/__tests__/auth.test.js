const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth Service', () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/makesoft_test');
  });

  afterAll(async () => {
    await User.deleteMany({});
    const mongoose = require('mongoose');
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('testuser');
    });

    it('should reject duplicate email', async () => {
      await User.create({
        username: 'existing',
        email: 'test@example.com',
        password: 'password123',
      });

      const response = await request(app)
        .post('/register')
        .send({
          username: 'newuser',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /login', () => {
    it('should login with valid credentials', async () => {
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
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

