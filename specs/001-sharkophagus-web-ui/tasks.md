# Tasks: Sharkophagus Web UI Frontend

**Input**: Design documents from `/specs/001-sharkophagus-web-ui/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: All tasks MUST follow a strict Test-Driven Development (TDD) approach. Test tasks are MANDATORY for all features (including contract, integration, and end-to-end tests) and must be written first to fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- All web files reside within the `web/` subdirectory as specified in the plan.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure under `web/` directory per implementation plan
- [X] T002 Initialize package.json and project configuration files in `web/package.json`
- [X] T003 Configure typescript and bundler settings in `web/tsconfig.json` and `web/vite.config.ts`
- [X] T004 Setup testing toolchain and helper config in `web/vitest.config.ts` and `web/tests/setup.ts`
- [X] T005 Create development Docker container environment in `web/Dockerfile` and `web/docker-compose.yml`
- [X] T006 [P] Create design tokens and basic typography styles in `web/src/assets/base.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Define TypeScript entities, data models, and API interfaces in `web/src/types/index.ts`
- [X] T008 Configure the baseline App mount entrypoint and skeleton structure in `web/src/main.ts`, `web/index.html` and `web/src/App.vue`
- [X] T009 [P] Write unit tests for ErrorNotification component in `web/tests/components/ErrorNotification.spec.ts`
- [X] T010 [P] Implement dismissible floating error toast component in `web/src/components/ErrorNotification.vue`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Upload Capture File with Validation (Priority: P1) 🎯 MVP

**Goal**: Allow users to select a file, perform client-side type checking, and upload to backend with progress indication.

**Independent Test**: Drag or select a file. Verify `.txt` or `.png` is immediately rejected. Verify `.pcap` shows progress animation, uploads, and starts active session state.

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

- [X] T011 [P] [US1] Write unit tests for file extension and size validation in `web/tests/components/FileUpload.spec.ts`
- [X] T012 [P] [US1] Write unit tests for API upload method in `web/tests/services/api.spec.ts`

### Implementation for User Story 1

- [X] T013 [US1] Implement API client upload session method with progress callback in `web/src/services/api.ts`
- [X] T014 [US1] Create FileUpload view component with drag-and-drop zone and validation hooks in `web/src/components/FileUpload.vue`
- [X] T015 [US1] Build upload progress bar and status indicator inside `web/src/components/FileUpload.vue`
- [X] T016 [US1] Integrate FileUpload component and handle transition to upload-progress state in `web/src/App.vue`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Display Backend Analysis Status (Priority: P2)

**Goal**: Retrieve and display packet capture analytics metadata after a file has uploaded successfully.

**Independent Test**: Simulate upload success, verify the UI displays capture statistics cards (`frames`, `bytes`, `duration`, `firstPacketTime`, `lastPacketTime`) matching server payload.

### Tests for User Story 2 (MANDATORY - TDD) ⚠️

- [X] T017 [P] [US2] Write unit tests for session stats display format in `web/tests/components/StatsDashboard.spec.ts`
- [X] T018 [P] [US2] Write unit tests for statistics retrieval method in `web/tests/services/api.spec.ts`

### Implementation for User Story 2

- [X] T019 [US2] Implement API client statistics retrieval method `getStatistics` in `web/src/services/api.ts`
- [X] T020 [US2] Create StatsDashboard view component with beautiful card grid to present parsed stats in `web/src/components/StatsDashboard.vue`
- [X] T021 [US2] Connect state flow in App to query session statistics and render StatsDashboard upon upload success in `web/src/App.vue`

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Graceful Session Termination and Reset (Priority: P3)

**Goal**: Click acknowledgment button to terminate the active session via API and return UI to starting upload state.

**Independent Test**: Open stats dashboard, click Acknowledge button. Confirm a DELETE request is sent, active session is destroyed, and the screen resets to the upload dropzone.

### Tests for User Story 3 (MANDATORY - TDD) ⚠️

- [X] T022 [P] [US3] Write unit tests for session termination action and state reset in `web/tests/components/StatsDashboard.spec.ts`
- [X] T023 [P] [US3] Write unit tests for API close session request in `web/tests/services/api.spec.ts`

### Implementation for User Story 3

- [X] T024 [US3] Implement API client close method `closeSession` to trigger session DELETE in `web/src/services/api.ts`
- [X] T025 [US3] Add Acknowledge button and click event handler to trigger termination in `web/src/components/StatsDashboard.vue`
- [X] T026 [US3] Integrate state reset logic in App to clear session references and return to idle state on deletion success in `web/src/App.vue`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T027 Connect global error toast state to handle all API/network request failures in `web/src/App.vue`
- [X] T028 Refine premium dark mode styling, hover micro-animations, layout responsiveness, and browser scaling in `web/src/assets/base.css` and `web/index.html`
- [X] T029 [P] Run full test suite with coverage collection verifying we pass the >=80% line coverage requirement in `web/package.json`
- [X] T030 Validate application flow and containerized test execution inside the development Docker image

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can then proceed in parallel or sequentially (P1 → P2 → P3).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

---

## Parallel Opportunities

- All Setup tasks marked [P] can run in parallel.
- Foundational tasks marked [P] (T009, T010) can run in parallel.
- All tests for a user story marked [P] can run in parallel.
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows).

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Write unit tests for file extension and size validation in web/tests/components/FileUpload.spec.ts"
Task: "Write unit tests for API upload method in web/tests/services/api.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
