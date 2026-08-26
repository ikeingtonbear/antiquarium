# Implementation Plan: Follow Stream

**Branch**: `017-follow-stream` | **Date**: 2026-08-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/017-follow-stream/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement a feature to allow users to follow a stream (e.g., TCP or UDP) from a selected packet. This involves showing a context menu option on the packet view, making an API request to the Sharkophagus `/sessions/{sessionId}/follow` endpoint using the protocol, filter, and stream ID from the packet's `followers` array, filtering the packet list, and displaying the stream payload in a modal or new window.

## Technical Context

**Language/Version**: TypeScript 5.8, Vue 3.5

**Primary Dependencies**: Vue, @lucide/vue

**Storage**: N/A

**Testing**: vitest, @vue/test-utils

**Target Platform**: Web browser (Electron-like UI, but standard web tech)

**Project Type**: web-service (frontend UI for sharkophagus)

**Performance Goals**: N/A

**Constraints**: Handle large stream payloads gracefully. Communicate with sharkophagus API.

**Scale/Scope**: Displaying stream payloads and interacting with the main packet list filter.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Test-Driven Development (TDD) Mandatory
- [x] Standardized Coding Style & Comprehensive Documentation
- [x] Leverage Industry-Standard Tooling
- [x] Security-First by Design
- [x] Modular & Plugin-Friendly Architecture
- [x] Containerized Environments & Build Pipelines
- [x] Task-Based Git Commit Strategy

## Project Structure

### Documentation (this feature)

```text
specs/017-follow-stream/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
web/src/
├── components/
│   ├── FollowStreamModal.vue
│   ├── FramesTable.vue
│   └── PacketDetails.vue
├── services/
│   └── api.ts
└── types/
    └── index.ts
```

**Structure Decision**: The project is a Vue frontend web application. We will add a new component `FollowStreamModal.vue` and update existing components `FramesTable.vue`, `PacketDetails.vue`, and the API service.
