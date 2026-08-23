# Implementation Tasks: Preferences Search Autocomplete

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify project environment is ready for development

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T002 Create `CompletionRequest` and `CompletionItem` interface types in `web/src/types/index.ts` based on backend spec
- [x] T003 Add `getComplete` API method in `web/src/services/api.ts` to call `/sessions/{sessionId}/complete?type=preference&prefix={prefix}`

**Checkpoint**: Foundation ready - API client can make autocomplete calls.

---

## Phase 3: User Story 1 - Autocomplete Preference Search (Priority: P1) 🎯 MVP

**Goal**: Users see autocomplete suggestions as they type in the preferences search bar.

**Independent Test**: Type a partial preference name in the search bar and verify that relevant suggestions are displayed and selectable.

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

- [x] T004 [P] [US1] Add tests for `getComplete` API method in `web/tests/services/api.test.ts` (if exists) or create it
- [x] T005 [P] [US1] Add tests for debounce and autocomplete rendering in `web/tests/components/ConfigModal.test.ts`

### Implementation for User Story 1

- [x] T006 [US1] Implement debounced API call logic in `web/src/components/ConfigModal.vue` triggering on `searchQuery` changes
- [x] T007 [US1] Add UI markup in `web/src/components/ConfigModal.vue` to render the dropdown list of suggestions below the search input
- [x] T008 [US1] Add click and keyboard selection (Enter) handlers to update `searchQuery` with the chosen suggestion in `web/src/components/ConfigModal.vue`
- [x] T009 [US1] Handle error states (e.g. backend unreachable) gracefully in the UI without crashing the modal

**Checkpoint**: User Story 1 complete and independently testable.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T010 [P] Code cleanup and verify Vue template styling for the autocomplete dropdown
- [x] T011 Run all unit tests to ensure > 80% coverage and no regressions

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup**: No dependencies.
- **Foundational**: Depends on Setup.
- **User Story 1**: Depends on Foundational.
- **Polish**: Depends on User Story 1.

### Parallel Opportunities
- Types and API service implementation (T002, T003) can be worked on sequentially or concurrently by one dev.
- Tests (T004, T005) can be written in parallel before UI implementation begins.
- Styling polish (T010) can happen anytime after UI structure (T007) is established.
