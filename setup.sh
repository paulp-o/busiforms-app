#!/usr/bin/env bash
set -e

echo "=== Setting up Nest.js Project ==="
cd busiforms-nest
echo "Installing npm dependencies in busiforms-nest..."
npm install

echo "=== Running Prisma setup in busiforms-nest ==="
npx prisma migrate dev --name init # Initializes Prisma Client
npx prisma generate # Generates Prisma Client

echo "=== Setting up Next.js Project ==="
cd ../busiforms-next
echo "Installing npm dependencies in busiforms-next..."
npm install
