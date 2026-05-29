# Research & Design Choices: Add Info Endpoint Information

## Design Decisions

### 1. API Integration Path and Method
- **Decision**: Implement `GET /info` matching the Sharkophagus backend contract.
- **Rationale**: Direct integration with the global, session-independent status endpoint. Allows version and system information retrieval without requiring an active PCAP session.
- **Alternatives Considered**: 
  - `GET /sessions/{sessionId}/info`: Rejected because capabilities are system-wide, not session-specific, and must be available on initial application load.

### 2. Client-Side TypeScript Schemas
- **Decision**: Define the `SystemInfo` and related formats (e.g. `InfoColumn`, `InfoItem`, `InfoType`) matching the exact structure from the OpenAPI schema of the Sharkophagus backend.
- **Rationale**: Prevents data mapping errors and simplifies testing by keeping typings in sync with backend realities.

### 3. UI Display Layout and Interaction
- **Decision**: Render version details in a new global `AppFooter` component. Introduce a Lucide `info` icon button next to the version stamp that opens a dedicated `SystemInfoModal` details dialog.
- **Rationale**: Footer placement keeps the main dashboard uncluttered while keeping diagnostic data accessible. The detail modal allows structured navigation of complex lists like protocols, statistics taps, and columns.
- **Alternatives Considered**:
  - Main upload screen card: Rejected because it wastes visual real estate on system status before user performs their primary task (uploading PCAP).
  - Integrating info into the existing upload/analysis modal: Rejected because users should be able to check system capabilities before uploading a file.
