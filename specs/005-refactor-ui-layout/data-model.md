# Data Model & State Specifications: Web UI Layout and Session Lifecycle Updates

This document describes the client-side state schema and component property contracts introduced or modified in this feature.

## Client-Side Vue Application State

The state machine in `App.vue` is extended with UI presentation flags:

### Reactive State in `App.vue`

```typescript
// App Lifecycle State (Unchanged)
const appState = ref<AppState>("idle"); // "idle" | "uploading" | "ready" | "deleting"

// New presentation state variables
/** Controls whether the AnalysisModal overlay is visible */
const isAnalysisModalOpen = ref<boolean>(false);

/** Controls whether the bottom-right settings popover menu is open */
const isSettingsMenuOpen = ref<boolean>(false);
```

---

## Component Interfaces & Contracts

### 1. `StatsDashboard.vue`

#### Props
- `statistics: CaptureStatistics` (Unchanged)
- `fileName: string` (Unchanged)
- `fileSize: number` (Unchanged)
- `isDeleting: boolean` (Unchanged)

#### Emits
- `end-session`: Triggered when the user clicks the primary "End Session" button.
- `show-details`: Triggered when the user clicks the "View Analysis Details" button.

---

### 2. `AnalysisModal.vue`

#### Props
- `statistics: CaptureStatistics` (Unchanged)
- `analysis: CaptureAnalysis` (Unchanged)
- `isClosing: boolean` (Unchanged, defaults to `false`)

#### Emits
- `close`: Triggered when the close button / X icon is clicked. (Note: In `App.vue` this will now set `isAnalysisModalOpen.value = false` instead of ending the session).

---

### 3. `SettingsMenu.vue` (or inline settings button/menu in `App.vue`)

#### State
- `isOpen: boolean`

#### Actions
- Clicking the gear icon toggles `isOpen`.
- Clicking "Info" closes settings and emits `open-info`.
- Clicking outside close settings.
