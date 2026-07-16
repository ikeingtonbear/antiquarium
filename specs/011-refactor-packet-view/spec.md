# Feature Specification: Web UI Layout Refactor for Packet-Centric View

**Feature Branch**: `011-refactor-packet-view`

**Created**: 2026-07-16

**Status**: Draft

**Input**: User description: "I want to refactor the web UI to make the view of the packets the primary element of the web ui. The Sharkophagus logo, and tag line should be moved and shrunk to make room for the packet view. Additionally I need the file name, file size, frames and duration information moved into a different area to make room for the packets. Move the End Session and Analysis details into a different area also ane make them a smaller size. Lets also extend the packets frame to use the entire screen to provide a wider view. Limit the quantity of packets visible in the scroll pane to 12."


## Clarifications

### Session 2026-07-16

- Q: How should the limit of 12 visible packets in the scroll pane be enforced? → A: Height-based constraint (CSS): The table scroll container is styled with a maximum height corresponding to exactly 12 rows, allowing the user to scroll vertically to load and view all other packets in the capture.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Focus on Packet Sequence Table (Priority: P1)

As a security analyst, I want the web interface to immediately show a large, wide table of packets after uploading a PCAP file, so that I can inspect the packet sequence without being distracted or restricted by large logo blocks or statistics cards.

**Why this priority**: The core utility of the application is packet inspection. Maximizing vertical and horizontal screen real estate for the packet table directly improves the analyst's efficiency.

**Independent Test**: Upload a PCAP and verify that the packet table occupies the majority of the viewport area immediately upon completion of the upload, and that the header area is highly compact.

**Acceptance Scenarios**:

1. **Given** a packet capture session is successfully initialized, **When** the session view loads, **Then** the packet sequence table is the most prominent element on the screen, occupying at least 70% of the vertical viewport.
2. **Given** a session is active, **When** the page renders, **Then** the Sharkophagus logo and tagline are placed in a compact header bar, with a text size significantly smaller than their display on the home (upload) page.

---

### User Story 2 - Compact Metadata and Session Controls (Priority: P2)

As a security analyst, I want to reference file metadata (file name, file size, frame count, duration) and access session actions (End Session, View Analysis Details) within a compact control bar, so that they do not push the packet list off the screen.

**Why this priority**: These elements provide essential context and control but should not compete with the packet viewer for layout space.

**Independent Test**: Check that file details and session buttons are aligned inline in a unified bar, rather than being displayed as separate blocks or large grid cards.

**Acceptance Scenarios**:

1. **Given** a session is active, **When** inspecting the layout, **Then** the file name, size, total frames, and duration are displayed inside a compact header bar or status bar area rather than a large 2x2 grid of cards.
2. **Given** a session is active, **When** inspecting the controls, **Then** the "End Session" and "View Analysis Details" buttons are smaller in size and located adjacent to the metadata inside the compact header area.

---

### User Story 3 - Limited Packet Viewport Height (Priority: P3)

As a user, I want the packet list scroll pane to fit exactly 12 rows at a time, so that the layout remains clean and structured without extending infinitely, while still allowing me to scroll to load more.

**Why this priority**: Limits the vertical space taken by the table, ensuring that the layout remains bounded and consistent across different viewport resolutions.

**Independent Test**: Check the packet list scroll pane and count the number of visible packet rows when 12 or more packets are loaded.

**Acceptance Scenarios**:

1. **Given** a packet list containing more than 12 frames, **When** rendered in the session view, **Then** exactly 12 packet rows are visible at one time in the scroll container before vertical scrolling is required.
2. **Given** a packet list containing fewer than 12 frames, **When** rendered in the session view, **Then** the scroll container shrinks to fit the exact number of packets, with no empty space or scrollbar.

---

### Edge Cases

- **Mobile Viewports**: On narrow screens, the wide table might overflow horizontally. The system should maintain horizontal scrolling specifically for the table while preventing the rest of the UI from breaking.
- **Extremely Long File Names**: If a file name is too long to fit in the compact header, it must be truncated with an ellipsis (`...`) and display the full name in a native tooltip on hover.
- **Fewer than 12 Packets**: If the capture contains fewer than 12 packets, the table viewport should shrink to fit the actual packet count rather than preserving empty space for 12 rows.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST move the Sharkophagus logo and tagline into a compact top header bar when a session is active.
- **FR-002**: The system MUST shrink the Sharkophagus logo text and logo icon size in the active session header to a smaller scale (e.g., matching standard header text like H3 or H4) and hide or shrink the tagline.
- **FR-003**: The system MUST replace the large 2x2 dashboard statistics cards with a compact, inline display of the file name, file size, frame count, and duration in the active session view.
- **FR-004**: The system MUST move the "End Session" and "View Analysis Details" actions into the compact top header/control area, rendering them as smaller, low-profile buttons.
- **FR-005**: The system MUST expand the active session view layout container to use a full-width responsive layout (e.g., removing the `1200px` max-width constraint) to maximize the screen area for the packet columns.
- **FR-006**: The system MUST limit the height of the packet table's scrollable container using CSS (e.g., max-height or height styling) so that exactly 12 packet rows are visible at any one time, while still allowing the user to scroll vertically to load and view all other packets in the capture.

### Key Entities

- **CaptureSession**: Represents the active packet capture analysis session, including the session ID, file name, file size, and the statistics of the file (frame count, duration).
- **SessionHeader**: Represents the compact navigation and info bar displayed at the top of the page during an active session.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The vertical viewport space occupied by the packet list increases from ~40% to at least 70% of the screen height on desktop screen resolutions (1080p).
- **SC-002**: The layout container width for the active session view expands from a maximum of `1200px` to a fluid `100%` viewport width (with minimal margin/padding).
- **SC-003**: The height of the packet table scroll pane allows exactly 12 rows to be visible simultaneously without needing to scroll.
- **SC-004**: The header height (containing logo, tagline, metadata, and controls) is reduced by at least 60% compared to the original dashboard layout.

## Assumptions

- The desktop screen resolution is the primary design target; mobile viewports will gracefully degrade by allowing horizontal scrolling of packet columns.
- The "View Analysis Details" action will still trigger the existing `AnalysisModal` overlay.
- The global layout (such as the app footer and settings menu) remains visible but stays out of the way of the expanded packet table.
- The 12-row limit is achieved using CSS styling (e.g., calculation based on row height) to ensure precise fitting across font sizes.
