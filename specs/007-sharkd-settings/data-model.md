# Data Model & State Specifications: Sharkd Configuration Settings

This document lists the modified interface contracts and new components:

## Type & API Client Extensions

### 1. `ConfigPreference` and `ConfigEnumChoice` Interfaces
```ts
export interface ConfigEnumChoice {
  value: number;
  description: string;
  default: boolean;
}

export interface ConfigPreference {
  name: string;
  type: "boolean" | "string" | "integer" | "range" | "enum" | "table" | "unknown";
  value: any;
  choices?: ConfigEnumChoice[];
}
```

### 2. `ApiClient` Interface Extensions
```diff
export interface ApiClient {
+  /**
+   * Fetches the Wireshark system configuration settings from the backend.
+   * @param pref - Optional name of a specific configuration preference to retrieve
+   */
+  getSystemConfig(pref?: string): Promise<ConfigPreference[]>;
+
+  /**
+   * Updates a configuration preference for the active session.
+   * @param sessionId - The active capture session UUID
+   * @param name - The configuration preference name
+   * @param value - The new configuration value
+   */
+  updateSessionConfig(sessionId: string, name: string, value: any): Promise<void>;
}
```

## Component Interface Updates

### 1. `SettingsMenu.vue`
- Add a new menu item labeled "Preferences".
- Emit `open-preferences` when the item is clicked.

### 2. `ConfigModal.vue` [NEW]
- Shows a list of configuration preferences.
- Contains a search input to filter preferences by name.
- Renders different controls based on option type:
  - Checkbox for `boolean` values.
  - Dropdown select for `enum` values.
  - Text input for `integer`, `string`, and `range` types.
  - Read-only label for `table` and `unknown` types.
- Integrates with the API client to fetch and set values.
- Controls are disabled and an explanatory notice is shown when no active session is loaded.
