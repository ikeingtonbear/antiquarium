# Data Model: Settings Visual Cleanup

This feature is implemented entirely client-side. The following data models represent the structure of configuration settings, dynamic groups, and formatting structures used within the Settings UI.

## Data Structures

### 1. ConfigPreference
This represents a single setting retrieved from the backend API.
```typescript
interface ConfigPreference {
  name: string;      // E.g., "capture.devices_hide"
  type: string;      // E.g., "boolean", "string", "enum", "table", "unknown"
  value: any;        // The active value (boolean, string, number, etc.)
  choices?: {        // Available options (only for 'enum' type)
    value: number | string;
    description: string;
    default: boolean;
  }[];
}
```

### 2. PreferenceGroup
A visual group containing multiple related preferences.
```typescript
interface PreferenceGroup {
  id: string;                      // Unique ID (e.g. "capture-devices")
  title: string;                   // Human-readable title (e.g. "Devices")
  prefix: string;                  // Shared prefix (e.g. "devices_")
  preferences: ConfigPreference[]; // List of settings under this group
  isCollapsed: boolean;            // Toggled collapse/expand state
}
```

### 3. CategoryViewData
Represents the organized structure of settings for a selected category or protocol.
```typescript
interface CategoryViewData {
  categoryId: string;
  categoryLabel: string;
  categoryDescription: string;
  standalonePreferences: ConfigPreference[]; // Standalone root-level preferences
  preferenceGroups: PreferenceGroup[];       // Grouped preferences
}
```

## Parsing & Formatting Rules

### Label Formatting Mapper
Technical abbreviations are translated using a static dictionary lookup:
- `"pmode"` -> `"Promiscuous Mode"`
- `"buffersize"` -> `"Buffer Size"`
- `"fileopen"` -> `"File Open"`
- `"defragment"` -> `"Defragment"`

### Subgroup Grouping Threshold
- A subgroup is formed if **two or more** settings share the same initial segment of their sub-property name (e.g. `devices_hide` and `devices_pmode` share `devices`).
- If only one setting has a specific prefix, it is left ungrouped to avoid visual bloat.
