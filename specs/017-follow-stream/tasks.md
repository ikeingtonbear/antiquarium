# Tasks: Follow Stream

**Branch**: `017-follow-stream` | **Feature**: Follow Stream | **Date**: 2026-08-25

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure. 
Since this is an existing feature addition, setup is minimal.

- [x] T001 Verify project test infrastructure and component test setup

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Update data models in `web/src/types/index.ts` to include `Follower`, `FollowPayload`, and `FollowResponse` interfaces

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Follow a Stream from Packet (Priority: P1) 🎯 MVP

**Goal**: Allow users to select a packet, view available streams, and display the stream payloads in a modal while filtering the main packet list.

**Independent Test**: Can be fully tested by selecting a TCP packet, initiating the follow stream action, verifying the packet list is filtered to that stream, and verifying the stream payload is displayed in the modal with directional coloring.

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T003 [P] [US1] Create unit test for API service `followStream` in `web/tests/api.test.ts`
- [x] T004 [P] [US1] Create component test for `FollowStreamModal` in `web/tests/FollowStreamModal.test.ts`

### Implementation for User Story 1

- [x] T005 [US1] Implement `followStream` API call in `web/src/services/api.ts`
- [x] T006 [US1] Implement `FollowStreamModal.vue` component in `web/src/components/FollowStreamModal.vue`
- [x] T007 [US1] Update `PacketDetails.vue` to show a context menu/buttons for stream followers in `web/src/components/PacketDetails.vue`
- [x] T008 [US1] Update `App.vue` to handle the follow stream event, apply the stream filter to `FramesTable`, and display the modal in `web/src/App.vue`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T009 [P] Code cleanup and component styling refinement for `FollowStreamModal.vue`
- [x] T010 [P] Validate edge cases handling (e.g. malformed capture or extremely large streams)

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

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Foundational task T002 can run in parallel with Setup
- All tests for US1 (T003, T004) can run in parallel
- Polish tasks can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Create unit test for API service followStream in web/tests/api.test.ts"
Task: "Create component test for FollowStreamModal in web/tests/FollowStreamModal.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready
