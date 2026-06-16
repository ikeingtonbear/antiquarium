# Research: Display Frames Table

## 1. Column Reordering Implementation
### Decision
Use the native HTML5 Drag and Drop API (`draggable="true"` on column headers) to reorder columns. We will manage an array of active columns in Vue reactive state and handle `@dragstart`, `@dragover`, `@drop` events on header elements to swap index positions.

### Rationale
Native HTML5 Drag and Drop is zero-dependency, lightweight, and completely supported by modern web browsers. This adheres to core principle **III. Leverage Industry-Standard Tooling** by using browser native capabilities rather than adding heavy third-party UI libraries like SortableJS.

### Alternatives Considered
- **Vuedraggable (SortableJS wrapper)**: Rejected because it adds external dependencies, increases bundle size, and is unnecessary for simple column header index swaps.
- **Button-based reordering (move left/right buttons)**: Rejected because it provides a less premium and less intuitive user experience than direct header dragging.

---

## 2. Columns Visibility Toggle
### Decision
Implement a column selector dropdown button next to the table header. The dropdown contains a checklist of all available columns from the API's system info capabilities. Checking/unchecking a checkbox updates a visibility boolean property on each column configuration object.

The **Packet Number** column is always checked, disabled (cannot be unchecked), and locked to index 0.

### Rationale
A checklist dropdown is clean, compact, and keeps the controls localized above the table layout. Locking the packet number prevents rendering incomplete frame sequences.

### Alternatives Considered
- **Fullscreen Settings Modal integration**: Rejected because it requires the user to leave the table view, causing high interaction friction.

---

## 3. Scrollable Table Limit & Lazy Loading
### Decision
Render the table inside a container with a fixed height calculated to fit exactly 25 rows of frame data (`max-height: calc(25 * var(--row-height, 40px))`) with `overflow-y: auto`.

To support extremely large captures without crashing the browser, we will implement **infinite scroll lazy loading**:
1. Retrieve the first chunk of 100 frames from the API when the dashboard loads.
2. Listen to the scroll event on the table body wrapper.
3. If the scroll position is within 200px of the bottom and more frames exist (checked against `statistics.frames` total), dispatch a fetch request for the next chunk of 100 frames (`skip = current_loaded_length`, `limit = 100`).
4. Append newly fetched frames to the reactive list.

### Rationale
Infinite scroll ensures that only the needed DOM elements are populated while scrolling. Restricting DOM additions to chunks of 100 is highly performant, handles files with 10,000+ packets easily, and provides a continuous scrollbar experience.

### Alternatives Considered
- **Render All Packets**: Rejected because loading 10,000+ rows into the browser DOM will crash/freeze the web tab.
- **Page-by-Page Pagination (Next/Prev Buttons)**: Rejected because infinite scrolling provides a much smoother, modern, and fluid user experience for packet inspection.
