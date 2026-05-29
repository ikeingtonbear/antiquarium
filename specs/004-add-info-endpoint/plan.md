# Implementation Plan: Add Info Endpoint Information

**Branch**: `004-add-info-endpoint` | **Date**: 2026-05-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/004-add-info-endpoint/spec.md`

## Summary

The goal of this feature is to integrate the `GET /info` endpoint from the Sharkophagus backend API into the antiquarium Vue web frontend. Upon page load, the application will query the `/info` endpoint. The retrieved backend version will be displayed as a status stamp in the global footer. Next to the version, an interactive information button/icon will be added, which when clicked, opens a "System Capabilities" modal displaying a categorized overview of all capabilities returned by the API (columns, stats, capture formats, encapsulation formats, taps, convs, seqa, ftypes, etc.). If the backend is offline or fails, the footer will display an offline message, and the details button will be hidden or disabled.

## Technical Context

**Language/Version**: TypeScript 5.x / Vue 3.x (Composition API)

**Primary Dependencies**: Vue 3, Vite, Vitest, Happy DOM, Lucide Icons (`@lucide/vue`)

**Storage**: Client-side reactive state

**Testing**: Component and service tests using Vitest and `@vue/test-utils`

**Target Platform**: Modern Web Browsers

**Project Type**: Single Page Web Application (Vue frontend under `web/`)

**Performance Goals**:
- `/info` API request triggered automatically within 50ms of app mount.
- System Capabilities modal opens/closes within 200ms.

**Constraints**:
- Strict Test-Driven Development (TDD) mandatory.
- Styles must be implemented using Vanilla CSS (scoped CSS inside Vue Single File Components) aligned with `web/src/assets/base.css`.
- Graceful degradation when backend is offline or returns invalid JSON.

## Constitution Check

- **Principle I: Test-Driven Development (TDD) Mandatory** - ✅ Failing tests will be written first in `web/tests/` before implementing any UI changes or API methods.
- **Principle II: Standardized Coding Style & Comprehensive Documentation** - ✅ Follow existing ESLint/TS and Prettier rules. All types and methods will be fully documented.
- **Principle III: Leverage Industry-Standard Tooling** - ✅ Standard Vite, Vitest, Vue Composition API, and `@lucide/vue` for icons.
- **Principle IV: Security-First by Design** - ✅ Graceful offline state handling, sanitized and safe rendering of capability strings in the DOM.
- **Principle V: Modular & Plugin-Friendly Architecture** - ✅ Decoupled system info state, encapsulated in clean components.
- **Principle VI: Containerized Building & Dependency Management** - ✅ Running and testing inside the project container environment.
- **Principle VII: Task-Based Git Commit Strategy** - ✅ Code committed immediately after each discrete task is completed and verified.

## Project Structure

### Documentation (this feature)

```text
specs/004-add-info-endpoint/
├── plan.md              # This file
├── research.md          # Phase 0: Design decisions and rationale
├── data-model.md        # Phase 1: State types and schema
├── quickstart.md        # Phase 1: Test commands and manual verification steps
└── contracts/
    └── api-client.md    # Phase 1: API client extension contract
```

### Source Code (Vue Frontend)

```text
web/
├── src/
│   ├── components/
│   │   ├── SystemInfoModal.vue     # [NEW] Capabilities detail modal component
│   │   └── AppFooter.vue           # [NEW] App footer containing version/info button
│   ├── services/
│   │   └── api.ts                  # [MODIFY] Add getSystemInfo method
│   ├── types/
│   │   └── index.ts                # [MODIFY] Add SystemInfo and related type definitions
│   └── App.vue                     # [MODIFY] Mount hook to query info and pass down state
└── tests/
    ├── components/
    │   ├── SystemInfoModal.spec.ts # [NEW] Test suite for SystemInfoModal
    │   ├── AppFooter.spec.ts       # [NEW] Test suite for AppFooter
    │   └── App.spec.ts             # [MODIFY] Test app mount queries info
    └── services/
        └── api.spec.ts             # [MODIFY] Test getSystemInfo method
```

**Structure Decision**: Web application option. The changes are focused strictly on the Vue project under the `web/` directory.

## Complexity Tracking

No constitution gate violations are requested.
