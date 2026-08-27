# Feature Specification: Apply Tap Options

**Feature Branch**: `018-apply-tap-options`

**Created**: 2026-08-25

**Status**: Draft

**Input**: User description: "the "tap" api endpoint in sharkophagus has been implemented. The "info" command provides the available taps that can be implemented, and should be the basis for applying taps and validating input to the tap command. I'm not sure how these should be selected and applied so I would like some possible options for how the user might be able to apply a tap"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Apply Tap via Web Interface (Priority: P1)

As a user of the sharkophagus web application, I want to apply a specific tap using the web interface so that I can configure the system with the desired tap.

**Why this priority**: Applying a tap is the core functionality requested. Being able to do this intuitively is essential for the tool's usability.

**Independent Test**: Can be fully tested by selecting valid taps in the UI and verifying the expected behavior (success or validation error displayed in the UI).

**Acceptance Scenarios**:

1. **Given** the user selects a valid tap from the UI, **When** they submit the action, **Then** the tap is successfully applied by the backend.
2. **Given** the user somehow submits an invalid tap, **When** they attempt to apply it, **Then** the system validates the input against available taps (from "info") and displays a helpful error message in the UI without making the backend request.

---

### User Story 2 - Discover Available Taps in UI (Priority: P2)

As a user, I want to easily see which taps are available in the web interface so that I can choose one to apply.

**Why this priority**: Users need to know what options are available before they can apply them. The "info" data provides this.

**Independent Test**: Can be tested by navigating to the tap selection area in the web app and verifying it matches the output of the "info" backend service.

**Acceptance Scenarios**:

1. **Given** the system has multiple available taps, **When** the user navigates to the tap selection view, **Then** the UI displays a clear list of available taps derived from the "info" data.

---

### User Story 3 - View Tap Results (Priority: P1)

As a user, I want to view the resulting statistics from my applied tap so that I can analyze the captured data.

**Why this priority**: Applying a tap is useless unless the user can see the resulting data.

**Independent Test**: Can be tested by applying a tap that is known to produce statistics and verifying those statistics appear in the UI.

**Acceptance Scenarios**:

1. **Given** a tap has been successfully applied, **When** the backend generates statistics for that tap, **Then** the UI displays those statistics to the user in a readable format.

### Edge Cases

- What happens when the selected tap requires additional configuration parameters that are not provided?
- How does the system handle network timeouts when querying the "info" or "tap" backend services?
- What happens if the data structure for available taps changes unexpectedly?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST fetch available taps using the existing "info" system data.
- **FR-002**: System MUST validate any tap selection against the list of available taps before attempting to apply it.
- **FR-003**: System MUST provide a dedicated "Taps" dashboard page for managing taps. To apply a new tap, users click an "Add Tap" button which opens a modal dialog listing the available taps to select and apply.
- **FR-004**: System MUST successfully instruct the backend system to apply the selected tap when valid.
- **FR-005**: System MUST display an error message if the tap application fails at the backend level.
- **FR-006**: System MUST display the resulting statistics from the applied tap on a separate "Analytics" Dashboard page dedicated to viewing aggregated metrics and data visualizations.

### Key Entities

- **Tap**: Represents a configuration or plugin that can be applied to sharkophagus. Has attributes like name/id and description.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of tap applications initiated by the user are validated against the "info" data before making backend requests.
- **SC-002**: Users can successfully discover and apply a tap within 1 minute of starting the process.
- **SC-003**: Invalid tap inputs are caught locally in 100% of cases, avoiding unnecessary backend errors.

## Assumptions

- The "info" command provides a predictable schema for available taps.
- The backend tap service expects a specific instruction format that can be constructed based on the selected tap.
- Network connectivity is available for both "info" and tap backend interactions.
