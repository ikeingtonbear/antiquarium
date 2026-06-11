# Implementation Plan: Settings Logical Grouping

**Branch**: `008-settings-logical-grouping` | **Date**: 2026-06-11 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/008-settings-logical-grouping/spec.md`

## Summary

Implement a logical settings grouping layout inside the settings dialog (`ConfigModal.vue`). The modal will be upgraded to a two-column desktop layout featuring a left-hand navigation sidebar (with sections for All Preferences, User Interface, Capture, and alphabetically listed Protocols) and a right-hand settings panel displaying settings filtered by the selected group. On mobile viewports (< 768px), the sidebar collapses into a custom top dropdown menu select element. A search bar allows global filtering, which dynamically presents matching settings grouped under category/protocol headers in a virtual search results view.

## Technical Context

**Language/Version**: TypeScript 5.x, Vue 3.x

**Primary Dependencies**: Vue 3, `@lucide/vue`

**Storage**: Client-side reactive state (persisted to session via API)

**Testing**: Vitest, Vue Test Utils

**Target Platform**: Modern Web Browsers

**Project Type**: Single-page Web Application Frontend

**Performance Goals**: Category switching < 50ms, search filtering < 30ms

**Constraints**: Vanilla CSS, responsive layout, WAI-ARIA compliant

**Scale/Scope**: 1 modified Vue component (`ConfigModal.vue`), 1 modified unit test suite (`ConfigModal.spec.ts`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Test-Driven Development (TDD) Mandatory**: **PASS**. All source code changes will be preceded by failing test cases verifying grouping, sidebar selection, and mobile menu interactions.
- **II. Standardized Coding Style & Comprehensive Documentation**: **PASS**. Code follows standard Prettier, ESLint, and standard Vue/TypeScript practices.
- **III. Leverage Industry-Standard Tooling**: **PASS**. Uses native Vue 3 reactivity (computed, watch, ref), CSS transitions, and Lucide icons.
- **IV. Security-First by Design**: **PASS**. Encapsulates prefix parsing and ensures input values are typed and sanitised.
- **V. Modular & Plugin-Friendly Architecture**: **PASS**. Separation of concern is maintained; categorization logic is extracted into clean helper functions and computed properties.
- **VI. Containerized Building & Dependency Management**: **PASS**. Standard development and test running scripts (npm scripts) are executed in a stable environment.
- **VII. Task-Based Git Commit Strategy**: **PASS**. Commits will occur sequentially task-by-task.

## Project Structure

### Documentation (this feature)

```text
specs/008-settings-logical-grouping/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── quickstart.md        # Phase 1 output
```

### Source Code (repository root)

```text
web/
├── src/
│   └── components/
│       └── ConfigModal.vue   # MODIFIED (categorised layout, sidebar, search grouping, mobile view)
└── tests/
    └── components/
        └── ConfigModal.spec.ts  # MODIFIED (add tests for layout grouping, sidebar, search, mobile)
```

**Structure Decision**: Modified existing single-file Vue component `ConfigModal.vue` and its test suite `ConfigModal.spec.ts` in order to contain all layout, template, and style changes locally, ensuring zero impact on parent/sibling components.
