# Tasks: Settings Logical Grouping

**Input**: Design documents from `/specs/008-settings-logical-grouping/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: All tasks MUST follow a strict Test-Driven Development (TDD) approach. Test tasks are MANDATORY for all features and must be written first to fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app: `web/src/`, `web/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify the project build and testing environment are functional in `web/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Define `PreferenceCategory` interface in `web/src/types/index.ts`
- [x] T003 [P] Configure initial import and setup for responsive testing in `web/tests/components/ConfigModal.spec.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Navigate Settings by Category (Priority: P1) 🎯 MVP

**Goal**: Split preferences by prefix namespace, render a two-column desktop sidebar layout, and display stripped sub-property labels.

**Independent Test**: Select a category in the sidebar and verify only settings belonging to that namespace are shown with stripped prefixes.

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

- [x] T004 [P] [US1] Write failing test for sidebar rendering, category selection, and prefix stripping in `web/tests/components/ConfigModal.spec.ts`

### Implementation for User Story 1

- [x] T005 [US1] Implement computed properties `categories` and `groupedConfigs` inside `web/src/components/ConfigModal.vue` to group preferences by first-dot namespace
- [x] T006 [US1] Implement sidebar rendering layout and active category state tracking (`selectedCategoryId`) in `web/src/components/ConfigModal.vue`
- [x] T007 [US1] Update right-hand settings panel to filter by `selectedCategoryId` and format display labels in `web/src/components/ConfigModal.vue`
- [x] T008 [US1] Apply two-column desktop layouts and styles using vanilla CSS in `web/src/components/ConfigModal.vue`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Global Search with Grouped Results (Priority: P2)

**Goal**: Search settings globally and display matches grouped under category headers in a virtual search results view.

**Independent Test**: Enter a search query and verify results are grouped by category headers, bypassing the active sidebar.

### Tests for User Story 2 (MANDATORY - TDD) ⚠️

- [x] T009 [P] [US2] Write failing test for global search and grouping by category headers in `web/tests/components/ConfigModal.spec.ts`

### Implementation for User Story 2

- [x] T010 [US2] Update `filteredConfigs` computed property to support global search and define grouped search computed properties in `web/src/components/ConfigModal.vue`
- [x] T011 [US2] Update settings rendering template to display grouped search results headers when search is active and restore state when cleared in `web/src/components/ConfigModal.vue`

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Browse All Settings (Priority: P2)

**Goal**: Add an "All Preferences" category showing all settings in a flat, alphabetically sorted list.

**Independent Test**: Select "All Preferences" and verify a flat, alphabetical list of all settings is shown with full dot-notation names.

### Tests for User Story 3 (MANDATORY - TDD) ⚠️

- [x] T012 [P] [US3] Write failing test for selecting "All Preferences" and verifying alphabetical flat listing in `web/tests/components/ConfigModal.spec.ts`

### Implementation for User Story 3

- [x] T013 [US3] Implement `'all'` category selection logic and rendering rules (retaining full dot-notation names) in `web/src/components/ConfigModal.vue`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout, transitions, linting, and final validation.

- [x] T014 [P] Write failing test for mobile resizing and dropdown selector display in `web/tests/components/ConfigModal.spec.ts`
- [x] T015 Implement `isMobile` viewport listener and responsive top dropdown category select menu in `web/src/components/ConfigModal.vue`
- [x] T016 [P] Add CSS transitions and Vue transition tags for smooth category content changes in `web/src/components/ConfigModal.vue`
- [x] T017 [P] Run linter and formatter scripts on modified files to verify styling compliance in `web/src/components/ConfigModal.vue` and `web/tests/components/ConfigModal.spec.ts`
- [x] T018 Run the test suite and verify all unit tests pass in `web/`
- [x] T019 Run quickstart.md manual validation checks to confirm feature completion in `web/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- T003 can run in parallel with T002
- User Story tests (T004, T009, T012) and implementation phases can run in parallel by different team members once Phase 2 is complete.

---

## Parallel Example: User Story 1

```bash
# Launch test and implementation components in parallel (if team staffed)
Task: "Write failing test for sidebar rendering, category selection, and prefix stripping in web/tests/components/ConfigModal.spec.ts"
Task: "Implement computed properties categories and groupedConfigs inside web/src/components/ConfigModal.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories
