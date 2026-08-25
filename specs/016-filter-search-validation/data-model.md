# Data Model

No new internal data models or database schemas are introduced in this feature.

## Frontend State Model (`FilterBar.vue`)

- `filterText`: `string` - The current input text of the filter.
- `validationError`: `string | null` - Stores the error message returned from the `check` endpoint if invalid, or `null` if valid/empty.
- `isValidating`: `boolean` - Tracks if a validation request is currently in-flight to show loading states and temporarily disable the Apply button.
- `isValid`: `boolean` (computed) - True if `filterText` is not empty, `validationError` is null, and `isValidating` is false.
