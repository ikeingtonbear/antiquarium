# Phase 0: Research

All technical choices and unknowns were resolved during the specification and planning phase. 

- **Decision**: Use existing `/sessions/{sessionId}/complete?type=preference` endpoint for autocomplete.
- **Rationale**: Reuses the backend's native sharkd autocomplete capabilities without requiring any extra backend logic or client-side caching of all preferences.
- **Alternatives considered**: Client-side filtering of the full preference list (too heavy, requires fetching 1000s of preferences up-front).

- **Decision**: Debounce the autocomplete API calls by 250-300ms.
- **Rationale**: Standard UX practice to avoid spamming the backend while providing a responsive feeling (< 500ms total latency).
- **Alternatives considered**: No debounce (too many API calls), 500ms debounce (feels too sluggish).
