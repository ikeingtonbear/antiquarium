# Implementation Plan: Web UI Layout and Session Lifecycle Updates

**Branch**: `005-refactor-ui-layout` | **Date**: 2026-05-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/005-refactor-ui-layout/spec.md`

## Summary

Decouple the Analysis Modal close action from the active pcap session lifecycle. Render the `StatsDashboard` component on the main dashboard as the persistent session view once the modal is closed. Rename the dashboard's primary close button to "End Session" (which terminates the active session) and add a secondary "View Analysis Details" button next to it to reopen the analysis details modal. Move the system capabilities info trigger from the footer to a new bottom-right Settings button and popup settings menu.

## Technical Context

**Language/Version**: TypeScript 5.x, Vue 3.x (Composition API)

**Primary Dependencies**: Vue, Lucide Vue icons, Vue Test Utils, Vitest

**Storage**: Memory / Client-Side State

**Testing**: Vitest with `@vue/test-utils` for Vue component testing

**Target Platform**: Modern Web Browsers

**Project Type**: Single-page Web Application Frontend

**Performance Goals**: UI transitions < 300ms, Settings menu toggle response < 100ms

**Constraints**: Vanilla CSS styling, no UI framework leakage, responsive layout

**Scale/Scope**: 1 main application file (App.vue), 2 modified components (StatsDashboard.vue, AppFooter.vue), 1 new Settings/Menu component (or inline in App.vue).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Test-Driven Development (TDD) Mandatory**: **PASS**. Component specifications will be verified via Vitest unit/integration tests before final implementation.
- **II. Coding Style & Documentation**: **PASS**. Code follows ESLint/TS formatting rules. Changes are documented.
- **III. Industry-Standard Tooling**: **PASS**. Reuses Vue 3, `@vue/test-utils` and standard Lucide Vue icons.
- **IV. Security-First**: **PASS**. Secure validation of UI actions and no leak of session identifiers.
- **V. Modular Architecture**: **PASS**. Clean modular separation of concerns between `App.vue`, `StatsDashboard.vue`, and the settings components.
- **VI. Containerized Building**: **PASS**. Build and tests run within the project's standard dev server/container setup.
- **VII. Task-Based Commits**: **PASS**. Will commit incrementally after each sub-task in `tasks.md`.

## Project Structure

### Documentation (this feature)

```text
specs/005-refactor-ui-layout/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── quickstart.md        # Phase 1 output
```

### Source Code

```text
web/
├── src/
│   ├── App.vue
│   ├── components/
│   │   ├── AnalysisModal.vue
│   │   ├── AppFooter.vue
│   │   ├── StatsDashboard.vue
│   │   ├── SystemInfoModal.vue
│   │   └── SettingsMenu.vue
│   └── types/
│       └── index.ts
└── tests/
    └── components/
        ├── App.spec.ts
        └── StatsDashboard.spec.ts
```

**Structure Decision**: Single Vue.js project matching the existing `web/` structure.

## Complexity Tracking

*No violations detected. Standard Vue 3 patterns are used.*
