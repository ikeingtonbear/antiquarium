# Feature Specification: Update Stats Display

**Feature Branch**: `002-update-stats-display`

**Created**: 2026-05-27

**Status**: Draft

**Input**: User description: "The API for sharkophagus for the stats endpoint has been updated, and the display of the information in the UI needs to be updated. Only display the filename, filesize, frames and duration."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Display Updated Session Capture Statistics (Priority: P1)

As a network analyst, once my capture file is uploaded, I want to see the key metadata of the analysis session, including the upload's filename, filesize, frame count, and duration, so that I can quickly verify the capture was parsed correctly without cluttering my view with timestamps or redundant byte information.

**Why this priority**: Correctly displaying the updated statistics is the main purpose of this feature. Without it, the UI does not align with the updated backend API.

**Independent Test**: The user uploads a file and, once complete, is shown a dashboard displaying exactly the filename, filesize, frame count, and capture duration, and no other stats (like first/last packet times or raw statistics bytes).

**Acceptance Scenarios**:

1. **Given** a capture file has been successfully uploaded and a session created, **When** the statistics are successfully retrieved, **Then** the UI displays the session's filename, filesize, frames, and duration.
2. **Given** the statistics dashboard is loaded, **When** reviewing the display, **Then** no fields for "Bytes", "First Packet", or "Last Packet" are displayed.

### Edge Cases

- **Missing/Zero values**: What happens when the frame count or duration is zero? The UI should display 0 frames and 0.000s duration.
- **Filename overflow**: How does the system handle very long filenames? The UI should truncate or wrap the filename gracefully to prevent UI breakage.
- **Large file size rendering**: How are filesizes displayed? They should be formatted in human-readable units (e.g. Bytes, KB, MB) matching the format used during the upload progress state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The UI MUST display the session filename in the Capture Analysis view.
- **FR-002**: The UI MUST display the session file size in a human-readable format (e.g., KB/MB/Bytes) in the Capture Analysis view.
- **FR-003**: The UI MUST display the frame count in the Capture Analysis view.
- **FR-004**: The UI MUST display the capture duration in seconds in the Capture Analysis view.
- **FR-005**: The UI MUST NOT display raw bytes, first packet time, or last packet time from the statistics response in the Capture Analysis view.

### Key Entities

- **CaptureSession**:
  - `fileName`: The name of the analyzed file.
  - `fileSize`: The size of the analyzed file in bytes.
- **CaptureStatistics**:
  - `frames`: The number of packets/frames in the capture file.
  - `duration`: The duration of the packet capture in seconds.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The UI displays exactly the four requested properties: filename, filesize, frames, and duration.
- **SC-002**: 100% of the outdated display cards ("Bytes", "First Packet Time", "Last Packet Time") are removed from the dashboard layout.
- **SC-003**: The statistics dashboard renders all four fields in under 50 milliseconds once statistics data is loaded.

## Assumptions

- The backend stats endpoint (`GET /sessions/{id}/stats`) has been updated to omit the fields `bytes`, `firstPacketTime`, and `lastPacketTime`.
- The filename and filesize are retrieved from the active capture session object created during the upload phase, rather than the stats endpoint.
