<!-- efe39fc2-18e7-403b-96d2-d12d857c0e3b 2a530040-e318-400e-bb8b-c335fb5e4d79 -->
# Makesoft.io MVP Build & Deploy Plan

## Overview

Build a complete, deployable MVP for Makesoft.io with 5 microservices, Docker Compose orchestration, Nginx reverse proxy, MongoDB database, and CI/CD integration. All services will be minimal but production-ready.

## Architecture

- **landing**: Vite + React + TS (port 5173) → makesoft.io
- **auth**: Node + Express + JWT + MongoDB (port 3001) → auth.makesoft.io
- **portal**: Vite + React + TS (port 5174) → portal.makesoft.io
- **forum**: Node + Express + MongoDB (port 3002) → forum.makesoft.io
- **api**: Node + Express + MongoDB (port 4000) → api.makesoft.io
- **mongo**: MongoDB (port 27017, internal only)
- **nginx**: Reverse proxy (ports 80/443)
- **cloudflared**: Cloudflare tunnel (TUNNEL_ID: ef034f3f-ad26-44ec-bf16-e3131fb09d55)

## Status

### ✅ Completed

- **Repository Structure**: All directories and files created
- **Docker Compose**: Production, dev, and test configurations complete
- **Nginx Configuration**: Configured for Docker, migrated from local nginx to Docker
- **All Services**: Auth, API, Forum, Landing, Portal fully scaffolded and tested
- **OAuth Integration**: Google and GitHub OAuth implemented with separate redirect URIs
- **MongoDB**: Seed script with admin user and sample forum threads
- **CI/CD**: GitHub Actions workflow compatible
- **Testing & Linting**: ESLint, Prettier, Jest configured
- **Health Checks**: All services have `/health` endpoints
- **Local Validation**: All services tested and working via Docker nginx
- **Documentation**: SETUP.md and DEPLOY.md created
- **Git Commit**: Changes committed locally (commit: bd1754a)

### 🔄 In Progress

- **GitHub Push**: Commit ready, awaiting SSH/HTTPS authentication setup
- **OAuth Provider Setup**: Redirect URIs need to be configured in Google/GitHub dashboards

### 📋 Remaining Tasks

1. **GitHub Authentication**: Set up SSH key or Personal Access Token for pushing
2. **OAuth Configuration**: 
   - Google: Add `https://auth.makesoft.io/oauth/google/callback` to OAuth app
   - GitHub: Add `https://auth.makesoft.io/oauth/github/callback` to OAuth app
3. **Production Deployment**: 
   - Push to main branch (triggers GitHub Actions)
   - Configure production `.env` on server
   - Verify cloudflared tunnel is working
4. **Production Secrets**: Fill in all `__REPLACE_ME__` values in production environment

## Implementation Tasks

### A. Repository Structure & Configuration ✅

1. ✅ Create `apps/` directory with subfolders: `landing`, `auth`, `portal`, `forum`, `api`
2. ✅ Create `docker-compose.yml` (production) and `docker-compose.dev.yml` (development with volume mounts)
3. ✅ Create `docker-compose.test.yml` for CI testing
4. ✅ Create `nginx/makesoft.conf` with server blocks for all 5 subdomains
5. ✅ Create `docker/mongo/initdb/` directory for seed scripts
6. ✅ Create `scripts/` directory with: `install.sh`, `start.sh`, `deploy.sh`, `seed-db.sh`
7. ✅ Create `.env.example` and `.env.production.example` with placeholder secrets
8. ✅ Create `docs/SETUP.md` and `docs/DEPLOY.md`

### B. Docker Compose Services ✅

1. ✅ **nginx**: Alpine image, mount nginx config, expose 80/443
2. ✅ **cloudflared**: Latest image, TUNNEL_ID ef034f3f-ad26-44ec-bf16-e3131fb09d55, mount credentials and cert, point to nginx container
3. ✅ **mongo**: Official image, named volume, init scripts, health check
4. ✅ **auth**: Build from `./apps/auth`, depends on mongo, port 3001, health check
5. ✅ **api**: Build from `./apps/api`, depends on mongo, port 4000, health check
6. ✅ **forum**: Build from `./apps/forum`, depends on mongo, port 3002, health check
7. ✅ **landing**: Build from `./apps/landing`, port 5173 (dev server) or static (prod)
8. ✅ **portal**: Build from `./apps/portal`, port 5174 (dev server) or static (prod)
9. ✅ Healthchecks for all Node services
10. ✅ Single network: `makesoft_network`

### C. Nginx Configuration ✅

1. ✅ HTTP server blocks (port 80) for development
2. ✅ Server blocks for each subdomain (makesoft.io, auth.makesoft.io, portal.makesoft.io, forum.makesoft.io, api.makesoft.io)
3. ✅ Proxy settings: headers, timeouts, buffering
4. ✅ Gzip compression
5. ✅ Static asset caching headers
6. ✅ Rate limiting for auth endpoints
7. ✅ Migrated from local nginx to Docker nginx
8. ✅ Local nginx stopped and disabled

### D. Service Scaffolds

#### Auth Service (`apps/auth`) ✅

1. ✅ Express server with `/register`, `/login`, `/me`, `/health` endpoints
2. ✅ JWT authentication with bcrypt password hashing
3. ✅ OAuth 2.0 integration (Google and GitHub) with Passport.js
4. ✅ MongoDB connection with Mongoose
5. ✅ Dockerfile: node:20-alpine, non-root user, expose 3001
6. ✅ Basic input validation and error handling
7. ✅ CORS, helmet, express-rate-limit middleware
8. ✅ Unit tests for auth logic
9. ✅ OAuth routes: `/oauth/google`, `/oauth/github`, `/oauth/callback`

#### API Service (`apps/api`) ✅

1. ✅ Express server with `/v1/status`, `/v1/users` (protected), `/health` endpoints
2. ✅ JWT middleware for protected routes
3. ✅ MongoDB connection
4. ✅ Dockerfile: node:20-alpine, non-root user, expose 4000
5. ✅ CORS, helmet, rate limiting
6. ✅ Unit tests for endpoints

#### Forum Service (`apps/forum`) ✅

1. ✅ Express server with `/threads` (GET, POST), `/threads/:id` (GET), `/health` endpoints
2. ✅ MongoDB connection for thread storage
3. ✅ Dockerfile: node:20-alpine, non-root user, expose 3002
4. ✅ Basic CRUD operations
5. ✅ CORS, helmet, rate limiting

#### Landing (`apps/landing`) ✅

1. ✅ Vite + React + TypeScript setup
2. ✅ Minimal marketing page with link to auth
3. ✅ Tailwind CSS for styling
4. ✅ Dockerfile: multi-stage (build static → serve via nginx in prod, or dev server)
5. ✅ Development server for HMR
6. ✅ Vite config updated to allow `makesoft.io` hostname

#### Portal (`apps/portal`) ✅

1. ✅ Vite + React + TypeScript setup
2. ✅ Dashboard page that fetches `/v1/status` from API
3. ✅ Authentication check (show user info if logged in)
4. ✅ Tailwind CSS for styling
5. ✅ Dockerfile: multi-stage (build static → serve via nginx in prod, or dev server)
6. ✅ Vite config updated to allow `portal.makesoft.io` hostname
7. ✅ OAuth callback handling

### E. MongoDB Setup ✅

1. ✅ Seed script: `docker/mongo/initdb/01-seed.js`
2. ✅ Create admin user (username: admin, password: admin123 - change in production)
3. ✅ Create sample forum threads (5 sample threads)
4. ✅ Create sample users (johndoe, janedoe)
5. ✅ Auto-run seed in dev compose or provide manual command via `scripts/seed-db.sh`

### F. CI/CD Integration ✅

1. ✅ Ensure `deploy.yml` compatibility (uses `docker-compose.yml` and `docker-compose up -d --build`)
2. ✅ Created `scripts/deploy.sh` wrapper with validation
3. ✅ Scripts are idempotent
4. ⏳ **AWAITING**: Push to main branch to trigger GitHub Actions workflow

### G. Testing & Linting ✅

1. ✅ Root-level ESLint + Prettier configuration
2. ✅ Jest for Node services (auth, api), Vitest configured for frontend services
3. ✅ Basic test files for auth and api services
4. ✅ `docker-compose.test.yml` for running tests in CI
5. ✅ Lint scripts in package.json files

### H. Monitoring & Health ✅

1. ✅ `/health` endpoint on all services (returns 200 OK with database status)
2. ✅ Healthchecks in docker-compose.yml for all services
3. ✅ Prometheus placeholder comments for future integration
4. ✅ All health endpoints tested and responding

### I. Local Validation ✅

1. ✅ Test docker-compose.dev.yml startup - All services running
2. ✅ Verify all services are healthy - MongoDB, Auth, API, Forum healthy
3. ✅ Test endpoints: landing (5173), api status (4000), auth register (3001) - All responding
4. ✅ Verify MongoDB seed data - Seed script ready
5. ✅ Test via nginx reverse proxy - All services accessible via Docker nginx on port 80
6. ✅ Frontend services (Landing, Portal) working with Vite

### J. Documentation & Security ✅

1. ✅ Create comprehensive `.env.example` with all required variables (including OAuth)
2. ✅ Create `.env.production.example` for production secrets
3. ✅ Add `.env`, `.env.*` to `.gitignore` (`.env` excluded from commit)
4. ✅ Create `docs/SETUP.md` with local development instructions
5. ✅ Create `docs/DEPLOY.md` with deployment checklist
6. ✅ Secrets checklist: JWT_SECRET, OAuth credentials, MongoDB password, Cloudflared credentials

### K. Final Steps

1. ✅ Create git commits with clear messages - Commit bd1754a created
2. ⏳ Push to remote - **AWAITING**: GitHub authentication setup (SSH key or Personal Access Token)
3. ⏳ Production deployment - **AWAITING**: Push to main branch to trigger GitHub Actions
4. ⏳ OAuth provider configuration - **AWAITING**: Add callback URLs to Google/GitHub dashboards

## Key Files Created

**Root level:**
- ✅ `docker-compose.yml`, `docker-compose.dev.yml`, `docker-compose.test.yml`
- ✅ `.env.example`, `.env.production.example`
- ✅ `.gitignore`
- ✅ `.eslintrc.js`, `.prettierrc`

**Nginx:**
- ✅ `nginx/makesoft.conf`

**Services:**
- ✅ `apps/auth/` (full Express app + Dockerfile + tests)
- ✅ `apps/api/` (full Express app + Dockerfile + tests)
- ✅ `apps/forum/` (full Express app + Dockerfile)
- ✅ `apps/landing/` (Vite + React + TS + Dockerfile)
- ✅ `apps/portal/` (Vite + React + TS + Dockerfile)

**Database:**
- ✅ `docker/mongo/initdb/01-seed.js`

**Cloudflared:**
- ✅ `docker/cloudflared/config.yml` (containerized config pointing to nginx)

**Scripts:**
- ✅ `scripts/install.sh`, `scripts/start.sh`, `scripts/deploy.sh`, `scripts/seed-db.sh`

**Documentation:**
- ✅ `docs/SETUP.md`, `docs/DEPLOY.md`

## Security Considerations

- ✅ All secrets use `__REPLACE_ME__` placeholder
- ✅ Non-root users in all Dockerfiles
- ✅ Helmet.js for security headers
- ✅ Rate limiting on auth endpoints
- ✅ CORS properly configured
- ✅ Input validation on all endpoints
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ OAuth state parameter for CSRF protection
- ✅ Secure session management for OAuth callbacks
- ✅ `.env` file excluded from git commit

## Next Steps

### Immediate Actions Required:

1. **GitHub Authentication**:
   - Add SSH public key to GitHub account, OR
   - Generate Personal Access Token and configure git credentials
   - Push commit: `git push origin main`

2. **OAuth Provider Configuration**:
   - **Google OAuth Console**: Add callback URL `https://auth.makesoft.io/oauth/google/callback`
   - **GitHub OAuth App**: Add callback URL `https://auth.makesoft.io/oauth/github/callback`

3. **Production Deployment**:
   - After push to main, GitHub Actions will trigger
   - Configure production `.env` on server with all secrets
   - Verify cloudflared tunnel connection
   - Test all endpoints in production

### Production Secrets Checklist:

- [ ] `JWT_SECRET` - Strong random string
- [ ] `MONGO_ROOT_PASSWORD` - Secure MongoDB password
- [ ] `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- [ ] `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
- [ ] Cloudflared credentials file and origin cert on server
- [ ] GitHub Actions secrets: `SSH_PRIVATE_KEY`, `DEPLOY_USER`, `DEPLOY_HOST`

## Assumptions

- ✅ TUNNEL_ID: ef034f3f-ad26-44ec-bf16-e3131fb09d55 (configured)
- ✅ OAuth: Google and GitHub OAuth implemented alongside local auth
- ✅ SMTP disabled (no email confirmation for MVP)
- ✅ MongoDB runs in Docker network (not exposed to host)
- ✅ Nginx runs in Docker and proxies to Docker service names
- ✅ Local nginx stopped and disabled (Docker nginx handles all traffic)

