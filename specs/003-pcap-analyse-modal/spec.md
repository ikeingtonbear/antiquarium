# Feature Specification: PCAP Analyse Modal

**Feature Branch**: `003-pcap-analyse-modal`

**Created**: 2026-05-27

**Status**: Draft

**Input**: User description: "The sharkophagus API has been updated with the analyse endpoint. I want to refactor the current UI implementation, so that once a PCAP is uploaded successfully, analyse and status are called, and the returned information from analyse and status is displayed in a modal. The modal should have the filename, filesize, duration, and frames returned from status, and then also display the information returned from the analyse call to display to the user. When the user closes the modal, go ahead and call the bye endpoint to close the session."

## Clarifications

### Session 2026-05-27

- Q: What format/structure does the `/sessions/{id}/analyse` endpoint return? → A: It returns `{"frames": integer, "protocols": array of strings, "first": number, "last": number}` as specified in the sharkophagus OpenAPI contract.
- Q: What endpoint performs the session cleanup? → A: The session is closed via the `DELETE /sessions/{sessionId}` endpoint, which handles the `{"req":"bye"}` clean shutdown internally on the backend.
- Q: What endpoint retrieves capture status/stats? → A: The capture status is retrieved via the `GET /sessions/{sessionId}/stats` endpoint, returning `{"frames": integer, "bytes": integer, "duration": number, "filename": string}`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View PCAP Analysis in Modal (Priority: P1)

As a security analyst, I want to see the key file status and deep analysis results in a consolidated modal overlay immediately after my PCAP upload completes, so that I can inspect the capture without navigating away from the upload interface.

**Why this priority**: High priority as it is the core workflow refactoring. Analysts need to see status and analysis results immediately after upload in a modal overlay.

**Independent Test**: Can be fully tested by selecting a valid PCAP file, watching the upload complete, and verifying that the modal displays the file name, file size, duration, frame count, and analysis findings (including protocols, first packet timestamp, and last packet timestamp) automatically.

**Acceptance Scenarios**:

1. **Given** the analyst is on the upload screen, **When** they upload a valid PCAP file and the upload completes successfully, **Then** the system automatically calls the stats and analysis endpoints, and opens a modal displaying the filename, filesize, duration, frame count, protocols list, first packet time, and last packet time.
2. **Given** the analysis modal is open with the results, **When** the analyst closes the modal (by clicking the close/dismiss button), **Then** the session is closed via `DELETE /sessions/{sessionId}` and the UI returns to the initial upload screen.

---

### User Story 2 - Resilient Error Handling for Stats and Analyse Calls (Priority: P2)

As a security analyst, I want to see a clear error notification if the stats retrieval or analysis fails after a successful upload, so that I understand why the details could not be displayed.

**Why this priority**: Medium priority to ensure system reliability and clear user feedback when API errors occur during stats or analysis.

**Independent Test**: Can be tested by simulating a stats or analysis API failure post-upload and verifying that an error message is shown and the session is cleaned up or retried.

**Acceptance Scenarios**:

1. **Given** a PCAP has been successfully uploaded, **When** either the stats or analysis call fails, **Then** the modal is not shown, a clear error notification is displayed, and the session is closed.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Once a PCAP file is successfully uploaded, the system MUST automatically trigger two parallel or sequential background requests to retrieve:
  - The capture status/statistics via `GET /sessions/{sessionId}/stats`
  - The capture analysis results via `GET /sessions/{sessionId}/analyse`
- **FR-002**: The system MUST display a modal overlay automatically upon receiving both responses successfully.
- **FR-003**: The modal MUST display the following status attributes from the stats response:
  - Filename (`filename` property)
  - Filesize (formatted from the `bytes` property in human-readable format)
  - Duration (`duration` property in seconds)
  - Number of frames (`frames` property)
- **FR-004**: The modal MUST display the analysis information from the analysis response:
  - Total frames analysed
  - List of detected protocols (`protocols` property)
  - Start time (`first` epoch timestamp formatted to a user-friendly format)
  - End time (`last` epoch timestamp formatted to a user-friendly format)
- **FR-005**: The modal MUST provide a prominent action/close button (e.g., "Acknowledge" or "Close").
- **FR-006**: When the analyst closes the modal, the system MUST call the session termination endpoint `DELETE /sessions/{sessionId}` (which triggers the `bye` method on the backend) to clean up the session and transition the user interface back to the idle upload state.

### Key Entities

- **Capture Session**: Represents the active upload and analysis lifecycle context.
- **Capture Status**: The metadata properties of the packet capture including frame count, duration, size in bytes, and filename.
- **Capture Analysis**: Deep-dive analysis results returned for the packet capture session including protocols and packet range bounds.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of successful PCAP uploads trigger the stats and analysis requests automatically.
- **SC-002**: The analysis modal renders in under 500ms after both API responses are received.
- **SC-003**: Closing the modal successfully calls the session termination API and resets the interface state back to the file upload dropzone within 300ms.
- **SC-004**: All file sizes are formatted in human-readable units (e.g., KB, MB) in the modal.

## Assumptions

- **A-001**: The backend provides the `/sessions/{sessionId}/stats`, `/sessions/{sessionId}/analyse`, and `/sessions/{sessionId}` endpoints.
- **A-002**: Terminating the session invalidates the session ID and stops any running daemons.
