# ==========================================
# Stage 1: Build the Control Plane Application
# ==========================================
FROM node:22-alpine AS builder

# Required to compile native modules during the global workspace install
RUN apk add --no-cache python3 make g++

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy the workspace configuration and lockfiles first
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./

# Copy the entire monorepo source to resolve local workspace dependencies
COPY . .

# Install all dependencies across the workspace
RUN pnpm install --frozen-lockfile

# Build the control-plane (compiles TypeScript to dist/)
RUN pnpm --filter control-plane build

# Isolate the app! This creates a standalone folder with the app
# and ONLY its production dependencies.
RUN pnpm --filter control-plane --prod deploy /pruned

# ==========================================
# Stage 2: Production Runner
# ==========================================
FROM node:22-alpine

WORKDIR /app

# Copy the isolated production environment from the builder
COPY --from=builder /pruned .

EXPOSE 3000

# Start the Node.js application
CMD ["node", "dist/index.js"]