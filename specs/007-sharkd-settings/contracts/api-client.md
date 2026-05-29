# API Client Contract: Sharkd Configuration Settings

This document specifies the contract additions for the frontend API client service.

## 1. Updated Client Interface (`web/src/types/index.ts`)

The `ApiClient` interface is extended to support configuration preferences.

```typescript
export interface ApiClient {
  // Existing methods ...

  /**
   * Fetches the Wireshark system configuration settings from the backend.
   * Path: GET /config
   */
  getSystemConfig(pref?: string): Promise<ConfigPreference[]>;

  /**
   * Updates a configuration preference for the active session.
   * Path: POST /sessions/{sessionId}/config
   */
  updateSessionConfig(sessionId: string, name: string, value: any): Promise<void>;
}
```

## 2. Response Payload Structure

The `/config` endpoint returns an array of `ConfigPreference` objects:

```json
[
  {
    "name": "udp.check_checksum",
    "type": "boolean",
    "value": true
  },
  {
    "name": "ip.defragment",
    "type": "boolean",
    "value": false
  },
  {
    "name": "ip.summary_in_comment",
    "type": "enum",
    "value": 1,
    "choices": [
      { "value": 0, "description": "None", "default": false },
      { "value": 1, "description": "Yes", "default": true }
    ]
  }
]
```
