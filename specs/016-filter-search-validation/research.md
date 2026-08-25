# Phase 0: Research & Outline

## Unknowns Resolved

### How will the `check` endpoint be consumed?
- **Decision**: Extend `SharkophagusApi` in `web/src/services/api.ts` with a `check` method.
- **Rationale**: The backend `check` API endpoint receives `{"type": "filter", "expression": "..."}` and returns `{"valid": boolean, "errorCode": int, "errorMessage": string}`. Adding a dedicated typed method to `SharkophagusApi` will keep the component cleanly separated from the fetch logic.
- **Alternatives considered**: Inline fetching within `FilterBar.vue`. Rejected because it violates separation of concerns and the `SharkophagusApi` service already handles all backend communication.

### How will input debouncing and reactive state be handled?
- **Decision**: Use Vue's standard `watch` and `setTimeout` based debouncing inside `FilterBar.vue`. The validation API will be called after the user pauses typing (e.g. 500ms).
- **Rationale**: This is a lightweight approach that fits perfectly with the existing Vue 3 composition API structure. Existing UI elements (like `validationError` ref) can be re-used or extended to display the specific `errorMessage` returned if `valid` is false.
- **Alternatives considered**: Using an external library like `lodash/debounce`. Rejected because `FilterBar.vue` already has debouncing patterns (for autocomplete) that can be extended, minimizing dependencies.
