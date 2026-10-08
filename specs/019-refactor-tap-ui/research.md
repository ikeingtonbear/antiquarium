# Phase 0: Outline & Research

## Decisions

- **Decision:** Use existing `POST /v1/sessions/{sessionId}/tap` endpoint for applying multiple taps.
- **Rationale:** The backend API already supports up to 16 taps in the `taps` object of the payload, allowing batch processing.
- **Alternatives considered:** Making multiple sequential requests (rejected due to inefficiency and potential state inconsistency).

- **Decision:** Maintain existing `ActiveTap` type but group them into a single request.
- **Rationale:** Minimizes structural changes in the frontend state while satisfying the new UI requirements.
