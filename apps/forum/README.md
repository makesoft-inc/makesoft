# Forum Service

Forum service for Makesoft.io with thread CRUD operations.

## Features

- Create and view forum threads
- Thread pagination
- View tracking
- Rate limiting

## Environment Variables

- `MONGO_URI` - MongoDB connection string

## API Endpoints

- `GET /threads` - Get all threads (with pagination)
- `GET /threads/:id` - Get single thread
- `POST /threads` - Create new thread
- `GET /health` - Health check

