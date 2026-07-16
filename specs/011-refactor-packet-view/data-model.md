# Data Model: Web UI Layout Refactor for Packet-Centric View

## Data Schema & Entities
This feature is a pure layout and UI refactoring task. No new data models, backend endpoints, or persistent database tables are introduced. 

The existing client-side and backend entities remain unchanged:
* **CaptureSession**:
  * `id` (string): Unique session identifier.
  * `fileName` (string): Name of the analyzed PCAP file.
  * `fileSize` (number): Size of the file in bytes.
* **CaptureStatistics**:
  * `frames` (number): Total number of frames in the capture.
  * `duration` (number): Duration of the capture in seconds.
* **Frame**:
  * `num` (number): Packet index.
  * `c` (array of strings): Display column cell values.

## UI State & Presentation Layout Map
The state transitions and their corresponding layout widths are mapped below:

| AppState | Layout Container Max-Width | Components Rendered |
|----------|----------------------------|---------------------|
| `idle` | `820px` (Centered Box) | `FileUpload` |
| `uploading` | `820px` (Centered Box) | Progress Bar |
| `ready` | `100%` (Full Viewport Width) | `StatsDashboard` (Horizontal Navigation Header), `FramesTable` (Limited to 12 rows height), `AnalysisModal` (Optional Overlay) |
| `deleting` | `100%` (Full Viewport Width) | `StatsDashboard` (Close State), `FramesTable` |
