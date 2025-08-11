# syntax=docker/dockerfile:1

# ---- builder ----
FROM node:22-alpine AS builder
WORKDIR /app

# Install deps
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
  else npm i; fi

# Copy source and build
COPY . .
RUN yarn build || npm run build

# ---- runtime ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NO_COLOR=1 \
    FORCE_COLOR=0

# Copy only runtime artifacts
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist

# Install only production deps (none required for Nest dist if pure TS -> JS)
# But include just in case runtime deps exist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080
CMD ["node", "dist/main.js"]
