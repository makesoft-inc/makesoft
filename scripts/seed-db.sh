#!/bin/bash
# Seed database script for Makesoft.io
# Seeds the MongoDB database with initial data

set -e

echo "🌱 Seeding MongoDB database..."

# Check if mongo container is running
if ! docker ps | grep -q makesoft_mongo; then
    echo "❌ MongoDB container is not running. Please start services first."
    exit 1
fi

# Get container name (dev or production)
CONTAINER_NAME=$(docker ps --format "{{.Names}}" | grep makesoft_mongo | head -n 1)

if [ -z "$CONTAINER_NAME" ]; then
    echo "❌ MongoDB container not found."
    exit 1
fi

# Run seed script
echo "📝 Running seed script..."
docker exec -i "$CONTAINER_NAME" mongosh makesoft < docker/mongo/initdb/01-seed.js

echo "✅ Database seeded successfully!"
echo ""
echo "Default credentials:"
echo "- Admin: admin / admin123"
echo "- Users: johndoe, janedoe / password123"

