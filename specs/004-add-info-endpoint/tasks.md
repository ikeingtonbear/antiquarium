# Tasks: Add Info Endpoint Information

**Input**: Design documents from `/specs/004-add-info-endpoint/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: All tasks MUST follow a strict Test-Driven Development (TDD) approach. Test tasks are MANDATORY and must be written first to fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Define SystemInfo type interfaces in `web/src/types/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core API integrations and mock client extensions that must be complete before UI stories

- [x] T002 Write failing unit tests for the `getSystemInfo` service method in `web/tests/services/api.spec.ts`
- [x] T003 Implement the `getSystemInfo` method inside the API client in `web/src/services/api.ts` to fetch `/info` and pass tests

---

## Phase 3: User Story 1 - View Backend Version and Engine Information (Priority: P1) 🎯 MVP

**Goal**: Display version stamp in global footer with online/offline fallback states

**Independent Test**: Mount AppFooter, verify standard version label rendered from API state. Mock API failure and verify "offline" label rendered.

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

- [x] T004 [P] [US1] Write failing unit tests for the `AppFooter` component in `web/tests/components/AppFooter.spec.ts` (verifying version display and online/offline states)
- [x] T005 [P] [US1] Write failing integration tests in `web/tests/components/App.spec.ts` to ensure `/info` is fetched on app mount

### Implementation for User Story 1

- [x] T006 [P] [US1] Implement the `AppFooter.vue` component under `web/src/components/AppFooter.vue` with scoped CSS styling
- [x] T007 [US1] Update `web/src/App.vue` to fetch `/info` on creation and pass the system status down to the AppFooter component

---

## Phase 4: User Story 2 - Inspect Detailed Backend Capabilities (Priority: P2)

**Goal**: Click an info button to open a capabilities detail modal displaying all returned parameters

**Independent Test**: Open the details modal, verify columns, stats, formats, and taps render in formatted cards/tabs.

### Tests for User Story 2 (MANDATORY - TDD) ⚠️

- [x] T008 [P] [US2] Write failing unit tests for `SystemInfoModal` in `web/tests/components/SystemInfoModal.spec.ts` (verifying modal mounting, closing, tab switches, and capability mapping)
- [x] T009 [P] [US2] Update tests in `web/tests/components/AppFooter.spec.ts` to verify clicking the info button triggers modal opening events

### Implementation for User Story 2

- [x] T010 [P] [US2] Implement the capabilities display modal in `web/src/components/SystemInfoModal.vue` with styled lists for columns, stats, and formats
- [x] T011 [US2] Integrate the `SystemInfoModal` into `web/src/components/AppFooter.vue` and link it to the info button click event

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verify style guidelines, formatting, documentation, and clean up any warnings

- [x] T012 Verify all scoped CSS formatting and layout responsiveness in `web/src/components/AppFooter.vue` and `web/src/components/SystemInfoModal.vue`
- [x] T013 Run full prettier and linter check on all new/modified files (`npm run format` & `npm run lint`)
- [x] T014 Run quickstart.md validation steps and verify all unit tests pass successfully (`npm run test`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 types. Blocks all UI User Stories.
- **User Story 1 (Phase 3)**: Depends on Foundational API method completion. Blocks User Story 2 details.
- **User Story 2 (Phase 4)**: Depends on User Story 1 footer and API state hook.
- **Polish (Phase 5)**: Depends on all user stories being complete.

### Parallel Opportunities

- T004 (Footer tests) and T005 (App integration tests) can be written in parallel.
- T008 (Modal tests) and T009 (Footer click logic tests) can be written in parallel.
- Implementation of T010 (SystemInfoModal component) can run in parallel with general AppFooter enhancements.

---

## Parallel Example: User Story 2

```bash
# Launch test files creation in parallel
Task: "Write failing unit tests for SystemInfoModal in web/tests/components/SystemInfoModal.spec.ts"
Task: "Update tests in web/tests/components/AppFooter.spec.ts to verify clicking the info button"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Define types (Phase 1)
2. Implement backend endpoint calling service (Phase 2)
3. Implement footer displaying version (Phase 3)
4. Validate footer online/offline status manually and with automated tests.

### Incremental Delivery
1. Add footer version stamp (MVP).
2. Add capability detail modal (Story 2).
3. Polish styles and finalize docs.
