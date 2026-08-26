# Data Model: Follow Stream

## Entities

### `Follower`
Represents an available stream for a packet.
- **Fields**:
  - `protocol: string`: Protocol of the stream (e.g., 'TCP', 'UDP')
  - `filter: string`: Wireshark display filter to isolate the stream (e.g., `tcp.stream eq 0`)
  - `stream: number`: Stream index number

### `FollowPayload`
Represents a chunk of data in the stream.
- **Fields**:
  - `n: number`: Number of bytes
  - `d: string`: Base64 encoded payload
  - `s: number`: Direction (0 = Client to Service, 1 = Service to Client)

### `FollowResponse`
Represents the result of following a stream.
- **Fields**:
  - `err?: number`: Error code
  - `shost: string`: Service IP
  - `sport: string`: Service Port
  - `sbytes: number`: Total bytes from service to client
  - `chost: string`: Client IP
  - `cport: string`: Client Port
  - `cbytes: number`: Total bytes from client to service
  - `payloads: FollowPayload[]`: List of payload chunks
