FROM node:22-alpine AS base

# ── deps: install all node_modules + Prisma engines ──────────────────────────
FROM base AS deps
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
# Prisma's postinstall (and our own) needs the schema file to download the
# correct engine binaries, so copy it before npm ci.
COPY prisma/schema.prisma prisma/schema.prisma
RUN npm ci

# ── builder: Next.js production build ────────────────────────────────────────
FROM base AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── runner: minimal production image ─────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache openssl
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

# Prisma engines (schema engine for migrate deploy, query engine for runtime)
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
