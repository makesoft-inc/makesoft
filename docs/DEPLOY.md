# Makesoft.io Deployment Guide

This guide covers deploying Makesoft.io to production.

## Prerequisites

- Ubuntu server (20.04+)
- Docker and Docker Compose installed
- Cloudflare account with tunnel configured
- Domain DNS configured (makesoft.io and subdomains)

## Server Setup

### 1. Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2. Install Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Clone Repository

```bash
cd ~
git clone <repository-url> makesoft
cd makesoft
```

### 4. Configure Environment

```bash
cp .env.production.example .env
nano .env  # Edit with your actual values
```

**Required Environment Variables:**
- `JWT_SECRET` - Strong random string for JWT signing
- `MONGO_ROOT_PASSWORD` - MongoDB root password
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (if using OAuth)
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` (if using OAuth)
- `TUNNEL_ID` - Cloudflared tunnel ID (already set: ef034f3f-ad26-44ec-bf16-e3131fb09d55)

### 5. Configure Cloudflared

Ensure cloudflared credentials are in place:
```bash
# Credentials should be at:
# /home/dev/.cloudflared/cert.pem
# /home/dev/.cloudflared/ef034f3f-ad26-44ec-bf16-e3131fb09d55.json
```

Update `docker-compose.yml` if credentials are in a different location.

### 6. Build and Start Services

```bash
./scripts/install.sh
./scripts/start.sh
```

Or manually:
```bash
docker-compose up -d --build
```

### 7. Seed Database (First Time)

```bash
./scripts/seed-db.sh
```

## CI/CD Setup (GitHub Actions)

The repository includes GitHub Actions workflow that auto-deploys on push to `main`.

### Required GitHub Secrets

Add these secrets in GitHub repository settings:

- `SSH_PRIVATE_KEY` - SSH private key for server access
- `DEPLOY_USER` - SSH username (e.g., `ubuntu`)
- `DEPLOY_HOST` - Server IP or domain

### Deployment Flow

1. Push to `main` branch
2. GitHub Actions runs automatically
3. SSH into server and runs deploy commands
4. Services restart with new code

## Monitoring

### Check Service Status

```bash
docker-compose ps
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f auth
```

### Health Checks

```bash
# API health
curl https://api.makesoft.io/health

# Auth health
curl https://auth.makesoft.io/health

# Forum health
curl https://forum.makesoft.io/health
```

## Rollback

If deployment fails, rollback to previous version:

```bash
cd ~/makesoft
git reset --hard HEAD~1
docker-compose down
docker-compose up -d --build
```

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET
- [ ] Enable firewall (ufw)
- [ ] Configure SSL/TLS in Cloudflare (Full Strict)
- [ ] Set up monitoring and alerts
- [ ] Regular backups of MongoDB
- [ ] Rotate secrets every 90 days

## Maintenance

### Update Services

```bash
cd ~/makesoft
git pull origin main
docker-compose down
docker-compose up -d --build
```

### Backup Database

```bash
docker exec makesoft_mongo mongodump --out /backup
docker cp makesoft_mongo:/backup ./backup-$(date +%Y%m%d)
```

### Restore Database

```bash
docker cp ./backup-YYYYMMDD makesoft_mongo:/backup
docker exec makesoft_mongo mongorestore /backup
```

## Troubleshooting

### Services Not Starting

1. Check logs: `docker-compose logs`
2. Verify `.env` file is correct
3. Check disk space: `df -h`
4. Check Docker: `docker ps -a`

### Cloudflared Not Connecting

1. Verify tunnel ID in `.env`
2. Check credentials file exists
3. View cloudflared logs: `docker-compose logs cloudflared`

### Database Connection Issues

1. Check MongoDB is healthy: `docker-compose ps mongo`
2. Verify MONGO_URI in `.env`
3. Check MongoDB logs: `docker-compose logs mongo`

## Support

For issues, check:
- Service logs
- GitHub Issues
- Documentation in `/docs` folder

