# Contract: FilterBar Component

## Component API

### Props
- `sessionId` (`string`): The current Sharkophagus session ID, used to fetch autocomplete suggestions.
- `initialFilter` (`string`, optional): Pre-populate the filter bar.

### Events
- `apply` (`filter: string`): Emitted when the user successfully clicks "Apply" and the filter is valid. The parent component should then apply this filter to the packet list.

### Behavior
- Internally fetches suggestions from `SharkophagusApi`.
- Validates the filter when "Apply" is clicked (currently just checking if not empty, but designed to hook into a future check API).
- Shows an error icon and tooltip on validation failure, and does not emit `apply`.
