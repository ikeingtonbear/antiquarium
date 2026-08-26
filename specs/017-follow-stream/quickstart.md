# Quickstart: Follow Stream

This quickstart guides developers on how the follow stream feature operates within the UI.

1. **Packet Selection**: When a packet is selected, `FramesTable` emits `select-frame` which populates `FrameDetail` via `api.getFrame(...)`.
2. **Action Trigger**: The `PacketDetails` component (or `FramesTable` context menu) reads `FrameDetail.followers` to display available streams (e.g., "Follow TCP Stream").
3. **Modal Display**: When clicked, `FollowStreamModal.vue` is opened. It is passed the `sessionId`, `protocol`, and `filter`.
4. **Data Fetching**: The modal calls `api.followStream` to fetch the reconstructed stream and renders it.
5. **Filtering**: The main UI filter is updated using the stream's `filter` to isolate those packets in the background list.
