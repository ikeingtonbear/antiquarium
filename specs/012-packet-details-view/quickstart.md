# Quickstart: Packet Details View Implementation

This quickstart guide provides the immediate context needed to begin implementing the Packet Details View feature.

## 1. Context Overview
We are implementing a split-pane view (Layer view on the left, Hexdump on the right) that displays the details of a single selected packet from the network capture session. This UI component belongs to the `antiquarium/web` Vue 3 frontend application.

## 2. API Integration
The backend API exposes (or will expose) a frame details endpoint:
`GET /sessions/{sessionId}/frames/{frameId}?proto=true`

You will need to update `src/services/api.ts` to include:
```typescript
export interface FrameDetail {
  err?: number;
  tree?: any[];
  fol?: string[][];
  bytes?: string; // or however the raw bytes are represented
}

// And a method in ApiService
async getSessionFrameDetail(sessionId: string, frameId: number): Promise<FrameDetail>
```

## 3. UI Component Architecture
You will build three primary Vue components:
1. `PacketDetails.vue`: The container that sits below the packet list, manages fetching the `FrameDetail`, and provides a resizable or fixed split-pane layout.
2. `LayerView.vue`: A recursive component to render the hierarchical `tree` structure. It needs to handle nested objects generically since protocols vary.
3. `HexdumpView.vue`: Renders the raw `bytes` in a standard hexdump format (Offset | Hex | ASCII).

## 4. Development Workflow
1. Write tests for `api.ts` enhancements.
2. Build the `HexdumpView.vue` component and test it with mock raw data.
3. Build the `LayerView.vue` recursive component and test it with a mocked JSON `tree` response.
4. Assemble them in `PacketDetails.vue` and integrate with the main layout below the packet list table.
5. Use Vite (`npm run dev`) to test the UI manually.
