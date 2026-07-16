# Quickstart: Web UI Layout Refactor for Packet-Centric View

This guide outlines how to run, test, format, and lint the application during the development of this layout refactoring feature.

## Prerequisites
Ensure Node.js v20+ and `npm` are installed locally, or Docker is configured.

## Development Commands

All commands are executed relative to the `web/` directory:

```bash
cd web/
```

### 1. Run Development Server
Start the Vite development server locally:
```bash
npm run dev
```
The application will be accessible at [http://localhost:5173](http://localhost:5173).

### 2. Run Unit Tests (TDD Verification)
Run all Vitest unit tests in single-run mode:
```bash
npm run test -- --run
```
To run tests in watch/interactive mode:
```bash
npm run test
```

### 3. Check Test Coverage
Verify that unit tests meet the minimum coverage gate (80% lines):
```bash
npm run test:coverage
```

### 4. Code Formatting and Linting
Format files using Prettier:
```bash
npm run format
```
Check code quality rules using ESLint:
```bash
npm run lint
```
