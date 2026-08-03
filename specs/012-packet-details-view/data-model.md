# Data Model: Packet Details View

## Entities

### `FrameDetail`
Represents the detailed information of a single packet/frame.

**Fields**:
- `err` (integer): Error code from the backend (0 for success).
- `tree` (array of objects): The recursive, hierarchical breakdown of protocol layers.
- `fol` (array of arrays): Follow streams information.
- `bytes` (string, optional): Base64 encoded or raw string representing the packet's raw bytes (to be rendered as hexdump).

### `LayerNode` (Derived from `tree` items)
Represents a single node in the human-readable layered breakdown.

**Fields**:
- `label` (string): The display label for the protocol or field.
- `children` (array of `LayerNode`): Nested sub-fields.
- `value` (any): The value of the field, if applicable.
- `expanded` (boolean, UI state): Whether the node is currently expanded in the view.

## State Transitions
- **Select Packet**: When a user clicks a packet in the packet list, the UI updates the `selectedFrameId` state, which triggers a fetch to `/sessions/{sessionId}/frames/{frameId}`.
- **Data Loading**: While fetching, the packet details view shows a loading state.
- **Data Rendered**: Once fetched, `tree` is rendered into the left pane recursively, and `bytes` is formatted and rendered into the right pane.
