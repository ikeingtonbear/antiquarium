# Implementation Plan: Web UI Adjustments and Accessibility Improvements

**Branch**: `006-adjust-ui-layout` | **Date**: 2026-05-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-adjust-ui-layout/spec.md`

## Summary

Adjust the settings menu to label the capabilities trigger option as exactly "Info". Remove the version string from the main footer status text, showing only online/offline status, while preserving the version string in the system capabilities modal. Update the close/acknowledge button in `AnalysisModal.vue` to say exactly "Close" to meet accessibility best practices.

## Technical Context

**Language/Version**: TypeScript 5.x, Vue 3.x

**Primary Dependencies**: Vue, Lucide Vue icons, Vitest

**Storage**: Memory / Client-Side State

**Testing**: Vitest with Vue Test Utils

**Target Platform**: Modern Web Browsers

**Project Type**: Single-page Web Application Frontend

**Performance Goals**: UI transitions < 300ms

**Constraints**: Vanilla CSS styling, responsive layout, WAI-ARIA compliance

**Scale/Scope**: 3 modified files (AppFooter.vue, SettingsMenu.vue, AnalysisModal.vue) and their corresponding test files.

## Constitution Check

- **I. Test-Driven Development (TDD) Mandatory**: **PASS**. Updates will be driven by failing tests.
- **II. Coding Style & Documentation**: **PASS**. Code follows styling rules.
- **III. Industry-Standard Tooling**: **PASS**. Standard Vue and Vitest.
- **IV. Security-First**: **PASS**. No security impact.
- **V. Modular Architecture**: **PASS**. Component interface separation maintained.
- **VI. Containerized Building**: **PASS**.
- **VII. Task-Based Commits**: **PASS**.

## Project Structure

### Documentation (this feature)

```text
specs/006-adjust-ui-layout/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── quickstart.md        # Phase 1 output
```

### Source Code

```text
web/
├── src/
│   ├── components/
│   │   ├── AnalysisModal.vue
│   │   ├── AppFooter.vue
│   │   └── SettingsMenu.vue
└── tests/
    └── components/
        ├── AnalysisModal.spec.ts
        ├── AppFooter.spec.ts
        └── SettingsMenu.spec.ts
```

**Structure Decision**: Web application layout updates.
