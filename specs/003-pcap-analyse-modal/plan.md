# Implementation Plan: PCAP Analyse Modal

**Branch**: `003-pcap-analyse-modal` | **Date**: 2026-05-27 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-pcap-analyse-modal/spec.md`

## Summary

The goal of this feature is to refactor the packet capture upload workflow so that immediately following a successful file upload, the application retrieves the capture statistics (`GET /sessions/{sessionId}/stats`) and the capture analysis results (`GET /sessions/{sessionId}/analyse`) in parallel. Once both responses are returned, the UI displays this consolidated information in a modal overlay. Upon closing the modal, the session is cleanly terminated (`DELETE /sessions/{sessionId}`) and the application resets to the idle upload state.

## Technical Context

**Language/Version**: TypeScript 5.x / Vue 3.x (Composition API)

**Primary Dependencies**: Vue 3, Vite, Vitest, Happy DOM

**Storage**: Client-side reactive memory (Vue `ref` and state machine)

**Testing**: Component and service tests using Vitest and `@vue/test-utils`

**Target Platform**: Modern Web Browsers (Chrome, Firefox, Safari)

**Project Type**: Single Page Web Application

**Performance Goals**:
- parallel API requests triggered immediately after upload
- modal overlay transition completes in < 300ms
- UI state reset to idle completed in < 300ms

**Constraints**:
- Must follow strict Test-Driven Development (TDD)
- Styles must be implemented using Vanilla CSS (scoped CSS inside SFCs) aligned with the core styling system in `web/src/assets/base.css`
- Session clean up must be guaranteed on close

## Constitution Check

- **Principle I: Test-Driven Development (TDD) Mandatory** - ✅ All new components, service methods, and view transitions will have failing tests written first in `web/tests/`.
- **Principle II: Standardized Style & Documentation** - ✅ Code will follow the existing project ESLint/TS formatting rules. Code will be fully documented.
- **Principle III: Industry-Standard Tooling** - ✅ standard Vite/Vitest test runner and Vue composition utilities.
- **Principle IV: Security-First** - ✅ Sessions are strictly cleaned up via the `bye` method (`DELETE /sessions/{sessionId}`) when closing the modal, preventing daemon or resource leaks.
- **Principle V: Modular Architecture** - ✅ The analysis display is encapsulated inside a new reusable `AnalysisModal.vue` component.
- **Principle VI: Containerized Building** - ✅ Verification is validated inside the container environment.
- **Principle VII: Task-Based Git Commits** - ✅ Each task from `tasks.md` will be committed individually.

## Project Structure

### Documentation (this feature)

```text
specs/003-pcap-analyse-modal/
├── plan.md              # This file
├── research.md          # Phase 0 research & design choices
├── data-model.md        # Phase 1 client state machine & schema types
├── quickstart.md        # Phase 1 quickstart manual tests & commands
└── contracts/
    └── api-client.md    # Mapped client interface contract
```

### Source Code

```text
web/
├── src/
│   ├── components/
│   │   └── AnalysisModal.vue       # [NEW] Modal overlay component
│   ├── services/
│   │   └── api.ts                  # [MODIFY] Added getAnalysis endpoint
│   ├── types/
│   │   └── index.ts                # [MODIFY] Updated CaptureStatistics, CaptureAnalysis, AppState
│   └── App.vue                     # [MODIFY] State machine and layout updates
└── tests/
    ├── components/
    │   ├── AnalysisModal.spec.ts   # [NEW] Test suite for the modal component
    │   └── App.spec.ts             # [MODIFY] Add tests for modal state flow
    └── services/
        └── api.spec.ts             # [MODIFY] Add tests for getAnalysis method
```

**Structure Decision**: Web application option. Changes are entirely focused on the Vue frontend project under the `web/` directory.

## Complexity Tracking

No constitution gate violations are requested.
