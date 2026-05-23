FROM node:22-alpine AS base

# ── deps: install all node_modules ────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts: skips our own postinstall (prisma generate) which would fail
# here because prisma/schema.prisma hasn't been copied yet. The builder stage
# runs `npx prisma generate` explicitly after copying the full source.
# The WASM issue is avoided in entrypoint.sh by calling prisma/build/index.js
# directly instead of through the .bin/ symlink.
RUN npm ci --ignore-scripts

# ── builder: generate Prisma client + Next.js build ───────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# generate Prisma client (no DB needed at build time)
RUN npx prisma generate
RUN npm run build

# ── runner: minimal production image ──────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# DB will be volume-mounted at /data; override DATABASE_URL at runtime via env
ENV DATABASE_URL="file:/data/finops.db"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Data directory for SQLite (volume-mountable)
RUN mkdir -p /data && chown nextjs:nodejs /data

# Next.js standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma schema + migrations + seed (needed at startup)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Full prisma package (node_modules/prisma/build/index.js is called directly
# in entrypoint.sh so __dirname resolves correctly and finds the WASM engine)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Entrypoint: migrate → seed → start
COPY --chown=nextjs:nodejs entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["./entrypoint.sh"]
