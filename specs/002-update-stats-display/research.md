# Research Notes: Stats Display Update

## 1. Updated API Stats Endpoint Analysis

**Decision**: 
Align the client-side `CaptureStatistics` interface with the updated backend API response for `GET /sessions/{id}/stats`. The new schema removes `bytes`, `firstPacketTime`, and `lastPacketTime`.

**Rationale**: 
The backend has updated the stats endpoint response to only return the raw frame count and the capture duration. The interface must match this schema exactly to prevent runtime errors or typescript compilation issues when fetching stats from the api.

**Alternatives Considered**:
- Keeping optional properties on `CaptureStatistics` and using dummy/null values: Rejected because this creates unnecessary dead code and potential UI confusion.

---

## 2. Dashboard Information Display Strategy

**Decision**:
Update the `StatsDashboard` component to receive:
1. `fileName` (string)
2. `fileSize` (number)
3. `statistics` (CaptureStatistics)
4. `isDeleting` (boolean)

These props will be fed from the parent `App.vue` component, which maintains the active `CaptureSession` instance. The dashboard will format and render exactly four cards:
- **File Name** (using `File` icon from `@lucide/vue`, or similar text representation)
- **File Size** (formatted using `formatBytes` with the existing `HardDrive` icon)
- **Frames** (formatted with thousands separator, using `Layers` icon)
- **Duration** (formatted to 3 decimal places with the `Clock` icon)

**Rationale**:
The user requested that we display filename, filesize, frames, and duration.
Since filename and filesize are already present in the client-side `CaptureSession` metadata fetched when the session was created, passing them from the parent component allows the dashboard to display them without requiring changes to the stats endpoint payload.

**Alternatives Considered**:
- Requesting the backend to return filename and filesize in the `/stats` endpoint: Rejected because it breaks the single-responsibility principle of the backend's stats daemon and changes the API boundary unnecessarily.
