# API Client Integration Contract: Stats Display Update

This document updates the contract for the integration between the frontend Vue application and the backend Sharkophagus API.

---

## 1. Get Capture Statistics

- **Path**: `GET /sessions/{sessionId}/stats`
- **Success Response (200 OK)**:
  - **Type**: `application/json`
  - **Body**:
    ```json
    {
      "frames": 1280,
      "duration": 4.529
    }
    ```
- **Error Responses**:
  - **404 Not Found**: Session expired or does not exist.
  - **500 Internal Server Error**: Failed to retrieve status from daemon.

---

## 2. Updated TypeScript Interfaces

```typescript
export interface CaptureStatistics {
  /** Total number of packets/frames */
  frames: number;
  /** Duration of capture in seconds */
  duration: number;
}
```
