# Tasks: PCAP Analyse Modal

**Input**: Design documents from `/specs/003-pcap-analyse-modal/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/api-client.md

**Tests**: All tasks MUST follow a strict Test-Driven Development (TDD) approach. Test tasks are MANDATORY for all features (including contract, integration, and end-to-end tests) and must be written first to fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Paths assume frontend project structure under `web/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and validation of spec branch structure

- [x] T001 Verify specification project structure and ensure setup is correct

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define the types and service layer contracts needed for both user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Update TypeScript interfaces in `web/src/types/index.ts` to define `CaptureAnalysis` and update `CaptureStatistics` properties
- [x] T003 [P] Update `SharkophagusApi` class in `web/src/services/api.ts` to add the `getAnalysis(sessionId)` method stub (returning a rejected promise initially)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View PCAP Analysis in Modal (Priority: P1) 🎯 MVP

**Goal**: Refactor the upload flow to fetch stats and analysis in parallel, display them in a modal overlay, and call the bye (DELETE) endpoint when the modal is closed.

**Independent Test**: Mock the stats and analysis endpoints in component tests. Upload a file, verify the modal shows stats (filename, filesize, duration, frames) and analysis (protocols, range bounds), click close, and verify that the session delete endpoint is called.

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T004 [P] [US1] Write unit tests for `getAnalysis` method in `web/tests/services/api.spec.ts` (test success payload and unreachable server/500 errors)
- [x] T005 [P] [US1] Write component tests for `AnalysisModal.vue` in `web/tests/components/AnalysisModal.spec.ts` (verify stats rendering, human-readable file size conversion, protocol list display, and clicking close emits `close` event)
- [x] T006 [P] [US1] Write component integration tests in `web/tests/components/App.spec.ts` verifying that when a session is created successfully, parallel calls to stats and analyse are triggered, the `AnalysisModal` is rendered, and closing it triggers `closeSession` (DELETE) and returns to idle state

### Implementation for User Story 1

- [x] T007 [US1] Implement `getAnalysis` method in `web/src/services/api.ts`
- [x] T008 [P] [US1] Implement `AnalysisModal.vue` component in `web/src/components/AnalysisModal.vue` with premium scoped CSS styling and a close button
- [x] T009 [US1] Refactor state transitions and parallel data fetching (using `Promise.all`) inside `web/src/App.vue` and integrate the `AnalysisModal` component into the layout

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Resilient Error Handling (Priority: P2)

**Goal**: Handle API failures during stats or analysis retrieval by showing a clear error notification and resetting the session.

**Independent Test**: Mock `getAnalysis` or `getStatistics` to fail. Upload a file and verify that the modal is not shown, the error message is displayed in `ErrorNotification`, and the app state returns to idle.

### Tests for User Story 2 (MANDATORY - TDD) ⚠️

- [x] T010 [P] [US2] Write component tests in `web/tests/components/App.spec.ts` simulating a stats or analysis request failure and verifying error banner visibility and idle state reset

### Implementation for User Story 2

- [x] T011 [US2] Update `handleUpload` in `web/src/App.vue` to catch post-upload errors, trigger session cleanup via `closeSession` in the background, set the error notification message, and reset to idle

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T012 Run formatting, lint checks, and the full test suite using `npm run test` inside `web/` to verify correctness
- [x] T013 Verify the manual verification checklist from `quickstart.md`
- [x] T014 [P] Update walkthrough documentation in `walkthrough.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1) is implemented first (MVP)
  - User Story 2 (P2) is implemented second (adds error handling resilience)
- **Polish (Final Phase)**: Depends on all user stories being complete

### Parallel Opportunities

- T003 (Api class setup) and T002 (Types setup) can run in parallel
- T004, T005, and T006 (TDD test suites) can run in parallel
- T008 (AnalysisModal UI component) can be built in parallel with T007 (API implementation)
- T010 (Error tests) and T011 (Error implementation) can run independently after Story 1 is finished

---

## Parallel Example: User Story 1

```bash
# Run API mock tests and Component layout tests concurrently:
Task: "Write unit tests for getAnalysis method in web/tests/services/api.spec.ts"
Task: "Write component tests for AnalysisModal.vue in web/tests/components/AnalysisModal.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational phases.
2. Write tests for User Story 1.
3. Implement `getAnalysis` and `AnalysisModal.vue`.
4. Integrate into `App.vue` and verify all tests pass.

### Incremental Delivery

1. Foundation ready.
2. User Story 1 complete and verified (MVP ready).
3. User Story 2 complete and verified (Error handling ready).
4. Run full validation checks.
