# API Contracts

This feature integrates with an existing backend endpoint `/sessions/{sessionId}/check`. The contract below defines the TypeScript interfaces that will be added to the frontend `api.ts` service to communicate with this endpoint.

## Request Interface

```typescript
export interface CheckRequest {
  type: "filter" | "field";
  expression: string;
}
```

## Response Interface

```typescript
export interface CheckResponse {
  valid: boolean;
  errorCode?: number;
  errorMessage?: string;
}
```

## Method Signature (`SharkophagusApi`)

```typescript
async check(
  sessionId: string,
  type: "filter" | "field",
  expression: string
): Promise<CheckResponse>
```
