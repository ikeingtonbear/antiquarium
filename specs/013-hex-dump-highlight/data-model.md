# Data Model: Hex Dump to Layer Highlight

This feature introduces no new backend entities. It entirely relies on the existing `FrameDetail` and `FrameLayerNode` types defined in `web/src/types/index.ts`.

## Client-Side State Additions

In `PacketDetails.vue`:
```typescript
const hoveredByteRange = ref<[number, number] | null>(null);
const selectedByteRange = ref<[number, number] | null>(null);
```

These states will be passed as props to `HexdumpView` and `LayerView`, and updated via Vue emits from both children.
