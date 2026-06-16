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
  /** Unique technical name/identifier of the column (e.g. "Time", "Source") */
  name: string;
  /** Human-readable display label (Title Case, e.g. "Time", "Source") */
  label: string;
  /** Toggle indicator for table rendering visibility */
  visible: boolean;
  /** Optional width in pixels for resizable columns */
  width?: number;
}
```

## Client-Side State & Persistence

### 1. LocalStorage Layout Map
To persist user column settings across page reloads and captures, preferences are serialized to `localStorage` under the key `sharkophagus_columns_layout` using the following shape:
```json
{
  "visibleNames": ["Time", "Source", "Destination", "Protocol", "Length", "Info"],
  "orderNames": ["Time", "Source", "Destination", "Protocol", "Length", "Info"],
  "widths": {
    "Time": 100,
    "Source": 150,
    "Destination": 150,
    "Protocol": 90,
    "Length": 80,
    "Info": 450
  }
}
```

### 2. Column Matching Logic
The backend `/sessions/{sessionId}/frames` returns column values `c` in a fixed order matching the columns list defined in the loaded capture session.
When displaying frames:
- We match the index of `c` to the matching system column name's index in the original columns list (`props.columns`) returned by the API server.
- If a column is hidden by the user, we skip rendering its cell.
- If columns are reordered, we render the cells in the order specified by the user's custom `orderNames` list.
- The **Packet Number** (`num`) is treated as a separate, fixed first cell in the row (represented by the first column in the table, lock-pinned to the left) and is not part of the `c` array mapping.

