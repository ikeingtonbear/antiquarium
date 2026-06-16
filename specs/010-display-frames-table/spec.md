# Feature Specification: Display Frames Table

**Feature Branch**: `010-display-frames-table`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "I just implemented the `frames` function from sharkophagus in sharkd. I want to update our UI to display the list of frames. The frame should be displayed in a table-like format where each frame is a row with the appropriate column headers and then the frame values below their respective header. Each frame row should begin with the packet number columns. Columns should be able to be reordered to fit the user's preference of order. They columns should also be able to be hid and unhidden to match the user's view preferences. The total frame table should be limited to display 25 frames before becoming scrollable to view additional frames."

## Clarifications

### Session 2026-06-15
- Q: How should the UI handle backend API errors (e.g., 500 Internal Server Error, network timeouts) when fetching frame data? → A: Display an error message banner inside the table container with a "Retry" button.
- Q: Which packet columns should be visible in the table by default on the initial load of a packet capture? → A: Display a standard default set: Packet Number, Time, Source, Destination, Protocol, Length, Info.
- Q: Should we include a display filter input bar at the top of the frames table as part of this feature, or is it out of scope? → A: The display filter input bar is out of scope for this feature (to be implemented later).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Frames List (Priority: P1)

As a network analyst, I want to see a table listing the network packets (frames) in my capture file, starting with the packet number, so that I can inspect the basic metadata of each packet in sequence.

**Why this priority**: Core value of the feature. Without seeing the list of packets, no further analysis or column customization is useful.

**Independent Test**: Can be fully tested by loading a capture file and observing that a table is rendered with at least 25 frames, each starting with its sequential packet number.

**Acceptance Scenarios**:

1. **Given** a packet capture file is successfully loaded, **When** I view the main capture dashboard, **Then** I should see a table displaying the list of packets.
2. **Given** the frames table is loaded, **When** I inspect a row, **Then** the first column in the row must show the packet number, followed by other metadata columns matching the headers.
3. **Given** a capture file with 100 packets, **When** the table is displayed, **Then** only up to 25 packets should be visible simultaneously, and a scrollbar should allow me to scroll to view the remaining packets.

---

### User Story 2 - Customize Column Order (Priority: P2)

As a network analyst, I want to drag and drop column headers to reorder them according to my preferences, so that I can group related packet fields (like source and destination IP) next to each other.

**Why this priority**: Enhances the user experience by allowing personalization of the analysis layout, but depends on the table being visible first.

**Independent Test**: Can be tested by clicking and dragging a column header to a new position and verifying the table columns rearrange accordingly.

**Acceptance Scenarios**:

1. **Given** the frames table is visible, **When** I click and drag a column header (e.g., "Protocol") and drop it before another header (e.g., "Source"), **Then** the column and all its values should move to that new position.
2. **Given** I have reordered columns, **When** I reload the application, **Then** my custom column ordering must be preserved and restored.

---

### User Story 3 - Hide and Show Columns (Priority: P2)

As a network analyst, I want to hide columns that are not relevant to my current analysis and unhide them later, so that I can reduce visual clutter.

**Why this priority**: Crucial for screen space management during detailed analysis.

**Independent Test**: Can be tested by opening the column configuration menu, deselecting a column to hide it, and selecting it again to show it.

**Acceptance Scenarios**:

1. **Given** the frames table is visible, **When** I open the column configuration menu and uncheck a column (e.g., "Length"), **Then** that column must disappear from the table.
2. **Given** a column is hidden, **When** I open the column configuration menu and check it again, **Then** the column must reappear in its correct order.
3. **Given** I have customized column visibility, **When** I reload the application, **Then** my visibility choices must be preserved.

---

### Edge Cases

- **No frames in capture file**: If the loaded capture file contains zero packets, the system must display a clear "No packets found in this capture" message within the table area instead of an empty, broken table.
- **Very long values in a column**: If a column value is exceptionally long (e.g., a long Info column description), the cell text must truncate gracefully with an ellipsis (`...`) rather than breaking the layout, and hover text/tooltips should reveal the full value.
- **Hiding all columns**: If a user hides all configurable columns, the table must still show the packet number column (which cannot be hidden) to ensure the table remains interactive and recognizable.
- **Backend API Error**: If fetching frame data fails due to network or server errors, the system must display an error message banner inside the table container with a "Retry" button to allow the user to reload the frames.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render network frames in a tabular layout, where each row represents one frame and columns represent metadata fields.
- **FR-002**: Every frame row MUST start with the packet number column, which serves as a fixed reference.
- **FR-003**: The table view container MUST limit the visible height to fit exactly 25 rows of data before displaying a scrollbar for vertical scrolling.
- **FR-004**: Users MUST be able to reorder columns by dragging and dropping column headers.
- **FR-005**: The packet number column MUST NOT be reorderable or hideable; it must always remain as the first column.
- **FR-006**: The system MUST provide a user interface control (e.g., a dropdown menu or modal) listing all available columns with checkboxes to toggle their visibility.
- **FR-007**: User preferences for column order and visibility MUST be persisted across browser sessions.
- **FR-008**: The table MUST load frame data efficiently (using virtualization or lazy loading) to ensure smooth scrolling and avoid browser crashes on large captures.
- **FR-009**: On initial load of a capture file, the table MUST display a standard default set of columns: Packet Number, Time, Source, Destination, Protocol, Length, Info.

### Key Entities *(include if feature involves data)*

- **Frame**: Represents a single network packet. Key attributes:
  - Packet Number: Unique sequential identifier.
  - Column Values: Ordered list of string metadata values corresponding to the capture file fields.
- **Column Definition**: Defines a column's metadata. Key attributes:
  - Header Title: Display name of the column.
  - Visibility Status: Boolean indicating whether the column is currently displayed.
  - Display Order: Numeric index representing the current column sequence.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the frames in any valid capture file must be accessible via scrolling the table.
- **SC-002**: The UI must render the frames table in under 500 milliseconds after a capture file finishes loading.
- **SC-003**: Scrolling through the packet list must remain responsive (60 FPS target) with no visible lag, even when scrolling through 10,000+ packets.
- **SC-004**: Custom column layout changes (order and visibility) must apply instantly (< 100ms) and persist correctly across page refreshes.

## Assumptions

- The list of available packet metadata columns is provided dynamically by the packet analysis engine when a capture file or session is loaded.
- Standard screen sizes (1080p and above) are the primary target, but the table will scale down responsively using horizontal scrolling when necessary.
- Local browser storage (LocalStorage) is available and sufficient for saving column preferences.
- The display filter input bar is out of scope for this initial implementation and will be addressed in a future task.
