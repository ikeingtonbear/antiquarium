# Tasks: Web UI Layout and Session Lifecycle Updates

**Input**: Design documents from `/specs/005-refactor-ui-layout/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: All tasks MUST follow a strict Test-Driven Development (TDD) approach. Test tasks are MANDATORY for all features and must be written first to fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project verification and clean environment verification

- [x] T001 Verify and run the existing Vitest test suite in `web/` to establish a baseline of passing tests

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Baseline routing and UI shell adjustments

- [x] T002 [P] Verify type files in `web/src/types/index.ts` to ensure compatibility with local UI presentation fields

---

## Phase 3: User Story 1 - Persisting Active Session on Modal Close (Priority: P1) 🎯 MVP

**Goal**: Close the Capture Analysis Modal overlay without ending the active pcap session

**Independent Test**: Verify that closing the modal does not revert the state back to idle, showing the dashboard instead.

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

- [x] T003 [US1] Write failing test in `web/tests/components/App.spec.ts` verifying that closing the analysis modal keeps the session active and shows the dashboard view.

### Implementation for User Story 1

- [x] T004 [US1] Update state in `web/src/App.vue` to introduce `isAnalysisModalOpen` reactive state, setting it to `true` on successful upload.
- [x] T005 [US1] Update `web/src/App.vue` template and `@close` modal event to close the modal overlay (setting `isAnalysisModalOpen.value = false`) without calling `closeSession` or resetting the session statistics.

---

## Phase 4: User Story 2 - Terminating Active Session Explicitly (Priority: P1)

**Goal**: Support explicit session termination and modal reopening from the Stats Dashboard

**Independent Test**: Verify clicking "End Session" closes the session on the backend and resets to upload, and clicking "View Analysis Details" reopens the modal.

### Tests for User Story 2 (MANDATORY - TDD) ⚠️

- [x] T006 [P] [US2] Update `web/tests/components/StatsDashboard.spec.ts` with failing tests for the renamed "End Session" button and the new "View Analysis Details" button.
- [x] T007 [US2] Write failing integration tests in `web/tests/components/App.spec.ts` verifying that "End Session" triggers backend deletion, and "View Analysis Details" re-displays the analysis modal.

### Implementation for User Story 2

- [x] T008 [P] [US2] Modify `web/src/components/StatsDashboard.vue` to replace the "Acknowledge & Close" button with two buttons: a primary "End Session" button (emitting `end-session`) and a secondary "View Analysis Details" button (emitting `show-details`).
- [x] T009 [US2] Update `web/src/App.vue` to handle the `@end-session` (calling `handleAcknowledge`) and `@show-details` (setting `isAnalysisModalOpen.value = true`) events emitted by `StatsDashboard.vue`.

---

## Phase 5: User Story 3 - Settings Menu and Info Modal Access (Priority: P2)

**Goal**: Implement a Settings button in the bottom-right corner that toggles a settings menu containing an "Info" option to open system capabilities.

**Independent Test**: Click settings button, click Info, verify capabilities modal opens.

### Tests for User Story 3 (MANDATORY - TDD) ⚠️

- [x] T010 [US3] Write failing tests in `web/tests/components/App.spec.ts` (or a new settings spec) verifying that clicking the Settings button toggles the menu and clicking the Info item opens the system capabilities modal.

### Implementation for User Story 3

- [x] T011 [P] [US3] Create `web/src/components/SettingsMenu.vue` containing the gear icon button and popover menu structure with the "Info" option.
- [x] T012 [US3] Update `web/src/App.vue` and `web/src/components/AppFooter.vue` to remove the info button from the footer, position the new settings menu in the bottom-right corner, and link the "Info" action to trigger the system capabilities modal.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify all changes, styles, and write documentation.

- [x] T013 [P] Run final automated test suite (`npm run test`) and ensure all tests pass cleanly.
- [x] T014 Run quickstart manual verification checklist and document changes in `walkthrough.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup.
- **User Story 1 (P1)**: Depends on Phase 2.
- **User Story 2 (P2)**: Depends on US1 completion.
- **User Story 3 (P3)**: Depends on Phase 2.
- **Polish (Final)**: Depends on all user stories.

### Parallel Opportunities

- T006 and T008 can be developed in parallel since they reside inside `StatsDashboard.vue` components and tests.
- T011 can be created in parallel with other tasks.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Verify environment (T001).
2. Implement TDD tests for US1 (T003).
3. Implement US1 modal close preservation (T004, T005).
4. Implement TDD tests for US2 (T006, T007).
5. Implement US2 dashboard buttons (T008, T009).
6. Validate MVP (Verify active session persists, and ends via Dashboard).
