# Data Model: Refactor Tap UI

## 1. Entities

### `ActiveTap`
*No structural changes.*
- `id`: string
- `tapString`: string
- `name`: string
- `results`: any (optional)

### `TapRequestPayload`
- The payload sent to `POST /v1/sessions/{sessionId}/tap`
- **Fields**:
  - `taps`: Record<string, string> (e.g., `{ "tap0": "eo:http", "tap1": "expert" }`)

## 2. Validation Rules

- **Tap Limit**: Maximum of 16 taps can be included in a single `TapRequestPayload`.

## 3. UI State

- **Tap Selection Modal**:
  - `selectedTaps`: Array of `InfoItem` (max length 16)
  - `tapsByCategory`: Record<string, InfoItem[]>
