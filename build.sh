#!/bin/bash
set -e

echo "🚀 Building leetgo for production..."

# Check if bun is available, otherwise use npm/node
if command -v bun &> /dev/null; then
  echo "📦 Using Bun for frontend build..."
  FRONTEND_BUILD_CMD="bun"
  FRONTEND_INSTALL_CMD="bun install --frozen-lockfile"
  FRONTEND_BUILD_SCRIPT="bun run build"
else
  echo "📦 Using npm for frontend build (Bun not found)..."
  FRONTEND_BUILD_CMD="npm"
  FRONTEND_INSTALL_CMD="npm ci"
  FRONTEND_BUILD_SCRIPT="npm run build"
fi

# Build frontend first
echo "📦 Building frontend..."
cd web

if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  $FRONTEND_INSTALL_CMD
fi

# Build frontend (API URL will be empty for sameorigin in production)
echo "Building React app..."
$FRONTEND_BUILD_SCRIPT
cd ..

# Build backend
echo "🔨 Building Go backend..."
go mod download
go build -o main ./cmd/api

echo "✅ Build complete"
