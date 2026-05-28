# Data Model: Stats Display Update

## 1. Updated Type Definitions

The types in `web/src/types/index.ts` will be updated to reflect the new API structure.

### 1.1 CaptureStatistics

```typescript
export interface CaptureStatistics {
  /** Total number of packets/frames */
  frames: number;
  /** Duration of capture in seconds */
  duration: number;
}
```

The fields `bytes`, `firstPacketTime`, and `lastPacketTime` have been removed from the backend endpoint and are therefore deprecated and removed from this interface.

### 1.2 CaptureSession (Unchanged)

```typescript
export interface CaptureSession {
  id: string;
  status: 'active' | 'closed';
  createdAt: string;
  fileName: string;
  fileSize: number;
}
```

---

## 2. Component Interface Changes

### 2.1 StatsDashboard Props

The `StatsDashboard` component props will be updated to receive the filename and filesize directly:

```typescript
export interface StatsDashboardProps {
  fileName: string;
  fileSize: number;
  statistics: CaptureStatistics;
  isDeleting: boolean;
}
```
