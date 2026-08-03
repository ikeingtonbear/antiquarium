# Tasks: Packet Details View

**Input**: Design documents from `/specs/012-packet-details-view/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: All tasks MUST follow a strict Test-Driven Development (TDD) approach. Test tasks are MANDATORY for all features (including contract, integration, and end-to-end tests) and must be written first to fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `web/src/`, `web/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure
*(No shared setup tasks required for this UI feature as the Vite project is established)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 Update API service in `web/src/services/api.ts` to include `FrameDetail` interface and `getSessionFrameDetail` method.
- [x] T002 Add unit test for `getSessionFrameDetail` in `web/tests/services/api.test.ts`.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Packet Layers and Hexdump (Priority: P1) 🎯 MVP

**Goal**: As a user analyzing network traffic, I want to see a detailed breakdown of a selected packet's layers and its raw hexadecimal representation.

**Independent Test**: Can be fully tested by selecting a packet from the list and verifying that the details pane appears with the correct layered breakdown on the left and hexdump on the right.

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T003 [P] [US1] Create tests for `HexdumpView` component in `web/tests/components/HexdumpView.spec.ts`
- [x] T004 [P] [US1] Create tests for `LayerView` component in `web/tests/components/LayerView.spec.ts`
- [x] T005 [US1] Create tests for `PacketDetails` component in `web/tests/components/PacketDetails.spec.ts`

### Implementation for User Story 1

- [x] T006 [P] [US1] Implement `HexdumpView.vue` in `web/src/components/HexdumpView.vue`
- [x] T007 [P] [US1] Implement `LayerView.vue` in `web/src/components/LayerView.vue`
- [x] T008 [US1] Implement `PacketDetails.vue` in `web/src/components/PacketDetails.vue` integrating the Layer and Hexdump components (depends on T006, T007).
- [x] T009 [US1] Integrate `PacketDetails` component below the packet list in `web/src/App.vue`.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T010 [P] Run `npm run lint` and `npm run format` across the `web/` directory.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- HexdumpView and LayerView can be built simultaneously before PacketDetails.

### Parallel Opportunities

- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- All tests for a user story marked [P] can run in parallel
- Models/Components within a story marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch component tests in parallel:
Task: "Create tests for HexdumpView component in web/tests/components/HexdumpView.spec.ts"
Task: "Create tests for LayerView component in web/tests/components/LayerView.spec.ts"

# Build isolated components in parallel:
Task: "Implement HexdumpView.vue in web/src/components/HexdumpView.vue"
Task: "Implement LayerView.vue in web/src/components/LayerView.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready
