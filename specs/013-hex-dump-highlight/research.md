# Research: Hex Dump to Layer Highlight

## Context
We need to map byte offsets in the Hex Dump to hierarchical protocol layers in the Layer View, and vice versa.

## Decision: State Management in `PacketDetails.vue`
**Decision**: Use `PacketDetails.vue` as the source of truth for the active highlight states, passing props to `HexdumpView` and `LayerView`.
**Rationale**: These two components are siblings inside `PacketDetails.vue`. Lifting state up is the standard Vue way to share state between siblings without introducing a global store.
**Alternatives considered**: Pinia store (overkill for component-specific UI state).

## Decision: Hover and Selection State Shapes
**Decision**: The shared state will track `hoveredByteRange: [number, number] | null` and `selectedByteRange: [number, number] | null`.
**Rationale**: `FrameLayerNode` defines its location via `h: [number, number]` (offset, length). By using a range, both single-byte hovers and full-layer hovers can be represented uniformly. When a user hovers a single byte in the hex dump, the range is `[offset, 1]`. When they hover a layer in the layer view, the range is `[layer.h[0], layer.h[1]]`.
**Alternatives considered**: Passing `FrameLayerNode` objects. This couples the hex dump to the layer structure unnecessarily. Byte ranges keep the components decoupled.

## Decision: Lowest Common Ancestor / Deepest Layer Resolution
**Decision**: `LayerView.vue` will be responsible for resolving a single byte offset to the "deepest" layer node that contains it.
**Rationale**: `LayerView.vue` already traverses and renders the `FrameLayerNode` tree. It can easily recursively search the tree to find the innermost node whose `h` range contains the given byte offset.
**Alternatives considered**: Doing the resolution in `PacketDetails.vue`. This would require passing the entire tree structure up and processing it there, but `LayerView.vue` already owns the tree visualization logic.
