# API Client Contract: Add Info Endpoint Information

This document specifies the contract additions for the frontend API client service.

## 1. Updated Client Interface (`web/src/types/index.ts`)

The `ApiClient` interface is extended to support querying backend system info.

```typescript
export interface ApiClient {
  // Existing methods ...

  /**
   * Fetches general system info and capabilities from the backend.
   * Path: GET /info
   */
  getSystemInfo(): Promise<SystemInfo>;
}
```

## 2. Response Payload Structure

The `/info` endpoint returns a response of type `SystemInfo`. Below is a mock payload structure for unit testing:

```json
{
  "version": "1.0.0-git-abc1234",
  "columns": [
    { "name": "Number", "format": "%m" },
    { "name": "Time", "format": "%t" }
  ],
  "stats": [
    { "name": "Endpoints", "tap": "endpoints" }
  ],
  "ftypes": ["eth", "ip", "tcp", "udp"],
  "capture_types": [
    { "name": "pcap", "description": "Wireshark/tcpdump/... PCAP" }
  ],
  "encap_types": [
    { "name": "ether", "description": "Ethernet" }
  ],
  "nstat": [],
  "convs": [],
  "seqa": [],
  "taps": [],
  "eo": [],
  "srt": [],
  "rtd": [],
  "follow": []
}
```
