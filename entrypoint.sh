#!/bin/sh
set -e

# Run pending migrations (idempotent, safe on every start)
node_modules/.bin/prisma migrate deploy --schema=prisma/schema.prisma

# Seed initial data if the database is empty
node prisma/seed.js

# Start Next.js
exec node server.js
