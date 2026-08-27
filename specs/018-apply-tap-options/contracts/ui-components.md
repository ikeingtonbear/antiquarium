# UI Component Contracts

## `AnalyticsDashboard.vue`
The main view for displaying active taps and their results.

**Props**:
- None (manages its own state or consumes from a global store/composables).

**Emits**:
- None.

## `AddTapModal.vue`
A modal dialogue allowing the user to select from available taps.

**Props**:
- `isOpen` (Boolean): Controls the visibility of the modal.
- `availableTaps` (Array of `InfoItem`): The list of taps to display.

**Emits**:
- `close`: Fired when the modal should be closed.
- `apply`: Fired when a tap is selected and "Apply" is clicked.
  - Payload: `tapString` (String)

## `api.ts` (Service layer)
**Functions**:
- `getAvailableTaps(): Promise<InfoItem[]>`: Fetches and flattens available taps from `/info`.
- `applyTap(sessionId: string, taps: Record<string, string>): Promise<void>`: Sends the selected taps to `/sessions/{sessionId}/tap`.
