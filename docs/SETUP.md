# Makesoft.io Setup Guide

This guide will help you set up Makesoft.io locally for development.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development without Docker)
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd makesoft
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file**
   - Update `JWT_SECRET` with a strong random string
   - Update OAuth credentials if using OAuth (Google/GitHub)
   - Update MongoDB credentials if needed

4. **Start services**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d --build
   ```

5. **Seed the database** (optional)
   ```bash
   ./scripts/seed-db.sh
   ```

## Services

Once started, services are available at:

- **Landing**: http://localhost:5173
- **Auth**: http://localhost:3001
- **Portal**: http://localhost:5174
- **Forum**: http://localhost:3002
- **API**: http://localhost:4000
- **MongoDB**: localhost:27017 (internal network in production)

## Development

### Running Individual Services

Each service can be run individually:

```bash
# Auth service
cd apps/auth
npm install
npm run dev

# API service
cd apps/api
npm install
npm run dev

# Forum service
cd apps/forum
npm install
npm run dev

# Landing (frontend)
cd apps/landing
npm install
npm run dev

# Portal (frontend)
cd apps/portal
npm install
npm run dev
```

### Database

MongoDB is accessible via Docker. To connect:

```bash
docker exec -it makesoft_mongo_dev mongosh makesoft
```

### Viewing Logs

```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f auth
```

### Stopping Services

```bash
docker-compose -f docker-compose.dev.yml down
```

## Default Credentials

After seeding the database:

- **Admin**: username: `admin`, password: `admin123`
- **Test Users**: `johndoe`, `janedoe` / password: `password123`

⚠️ **Change these passwords in production!**

## Troubleshooting

### Port Already in Use

If a port is already in use, either:
- Stop the conflicting service
- Change the port in `.env` file

### MongoDB Connection Issues

Ensure MongoDB container is healthy:
```bash
docker-compose -f docker-compose.dev.yml ps
```

### Services Not Starting

Check logs:
```bash
docker-compose -f docker-compose.dev.yml logs
```

## Next Steps

- See [DEPLOY.md](./DEPLOY.md) for production deployment instructions
- Configure OAuth providers in `.env` if needed
- Set up Nginx and Cloudflared for production

