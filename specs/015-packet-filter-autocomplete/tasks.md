# Tasks: Packet Filter Autocomplete

## Phase 1: Setup

**Purpose**: Project initialization and basic structure. Since this is an addition to an existing project, setup focuses on adding new API methods and basic file structure.

- [x] T001 Define `CompleteResponse` and `CompletionItem` interfaces in `web/src/types/api.ts` (if types are centralized) or in `web/src/services/api.ts`
- [x] T002 Update `SharkophagusApi` in `web/src/services/api.ts` to include the `getCompletions(sessionId: string, prefix?: string)` method

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Create skeleton `FilterBar.vue` component in `web/src/components/FilterBar.vue`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Field Autocomplete (Priority: P1) 🎯 MVP

**Goal**: Display suggestions for filter fields and values as the user types in the filter bar.

**Independent Test**: Can be fully tested by verifying that typing in the filter bar triggers a dropdown of suggestions based on the current input.

### Implementation for User Story 1

- [x] T004 [US1] Implement input debounce logic in `web/src/components/FilterBar.vue`
- [x] T005 [US1] Integrate `SharkophagusApi.getCompletions` into `FilterBar.vue` to fetch suggestions based on the debounced input
- [x] T006 [US1] Implement the dropdown UI in `FilterBar.vue` to display fetched `CompletionItem`s
- [x] T007 [US1] Add keyboard navigation (arrow keys, Enter) and mouse selection support to the dropdown in `FilterBar.vue`
- [x] T008 [US1] Implement selection logic to insert the chosen suggestion into the filter input at the correct cursor position in `FilterBar.vue`
- [x] T009 [US1] Add `FilterBar.vue` to the main view (`web/src/views/PacketList.vue` or `web/src/App.vue`) and pass the required `sessionId` prop

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. The filter bar should show suggestions and allow selection.

---

## Phase 4: User Story 2 - Applying Filters (Priority: P2)

**Goal**: Apply the constructed filter to the packet list only after it has been validated and explicitly triggered via an "Apply" button.

**Independent Test**: Can be fully tested by entering a filter, validating it, clicking "Apply", and verifying that the packet list updates accordingly.

### Implementation for User Story 2

- [x] T010 [US2] Add an "Apply" button next to the filter input in `web/src/components/FilterBar.vue`
- [x] T011 [US2] Implement filter validation logic in `FilterBar.vue` (currently a stub check, e.g., non-empty, preparing for future backend check)
- [x] T012 [US2] Implement error icon and tooltip display in `FilterBar.vue` for when validation fails
- [x] T013 [US2] Emit `apply` event from `FilterBar.vue` only when validation succeeds
- [x] T014 [US2] Update the parent view (`web/src/App.vue` or `web/src/views/PacketList.vue`) to listen to the `apply` event and trigger packet filtering

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. The user can type, see suggestions, and click apply to filter packets.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T015 [P] Update unit tests for `web/src/components/FilterBar.vue` using `@vue/test-utils`
- [x] T016 [P] Verify UI layout and styling consistency of `FilterBar.vue` with existing application components
- [x] T017 Run `npm run lint` and `npm run format` to ensure compliance with project standards

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories proceed sequentially in priority order (US1 → US2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 UI components for seamless integration.

### Within Each User Story

- Data integration (API calls) before UI rendering
- Basic UI rendering before interactive features (keyboard navigation, events)

### Parallel Opportunities

- Polish tasks (tests and linting) can run in parallel.
- `FilterBar.vue` tests can be written in parallel by mocking the API service.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently to ensure autocomplete works
5. Proceed to User Story 2.
