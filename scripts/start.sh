#!/bin/bash
# Start script for Makesoft.io
# Starts all services using docker-compose

set -e

echo "🚀 Starting Makesoft.io services..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it from .env.example"
    exit 1
fi

# Start services
docker-compose -f docker-compose.yml up -d --build

echo "✅ Services started!"
echo ""
echo "Services are running:"
echo "- Landing: http://localhost:5173"
echo "- Auth: http://localhost:3001"
echo "- Portal: http://localhost:5174"
echo "- Forum: http://localhost:3002"
echo "- API: http://localhost:4000"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"

