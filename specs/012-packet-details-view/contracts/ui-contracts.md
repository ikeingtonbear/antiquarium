# UI Component Contracts: Packet Details View

This file defines the internal TypeScript interfaces and component props expected for the new Packet Details View components.

## `PacketDetails.vue`
The main container component that orchestrates the fetching of the detailed frame data and splits the view into the Layer and Hexdump panes.

**Props**:
- `sessionId` (string, required): The ID of the current capture session.
- `frameId` (number, required): The ID of the currently selected frame/packet. If null, the component renders an empty/placeholder state.

## `LayerView.vue`
The component responsible for rendering the human-readable protocol tree recursively.

**Props**:
- `tree` (Array of objects, required): The structured protocol data from the backend.

## `HexdumpView.vue`
The component responsible for rendering the raw packet bytes in a traditional hexdump format (Offset | Hex values | ASCII representation).

**Props**:
- `bytes` (string, required): The raw data or base64 encoded payload to be displayed. If empty, displays "No raw data available".
