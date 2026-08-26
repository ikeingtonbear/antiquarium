# Research: Follow Stream

## Decisions

- **Decision**: Add a context menu or button to `PacketDetails.vue` or `FramesTable.vue` to trigger the "Follow Stream" action. We will use a dedicated modal `FollowStreamModal.vue` to display the data.
- **Rationale**: A modal keeps the user in the context of their analysis without navigating away.
- **Alternatives considered**: Opening a new browser window/tab (rejected as it complicates state management for filtering the main window's packet list).

- **Decision**: Update `web/src/types/index.ts` to type the `Follower`, `FollowResponse`, and `FollowPayload` objects as defined in the Sharkophagus OpenAPI spec.
- **Rationale**: Strong typing is required by the project's TypeScript configuration and improves maintainability.
