# Implementation Plan: Sharkophagus Web UI Frontend

**Branch**: `001-sharkophagus-web-ui` | **Date**: 2026-05-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-sharkophagus-web-ui/spec.md`

## Summary

Implement a modern, premium single-page dashboard using Vue 3, TypeScript, and Vite. The frontend application will be located inside the `web/` subdirectory of the workspace. It will allow analysts to upload packet capture files (validating extensions like `.pcap`, `.pcapng` on the client side), monitor upload progress, view rich capture statistics (`frames`, `bytes`, `duration`, `firstPacketTime`, `lastPacketTime`), acknowledge/close sessions, and handle API or network errors using a floating, dismissible toast. The codebase will follow strict Test-Driven Development (TDD) principles using Vitest and Vue Test Utils, aiming for >80% test coverage and full environment containerization.

## Technical Context

**Language/Version**: TypeScript 5.x, Vue 3.x

**Primary Dependencies**: Vue 3, Vite, Axios (or Fetch API), Lucide Vue Next (icons), Tailwind/PostCSS (if requested; otherwise pure vanilla CSS as per design guidelines)

**Storage**: Transient reactive client-side store (component state / Pinia if needed)

**Testing**: Vitest + Vue Test Utils + Happy DOM / jsdom

**Target Platform**: Modern web browsers supporting ES6+

**Project Type**: web-service (frontend application SPA)

**Performance Goals**:
- Page load to interactive in under 500ms.
- Client-side validation complete in under 50ms.
- Session termination initiation triggered within 100ms.

**Constraints**:
- File upload size limited by backend (default 10MB).
- Containerized development and build (using Docker with Node).
- Minimum of 80% code coverage.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **TDD Mandatory**: Yes. Failing unit/component tests verifying file validation, upload, statistics display, error toasts, and termination API triggers must be written before implementation.
- **Standardized Coding Style**: Yes. Set up ESLint with TypeScript and Vue plugins, along with Prettier.
- **Leverage Industry-Standard Tooling**: Yes. Vite, Vitest, Vue Test Utils, and Vue 3 core are leveraged.
- **Security-First by Design**: Yes. Client-side input validation on files and safe parsing of API response payloads.
- **Modular Architecture**: Yes. API client logic is decoupled into a dedicated service layer, and components are reusable and single-responsibility.
- **Containerized Building**: Yes. A development Node-based Docker image will be used to run Vite dev server and tests.
- **Task-Based Git Commit**: Yes. Commit after each completed task in `tasks.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-sharkophagus-web-ui/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
web/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── assets/
│   │   └── base.css
│   ├── components/
│   │   ├── FileUpload.vue
│   │   ├── StatsDashboard.vue
│   │   └── ErrorNotification.vue
│   ├── services/
│   │   └── api.ts
│   └── types/
│       └── index.ts
├── tests/
│   ├── components/
│   │   ├── FileUpload.spec.ts
│   │   ├── StatsDashboard.spec.ts
│   │   └── ErrorNotification.spec.ts
│   ├── services/
│   │   └── api.spec.ts
│   └── setup.ts
├── Dockerfile
└── docker-compose.yml
```

**Structure Decision**: Initialized in `web/` subdirectory using a standard single-page app Vite + Vue 3 structure.

## Complexity Tracking

*No current violations of the Antiquarium Constitution.*
