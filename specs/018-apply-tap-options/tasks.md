# Tasks: Apply Tap Options

**Input**: Design documents from `/specs/018-apply-tap-options/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: All tasks MUST follow a strict Test-Driven Development (TDD) approach. Test tasks are MANDATORY for all features and must be written first to fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `web/src/`, `web/tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create `types/index.ts` file in `web/src/` to hold common interfaces (SystemInfo, InfoItem, ActiveTap)
- [x] T002 Create `services/api.ts` file in `web/src/` to hold API functions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Define `SystemInfo` and `InfoItem` interfaces in `web/src/types/index.ts` based on `data-model.md`
- [x] T004 [P] Define `ActiveTap` interface in `web/src/types/index.ts` based on `data-model.md`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Apply Tap via Web Interface (Priority: P1) 🎯 MVP

**Goal**: As a user of the sharkophagus web application, I want to apply a specific tap using the web interface so that I can configure the system with the desired tap.

**Independent Test**: Can be fully tested by selecting valid taps in the UI and verifying the expected behavior (success or validation error displayed in the UI).

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T005 [P] [US1] Unit test for `applyTap` function in `web/tests/services/api.spec.ts`
- [x] T006 [P] [US1] Component test for `AddTapModal.vue` applying a tap in `web/tests/components/AddTapModal.spec.ts`

### Implementation for User Story 1

- [x] T007 [P] [US1] Implement `applyTap` API call in `web/src/services/api.ts`
- [x] T008 [US1] Create basic layout for `web/src/components/AddTapModal.vue` displaying "Apply" button and emit events based on `contracts/ui-components.md`
- [x] T009 [US1] Implement tap validation logic and error handling in `web/src/components/AddTapModal.vue`
- [x] T010 [US1] Integrate `AddTapModal.vue` into main view (`web/src/App.vue`) to allow toggling visibility

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 3 - View Tap Results (Priority: P1)

**Goal**: As a user, I want to view the resulting statistics from my applied tap so that I can analyze the captured data.

**Independent Test**: Can be tested by applying a tap that is known to produce statistics and verifying those statistics appear in the UI.

### Tests for User Story 3 (MANDATORY - TDD) ⚠️

- [x] T011 [P] [US3] Component test for `AnalyticsDashboard.vue` displaying tap results in `web/tests/components/AnalyticsDashboard.spec.ts`

### Implementation for User Story 3

- [x] T012 [P] [US3] Create basic layout for `web/src/components/AnalyticsDashboard.vue` based on `contracts/ui-components.md`
- [x] T013 [US3] Implement logic in `AnalyticsDashboard.vue` to display active taps and mock statistics
- [x] T014 [US3] Integrate `AnalyticsDashboard.vue` into main view (`web/src/App.vue`) alongside the modal

**Checkpoint**: At this point, User Stories 1 AND 3 should both work independently

---

## Phase 5: User Story 2 - Discover Available Taps in UI (Priority: P2)

**Goal**: As a user, I want to easily see which taps are available in the web interface so that I can choose one to apply.

**Independent Test**: Can be tested by navigating to the tap selection area in the web app and verifying it matches the output of the "info" backend service.

### Tests for User Story 2 (MANDATORY - TDD) ⚠️

- [x] T015 [P] [US2] Unit test for `getAvailableTaps` function in `web/tests/services/api.spec.ts`
- [x] T016 [P] [US2] Component test for `AddTapModal.vue` listing available taps in `web/tests/components/AddTapModal.spec.ts`

### Implementation for User Story 2

- [x] T017 [P] [US2] Implement `getAvailableTaps` API call in `web/src/services/api.ts` to parse `/info` schema
- [x] T018 [US2] Update `web/src/components/AddTapModal.vue` to fetch and render the list of available taps
- [x] T019 [US2] Update validation in `AddTapModal.vue` to dynamically use fetched `availableTaps`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T020 [P] Code cleanup and refactoring across Vue components
- [x] T021 [P] Styling enhancements using CSS/Tailwind (if applicable) for the Dashboard and Modal
- [x] T022 Run `npm run test` and `npm run lint` in `web/` to ensure all tests and style checks pass

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
- **User Story 3 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Integrates into the UI built in User Story 1

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Services before UI components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- All tests for a user story marked [P] can run in parallel
- Services and independent component layouts can be implemented in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for applyTap function in web/tests/services/api.spec.ts"
Task: "Component test for AddTapModal.vue applying a tap in web/tests/components/AddTapModal.spec.ts"
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
3. Add User Story 3 → Test independently → Deploy/Demo
4. Add User Story 2 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories
