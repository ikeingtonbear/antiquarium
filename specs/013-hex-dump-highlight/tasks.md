# Tasks: Hex Dump to Layer Highlight

**Input**: Design documents from `/specs/013-hex-dump-highlight/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: All tasks MUST follow a strict Test-Driven Development (TDD) approach. Test tasks are MANDATORY for all features (including contract, integration, and end-to-end tests) and must be written first to fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify test environment for Vitest is functioning in `web/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Add `ByteRange` type (e.g. `[number, number]`) to `web/src/types/index.ts` if needed, or define it directly in component interfaces.
- [x] T003 Update `web/src/components/PacketDetails.vue` to declare reactive state `hoveredByteRange` and `selectedByteRange` and pass them as props to `HexdumpView` and `LayerView`. Also define emit handlers.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Hovering over Hex Dump Highlights Layer (Priority: P1) 🎯 MVP

**Goal**: The corresponding protocol layer highlights when hovering over bytes in the hex dump view, and vice-versa.

**Independent Test**: Hover over bytes in HexdumpView and verify LayerView highlights; hover over layer in LayerView and verify HexdumpView highlights.

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T004 [P] [US1] Write failing unit tests for hover interactions in `web/tests/components/HexdumpView.test.ts`
- [x] T005 [P] [US1] Write failing unit tests for hover interactions in `web/tests/components/LayerView.test.ts`

### Implementation for User Story 1

- [x] T006 [P] [US1] Implement mouseover/mouseleave event handlers in `web/src/components/HexdumpView.vue` to emit hovered byte offsets.
- [x] T007 [P] [US1] Implement mouseenter/mouseleave event handlers in `web/src/components/LayerView.vue` to emit hovered layer byte ranges.
- [x] T008 [P] [US1] Implement visual highlighting logic in `web/src/components/HexdumpView.vue` based on `hoveredByteRange` prop.
- [x] T009 [US1] Implement resolution of byte offset to deepest layer and visual highlighting logic in `web/src/components/LayerView.vue` based on `hoveredByteRange` prop.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Selecting Hex Dump Highlights Layer (Priority: P2)

**Goal**: The corresponding protocol layer highlights (persistently) when clicking/selecting bytes in the hex dump view, and vice-versa.

**Independent Test**: Click bytes in HexdumpView and verify LayerView remains highlighted; click layer in LayerView and verify HexdumpView remains highlighted. Both highlights are visible if a selection is active while hovering.

### Tests for User Story 2 (MANDATORY - TDD) ⚠️

- [x] T010 [P] [US2] Write failing unit tests for selection (click) interactions in `web/tests/components/HexdumpView.test.ts`
- [x] T011 [P] [US2] Write failing unit tests for selection (click) interactions in `web/tests/components/LayerView.test.ts`

### Implementation for User Story 2

- [x] T012 [P] [US2] Implement click event handlers in `web/src/components/HexdumpView.vue` to emit selected byte offsets.
- [x] T013 [P] [US2] Implement click event handlers in `web/src/components/LayerView.vue` to emit selected layer byte ranges.
- [x] T014 [P] [US2] Update visual highlighting logic in `web/src/components/HexdumpView.vue` to support distinct styling for `selectedByteRange` and allow simultaneous display with hover.
- [x] T015 [US2] Update visual highlighting logic in `web/src/components/LayerView.vue` to support distinct styling for `selectedByteRange` and expand collapsed parent nodes to show the selected layer.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T016 [P] Run linting and formatting across modified files
- [x] T017 Verify UI performance (response time < 50ms) for large packets and optimize tree search if necessary
- [x] T018 Run quickstart.md manual validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 logic but expands upon it.

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Event emitting logic before highlight rendering logic
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- Once Foundational phase completes, tests for US1 and US2 can be written in parallel
- Component modifications in `HexdumpView` and `LayerView` marked [P] can be implemented in parallel by different developers

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → MVP!
3. Add User Story 2 → Test independently
