# Contracts: Follow Stream

We are integrating with the existing Sharkophagus API.

## Frontend API Interface (`web/src/services/api.ts`)

```typescript
export interface FollowStreamOptions {
  sessionId: string;
  protocol: string;
  filter: string;
}

// In SharkophagusApi class:
async followStream(options: FollowStreamOptions): Promise<FollowResponse>;
```
