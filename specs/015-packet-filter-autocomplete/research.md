# Research

## Filter Autocomplete API Integration
- **Decision**: Update `SharkophagusApi` in `web/src/services/api.ts` to include a `getCompletions(sessionId: string, prefix?: string)` method.
- **Rationale**: The backend API endpoint requires `sessionId`, `type` (`field`), and `prefix`. Since `SharkophagusApi` already handles session-based API calls, adding this method conforms to the existing pattern.
- **Alternatives considered**: None, as the API contract is fixed.

## UI Component Structure
- **Decision**: Create a new `FilterBar.vue` component and include it in `FramesTable.vue` (or the parent component that manages the session and packet list).
- **Rationale**: Vue 3's composition API allows for creating reusable components. The filter bar is a complex component with debouncing and overlay states, so it should be isolated.
- **Alternatives considered**: Adding the autocomplete logic directly into `FramesTable.vue`, but this would bloat the table component.
