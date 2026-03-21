FROM node:20-slim AS pruner

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && npm install -g turbo

WORKDIR /app
COPY . .


RUN turbo prune workspace-agent --docker


FROM node:20-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


RUN apt-get update && apt-get install -y python3 make g++ build-essential

WORKDIR /app


COPY --from=pruner /app/out/json/ .

RUN pnpm install --frozen-lockfile


COPY --from=pruner /app/out/full/ .


RUN pnpm turbo run build --filter=workspace-agent



FROM ubuntu:22.04 AS runner
ENV DEBIAN_FRONTEND=noninteractive


RUN apt-get update && apt-get install -y curl python3 make g++ build-essential git \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*


RUN useradd -m -s /bin/bash coder


RUN mkdir -p /app /workspace && chown -R coder:coder /app /workspace
USER coder


WORKDIR /app
COPY --from=builder --chown=coder:coder /app .


ENV WORKSPACE_DIR=/workspace
ENV PORT=8081
EXPOSE 8081


WORKDIR /app/apps/workspace-agent


CMD ["node", "dist/index.js"]
