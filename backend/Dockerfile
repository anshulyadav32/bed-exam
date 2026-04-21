# ── Stage 1: deps ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS deps
RUN apk add --no-cache openssl
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci

# ── Stage 2: builder ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY backend/ ./
COPY db/ ./db/
RUN npx prisma generate --schema db/prisma/schema.prisma
RUN npm run build

# ── Stage 3: runner ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 backend

COPY --from=builder /app/public ./public
COPY --from=builder --chown=backend:nodejs /app/.next/standalone ./
COPY --from=builder --chown=backend:nodejs /app/.next/static ./.next/static
# Include prisma for runtime db push
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/db/prisma ./db/prisma

USER backend
EXPOSE 3000
CMD ["node", "server.js"]
