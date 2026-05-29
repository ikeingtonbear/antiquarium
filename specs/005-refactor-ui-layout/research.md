# Research & Decisions: Web UI Layout and Session Lifecycle Updates

## Design & UI Architecture Decisions

### 1. State Machine Extension vs. UI presentation state

- **Decision**: Retain the existing `AppState` values (`idle`, `uploading`, `ready`, `deleting`) for the session lifecycle, and introduce a separate, local boolean reactive state `isAnalysisModalOpen` in `App.vue` to track the visibility of the modal overlay.
- **Rationale**: Keeping the API/lifecycle state machine focused on backend sync status (`ready` meaning the session is active and stats/analysis are loaded) while using a simple boolean for UI presentation (`isAnalysisModalOpen`) prevents overcomplicating the state machine transitions.
- **Alternatives considered**: Adding a new `dashboard` state to `AppState`. This was rejected because the dashboard is structurally identical to the "ready" state, just with the overlay hidden.

### 2. Settings Menu Implementation

- **Decision**: Add a new floating settings popover menu in the bottom-right corner, toggled by a Settings button (using a gear icon). The menu will render an "Info" item that opens the `SystemInfoModal`.
- **Rationale**: The user wants to start a settings menu in the bottom-right corner to prepare for future tools and options. A popover is highly modular and keeps the footer and main dashboard clean.
- **Alternatives considered**: 
  - Inline footer button: Rejected because it does not prepare for future settings menu options.
  - Full-screen settings panel: Rejected as too heavy for a simple "Info" option.

### 3. Stats Dashboard Action Layout

- **Decision**: Update `StatsDashboard.vue` to render two adjacent buttons: a primary red/danger styled "End Session" button, and a secondary styled "View Analysis Details" button.
- **Rationale**: Placing these controls together at the bottom of the dashboard keeps navigation intuitive and clear.
- **Alternatives considered**: Icon buttons in the header for reopening details. Rejected because prominent adjacent actions make the two main lifecycle controls easily discoverable.
