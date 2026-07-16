# Research & Outline: Web UI Layout Refactor for Packet-Centric View

## Decisions

### 1. Unified Session Navigation Header Component
We will refactor the existing `StatsDashboard.vue` component from a large 2x2 grid format into a thin, horizontal navigation/status bar. When active, it will be positioned at the top of the viewport.
* **Content Layout**:
  * **Left**: Shrunken Sharkophagus Logo (🦈 Sharkophagus, font size ~`var(--text-lg)`) and a small tagline.
  * **Center**: Inline list or badges showing the filename, formatted filesize, frame count, and duration.
  * **Right**: Small, compact session control buttons ("End Session" and "View Analysis Details").
* **Rationale**: Reusing `StatsDashboard.vue` preserves existing props, data bindings, and emits (avoiding duplication of data-fetching logic in `App.vue`). This maintains clean modularity and matches existing unit tests with minimal churn.

### 2. Viewport Width Expansion
We will modify the `.app-container.is-ready` style in `App.vue`.
* **Change**: Change `max-width: 1200px` to `max-width: 100%; width: 100%; padding: 0 var(--space-6);`.
* **Rationale**: This lets the page occupy the full screen width, giving the packet table column resize and layout mechanisms the maximum available area.

### 3. Scroll Height Limitation to 12 Rows
We will constrain the `.table-scroll-container` in `FramesTable.vue` to a maximum height matching exactly 12 packet rows.
* **Height Calculation**:
  * Font-size: `var(--text-xs)` (12px), line-height: 1.5 (~18px).
  * Padding: `var(--space-2)` (8px) top and bottom.
  * Border: 1px bottom border.
  * Estimated row height: `18px + 16px + 1px = 35px`.
  * Multiplier for 12 rows: `35px * 12 = 420px`.
  * **Change**: Set `.table-scroll-container` style `max-height` to `420px`.
* **Rationale**: Height-based constraint ensures the layout remains clean and predictable across standard resolutions, while preserving infinite scroll functionality for additional data chunks.

## Alternatives Considered

### 1. Dissolving `StatsDashboard.vue` and Moving Logic into `App.vue`
* **Why Rejected**: This increases the complexity of `App.vue` (violates modularity) and breaks existing unit tests in `StatsDashboard.spec.ts` that verify stat presentation and button emission.

### 2. Strict Row Rendering Limit (Hard Pagination)
* **Why Rejected**: Restricting the rendering array to 12 items would break the dynamic infinite scroll mechanism and prevent users from reading later packets without manual paging controls. A CSS-based viewport height constraint is simpler, standard, and highly interactive.
