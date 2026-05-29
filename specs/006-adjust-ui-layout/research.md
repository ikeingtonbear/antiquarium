# Research & Decisions: Web UI Adjustments and Accessibility Improvements

## Design & UI Architecture Decisions

### 1. Close Button Accessibility Label

- **Decision**: Select "Close" as the text label for the `AnalysisModal` overlay primary button instead of "Acknowledge" or "Ok".
- **Rationale**: 
  - "Close" explicitly describes the action (dismissing/hiding the view) without implying any other side effects.
  - It aligns with W3C WAI-ARIA authoring practices for modal dialog accessibility. Screen readers read this component's controls transparently.
  - "Ok" is vague because it is often associated with confirmation of a change, whereas this button is purely dismissive.
  - "Acknowledge" is unnecessarily wordy.

### 2. Version Information Location

- **Decision**: Remove the version string from the footer (rendered inline at the bottom of the page) and only show it inside the header of the `SystemInfoModal` capabilities popup.
- **Rationale**: Reduces redundant text and visual weight in the main UI, keeping version information consolidated in the detailed info display.
