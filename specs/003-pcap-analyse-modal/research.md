# Research & Design Decisions: PCAP Analyse Modal

## Decision: Parallel Post-Upload Fetching and Modal UI Transition

### Details

To ensure a fast and responsive user experience, the client-side API orchestration will be modified as follows:

1. **Parallel Requests**: Upon successful completion of the file upload (`createSession`), the client triggers `api.getStatistics(sessionId)` and `api.getAnalysis(sessionId)` concurrently using `Promise.all()`. This minimizes network round-trip delay.
2. **State Transition**:
   - `appState` transitions: `idle` → `uploading` → `ready` (once stats and analysis are loaded).
   - If an error occurs during the post-upload fetching, the UI transitions back to `idle` and displays the error via `ErrorNotification`.
3. **Modal UI**: A new component `AnalysisModal.vue` is introduced. It displays as an overlay, blocking interactions with the background.
4. **Clean Exit (bye)**: When the modal's Close/Acknowledge button is clicked, or the user navigates away, the client calls `api.closeSession(sessionId)` (mapping to the DELETE method / backend bye call). The UI then transitions back to `idle`.

### Rationale

- Concurrency reduces latency from sequential fetches.
- Modal presentation keeps the upload page clean and focuses the analyst's attention on the results.
- Triggering DELETE on close ensures the backend's resources are cleanly disposed of as requested.

### Alternatives Considered

- **Sequential calls**: Rejected because it increases total loading latency by waiting for `getStatistics` to finish before starting `getAnalysis`.
- **Replacing StatsDashboard entirely**: The `StatsDashboard` component was used in the previous layout. Encapsulating the display inside `AnalysisModal.vue` allows cleaner layout and better adherence to the modal requirement.
