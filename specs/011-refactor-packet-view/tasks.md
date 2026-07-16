# Tasks: Web UI Layout Refactor for Packet-Centric View

**Input**: Design documents from `/specs/011-refactor-packet-view/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: All tasks MUST follow a strict Test-Driven Development (TDD) approach. Test tasks are MANDATORY for all features and must be written first to fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project verification and styling context setup

- [x] T001 Verify project testing environment and verify existing tests pass using `npm run test -- --run` in `web/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core layout preparation that MUST be complete before any user story can be implemented

- [x] T002 Verify local layout structures and active session container variables in `web/src/App.vue`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Focus on Packet Sequence Table (Priority: P1) 🎯 MVP

**Goal**: Hide primary page-level headers and tagline during active sessions and expand layout container to 100% viewport width to maximize screen area for packet table display.

**Independent Test**: Start dev server, upload a PCAP file, and verify that the central table immediately loads in a full-width container and that the large top page header is hidden.

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

- [x] T003 [P] [US1] Write failing unit test in `web/tests/components/App.spec.ts` asserting that when the app is in the `ready` state, the main large header is hidden and the container has the fluid class `.is-ready`.

### Implementation for User Story 1

- [x] T004 [US1] Implement template conditional layout changes in `web/src/App.vue` to hide or shrink the primary header when the app state is `ready` or `deleting`.
- [x] T005 [US1] Update CSS styles in `web/src/App.vue` to make the `.app-container.is-ready` container expand to `max-width: 100%; width: 100%; padding: 0 var(--space-6);` for the full-width viewport.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Compact Metadata and Session Controls (Priority: P2)

**Goal**: Refactor the statistics dashboard to display file info and actions inside a thin top navigation header bar instead of a 2x2 card grid.

**Independent Test**: Verify that the file name, size, frames, and duration stats are displayed in a compact inline row alongside shrunken buttons for ending the session and viewing details.

### Tests for User Story 2 (MANDATORY - TDD) ⚠️

- [x] T006 [P] [US2] Update unit tests in `web/tests/components/StatsDashboard.spec.ts` to assert that `StatsDashboard.vue` renders elements inside a compact horizontal header structure instead of a 2x2 grid of cards, checking that the class `.stats-grid` is replaced and buttons have compact styling.

### Implementation for User Story 2

- [x] T007 [US2] Refactor template and styles in `web/src/components/StatsDashboard.vue` to render the inline shrunken logo, inline metadata details (file name, size, frames, duration), and compact buttons in a horizontal row.
- [x] T008 [US2] Update layout integration in `web/src/App.vue` to position the compact `StatsDashboard` component at the top of the active session view.

**Checkpoint**: At this point, User Stories 1 and 2 should both work together.

---

## Phase 5: User Story 3 - Limited Packet Viewport Height (Priority: P3)

**Goal**: Enforce a CSS maximum height on the table scroll container to limit the visible packets in the scroll pane to exactly 12.

**Independent Test**: Count the number of visible packet rows when 12 or more packets are loaded. Verify that exactly 12 rows are shown before scrolling is required.

### Tests for User Story 3 (MANDATORY - TDD) ⚠️

- [x] T009 [P] [US3] Write failing unit test in `web/tests/components/FramesTable.spec.ts` asserting that the `.table-scroll-container` scrollpane element has the correct CSS style height constraint for 12 rows.

### Implementation for User Story 3

- [x] T010 [US3] Modify styles in `web/src/components/FramesTable.vue` to restrict the `.table-scroll-container` maximum height to exactly `420px` (or corresponding row-height-based calculation) so that exactly 12 rows are shown.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Clean up, formatting, and final validation

- [x] T011 [P] Run Vitest unit tests `npm run test -- --run` in `web/` to verify all tests pass and verify coverage is above 80% line limit.
- [x] T012 Run prettier formatting and eslint check using `npm run format` and `npm run lint` in `web/` to verify style compliance.
- [x] T013 Update development quickstart guide and walkthrough notes if needed.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can then proceed in parallel (if staffed) or sequentially in priority order (P1 → P2 → P3).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable.
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable.

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation.
- Core implementation before integration.
- Story complete before moving to next priority.

### Parallel Opportunities

- Unit test files creation/modification tasks marked [P] can run in parallel.
- Stories can be worked on in parallel by different developers once Phase 2 completes.

---

## Parallel Example: User Story 1

```bash
# Launch test and styles verification tasks for User Story 1 together:
Task: "Write failing unit test in web/tests/components/App.spec.ts"
Task: "Update CSS styles in web/src/App.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories).
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Test User Story 1 independently.
5. Deploy/demo if ready.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready.
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!).
3. Add User Story 2 → Test independently → Deploy/Demo.
4. Add User Story 3 → Test independently → Deploy/Demo.
5. Each story adds value without breaking previous stories.
