# API Client Integration Contract: Sharkophagus Web UI

This document specifies the interface contract between the frontend Vue application and the backend Sharkophagus REST API.

---

## 1. Base Configuration

- **API Base URL**: Configured via the build-time environment variable `VITE_API_URL`.
- **Default Base Path**: `/v1`
- **Content Type**:
  - `multipart/form-data` (for session creation)
  - `application/json` (for responses and other endpoints)

---

## 2. API Endpoints Contract

### 2.1 Create Session
- **Path**: `POST /sessions`
- **Request Type**: `multipart/form-data`
- **Parameters**:
  - `file` (File, binary): The PCAP/PCAPNG capture file.
- **Success Response (200 OK / 201 Created)**:
  - **Type**: `application/json`
  - **Body**:
    ```json
    {
      "id": "uuid-string",
      "status": "active",
      "createdAt": "2026-05-21T18:00:00Z"
    }
    ```
- **Error Responses**:
  - **400 Bad Request**: Missing file or invalid multipart body.
  - **500 Internal Server Error**: Backend failed to spin up `sharkd` or process the file.

### 2.2 Get Capture Statistics
- **Path**: `GET /sessions/{sessionId}/stats`
- **Success Response (200 OK)**:
  - **Type**: `application/json`
  - **Body**:
    ```json
    {
      "frames": 1280,
      "bytes": 524288,
      "duration": 4.529,
      "firstPacketTime": "2026-05-21T18:00:00.001Z",
      "lastPacketTime": "2026-05-21T18:00:04.530Z"
    }
    ```
- **Error Responses**:
  - **404 Not Found**: Session expired or does not exist.
  - **500 Internal Server Error**: Failed to retrieve status from daemon.

### 2.3 Close Session
- **Path**: `DELETE /sessions/{sessionId}`
- **Success Response (204 No Content)**:
  - **Body**: *None*
- **Error Responses**:
  - **404 Not Found**: Session does not exist.
  - **500 Internal Server Error**: Failed to terminate daemon cleanly.

---

## 3. Frontend client implementation interface

The TypeScript API client in `web/src/services/api.ts` must expose the following contract:

```typescript
export interface ApiClient {
  /**
   * Uploads a packet capture file and returns the active Session info.
   * @param file The file to upload (PCAP, PCAPNG, CAP, DMP)
   * @param onProgress Callback for tracking upload percentage progress (0 to 100)
   */
  createSession(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<CaptureSession>;

  /**
   * Fetches analysis statistics for an active session.
   * @param sessionId The UUID of the session
   */
  getStatistics(sessionId: string): Promise<CaptureStatistics>;

  /**
   * Closes and cleans up the active session.
   * @param sessionId The UUID of the session
   */
  closeSession(sessionId: string): Promise<void>;
}
```
