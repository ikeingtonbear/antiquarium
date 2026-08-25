# Tasks: Filter Search Validation

**Input**: Design documents from `/specs/016-filter-search-validation/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: All tasks MUST follow a strict Test-Driven Development (TDD) approach. Test tasks are MANDATORY for all features (including contract, integration, and end-to-end tests) and must be written first to fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify project structure and build dependencies in web/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Add `CheckRequest` and `CheckResponse` interfaces in `web/src/services/api.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Validate Filter Input (Priority: P1) 🎯 MVP

**Goal**: Users enter a filter string in the search bar, and the system instantly tells them if it's valid or not.

**Independent Test**: Can be tested by typing valid/invalid filters into the search bar and observing any visual validation feedback, without actually applying the filter to the packet view.

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T003 [P] [US1] Write failing test for `api.check` method in `web/src/services/api.test.ts` (or equivalent test file)
- [x] T004 [P] [US1] Write failing test for `FilterBar` input validation debouncing and UI state in `web/src/components/FilterBar.test.ts` (or equivalent test file)

### Implementation for User Story 1

- [x] T005 [US1] Implement `check` method in `web/src/services/api.ts`
- [x] T006 [US1] Implement debounced `filterText` watcher calling `api.check` in `web/src/components/FilterBar.vue`
- [x] T007 [US1] Add `validationError`, `isValidating`, and `isValid` states to `web/src/components/FilterBar.vue`
- [x] T008 [US1] Implement visual feedback for `validationError` in `web/src/components/FilterBar.vue`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Apply Valid Filter (Priority: P1)

**Goal**: Users apply a valid filter to see only the packets that match their criteria.

**Independent Test**: Can be tested by entering a valid filter, clicking Apply, and observing that the packet view updates to show only the filtered packets.

### Tests for User Story 2 (MANDATORY - TDD) ⚠️

- [x] T009 [P] [US2] Write failing test for disabling Apply button on invalid filter in `web/src/components/FilterBar.test.ts`
- [x] T010 [P] [US2] Write failing test for applying valid filter in `web/src/components/FilterBar.test.ts`

### Implementation for User Story 2

- [x] T011 [US2] Bind Apply button `disabled` state to `isValid` computed property in `web/src/components/FilterBar.vue`
- [x] T012 [US2] Prevent `apply` emit if filter is invalid (e.g. via Enter key) in `web/src/components/FilterBar.vue`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Clear Filter (Priority: P2)

**Goal**: Users clear the current filter to return to viewing all packets in the capture.

**Independent Test**: Can be tested by having an applied filter, clicking clear, and verifying all packets are displayed.

### Tests for User Story 3 (MANDATORY - TDD) ⚠️

- [x] T013 [P] [US3] Write failing test for clear filter action resetting state in `web/src/components/FilterBar.test.ts`

### Implementation for User Story 3

- [x] T014 [US3] Ensure clearing filter resets `validationError` and emits empty apply in `web/src/components/FilterBar.vue`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T015 Code cleanup and formatting in `web/src/components/FilterBar.vue` and `web/src/services/api.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after Foundational (Phase 2), builds on validation logic from US1
- **User Story 3 (P2)**: Can start after Foundational (Phase 2)

### Parallel Opportunities

- Tests within US1 can run in parallel with each other.
- Tests within US2 can run in parallel with each other.
- US1, US2, and US3 tests could technically be drafted in parallel before implementation.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2
2. Complete Phase 3 (US1)
3. STOP and VALIDATE: Verify the user sees validation feedback.
4. Deploy/demo if ready

### Incremental Delivery

1. Foundation ready
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently
4. Add User Story 3 → Test independently
