# Auth Service

Authentication service for Makesoft.io with support for local username/password and OAuth (Google, GitHub).

## Features

- User registration and login
- JWT token authentication
- OAuth 2.0 (Google and GitHub)
- Password hashing with bcrypt
- Rate limiting
- Input validation

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration time (default: 7d)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `OAUTH_REDIRECT_URI` - OAuth callback URL

## API Endpoints

- `POST /register` - Register a new user
- `POST /login` - Login with email/password
- `GET /me` - Get current user (requires JWT token)
- `GET /oauth/google` - Initiate Google OAuth
- `GET /oauth/github` - Initiate GitHub OAuth
- `GET /health` - Health check

