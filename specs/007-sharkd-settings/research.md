# Research & Decisions: Sharkd Configuration Settings

## Design & UI Architecture Decisions

### 1. UI Integration for Configuration Management
- **Decision**: Integrate a new "Preferences" option inside the `SettingsMenu.vue` component. Clicking this option emits a new `open-preferences` event.
- **Rationale**: Keeps the main view clean and consolidates all global actions (Info, Preferences) under the floating settings menu button.

### 2. Rendering and Managing Settings
- **Decision**: Create a new modal component `ConfigModal.vue` to show all config settings in a scrollable, searchable modal list.
- **Rationale**: 
  - Since Wireshark/sharkd has many options (e.g. `udp.check_checksum`, protocol-specific ports), a dedicated modal with search/filter allows the user to find and edit configurations quickly.
  - Inputs will correspond directly to their data types: checkboxes for boolean settings, dropdowns for enums, and standard input fields for string/number values.
  - When no session is active, inputs are disabled, showing a message that tells the user to load a session to modify settings.

### 3. API Contract Integration
- **Decision**: Add `getSystemConfig` and `updateSessionConfig` methods to `ApiClient` interface and `SharkophagusApi` client class.
- **Rationale**: Aligns frontend capabilities with the backend `/config` (GET) and `/sessions/{sessionId}/config` (POST) endpoints.
