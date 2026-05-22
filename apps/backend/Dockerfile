FROM node:24-alpine AS base
WORKDIR /app

# Prepare
FROM base AS prepare
RUN apk add --no-cache libc6-compat
RUN npm install turbo --global
COPY . .
RUN turbo prune backend --docker

# Builder 
FROM base AS builder
COPY --from=prepare /app/out/json/ .
RUN npm ci
COPY --from=prepare /app/out/full/ .

RUN npm --workspace backend run generate
RUN npx turbo run build --filter=backend...
RUN npm prune --omit=dev

FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

COPY --from=builder --chown=expressjs:nodejs /app/apps/backend/dist ./dist
COPY --from=builder --chown=expressjs:nodejs /app/apps/backend/generated ./generated
COPY --from=builder --chown=expressjs:nodejs /app/node_modules ./node_modules

USER expressjs

EXPOSE 3000
CMD ["node", "dist/index.js"]