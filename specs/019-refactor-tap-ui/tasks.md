# Tasks: Refactor Tap UI

**Input**: Design documents from `/specs/019-refactor-tap-ui/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: All tasks MUST follow a strict Test-Driven Development (TDD) approach. Test tasks are MANDATORY for all features (including contract, integration, and end-to-end tests) and must be written first to fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- No major project initialization is required for this feature, as it refactors an existing Vue 3 application.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 [P] Write unit tests for API client `applyTaps` method in `web/tests/apiClient.spec.ts`
- [x] T002 [P] Update `TapRequestPayload` type in `web/src/types/index.ts`
- [x] T003 Implement `applyTaps` method in `web/src/services/apiClient.ts` to call `POST /v1/sessions/{sessionId}/tap`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Tap Selection and Batch Application (Priority: P1) 🎯 MVP

**Goal**: Users need to select multiple taps from categorized lists and apply them simultaneously to the backend, up to a maximum limit of 16 taps.

**Independent Test**: Can be fully tested by opening the tap modal, navigating through the accordions, selecting a number of taps, observing the counter, attempting to exceed the limit, and clicking apply to verify the network request payload.

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T004 [P] [US1] Write component tests for `AddTapModal` (accordion grouping) in `web/tests/AddTapModal.spec.ts`
- [x] T005 [P] [US1] Write component tests for `AddTapModal` (16 taps limit & counter) in `web/tests/AddTapModal.spec.ts`
- [x] T006 [P] [US1] Write component tests for `AddTapModal` (batch apply request) in `web/tests/AddTapModal.spec.ts`

### Implementation for User Story 1

- [x] T007 [US1] Implement category accordion grouping in `web/src/components/AddTapModal.vue`
- [x] T008 [US1] Implement multi-selection logic and max limit (16) counter in `web/src/components/AddTapModal.vue`
- [x] T009 [US1] Implement batch Apply button logic to construct `TapRequestPayload` and emit event in `web/src/components/AddTapModal.vue`
- [x] T010 [US1] Wire up the emitted apply event in `web/src/App.vue` to call the `apiClient.applyTaps` method

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Analytics Dashboard Migration and Data Verification (Priority: P2)

**Goal**: Users need to view the statistics of the taps applied during the current session within a dedicated tab in the modal, and view the actual raw data from the backend to verify functionality.

**Independent Test**: Can be tested by applying taps, navigating to the Analytics Dashboard tab in the modal, and verifying that the applied taps are listed and their raw JSON statistics are displayed instead of mock data.

### Tests for User Story 2 (MANDATORY - TDD) ⚠️

- [x] T011 [P] [US2] Write component tests for `AnalyticsDashboard` (raw JSON rendering) in `web/tests/AnalyticsDashboard.spec.ts`
- [x] T012 [P] [US2] Write integration tests for migrating the dashboard into the modal tab in `web/tests/App.spec.ts`

### Implementation for User Story 2

- [x] T013 [US2] Refactor `AnalyticsDashboard.vue` to render raw JSON from the backend in `web/src/components/AnalyticsDashboard.vue`
- [x] T014 [US2] Remove `AnalyticsDashboard` from the main overview in `web/src/App.vue`
- [x] T015 [US2] Add a tabbed interface (e.g., "Add Tap" and "Active Taps") to `web/src/components/AddTapModal.vue`
- [x] T016 [US2] Embed `AnalyticsDashboard` within the "Active Taps" tab in `web/src/components/AddTapModal.vue` and pass active session statistics

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T017 [P] Clean up unused mock data references in `web/src/components/AnalyticsDashboard.vue`
- [x] T018 Run `npm run lint` and `npm run format` to ensure coding standard compliance
- [x] T019 Run full test suite `npm run test`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed sequentially in priority order (P1 → P2) or parallel
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2). Relies on the modal structure from US1.

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models/types before services
- Services before UI components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Foundational tasks marked [P] can run in parallel
- All tests for a user story marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Write component tests for AddTapModal (accordion grouping)"
Task: "Write component tests for AddTapModal (16 taps limit & counter)"
Task: "Write component tests for AddTapModal (batch apply request)"
```

---

## Implementation Strategy

### Incremental Delivery

1. Complete Foundational tasks (API client update).
2. Complete User Story 1 (Modal changes for selecting taps). Validate it independently.
3. Complete User Story 2 (Dashboard migration and JSON display). Validate it independently.
4. Run Polish phase.
