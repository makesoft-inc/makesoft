# API Service

Main API service for Makesoft.io.

## Features

- RESTful API endpoints
- JWT authentication middleware
- Rate limiting
- Health checks

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token verification

## API Endpoints

- `GET /v1/status` - Get API status
- `GET /v1/users` - Get users list (protected)
- `GET /v1/users/me` - Get current user profile (protected)
- `GET /health` - Health check

