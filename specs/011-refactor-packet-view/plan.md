# Implementation Plan: Web UI Layout Refactor for Packet-Centric View

**Branch**: `011-refactor-packet-view` | **Date**: 2026-07-16 | **Spec**: [spec.md](file:///Users/isaiahsalsman/Projects/Antigravity_Workspaces/antiquarium/specs/011-refactor-packet-view/spec.md)

**Input**: Feature specification from `/specs/011-refactor-packet-view/spec.md`

## Summary

Refactor the active packet session screen layout to optimize focus on the packet list. The Sharkophagus logo and tagline will be moved and shrunk, the large 2x2 statistics cards will be collapsed into a compact horizontal status bar, the session controls (End Session, View Details) will be reduced to small inline buttons, the main application container width will expand to 100% viewport width, and the packet scroll container will be styled to show exactly 12 packet rows at a time.

## Technical Context

**Language/Version**: TypeScript ~5.8.3, Vue 3 ^3.5.13

**Primary Dependencies**: `@lucide/vue`, `vite`

**Storage**: LocalStorage (for column layout caching)

**Testing**: Vitest ^3.2.1, Happy DOM, `@vue/test-utils`

**Target Platform**: Web browsers (Vite dev/prod build)

**Project Type**: Web application (frontend Vue UI)

**Performance Goals**: Maintaining instant UI rendering, smooth horizontal/vertical scrolling for packet rows, and low layout reflow metrics.

**Constraints**: Limit the packet scroll pane viewport height using CSS constraints so that exactly 12 rows are visible. Max-width removed (fluid 100%) when in active session state.

**Scale/Scope**: 1 main container page (`App.vue`), 2 subcomponents modified (`StatsDashboard.vue` and `FramesTable.vue`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Test-Driven Development (TDD) Mandatory**: Verified. Tests in `StatsDashboard.spec.ts`, `FramesTable.spec.ts`, and `App.spec.ts` must be updated to drive/validate these design changes first.
- **Style & Documentation**: Verified. Code formatting via Prettier and linting via ESLint will run during test verification.
- **Containerized building**: Verified. Developer scripts are runnable locally or inside the Docker environment.
- **Task-Based Git commits**: Verified. Granular commits will occur after each task verification.

## Project Structure

### Documentation (this feature)

```text
specs/011-refactor-packet-view/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── quickstart.md        # Phase 1 output
```

### Source Code (repository root)

```text
web/
├── src/
│   ├── components/
│   │   ├── StatsDashboard.vue
│   │   └── FramesTable.vue
│   └── App.vue
└── tests/
    └── components/
        ├── StatsDashboard.spec.ts
        ├── FramesTable.spec.ts
        └── App.spec.ts
```

**Structure Decision**: Standard Vue/Vite project structure under `web/`. Modified components live under `web/src/components/` and `web/src/App.vue`. Corresponding unit tests live in `web/tests/components/`.

## Complexity Tracking

*No constitution violations detected.*
