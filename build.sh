#!/bin/bash

# Vercel build script that handles database setup properly
echo "Starting Vercel build process..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set!"
    echo "Please set DATABASE_URL in your Vercel project settings."
    echo "Go to: Vercel Dashboard → Project → Settings → Environment Variables"
    echo "Add: DATABASE_URL = your_postgresql_connection_string"
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo "Generating Prisma client..."
npx prisma generate

echo "Pushing database schema..."
npx prisma db push --accept-data-loss

echo "Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"