# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add an autocomplete dropdown to the preferences search bar in the `ConfigModal.vue` component. The UI will query the newly available `/sessions/{sessionId}/complete?type=preference` backend endpoint as the user types, debouncing the input, and present the results in a dropdown for quick selection.

**Language/Version**: TypeScript / Vue 3

**Primary Dependencies**: Vue 3, Vite, @lucide/vue

**Storage**: N/A

**Testing**: Vitest, Vue Test Utils

**Target Platform**: Web Browser

**Project Type**: Web UI

**Performance Goals**: < 500ms for autocomplete suggestions

**Constraints**: Must debounce API requests, gracefully handle network errors

**Scale/Scope**: Adding an autocomplete dropdown feature to the existing `ConfigModal.vue` search bar.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **TDD Adherence**: Tests will be written for the autocomplete logic and debouncing before implementation.
- [x] **Modularity**: The autocomplete fetching logic will be placed in a reusable service or composable to keep `ConfigModal.vue` clean.
- [x] **Containerization**: Existing Docker environment and Vitest will be used.
- [x] **Code Coverage**: We will ensure the new logic achieves > 80% line coverage.

## Project Structure

### Documentation (this feature)

```text
specs/014-preferences-search-autocomplete/
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
│   │   ├── ConfigModal.vue
│   │   └── ConfigModal.test.ts
│   └── services/
│       └── sharkd.ts (or equivalent api service)
└── tests/
```

**Structure Decision**: The feature extends the existing web UI inside the `web` directory. We'll modify `ConfigModal.vue` and the relevant API service, and add tests in the existing structure.
