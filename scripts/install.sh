#!/bin/bash
# Install script for Makesoft.io
# This script sets up the environment and installs dependencies

set -e

echo "🚀 Installing Makesoft.io..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your actual values before proceeding."
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Prerequisites check passed."

# Build images
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.yml build

echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your actual values"
echo "2. Run: ./scripts/start.sh"

