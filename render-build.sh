#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "🚀 Starting Robust Build Script..."

# Check if we are in the root and need to go to frontend
if [ -d "frontend" ]; then
  echo "📂 'frontend' directory found. Entering it..."
  cd frontend
else
  echo "📂 'frontend' directory NOT found. Assuming we are already inside it..."
fi

# Initializing dependencies
echo "📦 Installing dependencies..."
npm ci

# Building the project
echo "🔨 Building the project..."
npm run build

echo "✅ Build completed successfully!"
