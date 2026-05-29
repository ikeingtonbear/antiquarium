# Tasks: Web UI Adjustments and Accessibility Improvements

**Input**: Design documents from `/specs/006-adjust-ui-layout/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: All tasks MUST follow a strict Test-Driven Development (TDD) approach. Test tasks are MANDATORY for all features and must be written first to fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Baseline verification

- [x] T001 Verify and run the Vitest test suite in `web/` to establish a passing baseline

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Pre-checks

- [x] T002 [P] Verify type alignment in `web/src/types/index.ts`

---

## Phase 3: User Story 1 - Settings Menu Clean Text (Priority: P1)

**Goal**: Update the settings menu item label to exactly "Info"

**Independent Test**: Open settings popover and verify menu text is exactly "Info".

### Tests for User Story 1 (MANDATORY - TDD) ⚠️

- [x] T003 [US1] Update `web/tests/components/SettingsMenu.spec.ts` to assert the popover menu item is labeled exactly "Info" (no "System Capabilities").

### Implementation for User Story 1

- [x] T004 [US1] Update `web/src/components/SettingsMenu.vue` to change the menu button label text to "Info".

---

## Phase 4: User Story 2 - Footer Version Info Removal (Priority: P1)

**Goal**: Remove the version string from the persistent footer status text

**Independent Test**: Verify that footer reads "Sharkophagus online" without any version number.

### Tests for User Story 2 (MANDATORY - TDD) ⚠️

- [x] T005 [US2] Update `web/tests/components/AppFooter.spec.ts` to assert the online status text does not contain version details.

### Implementation for User Story 2

- [x] T006 [US2] Update `web/src/components/AppFooter.vue` to compute the online status text as exactly "Sharkophagus online" (removing version stamp).

---

## Phase 5: User Story 3 - Accessible Modal Close Label (Priority: P1)

**Goal**: Update the stats modal close button text to exactly "Close"

**Independent Test**: Upload a pcap and verify modal close button is labeled "Close".

### Tests for User Story 3 (MANDATORY - TDD) ⚠️

- [x] T007 [US3] Update `web/tests/components/AnalysisModal.spec.ts` with a failing test asserting the close button says "Close".

### Implementation for User Story 3

- [x] T008 [US3] Update `web/src/components/AnalysisModal.vue` primary button label to exactly "Close".

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Format and final run

- [x] T009 [P] Run Vitest test suite (`npm run test`) and format code (`npm run format`)
- [x] T010 Run manual verification checklists and document in `walkthrough.md`
