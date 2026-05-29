# Data Model: Add Info Endpoint Information

This document defines the client-side state schema and TypeScript models for the system information feature.

## 1. SystemInfo Interface Schema

Maps directly to the `SystemInfo` definition in the Sharkophagus backend contract (`openapi.yaml`).

```typescript
export interface InfoColumn {
  name: string;
  format: string;
}

export interface InfoItem {
  name: string;
  tap: string;
}

export interface InfoType {
  name: string;
  description: string;
}

export interface SystemInfo {
  version: string;
  columns: InfoColumn[];
  stats: InfoItem[];
  ftypes: string[];
  capture_types: InfoType[];
  encap_types: InfoType[];
  nstat: InfoItem[];
  convs: InfoItem[];
  seqa: InfoItem[];
  taps: InfoItem[];
  eo: InfoItem[];
  srt: InfoItem[];
  rtd: InfoItem[];
  follow: InfoItem[];
}
```

## 2. Client Application State

The main application state in `App.vue` manages backend connection info.

```typescript
export interface AppSystemState {
  systemInfo: SystemInfo | null;
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
}
```

## 3. UI Modal State

Tracks the presentation of the detailed system capabilities modal.

```typescript
export interface SystemInfoModalState {
  isOpen: boolean;
  activeTab: "overview" | "columns" | "formats" | "taps" | "filters";
}
```
