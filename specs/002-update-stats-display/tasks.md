# Tasks: Update Stats Display

**Input**: Design documents from `/specs/002-update-stats-display/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: All tasks MUST follow a strict Test-Driven Development (TDD) approach. Test tasks are MANDATORY and must be written first to fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Update TypeScript type definitions in `web/src/types/index.ts` to reflect the updated `CaptureStatistics` schema (removing `bytes`, `firstPacketTime`, and `lastPacketTime`).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Update mock data shapes in `web/tests/components/App.spec.ts`, `web/tests/components/StatsDashboard.spec.ts`, and `web/tests/services/api.spec.ts` to align with the new `CaptureStatistics` type shape.

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Display Updated Session Capture Statistics (Priority: P1) 🎯 MVP

**Goal**: Display exactly the filename, filesize, frames, and duration on the dashboard.

**Independent Test**: Upload a valid file and verify that the dashboard renders exactly the filename, filesize, frames, and duration cards, and does not show any of the old cards.

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T003 [P] [US1] Write failing unit tests in `web/tests/components/StatsDashboard.spec.ts` asserting that only the four requested fields (File Name, File Size, Frames, Duration) are rendered, that "Bytes", "First Packet", and "Last Packet" are not rendered, and that component props include `fileName` and `fileSize`.
- [x] T004 [P] [US1] Write failing integration test in `web/tests/components/App.spec.ts` asserting that `App.vue` passes `fileName` and `fileSize` to `StatsDashboard`.
- [x] T005 [P] [US1] Write failing unit test in `web/tests/services/api.spec.ts` asserting that the `getStatistics` method parsed response matches the updated `CaptureStatistics` interface.

### Implementation for User Story 1

- [x] T006 [US1] Update implementation of `getStatistics` in `web/src/services/api.ts` to align return type with updated `CaptureStatistics` shape.
- [x] T007 [US1] Update props, template, and icons in `web/src/components/StatsDashboard.vue` to display exactly the four cards and remove references/logic for old cards.
- [x] T008 [US1] Update `web/src/App.vue` to pass `fileName` and `fileSize` props to `StatsDashboard.vue`.

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T009 Verify styling and responsiveness of the updated 2x2 grid in `web/src/components/StatsDashboard.vue`.
- [x] T010 Run unit tests locally (`npm run test:unit`) and verify that all tests pass with 80%+ coverage.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3)**: Depends on Foundational phase completion.
- **Polish (Final Phase)**: Depends on all user stories being complete.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Verify tests and code formatting.
