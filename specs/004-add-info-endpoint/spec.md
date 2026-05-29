# Feature Specification: Add Info Endpoint Information

**Feature Branch**: `004-add-info-endpoint`

**Created**: 2026-05-29

**Status**: Draft

**Input**: User description: "I need to add the information from the 'info' sharkophagus API endpoint."

## Clarifications

- **Q1**: What is the path and HTTP method of the info endpoint?
  - **A**: `GET /info` (global, session-independent endpoint).
- **Q2**: What is the JSON structure and fields returned by the info endpoint?
  - **A**: `SystemInfo` schema as defined in the `/Users/isaiahsalsman/Projects/Antigravity_Workspaces/sharkophagus/specs/006-support-sharkd-info/contracts/openapi.yaml` specification. It includes:
    - `version` (string)
    - `columns` (array of `InfoColumn`: `name`, `format`)
    - `stats` (array of `InfoItem`: `name`, `tap`)
    - `ftypes` (array of strings)
    - `capture_types` (array of `InfoType`: `name`, `description`)
    - `encap_types` (array of `InfoType`: `name`, `description`)
    - `nstat`, `convs`, `seqa`, `taps`, `eo`, `srt`, `rtd`, `follow` (arrays of `InfoItem`: `name`, `tap`)
- **Q3**: Where in the UI should this info be displayed?
  - **A**: Displayed as a version stamp in the global footer (e.g., "Sharkophagus v1.0.0"), alongside an interactive "info" button/icon that opens a modal/overlay to view the full capabilities, columns, and statistics supported by the backend engine.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Backend Version and Engine Information (Priority: P1)

As a security analyst, I want to see the version of the Sharkophagus backend in the global footer, so that I can quickly verify that the UI is connected to an online backend.

**Why this priority**: Displaying basic version/status info is the entry point for ensuring API connectivity on load.

**Independent Test**: The analyst opens the application, and the footer immediately queries `GET /info` and displays the version (e.g., "Sharkophagus v1.0.0").

**Acceptance Scenarios**:

1. **Given** the application has loaded, **When** `GET /info` succeeds, **Then** the global footer displays the text "Sharkophagus v1.0.0" (using the version string returned by the API).
2. **Given** the application has loaded, **When** `GET /info` fails (e.g. backend offline), **Then** the global footer displays "Sharkophagus offline" with an appropriate visual style (e.g., red offline indicator).

---

### User Story 2 - Inspect Detailed Backend Capabilities (Priority: P2)

As a power user, I want to click an information icon next to the version stamp in the footer to open a details modal displaying all supported columns, statistics, capture formats, and protocols, so that I know what capabilities the active backend engine supports.

**Why this priority**: Enables deep inspection of the analyzer's capabilities (columns, stats, etc.) without cluttering the main upload interface.

**Independent Test**: Analyst clicks the info icon, which opens a modal showing categorized lists of all capabilities (columns, stats, capture types, etc.) returned by the `/info` endpoint.

**Acceptance Scenarios**:

1. **Given** the backend info has successfully loaded, **When** the analyst clicks the "info" button in the footer, **Then** a modal opens displaying structured sections for "Supported Columns", "Network Statistics", "Capture Formats", and other returned capabilities.
2. **Given** the capabilities modal is open, **When** the analyst clicks the close button or clicks outside the modal, **Then** the modal closes and focus returns to the main interface.

---

### Edge Cases

- **Backend Offline on Load**: The footer displays "offline" and the info button is disabled/hidden.
- **Empty/Partial Capabilities Lists**: If the backend returns empty arrays for certain capability fields (e.g., no sequence analysis taps), the modal displays a "None supported" placeholder in that section rather than rendering blank areas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST query `GET /info` upon initial application initialization.
- **FR-002**: The application MUST display the version string returned in the `version` property in the global footer of the application.
- **FR-003**: The application MUST render an interactive information icon/button next to the version display in the footer. This button MUST only be enabled/active if the info was retrieved successfully.
- **FR-004**: Clicking the information icon MUST display a "System Capabilities" modal.
- **FR-005**: The System Capabilities modal MUST display the full details returned from the `GET /info` endpoint in organized tabs or collapsible sections, specifically:
  - **Version**: Engine commit/release version.
  - **Display Columns**: Formatted table of columns (`name` and `format`).
  - **Capture & Encap Formats**: Supported file and encapsulation types (`name` and `description`).
  - **Available Taps & Stats**: Network stats (`nstat`), conversations (`convs`), sequence analysis (`seqa`), and other taps.
  - **Filter Types**: Supported field types/filter protocols.
- **FR-006**: The system MUST handle `GET /info` failures gracefully by updating the footer to display an offline status and preventing the capabilities modal from being opened.

### Key Entities

- **SystemInfo**:
  - `version` (string): The git commit or release version.
  - `columns` (array of `InfoColumn`): The supported display column mappings.
  - `stats` / `nstat` / `convs` / `seqa` / `taps` / `eo` / `srt` / `rtd` / `follow` (arrays of `InfoItem`): Analytical features.
  - `capture_types` / `encap_types` (arrays of `InfoType`): Format support.
  - `ftypes` (array of strings): Supported filter fields.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The application automatically retrieves system info on startup, initiating the HTTP request within 50ms of app mount.
- **SC-002**: The global footer displays the version or offline status correctly in all cases.
- **SC-003**: The capabilities modal opens/closes within 200ms of user interaction.

## Assumptions

- **A-001**: The `/info` endpoint is exposed globally at the base URL (e.g., `GET /info` or `GET http://localhost:8080/v1/info`).
- **A-002**: The payload schema matches the OpenAPI contract in the `sharkophagus` repository.
