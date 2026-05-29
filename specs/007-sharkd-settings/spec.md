# Feature Specification: Sharkd Configuration Settings

**Feature Branch**: `007-sharkd-settings`

**Created**: 2026-05-29

**Status**: Draft

**Input**: User description: "The sharkophagus backend api has been update to allow the user to view and set sharkd configurations. I want to add this same capability to the frontend under the settings area."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access and View Sharkd Configurations (Priority: P1)

As a user, I want to access a list of Wireshark/sharkd configuration preferences from the settings area, so that I can inspect the active dissection settings.

**Why this priority**: Core read capability required to inspect the analyzer settings.

**Independent Test**: Can be tested by opening the settings menu, clicking "Preferences", and verifying a list of configurations (such as `udp.check_checksum`) is successfully displayed with their current values.

**Acceptance Scenarios**:

1. **Given** the application is loaded, **When** the user clicks the settings gear icon and selects "Preferences", **Then** the application opens a configuration view showing preferences fetched from the server.
2. **Given** no packet capture session is active, **When** the user opens the configuration view, **Then** they can view the settings but editing is disabled with an explanatory tooltip or message.

---

### User Story 2 - Search and Filter Configurations (Priority: P2)

As a user, I want to search and filter the configuration settings by name or protocol prefix, so that I can quickly find specific options (e.g., searching for "udp").

**Why this priority**: Helps manage a potentially large list of preferences.

**Independent Test**: Type a search query like "udp" in the config search input and verify only preferences starting with or containing "udp" are shown.

**Acceptance Scenarios**:

1. **Given** the configuration view is open, **When** the user types "udp" into the search field, **Then** the list is filtered to display only preferences matching "udp" (e.g., `udp.check_checksum`).

---

### User Story 3 - Edit Configuration Preferences in Session (Priority: P1)

As a user, I want to edit configuration preferences during an active capture session, so that subsequent dissections and analyses automatically apply my updated preferences.

**Why this priority**: Core write capability that allows customizing dissection behavior for the session.

**Independent Test**: With an active session, toggle a boolean preference or change an enum selection, and verify that a network request to `/sessions/{sessionId}/config` is triggered with the correct payload.

**Acceptance Scenarios**:

1. **Given** an active capture session is loaded, **When** the user toggles a boolean configuration option (e.g., enabling `udp.check_checksum`), **Then** the frontend sends a POST request with the new value, displays a success confirmation, and updates the active settings state.
2. **Given** a change to a setting fails on the server, **When** the update response returns an error, **Then** the frontend displays a clear error message and reverts the UI input to its previous value.

---

### Edge Cases

- **Session Expiration / Disconnect**: If the session expires or connection is lost while updating a setting, the change is reverted in the UI and a descriptive error is shown.
- **Handling of Complex Types**: Supported controls are provided for boolean (checkbox/toggle), enum (dropdown), and integer/string (text field), while unsupported types (like `table` or `unknown`) are displayed as read-only text fields.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The settings menu MUST include a new menu item labeled exactly "Preferences".
- **FR-002**: The frontend MUST query the backend GET `/v1/config` endpoint to retrieve available settings upon opening the configuration view.
- **FR-003**: The configuration view MUST support basic search/filter by preference name.
- **FR-004**: The controls for settings MUST correspond to their type:
  - `boolean`: Checkbox / toggle.
  - `enum`: Dropdown selection box (`<select>`) populated with options from the preference's `choices` array.
  - `integer` / `string` / `range`: Input fields matching the type.
  - `table` / `unknown`: Read-only text display.
- **FR-005**: When a setting is updated and a session is active, the frontend MUST perform a `POST` request to `/v1/sessions/{sessionId}/config` with `{"name": "<pref_name>", "value": <new_value>}`.
- **FR-006**: Editing of configurations MUST be disabled when no active session is loaded, displaying a notice (e.g., "Active session required to modify settings").
- **FR-007**: The UI MUST gracefully handle failures by reverting the edited field to its previous value and displaying a non-blocking error notification.

### Key Entities *(include if feature involves data)*

- **ConfigPreference**: Represents a single configuration setting.
  - `name`: Unique preference identifier (e.g., `udp.check_checksum`).
  - `type`: Data type (e.g., `boolean`, `enum`, `integer`, `string`, `range`, `table`, `unknown`).
  - `value`: The current active value.
  - `choices`: (Optional) Available options for `enum` type preferences.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Opening the preferences list renders all fetched items within 300ms of the API response.
- **SC-002**: Applying a preference change updates the UI input state and sends the payload to the server within 100ms of user action (e.g. checkbox click or input blur).
- **SC-003**: Search filter updates the list of displayed configurations in real-time (< 50ms) as the user types.

## Assumptions

- The backend implements `GET /v1/config` and `POST /v1/sessions/{sessionId}/config` as documented in their OpenAPI definitions.
- Configuration preferences are global read, session-write.
