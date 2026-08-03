# Research Findings: Packet Details View

## Unknown: Backend support for Hexdump data

**Context**: The `frames` endpoint returns `tree` (layered protocol data) but it is unclear if the backend explicitly provides a `bytes` or `hexdump` field in the `/sessions/{sessionId}/frames/{frameId}` response, as the OpenAPI spec in `011-frame-function` does not explicitly list it.

**Decision**: 
We will assume the backend returns raw packet bytes (e.g., as a base64 encoded string `bytes`, or a dedicated `hexdump` string field, or within the `tree` object as raw data). For the UI implementation, we will define a clear frontend interface (`FrameDetail` containing `bytes` or `hexdump`) and if the backend currently lacks this, it will be added in a subsequent backend task. The UI will gracefully handle missing hex data by showing a "No raw data available" message.

**Rationale**: 
The requirement mandates a split pane with layers and a hexdump. Since this is a UI feature implementation plan, we design the component to consume a standard format (like base64 bytes) and render it as a hexdump. This decouples the UI from strict backend availability, allowing UI development to proceed.

**Alternatives considered**: 
- Block UI development until the backend explicitly defines the `bytes` field in the OpenAPI spec. Rejected because the UI can mock this data and still be built perfectly.

## Unknown: Format of the "tree" (layered breakdown)

**Context**: The `tree` object is an array of dynamically structured protocol layers. 

**Decision**: 
The UI will implement a recursive tree-rendering component (`LayerView`) that iterates through the JSON structure of `tree`. It will display standard key-value pairs and support nested objects/arrays to handle any protocol format the backend returns.

**Rationale**: 
This is the only way to satisfy the requirement (FR-005: "handle variable or dynamically structured layer data"). Hardcoding protocol formats would be brittle and violate the "gracefully handles at least 10 different common protocol types" success criteria.

**Alternatives considered**: 
- Pre-defining strict TypeScript interfaces for all protocols. Rejected due to the massive scope and variability of network protocols.
