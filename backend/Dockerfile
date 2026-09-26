# syntax=docker/dockerfile:1.6
FROM node:20-alpine

WORKDIR /app

# Copy manifests first so the install layer caches on package* only.
COPY package.json package-lock.json* ./

# Production-only deps, with a BuildKit cache mount for the npm cache.
RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then \
      npm ci --omit=dev --prefer-offline --no-audit --no-fund; \
    else \
      npm install --omit=dev --prefer-offline --no-audit --no-fund; \
    fi

# Source comes in its own layer so code-only changes don't bust the install layer.
COPY . .

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "src/server.js"]
