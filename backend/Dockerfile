# ── Stage 1: deps ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS deps
RUN apk add --no-cache openssl
WORKDIR /app
COPY backend/package*.json ./
RUN npm install

# ── Stage 2: builder ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate prisma client
RUN npx prisma generate --schema db/prisma/schema.prisma
# Build
RUN cd backend && npm run build

# ── Stage 3: runner ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 backend

# Copy prisma CLI and schema for runtime migrations if needed
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/db/prisma/schema.prisma ./db/prisma/schema.prisma

# Next.js standalone structure
COPY --from=builder /app/backend/public ./backend/public
COPY --from=builder --chown=backend:nodejs /app/backend/.next/standalone ./
COPY --from=builder --chown=backend:nodejs /app/backend/.next/static ./backend/.next/static

USER backend
EXPOSE 3000
CMD ["node", "backend/server.js"]
