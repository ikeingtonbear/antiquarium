# Data Model: Apply Tap Options

## Entities

### `SystemInfo`
Represents the available system capabilities, fetched from the backend.
- `stats` (Array of `InfoItem`): Statistics taps
- `taps` (Array of `InfoItem`): General taps
- `eo` (Array of `InfoItem`): Export object taps
- `srt` (Array of `InfoItem`): Service response time taps
- `rtd` (Array of `InfoItem`): Response time delay taps
- `follow` (Array of `InfoItem`): Follow stream taps

### `InfoItem`
Represents an individual available tap.
- `name` (String): Display name
- `tap` (String): The internal tap string identifier (e.g. `eo:http`)

### `ActiveTap` (Frontend State)
Represents a tap that the user has selected and applied to the current session.
- `id` (String): A generated ID (e.g., `tap0`, `tap1`) for the backend payload.
- `tapString` (String): The underlying tap string (e.g. `eo:http`).
- `name` (String): Display name for the UI.
- `results` (Object): Placeholder for the statistics/results data returned for this tap.
