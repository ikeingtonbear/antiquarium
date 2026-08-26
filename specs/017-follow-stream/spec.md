# Feature Specification: Follow Stream

**Feature Branch**: `017-follow-stream`

**Created**: 2026-08-25

**Status**: Draft

**Input**: User description: "sharkophagus has updated its api to include a follow endpoint. I want the user to be able to select a packet and then follow the stream. The ideal filter passed uses a stream ID or number (you may need to conduct some additional research if this is not specified in the returned data from sharkophagus already). The packet view should filter the packets to the filter passed to the follow, and the data returned for the stream should displayed in a modal, or new window. Standard Wireshark stream following information can be found here for reference: https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowStreamSection.html"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Follow a Stream from Packet (Priority: P1)

As a user analyzing a packet capture, I want to select a packet and view the entire stream of data (e.g., TCP or UDP stream) that this packet belongs to, so that I can understand the complete conversation between the client and server.

**Why this priority**: Following streams is a core workflow in network analysis that allows users to easily reconstruct and read payloads instead of inspecting individual packets one by one.

**Independent Test**: Can be fully tested by selecting a packet belonging to a TCP stream, initiating the follow stream action, verifying the packet list is filtered, and verifying the stream payload is displayed in a new view.

**Acceptance Scenarios**:

1. **Given** a packet capture is loaded with active TCP streams, **When** the user selects a packet and chooses to follow the stream, **Then** the application filters the main packet list to show only packets in that stream.
2. **Given** a packet capture is loaded, **When** the user follows a stream, **Then** a modal or new window opens displaying the reconstructed stream payload (client and server data).

### Edge Cases

- What happens when a packet does not belong to any stream (e.g., an ICMP echo request)? (Action should not be available or should be disabled).
- How does the system handle extremely large streams (e.g., a 100MB file download)?
- What happens if the stream data cannot be fetched or the capture is malformed?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a UI action (e.g., context menu or button) to "Follow Stream" for a selected packet, showing available stream types based on the packet's contents (e.g., TCP, UDP).
- **FR-002**: System MUST apply a display filter to the main packet view to isolate the selected stream when the "Follow Stream" action is invoked.
- **FR-003**: System MUST fetch and display the full conversation data for the selected stream.
- **FR-004**: System MUST display the reconstructed stream payloads in a dedicated modal or new window.
- **FR-005**: System MUST differentiate between client-to-server and server-to-client data in the stream view (e.g., using different colors or formatting).

### Key Entities

- **Stream Follower**: A representation of an available stream for a specific packet, including the protocol (e.g., TCP), and the filter to isolate it.
- **Stream Payload**: The reconstructed application-layer data exchanged between the client and server, represented as chunks with directionality (client->server or server->client).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully view a reconstructed stream payload for a selected TCP packet.
- **SC-002**: Upon following a stream, the main packet list is accurately filtered to show only packets from that stream, reducing the visible packets.
- **SC-003**: The stream payload modal successfully renders and distinguishes data directions without application crashes for streams of typical sizes.

## Assumptions

- Users have a mouse/pointer device or keyboard shortcuts to select a packet and invoke the follow stream action.
- The underlying engine provides the valid stream information and filters for supported packets.
- Stream payloads are text-based or can be adequately represented visually (e.g., raw binary is handled gracefully or displayed as text/hex).
