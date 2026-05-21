# Implementation Plan: Sharkophagus Web UI Frontend

**Branch**: `001-sharkophagus-web-ui` | **Date**: 2026-05-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-sharkophagus-web-ui/spec.md` and UX/UI requirements quality checklist from `/specs/001-sharkophagus-web-ui/checklists/ux.md`

## Summary

Implement a premium single-page dashboard using Vue 3, TypeScript, and Vite, located within the `web/` subdirectory. The interface will feature a rich cybernetic dark theme with high-contrast UI states, drag-and-drop uploading with live progress tracking, a grid-based statistics dashboard, floating error notifications, and robust accessibility standards. The implementation will follow strict Test-Driven Development (TDD) using Vitest and Vue Test Utils, with full Docker containment to avoid polluting the host.

---

## Technical Context

**Language/Version**: TypeScript 5.x, Vue 3.x (Composition API)

**Primary Dependencies**:
- `vue` (v3.x)
- `typescript` (v5.x)
- `vite` (v5.x)
- `axios` (v1.x) or Fetch API for networking
- `lucide-vue-next` (v0.x) for icons

**Storage**: Reactive client-side local ref state inside Vue `App.vue` or custom composable (e.g. `useSession`). No global state management library (like Pinia) is required for this single-page dashboard.

**Testing**: Vitest + Vue Test Utils + Happy DOM

**Target Platform**: Modern web browsers supporting ES6+ (Chrome, Safari, Firefox, Edge)

**Project Type**: web-service (frontend application SPA)

**Performance Goals**:
- Page load to interactive (LCP/TTI) under 500ms.
- Client-side file validation execution under 50ms.
- Session termination API execution triggered within 100ms of user acknowledgment.

**Constraints**:
- Max file size limit: 10MB (enforced on both client and backend).
- Minimum of 80% code coverage.
- Full containerization of development and test pipelines.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **TDD Mandatory**: Yes. Failing unit/component tests for file validation, upload triggers, API requests, progress indicators, stats cards, and error toasts must be written before implementation begins.
- **Standardized Coding Style**: Yes. Configure ESLint (with TypeScript & Vue rules) and Prettier for the frontend application.
- **Leverage Industry-Standard Tooling**: Yes. Leverage Vite, Vitest, Vue Test Utils, and Lucide icons.
- **Security-First by Design**: Yes. Strict client-side file type and size validation before any upload. Sanitize all parsed backend responses.
- **Modular & Plugin-Friendly Architecture**: Yes. Deconstruct views into decoupled Vue SFCs: `FileUpload.vue`, `StatsDashboard.vue`, and `ErrorNotification.vue`. Decouple API communication into a dedicated class/service `src/services/api.ts`.
- **Containerized Building**: Yes. Package development dependencies and execution scripts inside a local Docker container using Node 20+.
- **Task-Based Git Commit Strategy**: Yes. Commit code immediately following the completion and verification of each task in `tasks.md`.

---

## Project Structure

```text
web/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── assets/
│   │   └── base.css
│   ├── components/
│   │   ├── FileUpload.vue
│   │   ├── StatsDashboard.vue
│   │   └── ErrorNotification.vue
│   ├── services/
│   │   └── api.ts
│   └── types/
│       └── index.ts
├── tests/
│   ├── setup.ts
│   ├── components/
│   │   ├── FileUpload.spec.ts
│   │   ├── StatsDashboard.spec.ts
│   │   └── ErrorNotification.spec.ts
│   └── services/
│       └── api.spec.ts
├── Dockerfile
└── docker-compose.yml
```

**Structure Decision**: Fully containerized single-page Vue 3 workspace isolated within the `web/` directory.

---

## UX/UI Design & Accessibility Specifications

This section defines the design details mapped to each requirement quality check in the `checklists/ux.md` artifact.

### 1. Design Tokens, Colors, and Typography (CHK001, CHK018)
- **Base Style**: Custom CSS variables defined in `web/src/assets/base.css`.
- **Palette (Dark Mode)**:
  - Background: Deep Slate `#0b0f19`
  - Card/Container Background: Dark Navy `#161e2e` with glassmorphic border `border: 1px solid rgba(255, 255, 255, 0.08)`
  - Accent Color: Cyan `#06b6d4` (for focus, active uploads, dragging highlights)
  - Success Color: Emerald `#10b981` (for dashboard status, successful session)
  - Danger/Error Color: Rose `#f43f5e` (for error notifications, invalid file validations)
- **Typography**: Primary font `Inter` for general readability, secondary monospace font `Fira Code` (or system mono) for statistics and timestamps.
- **Contrast**: Maintain a contrast ratio of at least 4.5:1 (WCAG AA) for all text elements.

### 2. Layout Grid and Drag-and-Drop File Upload (CHK002, CHK008, CHK009, CHK012)
- **Dropzone Structure**: Centered viewport layout, dash-bordered dropzone container.
- **States**:
  - *Idle State*: Accent-gray dashed border, displays upload icon, supported file extensions (`.pcap`, `.pcapng`, `.cap`, `.dmp`), and the "Max 10MB" limit.
  - *Drag-Over State*: Dotted border glows bright Cyan (`#06b6d4`), scaling up by `x1.02` with a smooth transition.
  - *Invalid File State*: If an invalid file or a file >10MB is dropped/selected, the border turns Rose (`#f43f5e`), displays an instant error shaking animation (`shake`), and shows validation messages before upload is blocked.
- **File Input Trigger**: Invisible `<input type="file">` overlaying the dropzone, accessible via mouse click or keyboard focus.

### 3. Upload Progress Indicator (CHK003)
- **Structural States**:
  - Hides the dropzone layout when file validation passes.
  - Renders a centralized progress loader featuring a live progress bar.
  - Renders the file name, size (in KB/MB), and a dynamic text percentage counter (e.g. `45%`).
  - Animates the progress bar using a glowing Cyan gradient that transitions smoothly on value updates.

### 4. Capture Statistics Dashboard (CHK004, CHK005, CHK010)
- **Layout**: 3x2 responsive grid (collapses to 1-column on mobile viewports).
- **Cards Display**:
  - *Card 1 (Frames)*: Displays `frames` (large text) with a Lucide `Layers` icon.
  - *Card 2 (Bytes)*: Displays formatted file size (in KB, MB, or Bytes) with a Lucide `HardDrive` icon.
  - *Card 3 (Duration)*: Displays `duration` (formatted to seconds with three decimals) with a Lucide `Clock` icon.
  - *Card 4 (First Packet)*: Displays `firstPacketTime` (formatted to `YYYY-MM-DD HH:mm:ss.SSS`) with a Lucide `CalendarRange` icon.
  - *Card 5 (Last Packet)*: Displays `lastPacketTime` (formatted to `YYYY-MM-DD HH:mm:ss.SSS`) with a Lucide `CalendarClock` icon.
- **Acknowledge Button**:
  - Styled as an Emerald gradient button at the bottom of the dashboard.
  - Hover zoom scaling (`x1.04`), active press transition, and clear focus ring outline.
  - Shows a loader spinner if the DELETE request is executing.

### 5. Floating Error Notifications (CHK007, CHK011, CHK015)
- **Appearance**: Floating toast placed in the top-right corner of the viewport.
- **Transition**: Slides in from the right (`translateX(100%)` to `translateX(0)`) using `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Dismissibility**: Includes a close (`X`) button that dismisses the toast. If left un-dismissed, it auto-fades after 6 seconds, showing a shrinking visual timer bar at the bottom.
- **Content**: Custom message detailing the API error, network reachability issue, or backend offline status.

### 6. Edge Cases & Lifecycle States (CHK006, CHK013, CHK014, CHK015)
- **Exit Protection**: Add a `beforeunload` window event listener when the session status is active or when an upload is in progress to warn the user against closing the page.
- **Session Expiry (404/Expired)**: If statistics fetching fails due to session expiry, display an error banner stating "Session expired. Resetting application..." and automatically trigger the state transition back to the file upload zone.
- **Backend Offline**: Detect Axios network failures on session creation and show: "API server is unreachable. Please verify backend connection."
- **State Reset Animation**: Fades out the dashboard view and fades in the dropzone view concurrently over 300ms.

### 7. Accessibility (a11y) Specifications (CHK016, CHK017, CHK018)
- **Keyboard Tab Flow**:
  - Focus outlines are styled explicitly with a 2px Cyan border and a 2px offset.
  - Sequential Tab index order: File upload area (focusable) -> Acknowledge button (when dashboard visible) -> Error notification close button (when toast visible).
  - Activate file selection/clicks on keyboard `Enter` or `Space` keys.
- **ARIA Semantic Mapping**:
  - Drag-and-drop dropzone: `role="button"` with `aria-label="Upload capture file"`.
  - Progress bar: `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.
  - Floating toast notification: `role="alert"` with `aria-live="assertive"` to ensure assistive tech announces errors immediately.
  - Decorative icons: `aria-hidden="true"`.

---

## Complexity Tracking

*No violations of the Antiquarium Constitution.*
