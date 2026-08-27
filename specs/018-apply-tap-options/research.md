# Research Notes

## Technical Context Clarifications

All technical context points are fully clarified and documented in `plan.md`.

## Data Fetching from "info"

The backend API specification dictates that system capabilities (including available taps) are retrieved via the `/info` endpoint. Specifically, we will leverage the `stats`, `taps`, `eo`, `srt`, `rtd`, and `follow` arrays to determine available taps.

## "tap" Endpoint Interaction

Applying a tap involves POSTing to `/sessions/{sessionId}/tap` with a JSON payload of the form:
```json
{
  "taps": {
    "tap0": "<tap_string>"
  }
}
```

No further research is required.
