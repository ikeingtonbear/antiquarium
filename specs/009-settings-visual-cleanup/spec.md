# Feature Specification: Settings Visual Cleanup

**Feature Branch**: `009-settings-visual-cleanup`

**Created**: 2026-06-11

**Status**: Draft

**Input**: User description: "I want to further organize the visual display of the settings. The settings values in the right hand pane needs some additional clean up. The names are difficult to read with the snake case and dotted hierachy. These should be more human readable. Related settings here should be next to each other logically or grouped together visually to show relationship with each other. (i.e. settings related to "fileopen"). Also if there is a hierarchy of settings this needs to be relfected in the organization of the settings (i.e. capture.devices_hide, capture.devices_pmode and capture.devices_buffersize could all be reflected as capture -> devices -> [hide, pmode, buffersize] etc.)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Human Readable Settings Labels (Priority: P1)

As a user browsing the settings modal, I want to see settings names displayed in a clean, human-readable format (e.g., "Check Checksum" or "Buffer Size") instead of raw snake_case or dot-notated technical keys, so that I can quickly understand what each preference does without technical jargon.

**Why this priority**: Essential to improve readability and usability of the settings interface, addressing the primary friction point reported by users.

**Independent Test**: Open the settings modal, select a category (e.g., "UDP"), and verify that the setting `udp.check_checksum` is displayed with a user-friendly label "Check Checksum" while its raw name `udp.check_checksum` is visible as small, muted secondary text.

**Acceptance Scenarios**:

1. **Given** the settings modal is open and the "UDP" category is active, **When** the list of settings is displayed, **Then** the preference `udp.check_checksum` displays the primary label "Check Checksum" instead of "check_checksum" or "udp.check_checksum".
2. **Given** any setting is rendered in the list, **When** it is displayed, **Then** the raw, dot-separated preference key (e.g. `udp.check_checksum`) is shown as small, low-contrast helper text directly below or next to the main label for advanced reference.
3. **Given** settings with common technical abbreviations (e.g. `pmode`, `buffersize`, `fileopen`), **When** they are formatted into human-readable labels, **Then** they use corrected terminology (e.g. "Promiscuous Mode", "Buffer Size", "File Open") via a configured mapper.

---

### User Story 2 - Hierarchical Setting Grouping (Priority: P1)

As a user looking at a category with many preferences, I want related settings that share common prefix segments (e.g., `capture.devices_hide`, `capture.devices_pmode`, and `capture.devices_buffersize`) to be visually grouped together in card-like sections, so that I can see their relationships and focus on one logical area at a time.

**Why this priority**: Crucial for dividing long, flat lists of preferences into manageable, semantic clusters.

**Independent Test**: Select the "Capture" category and verify that settings starting with `devices_` are grouped under a card titled "Devices", and that their individual field labels within the group are simplified (e.g., "Hide", "Promiscuous Mode", "Buffer Size").

**Acceptance Scenarios**:

1. **Given** a selected sidebar category has multiple settings sharing the same prefix segment (separated by dots or underscores, e.g. `devices_`), **When** the right-hand panel is rendered, **Then** those settings are grouped inside a visual card/section with the header "Devices".
2. **Given** settings are rendered inside a group card (e.g. "Devices"), **When** their individual labels are displayed, **Then** the group prefix is omitted from the label (e.g. `capture.devices_hide` is displayed as "Hide" inside the "Devices" group).
3. **Given** a setting has a unique prefix segment not shared by any other settings in the same category (e.g. `capture.promiscuous`), **When** the settings list is rendered, **Then** it is shown at the root level of the category (e.g., under a default "General" section) rather than being wrapped in a single-item sub-group.

---

### User Story 3 - Collapsible Settings Groups (Priority: P2)

As a user navigating a dense category of settings, I want to be able to collapse or expand grouped sections of settings, so that I can hide options I do not currently need and reduce vertical scrolling.

**Why this priority**: Enhances the user experience on pages with many groups, giving the user control over their workspace layout.

**Independent Test**: Click the collapse button on the "Devices" group card under the "Capture" category and verify that the settings under it are hidden and the section takes up minimal vertical space.

**Acceptance Scenarios**:

1. **Given** a grouped section of settings (e.g., "Devices"), **When** the user clicks the toggle button in the group header, **Then** the group content collapses (hides) or expands (shows) with a smooth transition.
2. **Given** a user changes categories or searches, **When** they return to the category, **Then** the expand/collapse state of the groups is preserved during the current session.

---

### Edge Cases

- **Single-Item Sub-groups**: If only a single setting matches a prefix (e.g., `capture.single_setting`), it MUST NOT be grouped. It should be displayed as a standalone root-level setting to avoid unnecessary headers.
- **Deep Nesting**: If a setting has multiple hierarchy levels (e.g., `gui.fileopen.recent.max_count` and `gui.fileopen.recent.clear_on_exit`), they should be grouped under a nested structure (e.g. Group "File Open" -> Sub-group "Recent" -> ["Max Count", "Clear On Exit"]) up to a maximum depth of 2 levels of nesting to prevent excessive horizontal indentation.
- **Search Result Grouping**: When a search is performed, the matching settings MUST be grouped first by Category (as in the current implementation), and within each category, they should be grouped into their respective sub-groups if they belong to one.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The right-hand settings panel MUST convert raw setting keys (e.g. `summary_in_comment`) into human-readable Title Case labels (e.g. "Summary In Comment").
- **FR-002**: A mapper for common abbreviation translations MUST be implemented to translate technical terms (e.g., `pmode` to "Promiscuous Mode", `buffersize` to "Buffer Size", `fileopen` to "File Open").
- **FR-003**: The full, raw dot-notation setting name (e.g., `ip.summary_in_comment`) MUST be displayed as secondary, low-contrast monospace text beneath the human-readable label.
- **FR-004**: Settings under the active category MUST be dynamically grouped into visual sections (styled as cards or bordered blocks) if two or more settings share a common prefix segment (determined by splitting by dot `.` or underscore `_`).
- **FR-005**: Visual section headers MUST display the human-readable prefix title (e.g., settings starting with `devices_` are grouped under "Devices").
- **FR-006**: Inside a visual section, the individual setting labels MUST omit the shared group prefix to avoid redundant repetition (e.g., display "Hide" instead of "Devices Hide" inside the "Devices" section).
- **FR-007**: Standalone settings that do not share a prefix with other settings MUST be rendered at the root level of the category, positioned before or after the grouped cards.
- **FR-008**: Each grouped section card MUST contain an expand/collapse toggle button in its header. Clicking this button MUST toggle the visibility of the settings within that section.
- **FR-009**: Group collapse/expand transitions MUST be animated smoothly.
- **FR-010**: When searching globally, the search results MUST preserve the hierarchical sub-groups within each category group.

### Key Entities

- **ConfigPreference**: Represents a single configuration setting.
  - `name`: Unique preference identifier (e.g. `capture.devices_hide`).
  - `type`: Data type (e.g. `boolean`, `enum`, `integer`, `string`).
  - `value`: Current configuration value.
- **PreferenceGroup**: Represents a dynamically created group of related settings.
  - `title`: Display title of the group (e.g. "Devices").
  - `prefix`: Prefix used for grouping (e.g. `devices_`).
  - `preferences`: List of child `ConfigPreference` objects.
  - `isCollapsed`: Boolean state indicating if the group is collapsed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Page rendering time remains under 60ms when building and displaying the hierarchical groups for a category with up to 100 settings.
- **SC-002**: The settings panel successfully groups related items (e.g. `devices_` settings) into a single visual container on both desktop and mobile layouts.
- **SC-003**: In user testing, 100% of users can locate specific sub-settings (e.g., finding "Promiscuous Mode" under "Devices") without needing to read raw snake_case names.

## Assumptions

- Settings keys follow a consistent naming convention where prefixes indicate category (`category.`) and sub-categories are separated by dots or underscores.
- Configuration schemas are resolved client-side; no backend API changes are required to support human-readable labels or hierarchical grouping.
