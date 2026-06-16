# Implementation Plan: Display Frames Table

**Branch**: `010-display-frames-table` | **Date**: 2026-06-15 | **Spec**: [spec.md](file:///Users/isaiahsalsman/Projects/Antigravity_Workspaces/antiquarium/specs/010-display-frames-table/spec.md)

**Input**: Feature specification from `/specs/010-display-frames-table/spec.md`

## Summary

This feature adds a performant, custom-styled packet/frame listing table to the capture analysis view. The UI will retrieve frame list chunks using the backend `/sessions/{sessionId}/frames` endpoint. Key interactive capabilities include drag-and-drop column header reordering, column visibility toggles (always beginning with and locking the packet number column), error state recovery banners with retry triggers, and a vertical scroll window restricted to 25 rows maximum to control screen space.

We will use Vue 3 composition reactive properties to hold current layout preferences (restored from and persisted to `LocalStorage`) and implement table virtualization or container scroll loading to ensure high-fidelity performance with large captures.

## Technical Context

**Language/Version**: TypeScript 5.x / Vue 3.x (Composition API)

**Primary Dependencies**: Vue 3, `@lucide/vue`

**Storage**: Local browser storage (`LocalStorage`) for custom column layout configuration

**Testing**: Vitest (`npm run test`) with Happy DOM and `@vue/test-utils`

**Target Platform**: Modern Web Browsers (Responsive horizontal scrolling on small viewports)

**Project Type**: Web application frontend

**Performance Goals**: Table rendering under 500ms; UI layout alterations apply under 100ms; 60 FPS scrolling responsiveness

**Constraints**: Client-side layout logic and fetch interactions; must preserve packet number as the permanent leftmost, locked column.

**Scale/Scope**: Rendering up to 10,000+ packets utilizing lazy loading or virtualization.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Test-Driven Development (TDD) Mandatory**: We will write failing unit tests in `web/tests/components/FramesTable.spec.ts` to test default column visibility, hiding/showing, column reordering, scrolling limits, and error handling behaviors before writing the implementation.
- **II. Standardized Coding Style & Comprehensive Documentation**: We will format code with prettier and run ESLint checks, documenting the component props, methods, and reactive state structures.
- **III. Leverage Industry-Standard Tooling**: We will utilize Lucide icons, standard Vue 3 reactivity patterns, and standard CSS grid layouts for table structures.
- **IV. Security-First by Design**: We will sanitize column values before rendering to prevent script injection.
- **V. Modular & Plugin-Friendly Architecture**: We will encapsulate the table layout and logic into a dedicated, reusable `FramesTable.vue` component, maintaining clear Separation of Concerns.
- **VI. Containerized Building & Dependency Management**: All testing and building will run within the provided container/development environment (`npm run dev`/`npm run test`).
- **VII. Task-Based Git Commit Strategy**: We will perform task-based commits for API service changes, type updates, test creation, and component implementation.

## Project Structure

### Documentation (this feature)

```text
specs/010-display-frames-table/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── quickstart.md        # Phase 1 output
```

### Source Code

```text
web/
├── src/
│   ├── components/
│   │   └── FramesTable.vue          # [NEW] Table to view frames list with custom reordering & hiding
│   ├── services/
│   │   └── api.ts                   # [MODIFY] Add getSessionFrames API fetcher method
│   ├── types/
│   │   └── index.ts                 # [MODIFY] Add Frame and Column layout types
│   └── App.vue                      # [MODIFY] Integrate FramesTable below StatsDashboard
└── tests/
    ├── components/
    │   └── FramesTable.spec.ts      # [NEW] Tests for rendering, reordering, hiding, error states, scrolling
    └── services/
        └── api.spec.ts              # [MODIFY] Test getSessionFrames API client method
```

**Structure Decision**: Creating `FramesTable.vue` keeps dashboard logic modular. App.vue manages top-level session state and passes down the active sessionId and SystemInfo data (for column specs).

## Complexity Tracking

*No constitution violations identified.*
