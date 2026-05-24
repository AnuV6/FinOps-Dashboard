#!/bin/sh
set -e

# Fix /data ownership (volume mounts default to root)
chown nextjs:nodejs /data

# Run migrations as nextjs user
su-exec nextjs node node_modules/prisma/build/index.js migrate deploy --schema=prisma/schema.prisma

# Seed initial data if empty
su-exec nextjs node prisma/seed.js

# Start Next.js as nextjs user
exec su-exec nextjs node server.js
