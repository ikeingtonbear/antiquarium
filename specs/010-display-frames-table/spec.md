# Feature Specification: Display Frames Table

**Feature Branch**: `010-display-frames-table`

**Created**: 2026-06-15
**Updated**: 2026-06-16

**Status**: Approved

**Input**: User description: "I just implemented the `frames` function from sharkophagus in sharkd. I want to update our UI to display the list of frames. The frame should be displayed in a table-like format where each frame is a row with the appropriate column headers and then the frame values below their respective header. Each frame row should begin with the packet number columns. Columns should be able to be reordered to fit the user's preference of order. They columns should also be able to be hid and unhidden to match the user's view preferences. The total frame table should be limited to display 25 frames before becoming scrollable to view additional frames."

## Clarifications

### Session 2026-06-15
- Q: How should the UI handle backend API errors (e.g., 500 Internal Server Error, network timeouts) when fetching frame data? → A: Display an error message banner inside the table container with a "Retry" button.
- Q: Which packet columns should be visible in the table by default on the initial load of a packet capture? → A: Display a standard default set: Packet Number, Time, Source, Destination, Protocol, Length, Info.
- Q: Should we include a display filter input bar at the top of the frames table as part of this feature, or is it out of scope? → A: The display filter input bar is out of scope for this feature (to be implemented later).

### Session 2026-06-16 (Post-Implementation Debugging)
- Q: How should the table accommodate custom or empty session-specific columns returned by the backend? → A: The table must dynamically fall back to using the columns list returned in `systemInfo.columns` (representing all columns configured in the Wireshark profile) if session statistics columns are unavailable, rather than locking the user to the hardcoded default set.
- Q: How should the UI handle long metadata strings that overflow columns? → A: Column widths must be resizable, cells must truncate text using an ellipsis, and hover tooltips (`title` attributes) must reveal the full content on hover.
- Q: Should the layout stretch to utilize widescreen monitors? → A: The dashboard layout container must expand dynamically from `820px` to `1200px` (2/3 width) when loading the packet sequence dashboard.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Frames List (Priority: P1)

As a network analyst, I want to see a table listing the network packets (frames) in my capture file, starting with the packet number, so that I can inspect the basic metadata of each packet in sequence.

**Why this priority**: Core value of the feature. Without seeing the list of packets, no further analysis or column customization is useful.

**Acceptance Scenarios**:
1. **Given** a packet capture file is successfully loaded, **When** I view the main capture dashboard, **Then** I should see a table displaying the list of packets.
2. **Given** the frames table is loaded, **When** I inspect a row, **Then** the first column in the row must show the packet number, followed by other metadata columns matching the headers.
3. **Given** a capture file with 100 packets, **When** the table is displayed, **Then** only up to 25 packets should be visible simultaneously, and a scrollbar should allow me to scroll to view the remaining packets.

---

### User Story 2 - Customize Column Order (Priority: P2)

As a network analyst, I want to drag and drop column headers to reorder them according to my preferences, so that I can group related packet fields (like source and destination IP) next to each other.

**Acceptance Scenarios**:
1. **Given** the frames table is visible, **When** I click and drag a column header (e.g., "Protocol") and drop it before another header (e.g., "Source"), **Then** the column and all its values should move to that new position.
2. **Given** I have reordered columns, **When** I reload the application, **Then** my custom column ordering must be preserved and restored.

---

### User Story 3 - Hide and Show Columns (Priority: P2)

As a network analyst, I want to hide columns that are not relevant to my current analysis and unhide them later, so that I can reduce visual clutter.

**Acceptance Scenarios**:
1. **Given** the frames table is visible, **When** I open the column configuration menu and uncheck a column (e.g., "Length"), **Then** that column must disappear from the table.
2. **Given** a column is hidden, **When** I open the column configuration menu and check it again, **Then** the column must reappear in its correct order.

---

### User Story 4 - Resize Column Widths (Priority: P2)

As a network analyst, I want to click and drag the right edge of any column header to resize its width, so that I can read long fields or save horizontal screen space.

**Acceptance Scenarios**:
1. **Given** the frames table is visible, **When** I drag a column's resize handle to the right, **Then** the column and all cells in it must widen instantly.
2. **Given** I have customized column widths, **When** I reload the application, **Then** my custom widths must be preserved and restored.

---

### User Story 5 - Select System Profile Columns (Priority: P2)

As a network analyst, I want to be able to select and toggle any column defined in the active Wireshark/sharkd profile (from `systemInfo.columns`), so that I can view custom or less common columns not present in the default layout.

**Acceptance Scenarios**:
1. **Given** `statistics.columns` is missing/empty, **When** the table mounts, **Then** the column selection checklist must offer all columns returned in the `systemInfo.columns` payload.

---

### Edge Cases

- **No frames in capture file**: If the loaded capture file contains zero packets, the system must display a clear "No packets found in this capture" message within the table area instead of an empty, broken table.
- **Very long values in a column**: If a column value is exceptionally long (e.g., a long Info column description), the cell text must truncate gracefully with an ellipsis (`...`) rather than breaking the layout. Hovering over any cell must display its complete, untruncated value in a browser tooltip using the `title` attribute.
- **Hiding all columns**: If a user hides all customizable columns, only the locked packet number column remains visible. Upon subsequent page reloads, layout cache initialization safeguards the UI by automatically showing all customizable columns if the stored state contains zero visible customizable columns.
- **Backend API Error**: If fetching frame data fails due to network or server errors, the system must display an error message banner inside the table container with a "Retry" button to allow the user to reload the frames.
- **LocalStorage Layout Cache Mismatch**: If the browser's `localStorage` contains a layout from a previous version or pcap with completely mismatched column names, the system must automatically detect the mismatch, discard the invalid cache, and safely default to showing all active columns.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render network frames in a tabular layout, where each row represents one frame and columns represent metadata fields.
- **FR-002**: Every frame row MUST start with the packet number column, which serves as a fixed reference.
- **FR-003**: The table view container MUST limit the visible height to fit exactly 25 rows of data before displaying a scrollbar for vertical scrolling.
- **FR-004**: Users MUST be able to reorder columns by dragging and dropping column headers.
- **FR-005**: The packet number column (represented by the first column returned in the schema) MUST NOT be reorderable or hideable; it must always remain as the first column.
- **FR-006**: The system MUST provide a user interface control (e.g., a dropdown menu) listing all available columns with checkboxes to toggle their visibility.
- **FR-007**: User preferences for column order, visibility, and custom widths MUST be persisted in `LocalStorage` across browser sessions.
- **FR-008**: The table MUST load frame data efficiently (using lazy loading on scroll) to ensure smooth scrolling and avoid browser crashes on large captures.
- **FR-009**: On initial load of a capture file, the table MUST display a standard default set of columns: Packet Number, Time, Source, Destination, Protocol, Length, Info.
- **FR-010**: The table MUST support column resizing. Resizing handle mousedown events MUST NOT trigger the HTML5 header drag-and-drop reordering.
- **FR-011**: If `statistics.columns` is missing or empty, the table MUST fall back to utilizing the list from `systemInfo.columns` to build the selection catalog.
- **FR-012**: Table cell hover tooltips (using the `title` attribute) MUST display the complete, untruncated cell value.
- **FR-013**: The main dashboard container width MUST transition dynamically to `1200px` to accommodate wider column configurations.
- **FR-014**: Table headers MUST be sticky (`position: sticky` and `top: 0`) and have a `z-index` higher than all cells and scrolling columns, maintaining visibility during vertical scrolling.
- **FR-015**: The system MUST map column data values to their correct headers by indexing the column name against the original column list (`props.columns`) returned by the API, rather than relying on the customized column layout order index.
- **FR-016**: The system MUST validate the cached columns layout against the current capture's columns. If there is no overlap between the cached customizable column list and the active columns list (or if parsing fails), the cached layout MUST be discarded and default layouts initialized.
- **FR-017**: If a user attempts to hide all customizable columns, the table layout initialization MUST automatically fallback to showing all customizable columns to prevent a completely empty table state.
- **FR-018**: The system MUST apply visual CSS color-coding to protocol values in the Protocol and Info columns (e.g. unique colors for TCP, UDP, HTTP/SSL/TLS, DNS, ARP, ICMP) to aid in quick packet analysis.
- **FR-019**: The system MUST define default width presets for standard columns (e.g., `100px` for Time, `150px` for Source/Destination, `90px` for Protocol, `80px` for Length, and `450px` for Info) to provide a proportioned layout before user customization.
- **FR-020**: The leftmost packet number column (`No.`) MUST remain horizontally sticky (`position: sticky` and `left: 0`) and have a higher `z-index` in the header (`z-index: 15`) than both the table header (`z-index: 10` / `--z-raised`) and scrolling columns to prevent content overlapping during horizontal scrolling.


### Key Entities

- **Frame**: Represents a single network packet. Key attributes:
  - Packet Number: Unique sequential identifier.
  - Column Values: Ordered list of string metadata values corresponding to the capture file fields.
- **ColumnLayoutConfig**: Defines a column's metadata:
  - Technical Name: Key name of the column (e.g., `"Time"`, `"Source"`).
  - Header Title: Display label of the column.
  - Visibility Status: Boolean indicating whether the column is currently displayed.
  - Width: Optional number in pixels representing the column width.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the frames in any valid capture file must be accessible via scrolling the table.
- **SC-002**: The UI must render the frames table in under 500 milliseconds after a capture file finishes loading.
- **SC-003**: Scrolling through the packet list must remain responsive (60 FPS target) with no visible lag, even when scrolling through 10,000+ packets.
- **SC-004**: Custom column layout changes (order, visibility, and widths) must apply instantly (< 100ms) and persist correctly across page refreshes.

## Assumptions

- The list of available packet metadata columns is provided dynamically by the packet analysis engine when a capture file or session is loaded.
- Local browser storage (LocalStorage) is available and sufficient for saving column preferences.
- The display filter input bar is out of scope for this initial implementation and will be addressed in a future task.
