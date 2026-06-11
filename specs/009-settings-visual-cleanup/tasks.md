# Tasks: Settings Visual Cleanup

**Input**: Design documents from `/specs/009-settings-visual-cleanup/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: All tasks MUST follow a strict Test-Driven Development (TDD) approach. Test tasks are MANDATORY and must be written first to fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Configure formatting utility folder structure in `web/src/services/`
- [x] T002 Verify test framework execution by running `npm run test` in `web/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Define typescript interfaces for `PreferenceGroup` and updated settings configurations in `web/src/types/index.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Human Readable Settings Labels (Priority: P1) 🎯 MVP

**Goal**: Convert snake_case/dotted sub-keys to friendly titles using translation mapper.

**Independent Test**: Select a category (e.g. "UDP"), verify `udp.check_checksum` shows "Check Checksum", and raw key is shown as muted secondary text.

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T004 [P] [US1] Write Vitest unit tests for the formatting function in `web/tests/services/configFormatter.spec.ts`
- [x] T005 [P] [US1] Write Vitest component tests for the friendly label rendering inside `web/tests/components/ConfigModal.spec.ts`

### Implementation for User Story 1

- [x] T006 [US1] Implement pure-utility function `toHumanReadableLabel` and friendly abbreviation translations in `web/src/services/configFormatter.ts`
- [x] T007 [US1] Integrate `toHumanReadableLabel` in `web/src/components/ConfigModal.vue` to format labels and render raw keys as secondary text

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Hierarchical Setting Grouping (Priority: P1)

**Goal**: Cluster related settings into visual sub-groups/cards.

**Independent Test**: Select "Capture" category, verify `devices_` options are grouped under a card header "Devices", and prefix is omitted from child labels.

### Tests for User Story 2 (MANDATORY - TDD) ⚠️

- [x] T008 [P] [US2] Write Vitest unit tests for the grouping function in `web/tests/services/configFormatter.spec.ts`
- [x] T009 [P] [US2] Write Vitest component tests for the card layout rendering inside `web/tests/components/ConfigModal.spec.ts`

### Implementation for User Story 2

- [x] T010 [US2] Implement pure-utility function `groupPreferences` in `web/src/services/configFormatter.ts`
- [x] T011 [US2] Update computed properties and template to render card layouts for grouped items in `web/src/components/ConfigModal.vue`
- [x] T012 [US2] Ensure global search results display sub-groups within category sections in `web/src/components/ConfigModal.vue`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Collapsible Settings Groups (Priority: P2)

**Goal**: Support collapsing/expanding cards with transition animations and session persistence.

**Independent Test**: Click collapse toggle on "Devices" card, verify settings disappear with smooth transition, select another category, return, and verify card is still collapsed.

### Tests for User Story 3 (MANDATORY - TDD) ⚠️

- [x] T013 [P] [US3] Write Vitest component tests for toggle state click and collapse/expand transition triggers in `web/tests/components/ConfigModal.spec.ts`

### Implementation for User Story 3

- [x] T014 [US3] Implement collapse/expand state dictionary and toggling functions in `web/src/components/ConfigModal.vue`
- [x] T015 [US3] Add scoped CSS animations and transition wrapper elements for dynamic height transitions in `web/src/components/ConfigModal.vue`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T016 Run automated formatting check (`npm run format`) and lint verification (`npm run lint`) in `web/`
- [x] T017 Run and pass all Vitest tests in `web/` (`npm run test`)
- [x] T018 Verify that the settings layout displays correctly on mobile viewport widths (e.g. 375px) in `web/src/components/ConfigModal.vue`
- [x] T019 Update developer documentation in [quickstart.md](file:///Users/isaiahsalsman/Projects/Antigravity_Workspaces/antiquarium/specs/009-settings-visual-cleanup/quickstart.md) or code comments

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1
- **User Story 3 (P3)**: Can start after US2 is complete

---

## Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All tests for a user story marked [P] can run in parallel
- Helper unit tests and Vue component integration tests can be worked on concurrently

---

## Parallel Example: User Story 1

```bash
# Write unit tests and component integration tests concurrently
Task: "Write Vitest unit tests for the formatting function in web/tests/services/configFormatter.spec.ts"
Task: "Write Vitest component tests for the friendly label rendering inside web/tests/components/ConfigModal.spec.ts"
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
