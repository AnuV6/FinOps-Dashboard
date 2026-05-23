#!/bin/sh
set -e

# Run pending migrations (idempotent, safe on every start)
# Use full module path so __dirname resolves correctly (not through .bin/ symlink)
node node_modules/prisma/build/index.js migrate deploy --schema=prisma/schema.prisma

# Seed initial data if the database is empty
node prisma/seed.js

# Start Next.js
exec node server.js
