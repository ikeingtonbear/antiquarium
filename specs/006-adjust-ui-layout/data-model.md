# Data Model & State Specifications: Web UI Adjustments and Accessibility Improvements

This document lists the modified interface contracts for the components:

## Component Interface Updates

### 1. `AnalysisModal.vue`
- Update the button layout element at the bottom of the dialog:
  - Label text MUST be changed from "Close & End Session" to "Close".

### 2. `SettingsMenu.vue`
- Update the list item button:
  - Text MUST be changed from "Info (System Capabilities)" to "Info".

### 3. `AppFooter.vue`
- Update `statusText` computed property:
  - Returns "Sharkophagus online" instead of `Sharkophagus v${props.systemInfo?.version}` when online.
  - Returns "Loading system info..." when loading.
  - Returns "Sharkophagus offline" when offline.
