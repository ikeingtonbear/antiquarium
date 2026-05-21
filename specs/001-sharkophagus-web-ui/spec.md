# Feature Specification: Sharkophagus Web UI Frontend

**Feature Branch**: `001-sharkophagus-web-ui`

**Created**: 2026-05-18

**Status**: Approved

**Input**: User description: "I want to build a web ui front end for a backend called sharkophagus - a pcap analysis engine with a REST API. Sharkophagus has an API specification that the front end should use in order to connect to the backend. The initial implementation of the UI should be a simple, but modern. The current sharkophagus API allows for the upload of a PCAP file, so the UI should have an uplaod button that allows the user to select a file, validates the filetype before uploading it to the backend. Once the file is uploaded, the UI should display the status of the sharkophagus backend with an "Ok" button for the user to acknowledge. Once the user accepts the UI should close the sharkophagus session and return to its original state."

## Clarifications

### Session 2026-05-21
- Q: Which frontend tech stack should be used for the Sharkophagus Web UI? → A: VueJS + TypeScript (Vite).
- Q: How should the frontend align with the backend's capture statistics response format? → A: Align frontend models and status view with backend schema (`frames`, `bytes`, `duration`, `firstPacketTime`, `lastPacketTime`).
- Q: What testing toolchain should be used for unit and component testing? → A: Vitest + Vue Test Utils.
- Q: How should the UI handle backend API and network errors? → A: Display a dismissible, floating banner/toast with the error details and allow immediate re-upload.
- Q: Where should the Vue 3 application project structure be initialized within the workspace? → A: In a subdirectory named `web/`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload Capture File with Validation (Priority: P1)

As a network analyst, I want the Web UI to allow me to upload a packet capture file and automatically validate its filetype before uploading, so that I don't waste time uploading invalid files.

**Why this priority**: Uploading and validating capture files is the starting entry point of the entire analysis workflow. Without it, no session can be created.

**Independent Test**: The user can open the Web UI, choose a file to upload, observe that invalid extensions are rejected instantly, and see that valid capture files are successfully uploaded.

**Acceptance Scenarios**:

1. **Given** the Web UI is in its initial state, **When** the user selects a file with an invalid extension, **Then** the UI displays a clear validation error and blocks the upload.
2. **Given** the Web UI is in its initial state, **When** the user selects a file with a valid capture extension, **Then** the file is validated and uploaded, initiating a new analysis session.

---

### User Story 2 - Display Backend Analysis Status (Priority: P2)

As a network analyst, once my capture file is uploaded, I want to see the key metadata and status of the analysis session, so that I can verify the capture was parsed successfully.

**Why this priority**: The user needs confirmation that the backend processed the capture successfully and needs to see basic metadata about the loaded capture.

**Independent Test**: Can be tested by uploading a valid capture file and verifying that the UI displays capture statistics (such as frame count, capture duration, and status).

**Acceptance Scenarios**:

1. **Given** a capture file has been successfully uploaded, **When** the backend initiates the session, **Then** the UI transitions to a status dashboard displaying key capture details and status.

---

### User Story 3 - Graceful Session Termination and Reset (Priority: P3)

As a network analyst, after reviewing the capture status, I want to be able to acknowledge the session and gracefully close it, resetting the UI back to its clean starting state.

**Why this priority**: Properly closing the session releases backend resources (processes, memory) and leaves the interface ready for the next analysis task.

**Independent Test**: The user can click an "Ok" acknowledgment button on the status view, which triggers session cleanup on the backend and returns the user to the initial upload screen.

**Acceptance Scenarios**:

1. **Given** the user is viewing the capture session status, **When** the user clicks the "Ok" / Acknowledge button, **Then** the UI sends a termination request to the backend, closes the session, and returns to the initial file upload view.

---

### Edge Cases

- **Backend Offline or Reachability Issue**: How does the UI handle connection failure when initiating a session or uploading a file? The UI must show a friendly error state allowing the user to retry or check connection settings.
- **Upload Interrupted**: If the user closes or refreshes the page during an active upload, the backend session should not leak resources (addressed by backend session TTL, but the UI should show a warn-on-exit if uploading).
- **Session Expiration**: If a session expires on the backend due to inactivity before the user clicks "Ok", the UI should gracefully handle the 404/expired response and reset to the starting state with an informative message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The UI MUST provide a clean, modern single-page dashboard designed for network analysts.
- **FR-002**: The UI MUST support choosing a packet capture file for analysis.
- **FR-003**: The UI MUST validate the capture file's file extension on the client side before triggering any upload.
- **FR-004**: The UI MUST restrict the allowed file extensions to `.pcap`, `.pcapng`, `.cap`, and `.dmp`.
- **FR-005**: The UI MUST display a dynamic progress bar or upload indicator during the file upload process.
- **FR-006**: The UI MUST make a request to the backend to establish the analysis session.
- **FR-007**: The UI MUST know where to locate the backend server via a build-time environment variable configuration (e.g. `VITE_API_URL` or equivalent).
- **FR-008**: The UI MUST display capture statistics and session details returned from the backend once the capture is loaded.
- **FR-009**: The UI MUST display an acknowledgment ("Ok") button on the status screen.
- **FR-010**: Clicking the acknowledgment button MUST trigger a session termination request to the backend.
- **FR-011**: The session termination request MUST follow the specification of a `DELETE /sessions/{id}` request to destroy the session while leaving the underlying capture file stored on the backend.
- **FR-012**: Upon successful session termination, the UI MUST completely reset its state and return to the starting file upload view.
- **FR-013**: The UI MUST be implemented using Vue 3 with TypeScript and Vite.
- **FR-014**: The frontend test suite MUST use Vitest and Vue Test Utils, targeting at least 80% code coverage.
- **FR-015**: The UI MUST display a dismissible, floating error banner or notification if session creation, statistics retrieval, or session termination fails, allowing the user to select another file without reloading the application.
- **FR-016**: The frontend application codebase MUST be initialized and contained entirely within the `web/` subdirectory of the workspace.

### Key Entities

- **CaptureSession** (aligns with backend schema):
  - `id`: Unique identifier of the analysis session (UUID).
  - `status`: Current state of the session (`active` or `closed`).
  - `createdAt`: Date-time of session creation.
  - *Note: Client-side tracks local `fileName` and `fileSize` from the uploaded file.*
- **CaptureStatistics** (returned from `/sessions/{sessionId}/stats`):
  - `frames`: Total number of packets/frames in the capture file (integer).
  - `bytes`: Total size of the capture file in bytes (integer).
  - `duration`: The duration of the packet capture in seconds (float).
  - `firstPacketTime`: Timestamp of the earliest frame (date-time string).
  - `lastPacketTime`: Timestamp of the latest frame (date-time string).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete a full workflow (upload file, view status, acknowledge, and reset) in under 4 user actions.
- **SC-002**: Client-side validation blocks invalid files in less than 50 milliseconds, before any data is sent to the network.
- **SC-003**: Session termination is initiated immediately (within 100 milliseconds of user clicking the acknowledgment button).
- **SC-004**: 98% of target analysts report that the interface feels highly responsive, modern, and intuitive.

## Assumptions

- **Single-User Focus**: The initial implementation is optimized for a single analyst working with one active capture session at a time.
- **Local/Direct Network**: The UI is assumed to have direct network access to the Sharkophagus REST API without complex gateway hops.
- **Modern Browser Support**: The interface is built for modern evergreen web browsers (Chrome, Safari, Firefox, Edge) supporting standard HTML5, CSS3, and ES6+ features.
