# Data Model: Packet Filter Autocomplete

## Entities

### CompletionItem
Represents a single autocomplete suggestion returned by the backend API.
- `value`: `string` - The suggested completion text.
- `description`: `string` (optional) - Additional details or help text for the suggestion.

### CompleteResponse
The response payload from the `/sessions/{sessionId}/complete` endpoint.
- `completions`: `CompletionItem[]` - List of suggestions.
