# Research: Settings Logical Grouping

This document summarizes the design decisions, rationales, and alternatives considered for organizing and displaying configuration preferences.

---

### Decision 1: Category Mapping Rules
* **Decision**: Split preference names by the first dot (dot-notation namespace) to extract categories. Maps `gui.*` to "User Interface", `capture.*` and `cap.*` to "Capture", any other namespaces dynamically to "Protocols", and names without a dot to "Miscellaneous".
* **Rationale**: Simple, robust, and dynamically adapts to whatever preferences the server returns without requiring a hardcoded static dictionary for all thousands of Wireshark preferences.
* **Alternatives Considered**: 
  - *Hardcoded dictionary*: Too brittle; if Wireshark adds new dissectors, they would be uncategorized or omitted.
  - *Flat list only*: Rejected by spec because it lacks logical grouping.

---

### Decision 2: Search scope and sidebar interaction
* **Decision**: Implement a virtual "Search Results" view (Option A). Entering a search query temporarily suspends the active sidebar state, searches all settings globally, and groups results by category. When the search is cleared, the previously active category is restored.
* **Rationale**: Provides the best discovery experience without losing the user's place in the category tree.
* **Alternatives Considered**:
  - *Filter-in-place (Option B)*: Limits search to the active category, which makes finding a setting whose category is unknown difficult.
  - *Highlight categories (Option C)*: High implementation complexity with low usability benefits inside a small modal container.

---

### Decision 3: Responsive layout on mobile screens
* **Decision**: Collapse the sidebar into a top dropdown menu selector on mobile screens (< 768px wide) (Option A).
* **Rationale**: Extremely space-efficient, easy to interact with inside a modal container, and avoids complex overlay-on-overlay hamburger drawer menus.
* **Alternatives Considered**:
  - *Slide-out navigation drawer (Option B)*: Adds visual clutter and potential gesture/click conflicts within the modal dialog.
  - *Bottom tab bar (Option C)*: Impractical if the list of protocols is large.

---

### Decision 4: Transitions and Animations
* **Decision**: Use Vue 3's built-in `<Transition>` component with custom CSS animations to smoothly fade/slide settings content when switching categories.
* **Rationale**: Gives a premium, modern feel to the application interface in alignment with Web App Development guidelines.
* **Alternatives Considered**:
  - *No transitions*: Functional but feels abrupt and less premium.
