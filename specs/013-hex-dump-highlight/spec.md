# Feature Specification: Hex Dump to Layer Highlight

**Feature Branch**: `013-hex-dump-highlight`

**Created**: 2026-08-02

**Status**: Draft

**Input**: User description: "I want to add a feature where if I hover over or select part of the hex dump, it will highlight the corresponding layer in the layer view."

## Clarifications

### Session 2026-08-02

- Q: When a user hovers over a byte/layer while a selection is already active, how should the highlights be displayed? → A: Show both simultaneously using distinct visual styles (e.g., selection is blue, hover is light gray). This behavior applies bidirectionally for both hex dump and layer view interactions.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hovering over Hex Dump Highlights Layer (Priority: P1)

As a user analyzing network packets, I want the corresponding protocol layer to highlight when I hover over bytes in the hex dump view, so that I can easily visually map raw byte data to its parsed structural representation.

**Why this priority**: Core value of the feature. Immediate visual feedback connecting raw bytes to parsed layers provides immense utility for network analysts.

**Independent Test**: Can be fully tested by hovering over different sections of the hex dump and observing the layer view highlighting the correct layer node.

**Acceptance Scenarios**:

1. **Given** a packet with parsed layers and a hex dump view is open, **When** the user hovers over a byte in the hex dump that belongs to a specific layer (e.g., IPv4 header), **Then** the corresponding IPv4 layer in the layer tree view is visually highlighted.
2. **Given** a packet with parsed layers and a hex dump view is open, **When** the user hovers over a byte in the hex dump that belongs to a nested layer (e.g., TCP port inside IPv4), **Then** only the most specific (innermost) corresponding layer is highlighted in the layer view.
3. **Given** a packet with parsed layers, **When** the user moves the mouse cursor out of the hex dump view, **Then** any active layer highlights are removed from the layer view.

---

### User Story 2 - Selecting Hex Dump Highlights Layer (Priority: P2)

As a user analyzing network packets, I want the corresponding protocol layer to highlight (and potentially expand/scroll into view) when I click or select bytes in the hex dump, so that I can maintain focus on a specific structural element while examining its raw bytes.

**Why this priority**: Enhances the interaction beyond temporary hover states, allowing the user to "lock in" a selection for deeper inspection.

**Independent Test**: Can be fully tested by clicking/selecting a range of bytes in the hex dump and verifying the layer tree view updates its selection/highlight state to match the layer encompassing those bytes.

**Acceptance Scenarios**:

1. **Given** a packet with parsed layers, **When** the user clicks on a single byte in the hex dump, **Then** the corresponding specific layer is highlighted in the layer view.
2. **Given** a packet with parsed layers, **When** the user selects a contiguous range of bytes in the hex dump, **Then** the layer that most closely encompasses the entire selected range is highlighted.
3. **Given** the layer view is long and requires scrolling, **When** the user selects a byte in the hex dump, **Then** the corresponding highlighted layer is scrolled into view in the layer tree if it wasn't visible.

### Edge Cases

- What happens when a hovered/selected byte does not map to any known layer (e.g., trailing padding bytes, unparsed payload)?
- What happens when a selected range of bytes spans across multiple distinct peer layers?
- What happens when the hex dump is updated (e.g. switching to a different packet) while a hover state is active?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST map byte offsets in the raw packet data to specific parsed protocol layers.
- **FR-002**: The hex dump view MUST detect mouse hover events over individual bytes and highlight the entire grouping of bytes that corresponds to that byte's most specific layer.
- **FR-003**: The hex dump view MUST detect mouse click/selection events over bytes and select both the exact clicked byte AND the entire grouping of bytes that corresponds to that byte's most specific layer.
- **FR-004**: The system MUST communicate the hovered/selected byte offsets from the hex dump component to the layer view component.
- **FR-005**: The layer view MUST visually distinguish the layer that corresponds to the provided byte offset(s).
- **FR-006**: When hovering, the highlight MUST be temporary and revert when the hover ends.
- **FR-007**: When selecting, the highlight MUST persist until the selection is cleared or changed.
- **FR-008**: The layer view MUST automatically expand collapsed parent nodes if a child node needs to be highlighted due to selection.
- **FR-009**: If a hover event occurs while a selection is active, both highlights MUST be shown simultaneously using distinct visual styles (e.g., selection in blue, hover in light gray).
- **FR-010**: Highlighting behavior MUST be bidirectional: hovering/selecting in the hex dump highlights the layer view, and hovering/selecting in the layer view highlights the corresponding bytes in the hex dump.

### Key Entities

- **Hex Dump Byte**: Represents a single byte of raw packet data at a specific offset.
- **Parsed Layer**: A structural representation of protocol data (e.g., Ethernet header, IPv4 header) that corresponds to a specific start offset and length in the raw packet data.
- **Layer Mapping**: A data structure or function that associates a byte offset to the deepest (most specific) Parsed Layer containing it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visual highlight response time when hovering over a byte must be under 50ms to ensure a smooth, real-time feel.
- **SC-002**: 100% of tested valid byte offsets correctly highlight the single most specific corresponding layer.
- **SC-003**: When a byte selection spans multiple layers, the system consistently highlights the lowest common ancestor layer without errors.

## Assumptions

- The backend or parsing engine already provides start offset and length (or end offset) metadata for each parsed layer.
- The UI framework supports cross-component communication (state management, events, etc.) to link the hex dump and layer view.
- The hex dump view renders bytes in a way that allows identifying the underlying offset of the hovered/clicked DOM element.
