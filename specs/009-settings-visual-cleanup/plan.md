# Implementation Plan: Settings Visual Cleanup

**Branch**: `009-settings-visual-cleanup` | **Date**: 2026-06-11 | **Spec**: [spec.md](file:///Users/isaiahsalsman/Projects/Antigravity_Workspaces/antiquarium/specs/009-settings-visual-cleanup/spec.md)

**Input**: Feature specification from `/specs/009-settings-visual-cleanup/spec.md`

## Summary

This feature improves the readability and organization of the Settings UI modal. Setting keys are formatted into human-readable Title Case labels using an abbreviation translation mapper (e.g. converting `pmode` to "Promiscuous Mode"). Related preferences under a category that share common name prefixes are dynamically grouped into styled collapsible card components.

The core logic will be written in a modular, pure-utility module `configFormatter.ts` and thoroughly tested with Vitest before updating the `ConfigModal.vue` template.

## Technical Context

**Language/Version**: TypeScript 5.x / Vue 3.x (Composition API)

**Primary Dependencies**: Vue 3, `@lucide/vue`

**Storage**: Reactive component state (transient collapse status)

**Testing**: Vitest (`npm run test`)

**Target Platform**: Modern Web Browsers (Responsive layouts down to 375px)

**Project Type**: Web application frontend

**Performance Goals**: Category grouping calculations computed in < 15ms

**Constraints**: Purely client-side formatting and layout structure; no backend modifications.

**Scale/Scope**: Prefs modal display cleanup

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Test-Driven Development (TDD) Mandatory**: We will write failing unit tests in `web/tests/services/configFormatter.spec.ts` testing the grouping algorithm and label formatting before implementing the code.
- **II. Standardized Coding Style & Comprehensive Documentation**: We will run linting (`npm run lint`) and formatting checks on all code changes and write clear TypeDocs for helper functions.
- **III. Leverage Industry-Standard Tooling**: Rely on Vue 3 reactive properties, standard CSS flexbox/grid for card styling, and Vitest for testing.
- **IV. Security-First by Design**: Escape text inputs and labels to prevent injection or CSS breakage when rendering settings.
- **V. Modular & Plugin-Friendly Architecture**: Decouple the grouping and naming logic from Vue by placing it in a pure TypeScript service helper `web/src/services/configFormatter.ts`.
- **VII. Task-Based Git Commit Strategy**: Create separate commits for the helper, tests, and component layout integration.

## Project Structure

### Documentation (this feature)

```text
specs/009-settings-visual-cleanup/
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
│   │   └── ConfigModal.vue          # [MODIFY] Render collapsible group cards and friendly labels
│   ├── services/
│   │   └── configFormatter.ts       # [NEW] Config formatting and grouping logic
│   └── types/
│       └── index.ts                 # [MODIFY] Add group types
└── tests/
    ├── components/
    │   └── ConfigModal.spec.ts      # [MODIFY] Verify modal styling and toggle behaviour
    └── services/
        └── configFormatter.spec.ts  # [NEW] Tests for config formatting and grouping
```

**Structure Decision**: A helper service `configFormatter.ts` keeps the business logic of formatting and grouping out of the UI component, which only handles rendering.
