# API Client Contract: PCAP Analyse Modal

This document defines the interface contract for the frontend API client.

## 1. Updated Client Interface (`web/src/types/index.ts`)

The `ApiClient` interface is extended to support fetching capture analysis results:

```typescript
export interface ApiClient {
  /**
   * Uploads a packet capture file and returns the active session info.
   */
  createSession(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<CaptureSession>;

  /**
   * Fetches analysis statistics for an active session.
   */
  getStatistics(sessionId: string): Promise<CaptureStatistics>;

  /**
   * Fetches deep analysis results for an active session.
   * Path: GET /sessions/{sessionId}/analyse
   */
  getAnalysis(sessionId: string): Promise<CaptureAnalysis>;

  /**
   * Closes and cleans up the active session (sends bye).
   */
  closeSession(sessionId: string): Promise<void>;
}
```

## 2. Mocking Endpoint Responses in Tests

For unit/component testing, the `/sessions/{sessionId}/analyse` endpoint returns:

```json
{
  "frames": 1280,
  "protocols": ["eth", "ip", "tcp", "http"],
  "first": 1599818818.123,
  "last": 1599818822.652
}
```
