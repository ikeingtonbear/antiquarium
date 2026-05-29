# Feature Specification: Web UI Adjustments and Accessibility Improvements

**Feature Branch**: `006-adjust-ui-layout`

**Created**: 2026-05-29

**Status**: Draft

**Input**: User description: "I want to adjust some of the changes you just made. I just want the menu entry for the sharkd info to say "Info" - remove the "System Capabilities" from the item. Remove the sharkophagus version info from the main screen, only have it display in the sharkd info area. Once a file has been successfully uploaded, the stats modal should display "Acknolwledge", "Ok" or "Close" not "Close & End Session". Of the options I've given you, select the best one based on web and accessibility best practices."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Settings Menu Clean Text (Priority: P1)

As a user, I want the settings menu option for capabilities to say simply "Info", so that the interface is concise and matches standard menu nomenclature.

**Why this priority**: Direct requirement to clean up and simplify text content.

**Independent Test**: Verify that when opening the settings popover, the menu item text is "Info" and does not contain "System Capabilities".

**Acceptance Scenarios**:

1. **Given** the settings menu popover is open, **When** the user inspects the menu list, **Then** they see an item labeled exactly "Info".

---

### User Story 2 - Footer Version Info Removal (Priority: P1)

As a user, I want the footer to display only online/offline status and not display the version string on the main page, so that clutter is reduced and version strings are only exposed on request.

**Why this priority**: Layout refinement to reduce clutter and consolidate versioning.

**Independent Test**: Verify that the footer on the main page shows the status (e.g. "Sharkophagus online" or "Sharkophagus offline") without any version stamp (e.g. `v1.0.0`).

**Acceptance Scenarios**:

1. **Given** the application is online, **When** the user views the footer, **Then** they see "Sharkophagus online" (or similar status indicator) without any version number.
2. **Given** the system capabilities modal is open, **When** the user views the header, **Then** the version number is visible there.

---

### User Story 3 - Accessible Modal Close Label (Priority: P1)

As a user, I want the close button in the successfully uploaded session stats modal to be labeled "Close" (following web accessibility best practices), so that its function is clear and predictable.

**Why this priority**: Improves screen reader accessibility and adheres to WAI-ARIA standards for dialog closing actions.

**Independent Test**: Verify that the primary close action button at the bottom of the `AnalysisModal` overlay is labeled "Close".

**Acceptance Scenarios**:

1. **Given** the successfully uploaded session analysis modal is open, **When** the user views the button at the bottom of the modal, **Then** the button text is "Close".

### Edge Cases

- **Loading State in Footer**: If system info is loading, the status text should be "Loading system info..." (no version display).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The settings popover menu item for system capabilities MUST be labeled exactly "Info".
- **FR-002**: The footer status text MUST NOT include the version string, displaying only "Sharkophagus online" or "Sharkophagus offline" depending on connectivity.
- **FR-003**: The version string MUST continue to be rendered in the header badge of the system capabilities modal.
- **FR-004**: The close button at the bottom of the `AnalysisModal` MUST be labeled "Close".

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All screen reader announcements for the stats modal close button read "Close, button".
- **SC-002**: Visual clutter is reduced by removing redundant version info from the persistent footer.

## Assumptions

- **A-001**: "Close" is selected as the optimal label over "Acknowledge" (too formal/unclear side effects) and "Ok" (vague, does not describe the dismiss action).
