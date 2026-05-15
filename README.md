# ☁️ Code-Engine

Code-Engine is a cloud workspace provisioning system and browser-based IDE. It allows users to launch isolated, containerized development environments via Kubernetes and interact with them directly from a web browser.

## 🏗️ Project Structure

This project is a monorepo managed by [Turborepo](https://turbo.build/) and `pnpm`.

* **`apps/frontend`**: The React/Vite user interface (Dashboard, Code Editor, Terminal, File Explorer).
* **`apps/control-plane`**: The core backend (Node.js/Express) that manages user auth, workspace states, and provisions Kubernetes pods.
* **`apps/workspace-agent`**: The lightweight server running *inside* each user's container to handle direct File System and Terminal (PTY) WebSocket connections.
* **`packages/shared-types`**: Shared TypeScript interfaces utilized across the frontend, control-plane, and agent.

## 🚀 Tech Stack

* **Frontend:** React, Vite, TailwindCSS, TanStack Query, TanStack Router, Zustand
* **Backend:** Node.js, Express, Drizzle ORM
* **Infrastructure:** Kubernetes (K8s), Docker
* **Tooling:** Turborepo, pnpm, TypeScript

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18+)
* [pnpm](https://pnpm.io/installation) (v8+)
* [Docker](https://www.docker.com/)
* A local Kubernetes cluster like [Kind](https://kind.sigs.k8s.io/) or [Minikube](https://minikube.sigs.k8s.io/)
* `kubectl` configured to communicate with your local cluster

## 💻 Quick Start

**1. Clone the repository and install dependencies:**
```bash
git clone https://github.com/yourusername/code-engine.git
cd code-engine
pnpm install
```

**2. Set up environment variables:**
Copy the example environment files in the respective app directories.
```bash
cp apps/control-plane/.env.example apps/control-plane/.env
cp apps/frontend/.env.example apps/frontend/.env
```

**3. Start the local development server:**
This will start the frontend and control-plane concurrently.
```bash
pnpm turbo dev
```

## 📚 Documentation

For deeper dives into specific architectures and APIs, refer to the detailed documentation:

* [System Architecture & Data Flow](./docs/architecture.md)
* [API & WebSocket Reference](./docs/api-reference.md)
* [Frontend Documentation](./apps/frontend/README.md)
* [Control Plane Documentation](./apps/control-plane/README.md)
* [Workspace Agent Documentation](./apps/workspace-agent/README.md)