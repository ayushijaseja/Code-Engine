FROM node:22-alpine

# Required to compile native modules (like node-pty) during workspace install
RUN apk add --no-cache python3 make g++

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy the workspace configuration and lockfiles first
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./

# Copy the entire monorepo source
COPY . .

# Install all dependencies across the workspace
RUN pnpm install --frozen-lockfile

# Expose Vite's default port
EXPOSE 5173

# Run the Vite development server and expose it to the Docker host network
# The extra "--" passes the "--host" flag to Vite rather than to pnpm
CMD ["pnpm", "--filter", "frontend", "dev", "--", "--host", "0.0.0.0"]