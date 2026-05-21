# Technical Research and Decisions: Sharkophagus Web UI

This document records the design decisions and architectural rationales for the Sharkophagus Web UI frontend, resolving the key unknowns identified during specification clarification.

---

## 1. Frontend Tech Stack

- **Decision**: Vue 3 + TypeScript + Vite.
- **Rationale**: Vue 3 with the Composition API offers excellent reactivity, component modularity, and high-quality tooling. Combining it with TypeScript ensures type safety across API client responses and component props. Vite provides extremely fast HMR (Hot Module Replacement) and build pipelines.
- **Alternatives Considered**: 
  - *Vanilla JavaScript/TypeScript (Option A)*: Rejected because a structured framework is better suited for long-term maintainability, testability, and state scalability.

---

## 2. API Data Model Alignment

- **Decision**: Align frontend models directly with the backend's `CaptureStatistics` schema fields (`frames`, `bytes`, `duration`, `firstPacketTime`, `lastPacketTime`).
- **Rationale**: Direct alignment with the backend OpenAPI schema reduces integration bugs, simplifies testing, and avoids maintenance of a redundant client-side mapping layer.
- **Alternatives Considered**:
  - *Client-Side Translation*: Keeping the spec's original `SessionStatusInfo` fields and translating them in the API client layer. Rejected as it introduces artificial complexity and mock values for missing fields.

---

## 3. Testing Toolchain

- **Decision**: Vitest + Vue Test Utils + Happy DOM.
- **Rationale**: Vitest is a modern testing runner built specifically for Vite. It uses the same build configuration, plugins, and resolvers, resulting in sub-millisecond execution times for unit tests and seamless TypeScript/Vue single-file component compilation.
- **Alternatives Considered**:
  - *Jest + Vue Test Utils*: Rejected due to slow compile times under Vite and high configuration overhead for ESM and TypeScript modules.

---

## 4. API and Network Error Handling

- **Decision**: Dismissible, floating toast banner at the top of the dashboard.
- **Rationale**: Provides clear visibility of errors (e.g., file extension mismatch, backend spawn failures) without redirecting the user or forcing a manual application state reset.
- **Alternatives Considered**:
  - *Dedicated Error Page*: Rejected because it disrupts the single-page workflow and requires additional clicks to reset the upload state.

---

## 5. Project Directory Initialization

- **Decision**: Subdirectory named `web/`.
- **Rationale**: Isolates the frontend build files, dependencies, and test configurations from the repository root, keeping the root clean and ready for potential multi-package expansion.
- **Alternatives Considered**:
  - *Root Workspace Directory*: Rejected to avoid mixing workspace config metadata with project source files.
