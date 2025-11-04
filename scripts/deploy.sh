#!/bin/bash
# Deploy script for Makesoft.io
# This script is called by GitHub Actions to deploy to production

set -e

echo "🚀 Deploying Makesoft.io to production..."

# Validate docker-compose config
echo "📋 Validating docker-compose configuration..."
docker-compose -f docker-compose.yml config > /dev/null

# Pull latest images
echo "📥 Pulling latest images..."
docker-compose -f docker-compose.yml pull || true

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.yml down

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.yml up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service health
echo "🏥 Checking service health..."
docker-compose -f docker-compose.yml ps

echo "✅ Deployment complete!"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To check status: docker-compose ps"

