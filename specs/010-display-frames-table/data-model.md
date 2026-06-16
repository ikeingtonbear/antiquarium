# Data Model: Display Frames Table

The Frames Table feature requires new TypeScript types for packet frame data and client-side layout configurations.

## Data Structures

### 1. Frame
Represents a dissected packet frame returned from the backend `/sessions/{sessionId}/frames` endpoint.
```typescript
interface Frame {
  /** The 1-based sequential packet index */
  num: number;
  /** Ordered array of text metadata values matching current column settings */
  c: string[];
}
```

### 2. ColumnLayoutConfig
Represents client-side customization state for column headers.
```typescript
interface ColumnLayoutConfig {
  /** Unique technical name/identifier of the column (e.g. "frame.time", "ip.src") */
  name: string;
  /** Human-readable display label (Title Case, e.g. "Time", "Source") */
  label: string;
  /** Toggle indicator for table rendering visibility */
  visible: boolean;
}
```

## Client-Side State & Persistence

### 1. LocalStorage Layout Map
To persist user column settings across page reloads and captures, preferences are serialized to `localStorage` under the key `sharkophagus_columns_layout` using the following shape:
```json
{
  "visibleNames": ["ip.src", "ip.dst", "frame.len", "frame.protocols"],
  "orderNames": ["ip.src", "ip.dst", "frame.protocols", "frame.len"]
}
```

### 2. Column Matching Logic
The backend `/sessions/{sessionId}/frames` returns column values `c` in a fixed order matching the columns list defined in the `/info` endpoint.
When displaying frames:
- We match the index of `c` to the matching system column definition in `systemInfo.columns`.
- If a column is hidden by the user, we skip rendering its cell.
- If columns are reordered, we render the cells in the order specified by the user's custom `orderNames` list.
- The **Packet Number** (`num`) is treated as a separate, fixed first cell in the row and is not part of the `c` array mapping.
