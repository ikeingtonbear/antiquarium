# Tasks: Display Frames Table

**Input**: Design documents from `/specs/010-display-frames-table/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: All tasks MUST follow a strict Test-Driven Development (TDD) approach. Test tasks are MANDATORY for all features (including contract, integration, and end-to-end tests) and must be written first to fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `web/src/`, `web/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and test suite initialization

- [x] T001 Define Frame and ColumnLayoutConfig types in web/src/types/index.ts
- [x] T002 [P] Create test skeleton file in web/tests/components/FramesTable.spec.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: API integration interface setup

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Implement getSessionFrames API client method in web/src/services/api.ts
- [x] T004 Write unit tests for getSessionFrames API method in web/tests/services/api.spec.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Frames List (Priority: P1) 🎯 MVP

**Goal**: Render network frames in a table structure, lock packet number to the first column, show scrollbar for overflow above 25 rows, lazy load packets.

**Independent Test**: Verify the table displays frames with scrollbar, shows up to 25 rows, and fetches more when scrolling.

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

- [x] T005 [P] [US1] Create failing unit tests for default column rendering and infinite scrolling in web/tests/components/FramesTable.spec.ts

### Implementation for User Story 1

- [x] T006 [US1] Create initial table skeleton and scroll listener in web/src/components/FramesTable.vue
- [x] T007 [US1] Render FramesTable component below StatsDashboard in web/src/App.vue
- [x] T008 [US1] Implement chunk fetching and infinite scroll appending in web/src/components/FramesTable.vue

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Customize Column Order (Priority: P2)

**Goal**: Drag and drop column headers to reorder them and persist layout.

**Independent Test**: Drag header, verify order swaps, reload page, verify order persists.

### Tests for User Story 2 (MANDATORY - TDD) ⚠️

- [x] T009 [P] [US2] Create failing unit tests for drag-and-drop column reordering and persistence in web/tests/components/FramesTable.spec.ts

### Implementation for User Story 2

- [x] T010 [US2] Implement drag-and-drop column header event handlers in web/src/components/FramesTable.vue
- [x] T011 [US2] Implement LocalStorage serialization and loading of column order in web/src/components/FramesTable.vue

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Hide and Show Columns (Priority: P2)

**Goal**: Hide and show columns via dropdown menu.

**Independent Test**: Check/uncheck boxes, verify column presence, reload page, verify visibility persists.

### Tests for User Story 3 (MANDATORY - TDD) ⚠️

- [x] T012 [P] [US3] Create failing unit tests for column visibility toggles and locked packet number in web/tests/components/FramesTable.spec.ts

### Implementation for User Story 3

- [x] T013 [US3] Implement column selector dropdown checklist UI in web/src/components/FramesTable.vue
- [x] T014 [US3] Implement visibility rendering rules and LocalStorage persistence for column visibility in web/src/components/FramesTable.vue

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Loading states, error states, and quality gates verification

- [x] T015 [P] Implement API error recovery banner and reload retry button in web/src/components/FramesTable.vue
- [x] T016 [P] Verify styling rules and run code formatter and linter tools on altered files
- [x] T017 Run full test suite with coverage to satisfy 80% coverage gate

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Parallel Opportunities

- Setup tasks T001 and T002 can run in parallel
- T005, T009, T012 can run in parallel to setup TDD assertions
- T015 and T016 can run in parallel during final polish phase

---

## Parallel Example: User Story 1

```bash
# Set up test assertions:
Task: "T005 Create failing unit tests for default column rendering and infinite scrolling in web/tests/components/FramesTable.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (MVP)
4. **STOP and VALIDATE**: Verify UI displays frames and scrolls correctly
5. Add custom column reordering and visibility features incrementally
