# Tasks: Sharkd Configuration Settings

**Input**: Design documents from `/specs/007-sharkd-settings/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: All tasks MUST follow a strict Test-Driven Development (TDD) approach. Test tasks are MANDATORY for all features (including contract, integration, and end-to-end tests) and must be written first to fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Declare types and ApiClient contract in `web/src/types/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Implement stub methods for `getSystemConfig` and `updateSessionConfig` in `web/src/services/api.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Access and View Sharkd Configurations (Priority: P1) 🎯 MVP

**Goal**: View configuration settings in the settings menu, fetching data via API and displaying options in the UI.

**Independent Test**: Click "Preferences" in the settings menu, verify that a modal opens showing the list of configuration options fetched from the backend.

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

- [x] T003 [P] [US1] Write unit tests for SettingsMenu preferences options emission in `web/tests/components/SettingsMenu.spec.ts`
- [x] T004 [P] [US1] Write unit tests for `getSystemConfig` API call in `web/tests/services/api.spec.ts`
- [x] T005 [P] [US1] Write unit tests for ConfigModal list rendering and state locking in `web/tests/components/ConfigModal.spec.ts`
- [/] T006 [P] [US1] Write unit tests for ConfigModal integration in `web/tests/components/App.spec.ts`

### Implementation for User Story 1

- [x] T007 [US1] Implement "Preferences" menu option emission in `web/src/components/SettingsMenu.vue`
- [x] T008 [US1] Implement `getSystemConfig` method in `web/src/services/api.ts`
- [x] T009 [US1] Create the view template and layout logic for `web/src/components/ConfigModal.vue`
- [/] T010 [US1] Integrate `ConfigModal` and bind modal trigger state in `web/src/App.vue`

**Checkpoint**: User Story 1 is functional and testable independently.

---

## Phase 4: User Story 2 - Search and Filter Configurations (Priority: P2)

**Goal**: User can search and filter the configuration settings by name.

**Independent Test**: Type "udp" into the search field of the preferences modal and verify that only matching options (e.g. `udp.check_checksum`) are displayed.

### Tests for User Story 2 (MANDATORY - TDD) ⚠️

- [x] T011 [P] [US2] Write unit tests for search and filter logic in `web/tests/components/ConfigModal.spec.ts`

### Implementation for User Story 2

- [x] T012 [US2] Implement computed filtering list in `web/src/components/ConfigModal.vue`

**Checkpoint**: User Story 2 is functional and testable independently.

---

## Phase 5: User Story 3 - Edit Configuration Preferences in Session (Priority: P1)

**Goal**: Update settings during an active capture session, making POST request to API.

**Independent Test**: Change settings in the modal during an active session, verify that a `POST` request is sent to `/v1/sessions/{sessionId}/config`.

### Tests for User Story 3 (MANDATORY - TDD) ⚠️

- [x] T013 [P] [US3] Write unit tests for `updateSessionConfig` in `web/tests/services/api.spec.ts`
- [x] T014 [P] [US3] Write unit tests for interactive input updates and API calls in `web/tests/components/ConfigModal.spec.ts`

### Implementation for User Story 3

- [x] T015 [US3] Implement `updateSessionConfig` method in `web/src/services/api.ts`
- [x] T016 [US3] Implement input change handlers, type mappings, and API dispatch logic in `web/src/components/ConfigModal.vue`
- [x] T017 [US3] Implement revert-value and error-handling display logic in `web/src/components/ConfigModal.vue`

**Checkpoint**: User Story 3 is functional and testable independently.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T018 Verify styling compliance and responsiveness for the settings modal in `web/src/components/ConfigModal.vue`
- [x] T019 [P] Run `npm run lint` and `npm run format` across modified web files
- [x] T020 Run `quickstart.md` manual validation steps and verify all tests pass with `npm run test -- --run`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- Setup tasks and Foundational stubs can start in parallel.
- Test suites can be written in parallel.
- Once the foundational components and interfaces are in place, the frontend components and API endpoints can be developed.
