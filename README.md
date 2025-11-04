# Makesoft.io

A modern microservices platform built with Docker, Node.js, React, and MongoDB.

## Architecture

- **Landing Page** (Vite + React + TS) - Marketing site
- **Auth Service** (Node + Express) - Authentication with JWT and OAuth (Google, GitHub)
- **Portal** (Vite + React + TS) - User dashboard
- **Forum** (Node + Express) - Discussion forum
- **API** (Node + Express) - RESTful API
- **MongoDB** - Database
- **Nginx** - Reverse proxy
- **Cloudflared** - Cloudflare tunnel

## Quick Start

### Development

```bash
# Clone repository
git clone <repository-url>
cd makesoft

# Create environment file
cp .env.example .env
# Edit .env with your values

# Start services
docker-compose -f docker-compose.dev.yml up -d --build

# Seed database (optional)
./scripts/seed-db.sh
```

Services will be available at:
- Landing: http://localhost:5173
- Auth: http://localhost:3001
- Portal: http://localhost:5174
- Forum: http://localhost:3002
- API: http://localhost:4000

### Production

```bash
# Install dependencies
./scripts/install.sh

# Start services
./scripts/start.sh
```

## Documentation

- [Setup Guide](./docs/SETUP.md) - Detailed local development setup
- [Deployment Guide](./docs/DEPLOY.md) - Production deployment instructions

## Services

### Auth Service
- User registration and login
- JWT token authentication
- OAuth 2.0 (Google, GitHub)
- Endpoints: `/register`, `/login`, `/me`, `/oauth/google`, `/oauth/github`

### API Service
- RESTful API endpoints
- Protected routes with JWT
- Endpoints: `/v1/status`, `/v1/users`

### Forum Service
- Thread CRUD operations
- Endpoints: `/threads`, `/threads/:id`

### Frontend Services
- Landing: Marketing page
- Portal: User dashboard with API integration

## Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `JWT_SECRET` - Secret for JWT signing
- `MONGO_URI` - MongoDB connection string
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` - GitHub OAuth
- `TUNNEL_ID` - Cloudflared tunnel ID

## Default Credentials

After seeding:
- Admin: `admin` / `admin123`
- Test Users: `johndoe`, `janedoe` / `password123`

⚠️ **Change these in production!**

## CI/CD

GitHub Actions automatically deploys on push to `main` branch.

Required GitHub Secrets:
- `SSH_PRIVATE_KEY`
- `DEPLOY_USER`
- `DEPLOY_HOST`

## Development

Each service can be run independently:

```bash
cd apps/auth
npm install
npm run dev
```

## License

MIT
