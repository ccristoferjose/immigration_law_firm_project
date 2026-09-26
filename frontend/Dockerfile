# syntax=docker/dockerfile:1.6
#
# Frontend image — optimized for cache reuse.
#
# Key ideas:
#   1. Dependencies are installed BEFORE any ARG / ENV / source copy, so the
#      expensive `npm ci` layer is NOT invalidated when build-time env vars
#      or source files change.
#   2. A BuildKit cache mount persists the npm download cache between builds,
#      so even a full reinstall only re-downloads what actually changed.
#   3. VITE_* args are declared right before `npm run build`, which is the
#      only step that actually consumes them.

FROM node:20-alpine AS build

WORKDIR /app

# ---------- Stage 1: install deps (cached unless package files change) ----------
# Copy only the manifest + lockfile. The `*` on package-lock.json makes it
# optional so the build still works if no lockfile is committed yet.
COPY package.json package-lock.json* ./

# BuildKit cache mount keeps ~/.npm across builds so repeated installs are
# near-instant even after a cache bust.
RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then \
      npm ci --prefer-offline --no-audit --no-fund; \
    else \
      npm install --prefer-offline --no-audit --no-fund; \
    fi

# ---------- Stage 2: copy source ----------
# This layer is invalidated only when source files change, not when
# build args change.
COPY . .

# ---------- Stage 3: build-time env vars ----------
# Declared HERE, after the expensive install + copy, so changing any of
# them only re-runs `npm run build` — NOT `npm ci`.
ARG VITE_API_BASE_URL
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_APP_ID

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

RUN npm run build

# ---------- Stage 4: runtime (nginx) ----------
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
