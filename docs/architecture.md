# 🏛️ Comprehensive System Architecture

Code-Engine is a distributed cloud IDE platform managed as a monorepo via [Turborepo](https://turbo.build/). It provisions isolated development environments using [Kubernetes](https://kubernetes.io/) and connects them to a web-based interface.



The system is strictly divided into three primary operational domains:
1. **Frontend (`apps/frontend`)**: The client-side IDE interface.
2. **Control Plane (`apps/control-plane`)**: The centralized orchestration and state management backend.
3. **Workspace Agent (`apps/workspace-agent`)**: The isolated server running inside the user's provisioned container.

---

## 1. The Frontend (Client-Side IDE)
**Path:** [`apps/frontend`](../apps/frontend) | **Tech:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [TanStack Router](https://tanstack.com/router/latest), [Zustand](https://zustand-demo.pmnd.rs/), [Tailwind CSS](https://tailwindcss.com/)

The frontend is a single-page application (SPA) responsible for rendering the IDE, managing local user state, and maintaining active connections (REST and WebSocket) to both the Control Plane and the individual Workspace Agents.

**📖 Related Documentation:**
* [Frontend State Management Guide](./frontend-state.md)
* [IDE Component Architecture](./ide-components.md)

### Core Responsibilities & File Mapping:

* **Routing & Access Control:**
    * Manages navigation between public landing pages and authenticated dashboard/workspace routes.
    * **Files:** [`src/routes/_protected.tsx`](../apps/frontend/src/routes/_protected.tsx) (Auth Guard), [`src/routeTree.gen.ts`](../apps/frontend/src/routeTree.gen.ts) (Generated routing tree).
    * *See also: [Routing Flow Docs](./frontend-routing.md)*
* **Global State Management:**
    * Maintains the active user session and the operational state of the current workspace.
    * **Files:** [`src/store/useAuthStore.ts`](../apps/frontend/src/store/useAuthStore.ts), [`src/store/workspaceStore.ts`](../apps/frontend/src/store/workspaceStore.ts).
* **Authentication State & Flow:**
    * Manages user login sessions, token storage/retrieval, and automatic injection of credentials into backend API requests.
    * **Strategy:** Uses [insert your strategy: e.g., JWT Bearer tokens / HTTP-only cookies / Clerk / Auth0] for session management.
    * **Files:** [`src/features/auth/hooks`](../apps/frontend/src/features/auth/hooks) (Auth state management).
    * *See also: [Authentication Flow Docs](./frontend-auth.md)*
* **Workspace Lifecycle UI (Dashboard):**
    * Provides the interface for users to create, launch, stop, and delete their workspaces.
    * **Files:** [`src/features/dashboard/components`](../apps/frontend/src/features/dashboard/components), [`src/features/dashboard/hooks`](../apps/frontend/src/features/dashboard/hooks).
* **The Editor Interface (`features/editor`):**
    * Renders the code editor, handles syntax highlighting, and triggers file saves.
    * **Files:** [`src/features/editor/components/CodeEditor.tsx`](../apps/frontend/src/features/editor/components/CodeEditor.tsx), [`src/features/editor/hooks/useAutoSave.ts`](../apps/frontend/src/features/editor/hooks/useAutoSave.ts).
    * *See also: [Editor Internals & Auto-Save](./editor-internals.md)*
* **The Terminal Interface (`features/terminal`):**
    * Renders the visual terminal emulator and connects its input/output to the Agent's WebSocket.
    * **Files:** [`src/features/terminal/components/TerminalContainer.tsx`](../apps/frontend/src/features/terminal/components/TerminalContainer.tsx), [`src/features/terminal/hooks/useTerminal.ts`](../apps/frontend/src/features/terminal/hooks/useTerminal.ts).
* **The File Explorer (`features/explorer`):**
    * Visualizes the workspace file tree, handles drag-and-drop, and provides UI for CRUD operations on the file system.
    * **Files:** [`src/features/explorer/components/FileExplorer.tsx`](../apps/frontend/src/features/explorer/components/FileExplorer.tsx), [`src/features/explorer/api/useFsQuery.ts`](../apps/frontend/src/features/explorer/api/useFsQuery.ts).

---

## 2. The Control Plane (Orchestration Layer)
**Path:** [`apps/control-plane`](../apps/control-plane) | **Tech:** [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Drizzle ORM](https://orm.drizzle.team/), [Kubernetes JS Client](https://github.com/kubernetes-client/javascript)

The Control Plane is the authoritative backend. The Frontend communicates with it exclusively to manage accounts and orchestrate infrastructure. It acts as the bridge between the database and the Kubernetes cluster.

**📖 Related Documentation:**
* [Control Plane REST API Reference](./api-reference.md#control-plane-api)
* [Database Schema & Migrations](./database-schema.md)
* [Kubernetes Provisioning Guide](./kubernetes-provisioning.md)

### Core Responsibilities & File Mapping:

* **Data Persistence:**
    * Defines the database schema for Users, Workspaces, and potentially billing data using Drizzle.
    * **Files:** [`src/db/schema.ts`](../apps/control-plane/src/db/schema.ts), [`src/db/index.ts`](../apps/control-plane/src/db/index.ts).
* **Authentication & Authorization:**
    * Validates user sessions/tokens before allowing infrastructure operations.
    * **Files:** [`src/middlewares/auth.middleware.ts`](../apps/control-plane/src/middlewares/auth.middleware.ts), [`src/controllers/auth.controller.ts`](../apps/control-plane/src/controllers/auth.controller.ts).
    * *See also: [Authentication Flow](./auth-flow.md)*
* **Kubernetes Orchestration:**
    * Translates database states into actual Kubernetes resources. Generates YAML/JSON definitions for Pods, Services, and Ingresses, and applies them to the cluster.
    * **Files:** [`src/k8s/k8s.client.ts`](../apps/control-plane/src/k8s/k8s.client.ts) (Executes API calls to K8s), [`src/k8s/k8s.manifest.ts`](../apps/control-plane/src/k8s/k8s.manifest.ts) (Generates the K8s object schemas).
* **Workspace Business Logic:**
    * Coordinates the transaction of marking a workspace "active" in the DB while simultaneously commanding K8s to spin up the container.
    * **Files:** [`src/services/workspace.service.ts`](../apps/control-plane/src/services/workspace.service.ts), [`src/controllers/workspace.controller.ts`](../apps/control-plane/src/controllers/workspace.controller.ts).

---

## 3. The Workspace Agent (In-Container Server)
**Path:** [`apps/workspace-agent`](../apps/workspace-agent) | **Tech:** Node.js, Express, [WebSocket (ws)](https://github.com/websockets/ws), [node-pty](https://github.com/microsoft/node-pty)

The Workspace Agent is baked into the `agent.Dockerfile`. When the Control Plane provisions a pod, this server boots up inside it. The Frontend communicates *directly* with this agent to edit code and run commands, completely bypassing the Control Plane to ensure zero-latency typing.

**📖 Related Documentation:**
* [Agent REST & WebSocket API Reference](./api-reference.md#workspace-agent-api)
* [PTY & Terminal Architecture](./pty-architecture.md)
* [File Watcher System](./file-watcher-system.md)

### Core Responsibilities & File Mapping:

* **File System Manipulation (REST):**
    * Provides APIs to read file content, write to files, and manage the directory structure natively on the container's disk.
    * **Files:** [`src/controllers/fs.content.controller.ts`](../apps/workspace-agent/src/controllers/fs.content.controller.ts), [`src/controllers/fs.structure.controller.ts`](../apps/workspace-agent/src/controllers/fs.structure.controller.ts).
* **File System Polling/Watching:**
    * Monitors the container's disk for changes made outside the editor (e.g., if a user runs `npm install`, the tree must update).
    * **Files:** [`src/controllers/fs.watcher.controller.ts`](../apps/workspace-agent/src/controllers/fs.watcher.controller.ts), [`src/services/fs.service.ts`](../apps/workspace-agent/src/services/fs.service.ts).
* **Pseudo-Terminal (PTY) Execution:**
    * Spawns actual bash/zsh shell processes and pipes the raw standard input (`stdin`) and standard output (`stdout`) over WebSockets back to the frontend.
    * **Files:** [`src/services/pty.service.ts`](../apps/workspace-agent/src/services/pty.service.ts), [`src/ws/terminal.ws.ts`](../apps/workspace-agent/src/ws/terminal.ws.ts).
* **Port Proxying (Preview):**
    * Intercepts requests made to development servers running inside the workspace and routes them so the frontend `BrowserPreview` can display them securely.
    * **Files:** [`src/middleware/proxy.middleware.ts`](../apps/workspace-agent/src/middleware/proxy.middleware.ts).
    * *See also: [Browser Preview Proxying](./preview-proxy.md)*

---

## 4. Shared Packages
**Path:** [`packages/shared-types`](../packages/shared-types)

To prevent duplication and runtime errors, common TypeScript interfaces are centralized here. This ensures that the JSON payload the Frontend sends exactly matches what the Control Plane or Agent expects to receive.

**📖 Related Documentation:**
* [Adding & Managing Shared Types](./adding-shared-types.md)

* **Responsibilities:** Centralizes Database schema types, API Request/Response shapes, and WebSocket event payloads.
* **Files:** [`index.ts`](../packages/shared-types/index.ts).