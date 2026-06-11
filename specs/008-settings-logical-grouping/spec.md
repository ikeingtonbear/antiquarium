# Feature Specification: Settings Logical Grouping

**Feature Branch**: `008-settings-logical-grouping`

**Created**: 2026-06-11

**Status**: Draft

**Input**: User description: "I want to update how the settings are displayed. They need to be grouped logically so that a user can quickly find a specific setting. The user guide for Wireshark contains some information about setting preferences (here: https://www.wireshark.org/docs/wsug_html/#ChCustPreferencesSection) including some screenshots. These may not all apply to sharkd's configurations, but you should draw inspiration from here to help organize and display certain settings."

## Clarifications

### Session 2026-06-11

- Q: How should the sidebar interaction and visual state behave when the search input is active versus when it is cleared? → A: Virtual "Search Results" view; sidebar active state is visually suspended (or switches to a temporary "Search Results" item), and the previously selected category is restored when search is cleared.
- Q: Which responsive UX pattern should be used for navigating categories on mobile/small screens (width < 768px)? → A: Top Dropdown Menu Selector: The sidebar navigation is replaced by an elegant custom dropdown menu (combobox style) positioned at the top of the settings panel.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate Settings by Group/Category (Priority: P1)

As a user, I want to navigate configuration preferences using logical categories in a sidebar, so that I can easily find settings related to specific protocols or application areas.

**Why this priority**: Core feature requested to organize the settings and prevent a single overwhelming list.

**Independent Test**: Open the preferences modal, click on a protocol category in the sidebar (e.g., "UDP"), and verify that only UDP-related preferences are displayed.

**Acceptance Scenarios**:

1. **Given** the preferences modal is open, **When** the user clicks "TCP" under the Protocols section in the sidebar, **Then** the settings panel updates to show only preferences starting with the `tcp.` namespace.
2. **Given** a protocol preference category is selected (e.g., "IP"), **When** the preferences are rendered in the panel, **Then** they display the sub-property name (e.g., `defragment`) as the primary label and the full preference path (e.g., `ip.defragment`) as muted, secondary text.

---

### User Story 2 - Global Search with Grouped Results (Priority: P2)

As a user, I want to search for a setting name globally and see the matching settings grouped by their category or protocol, so that I can quickly find the setting and understand its context.

**Why this priority**: Essential for rapid discovery across a large and diverse set of configurations.

**Independent Test**: Enter a search query in the search bar and verify that matching preferences from different namespaces are displayed under headers corresponding to their respective categories.

**Acceptance Scenarios**:

1. **Given** the preferences modal is open, **When** the user enters a search query like "checksum", **Then** the main panel displays matching preferences grouped under category headers (e.g., "UDP" header containing `check_checksum` and "TCP" header containing `check_checksum`).
2. **Given** a search query is active, **When** the user clears the search query, **Then** the settings panel reverts to showing the previously selected sidebar category.

---

### User Story 3 - Browse All Settings (Advanced View) (Priority: P2)

As a user, I want to access a flat, alphabetical list of all settings in an "Advanced" view, so that I can browse or search the entire settings database without filtering by category.

**Why this priority**: Fallback view that ensures all configurations are discoverable, even if they don't map cleanly to predefined UI categories.

**Independent Test**: Select "All Preferences" in the sidebar and verify that a flat scrollable list of all configuration settings is shown.

**Acceptance Scenarios**:

1. **Given** the modal is open, **When** the user selects "All Preferences" in the sidebar, **Then** the panel displays a single alphabetical list of all preferences using their full names (e.g., `custom.table`, `ip.defragment`, `tcp.ports`, `udp.check_checksum`).

---

### Edge Cases

- **Dynamic Protocols/Namespaces**: If the backend returns settings with a namespace that is not predefined (e.g., a new custom dissector prefix), it should automatically appear in the sidebar under "Protocols" in alphabetical order, rather than being omitted.
- **Empty Category Selection**: If a category or protocol in the sidebar has no configuration items, it must be hidden from the sidebar to avoid empty screen states.
- **Uncategorized Prefixes**: Settings that do not start with a recognized category prefix (like `gui.`, `capture.`, or standard protocols) should be grouped under a "Miscellaneous" category in the sidebar if they cannot be categorized.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The preferences modal MUST be updated to use a two-column layout: a left-hand category navigation sidebar and a right-hand settings detail panel.
- **FR-002**: The left-hand sidebar MUST organize settings into the following distinct sections:
  - **All Preferences** (flat advanced view)
  - **User Interface** (containing preferences starting with `gui.`)
  - **Capture** (containing preferences starting with `capture.` or `cap.`)
  - **Protocols** (containing settings starting with protocol prefixes, grouped by their prefix namespace e.g. `ip`, `tcp`, `udp`)
- **FR-003**: The "Protocols" section in the sidebar MUST list all available protocols that have preferences returned by the backend, sorted alphabetically.
- **FR-004**: Clicking on any category or protocol in the sidebar MUST update the active selection and filter the right-hand panel to display only settings belonging to that group.
- **FR-005**: The right-hand panel MUST display a clear category title and description at the top of the content area.
- **FR-006**: When displaying settings inside a specific protocol or category, the setting's sub-property name MUST be displayed as the main title (e.g., `check_checksum` instead of `udp.check_checksum`), with the full dot-notation path shown as secondary monospace helper text.
- **FR-007**: The search input MUST perform a global case-insensitive search across all settings. When a search query is active, the UI MUST activate a virtual "Search Results" view: the sidebar active state is visually suspended (or switches to a temporary "Search Results" selection) and all matching settings are displayed in the main panel grouped by category/protocol. When the search query is cleared, the sidebar MUST restore the previously active category/protocol.
- **FR-008**: The modal layout MUST be responsive. On mobile screens (width < 768px), the sidebar MUST collapse into an elegant custom dropdown menu (combobox style) positioned at the top of the settings panel for category navigation.
- **FR-009**: Transition animations MUST be used when switching between categories in the settings panel to enhance the user experience.
- **FR-010**: All interactive elements (sidebar items, inputs, buttons) MUST have unique, descriptive IDs or class selectors for browser testing and accessibility.

### Key Entities *(include if feature involves data)*

- **ConfigPreference**: Represents a single configuration setting.
  - `name`: Unique preference identifier (e.g., `udp.check_checksum`).
  - `type`: Data type (e.g., `boolean`, `enum`, `integer`, `string`, `range`, `table`, `unknown`).
  - `value`: The current active value.
  - `choices`: (Optional) Available options for `enum` type preferences.
- **PreferenceCategory**: Represents a logical grouping of settings.
  - `id`: Unique group identifier (e.g. `all`, `gui`, `capture`, `protocol-tcp`).
  - `label`: Display name (e.g. "User Interface", "TCP").
  - `prefix`: Namespace prefix used to match setting names (e.g. `gui.`, `tcp.`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Switching categories in the sidebar renders the filtered list in the panel in under 50ms.
- **SC-002**: Performing a search filters and groups all matching preferences globally in under 30ms.
- **SC-003**: The two-column layout successfully adapts to mobile screen sizes (tested at 375px width) without horizontal scroll overflow or overlapping text.

## Assumptions

- Prefixes on configuration setting names consistently use dot-notation (e.g. `prefix.setting_name`).
- The backend configuration endpoints (`GET /v1/config` and `POST /v1/sessions/{sessionId}/config`) remain unchanged; all grouping is performed client-side on the fetched array of preferences.
