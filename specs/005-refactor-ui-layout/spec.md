# Feature Specification: Web UI Layout and Session Lifecycle Updates

**Feature Branch**: `005-refactor-ui-layout`

**Created**: 2026-05-29

**Status**: Draft

**Input**: User description: "I want to change the layout and some of the behavior of the web UI to prepare for future implementations. Right now, closing the upload modal, ends a sessions. I want to be able to close the modal without ending the session. I also want to move the information about sharkd, including the version etc out of the modal and into the main ui. Make a recommendation on the best place to move this to, whether that should be additional buttons or whether we should start implementing an application menu."

## Clarifications

### Session 2026-05-29

- Q: How should the session termination and modal reopening actions be laid out on the main dashboard? → A: Rename the primary button on `StatsDashboard` to "End Session" and add a secondary button "View Analysis Details" next to it to reopen the modal.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Persisting Active Session on Modal Close (Priority: P1)

As a user, I want to close the capture analysis modal overlay without terminating my active pcap analysis session, so that I can interact with the dashboard underneath.

**Why this priority**: Core requirement to decouples modal state from session lifecycle, enabling future multi-tab or persistent session views.

**Independent Test**: Can be verified by uploading a pcap, closing the modal, and observing that the session remains active in the dashboard instead of reverting to the upload screen.

**Acceptance Scenarios**:

1. **Given** a successfully uploaded packet capture and the analysis modal is visible, **When** the user clicks the "Close" button (e.g., "Close Modal" or X icon), **Then** the analysis modal overlay closes, and the user is shown the active session dashboard.
2. **Given** the analysis modal is closed and a session is active, **When** the user views the main UI, **Then** they see a clear indicator of the active session (e.g. filename) and a "View Analysis Details" button next to the "End Session" button.

---

### User Story 2 - Terminating Active Session Explicitly (Priority: P1)

As a user, I want to explicitly terminate my active session from the main UI when I am done, so that server resources are cleaned up.

**Why this priority**: Required to prevent resource leaks and allow the user to upload a new capture file when finished.

**Independent Test**: Verified by clicking "End Session" in the dashboard, checking that the session delete API is called, and the UI returns to the initial file upload dropzone.

**Acceptance Scenarios**:

1. **Given** a closed analysis modal and an active session, **When** the user clicks the primary "End Session" button in the dashboard, **Then** the application performs the session termination cleanup and transitions back to the idle upload screen.

---

### User Story 3 - Settings Menu and Info Modal Access (Priority: P2)

As a user, I want to access a settings menu from the bottom-right corner of the screen containing an "Info" item, so that I can open the sharkd capabilities details when needed.

**Why this priority**: Implements a clean settings/application menu structure, moving direct links out of the footer and starting a reusable menu pattern.

**Independent Test**: Verified by clicking the settings button in the bottom right, checking that the menu opens, clicking "Info", and verifying that the capabilities modal opens.

**Acceptance Scenarios**:

1. **Given** the application is loaded, **When** the user clicks the Settings button in the bottom-right corner, **Then** the settings menu is displayed.
2. **Given** the settings menu is open, **When** the user clicks the "Info" menu item, **Then** the sharkd capabilities modal opens.

### Edge Cases

- **Refresh / Navigation**: If the page is reloaded, the active session state should gracefully degrade or re-initialize depending on storage.
- **Session API Failure**: If the session close API request fails, the application should display a non-blocking error notification but still allow the UI to reset to the upload dropzone if force-closed.
- **Settings Menu Dismissal**: Clicking outside the settings menu or clicking the settings button again should close the menu.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The close action on the Analysis Modal MUST hide the modal overlay without invoking the session termination API.
- **FR-002**: When a session is active and the modal is closed, the UI MUST display the active session dashboard showing the file statistics.
- **FR-003**: The active session dashboard MUST include an explicit "End Session" button to terminate the session and return the application to the idle (upload) state.
- **FR-004**: The active session dashboard MUST include a "View Analysis Details" button next to the "End Session" button to reopen the Analysis Modal.
- **FR-005**: The UI MUST place a settings button in the bottom-right corner of the screen.
- **FR-006**: Clicking the settings button MUST open a settings menu.
- **FR-007**: The settings menu MUST contain an "Info" option.
- **FR-008**: Clicking the "Info" option MUST open the system capabilities modal showing the sharkd details.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can close the initial analysis modal in under 1 second without losing their active capture data context.
- **SC-002**: Users can transition from an active dashboard back to the idle upload state within 500ms of clicking "End Session".
- **SC-003**: The settings menu opens within 100ms of clicking the settings button.

## Assumptions

- **A-001**: The backend session APIs remain unchanged; only client-side lifecycle handling is modified.
- **A-002**: The stats dashboard is updated to support the main dashboard role when a session is active.
