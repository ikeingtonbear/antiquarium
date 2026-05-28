# Implementation Plan: Update Stats Display

**Branch**: `002-update-stats-display` | **Date**: 2026-05-27 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-update-stats-display/spec.md`

## Summary

Update the frontend client integration and statistics display to support the updated backend API for the statistics endpoint. Remove the display of first/last packet timestamps and raw capture bytes from the dashboard, replacing them with session-derived filename and filesize to display exactly the filename, filesize, frame count, and duration in a neat, responsive grid layout. We will utilize TypeScript definitions and Vue component props to pass the data, and adapt the Vitest test suites to drive these UI design changes.

## Technical Context

**Language/Version**: TypeScript 5.x, Vue 3.x (Composition API)

**Primary Dependencies**: `vue` (v3.x), `vite` (v5.x), `@lucide/vue` (v0.x)

**Storage**: Client-side Vue reactive ref states.

**Testing**: Vitest + Vue Test Utils + Happy DOM

**Target Platform**: Modern web browsers supporting ES6+

**Project Type**: web-service (frontend application SPA)

**Performance Goals**: Stats dashboard UI render/update under 50ms upon state transition.

**Constraints**: Minimum of 80% unit test coverage.

**Scale/Scope**: 1 active session, 4 dashboard statistics cards.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **TDD Mandatory**: Yes. Write failing unit/component tests for modified Vue models, component props, and API response parsing before updating source code.
- **Standardized Coding Style**: Yes. Conform to project's Prettier and ESLint configuration.
- **Leverage Industry-Standard Tooling**: Yes. Use Vue Test Utils, Vitest, Vue 3 Composition API, and `@lucide/vue`.
- **Modular Architecture**: Yes. Keep components decoupled, utilizing component props interfaces explicitly.
- **Task-Based Commit Strategy**: Yes. Commit incrementally on each task verification.

## Project Structure

### Documentation (this feature)

```text
specs/002-update-stats-display/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/
│   └── api-client.md    # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
web/
├── src/
│   ├── App.vue
│   ├── components/
│   │   └── StatsDashboard.vue
│   ├── types/
│   │   └── index.ts
│   └── services/
│       └── api.ts
└── tests/
    ├── components/
    │   ├── App.spec.ts
    │   └── StatsDashboard.spec.ts
    └── services/
        └── api.spec.ts
```

**Structure Decision**: Single project layout contained within the `web/` directory.

## Complexity Tracking

*No violations of the Antiquarium Constitution.*
