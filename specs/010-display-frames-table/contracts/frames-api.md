# Interface Contract: Sessions Frames API

This contract specifies the API endpoint for fetching network packet frames from a loaded capture session.

## Endpoint

`GET /sessions/{sessionId}/frames`

### Path Parameters

| Name | Type | Description | Required |
|:---|:---|:---|:---|
| `sessionId` | String (UUID) | The active capture session identifier | Yes |

### Query Parameters

| Name | Type | Description | Default |
|:---|:---|:---|:---|
| `skip` | Integer | The number of frames to skip (0-based pagination) | `0` |
| `limit` | Integer | The maximum number of frames to return (1 to 10000) | `1000` |
| `filter` | String | A Wireshark display filter to apply to the frames list | None |

---

## Response Schemas

### 200 OK
Returns an array of dissected frames.

**Headers:**
- `Content-Type: application/json`

**Body:**
```json
[
  {
    "num": 1,
    "c": [
      "0.000000",
      "10.0.0.1",
      "10.0.0.2",
      "TCP",
      "74",
      "443 → 51234 [SYN] Seq=0 Win=65535 Len=0"
    ]
  },
  {
    "num": 2,
    "c": [
      "0.000120",
      "10.0.0.2",
      "10.0.0.1",
      "TCP",
      "74",
      "51234 → 443 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0"
    ]
  }
]
```

### 400 Bad Request
Returned when pagination parameters are invalid or the filter syntax is incorrect.

**Body:**
```json
{
  "code": "BAD_REQUEST",
  "message": "Invalid skip parameter: must be non-negative"
}
```

### 404 Not Found
Returned when the capture session does not exist or has expired.

**Body:**
```json
{
  "code": "SESSION_NOT_FOUND",
  "message": "Session expired. Please re-upload capture file."
}
```

### 500 Internal Server Error
Returned when the backend fails to communicate with the underlying sharkd engine.

**Body:**
```json
{
  "code": "SHARKD_ERROR",
  "message": "Engine failed to dissect frame sequence."
}
```
