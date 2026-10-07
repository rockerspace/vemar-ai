# Multi-stage Dockerfile for VEMAR AI Production Deployment (Google Cloud Run / Kubernetes)
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy application sources
COPY . .

# Build Vite client SPA and esbuild server.cjs bundle
RUN npm run build

# Production runner stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package descriptors and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.html ./index.html

# Expose container ingress port
EXPOSE 3000

# Start compiled CommonJS server bundle
CMD ["node", "dist/server.cjs"]
