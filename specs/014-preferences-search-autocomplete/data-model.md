# Data Model

## Entities

### `CompletionResponse` (from backend API)

- **Type**: JSON Object / Array (Based on sharkophagus API format)
- **Fields**:
  - Contains autocomplete suggestions for preferences.
  - Suggestion format depends on the sharkophagus `/complete` response payload (typically an array of strings or objects containing `name` and `description`).

### `AutocompleteSuggestion` (UI Model)

- **Description**: The internal state representation of a suggestion within `ConfigModal.vue`.
- **Fields**:
  - `name` (string): The preference string (e.g., "tcp.port").
  - `description` (string, optional): A human-readable description if provided by the backend.
