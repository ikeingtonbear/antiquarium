<!--
Sync Impact Report:
- Version change: None -> 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] -> I. Test-Driven Development (TDD) Mandatory
  - [PRINCIPLE_2_NAME] -> II. Standardized Coding Style & Comprehensive Documentation
  - [PRINCIPLE_3_NAME] -> III. Leverage Industry-Standard Tooling
  - [PRINCIPLE_4_NAME] -> IV. Security-First by Design
  - [PRINCIPLE_5_NAME] -> V. Modular & Plugin-Friendly Architecture
  - [PRINCIPLE_6_NAME] -> VI. Containerized Environments & Build Pipelines
  - [PRINCIPLE_7_NAME] -> VII. Task-Based Git Commit Strategy
- Added sections:
  - Additional Architectural & Quality Constraints
  - Development Workflow & Verification Gates
- Removed sections:
  - None
- Templates requiring updates (✅ updated / ⚠ pending) with file paths:
  - ✅ .specify/templates/tasks-template.md
- Follow-up TODOs:
  - None
-->

# Antiquarium Constitution

## Core Principles

### I. Test-Driven Development (TDD) Mandatory
All code development, including integration and end-to-end (E2E) testing, MUST follow a strict Test-Driven Development (TDD) approach. Standard Red-Green-Refactor cycles are mandatory. Developers MUST write failing tests before implementing any source code. Changes without corresponding tests are strictly prohibited.
- **Rationale**: TDD ensures that the software design is driven directly by requirements, maintains high code coverage, catches regressions instantly, and builds decoupled, testable interfaces from day one.

### II. Standardized Coding Style & Comprehensive Documentation
All code MUST follow standard industry and language-specific coding styles for formatting, documentation, and comments (e.g. PEP 8 for Python, Go standards for Go, ESLint/Prettier for Javascript). All public and custom data structures, interfaces, algorithms, and modules MUST be thoroughly documented.
- **Rationale**: Maintainability, readability, and onboarding speed are critical for the longevity of the project. Clear documentation of the "why" behind the code prevents future technical debt.

### III. Leverage Industry-Standard Tooling
Always leverage industry-standard tooling, packages, and libraries rather than reinventing existing functionality or recreating standard wheels.
- **Rationale**: Utilizing proven, secure, and community-maintained libraries reduces the codebase footprint, minimizes security risks, and allows developers to focus on unique domain logic.

### IV. Security-First by Design
A security-first approach MUST be applied to every phase of planning, design, and implementation. The application must be secure-by-design, minimizing the attack surface, implementing robust input validation, protecting sensitive data, and utilizing safe dependencies.
- **Rationale**: Security cannot be retrofitted. Building with a secure-by-design mindset protects user data and system integrity from the outset.

### V. Modular & Plugin-Friendly Architecture
All system designs MUST prioritize modularity, loose coupling, and clear boundaries between components. Architecture must be highly plugin-friendly, utilizing interfaces and dependency injection so that behaviors can be extended or replaced without modifying core systems.
- **Rationale**: A modular design ensures the software scales gracefully under load, simplifies unit/integration testing, and enables third-party developers to write plugins easily.

### VI. Containerized Building & Dependency Management
All builds, dependency installations, tests, and execution environments MUST run inside containerized environments (e.g., Docker, Podman). The underlying host operating system MUST NOT be polluted with project-specific runtimes or build dependencies.
- **Rationale**: Containerization guarantees environment parity between local development, continuous integration, and production, eliminating configuration drift and host dependency pollution.

### VII. Task-Based Git Commit Strategy
Adopt a structured, task-driven Git commit strategy where code is committed immediately after each discrete task (from `tasks.md`) is completed and verified. Large, monolithic commits covering multiple tasks are strictly prohibited.
- **Rationale**: Task-based commits create a granular, highly readable Git history, simplify code reviews, make backtracking easier, and minimize merge conflicts.

## Additional Architectural & Quality Constraints
- **Test Coverage Gate**: Every new module or feature MUST maintain a minimum of 80% line coverage verified via containerized test suites.
- **Linting Compliance**: Automated formatting and linting checks MUST run and pass successfully on every task-based commit before pushing to remote.
- **Vulnerability Scanning**: Continuous security analysis (SAST) and software composition analysis (SCA) MUST run inside the build container.

## Development Workflow & Verification Gates
1. **Plan & Specify**: Every feature begins with a spec file and an implementation plan, ensuring design questions are resolved before code is written.
2. **Implement & Test (TDD)**: Create failing tests matching the spec requirements first, verify they fail, then implement the minimal code required to pass, and refactor.
3. **Commit Incrementally**: Apply the task-based commit strategy on every successful task completion.
4. **Final Review**: Validate the integration, run end-to-end tests inside the container, verify all documentation is complete, and review for security compliance before merging.

## Governance
This Constitution is the supreme authority for the Antiquarium project's engineering standards. No pull request may be merged if it violates any core principle.
- **Amendment Procedure**: Any modifications or additions to these principles require a version bump following semantic versioning rules, updating ratification dates, and generating a Sync Impact Report.
- **Compliance Checks**: Peer reviews and continuous integration (CI) pipelines must automatically verify compliance with the TDD, style, modularity, security, and containerization principles.
- **Documentation**: Runtime engineering guidance is governed by the `AGENTS.md` file and standard specifications under `.specify/`.

**Version**: 1.0.0 | **Ratified**: 2026-05-17 | **Last Amended**: 2026-05-17
