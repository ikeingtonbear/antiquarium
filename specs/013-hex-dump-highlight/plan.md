# Implementation Plan: Hex Dump to Layer Highlight

**Branch**: `013-hex-dump-highlight` | **Date**: 2026-08-02 | **Spec**: [spec.md](file:///Users/isaiahsalsman/Projects/Antigravity_Workspaces/antiquarium/specs/013-hex-dump-highlight/spec.md)

**Input**: Feature specification from `/specs/013-hex-dump-highlight/spec.md`

## Summary

Add bidirectional highlighting between the hex dump and layer tree views. When a user hovers or selects bytes in the hex dump, the corresponding protocol layer highlights. When a layer is hovered or selected, the corresponding bytes highlight in the hex dump.

## Technical Context

**Language/Version**: TypeScript 5.8 / Vue 3.5

**Primary Dependencies**: Vue 3, Vite, Lucide Vue

**Storage**: N/A

**Testing**: Vitest, Vue Test Utils

**Target Platform**: Web Browser

**Project Type**: web frontend (Vue SPA)

**Performance Goals**: Highlight response time < 50ms

**Constraints**: Must work efficiently with large layer trees and hex dumps.

**Scale/Scope**: HexdumpView.vue, LayerView.vue, and PacketDetails.vue (parent)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Test-Driven Development (TDD) Mandatory**: We will write Vue component tests before implementing the highlight interactions.
- [x] **II. Standardized Coding Style & Comprehensive Documentation**: We will use ESLint/Prettier and document any Vue emit/prop additions.
- [x] **III. Leverage Industry-Standard Tooling**: We rely on Vue 3's reactive reactivity system (`ref`, `computed`, `emit`) for state passing.
- [x] **IV. Security-First by Design**: No security implications.
- [x] **V. Modular & Plugin-Friendly Architecture**: `HexdumpView` and `LayerView` will communicate via `PacketDetails.vue` using Vue events and props, keeping them decoupled.
- [x] **VI. Containerized Building & Dependency Management**: N/A for this code-level change, but CI will run inside Docker.
- [x] **VII. Task-Based Git Commit Strategy**: Tasks will be broken down into granular commits.
- [x] **Test Coverage Gate**: We will ensure 80% coverage on new methods.

## Project Structure

### Documentation (this feature)

```text
specs/013-hex-dump-highlight/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
web/
├── src/
│   ├── components/
│   │   ├── HexdumpView.vue
│   │   ├── LayerView.vue
│   │   └── PacketDetails.vue
│   └── types/
│       └── index.ts
└── tests/
```

**Structure Decision**: Modifying existing Vue components in the `web/src/components` directory.

## Complexity Tracking

No violations of the Constitution or complex deviations.
