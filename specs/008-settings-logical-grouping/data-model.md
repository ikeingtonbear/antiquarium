# Data Model & UI State Specification: Settings Logical Grouping

This document specifies the internal data structures and state variables required to implement the logical settings grouping layout.

## Data Structures

### 1. `PreferenceCategory` Interface
This represents a logical group or category of preferences.
```ts
export interface PreferenceCategory {
  id: string;      // Unique category identifier (e.g., 'all', 'gui', 'capture', 'proto-tcp')
  label: string;   // Human-readable label (e.g., 'All Preferences', 'User Interface', 'Capture', 'TCP')
  prefix?: string; // Prefix filter string (e.g., 'gui.', 'capture.', 'tcp.')
  isProtocol?: boolean; // True if it represents a protocol dissector group
}
```

## UI & Component State Specifications

### `ConfigModal.vue` Internal Reactive State

The component state is extended with the following properties:

1. **`selectedCategoryId`** (ref<string>, default: `'all'`)
   - Tracks the active category/protocol group selected in the sidebar navigation.

2. **`isMobile`** (ref<boolean>, default: `false`)
   - Reactive flag representing whether the viewport width is below 768px.
   - Initialised on mount and updated via a `resize` event listener.

3. **`categories`** (computed<PreferenceCategory[]>)
   - Dynamically derived list of categories compiled from the retrieved preferences:
     - Always contains `'all'` (All Preferences), and (if matching preferences exist) `'gui'` (User Interface), `'capture'` (Capture).
     - Scans the namespace (first segment) of all preferences starting with other prefixes (e.g. `ip`, `tcp`, `udp`) and creates a protocol category for each unique namespace.
     - Protocol categories are sorted alphabetically.

4. **`groupedConfigs`** (computed<Record<string, ConfigPreference[]>>)
   - Computes a mapping of category/protocol IDs to their matching preference objects for quick lookup.

5. **`filteredConfigs`** (computed<ConfigPreference[]>)
   - Replaced/extended:
     - If `searchQuery` is active, performs global search and returns all matches.
     - Otherwise, returns preferences belonging only to the `selectedCategoryId`.
