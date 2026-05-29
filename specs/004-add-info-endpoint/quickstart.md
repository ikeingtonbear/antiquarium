# Quickstart & Verification: Add Info Endpoint Information

This document outlines verification steps for both automated unit tests and manual execution.

## 1. Automated Tests

Run the test suite inside the container environment or locally using npm:

```bash
# Run all tests
npm run test

# Run only the API service test suite
npm run test -- tests/services/api.spec.ts

# Run only footer and modal component test suites
npm run test -- tests/components/AppFooter.spec.ts tests/components/SystemInfoModal.spec.ts
```

### Verification Criteria
- `api.spec.ts` verifies that `getSystemInfo` makes a `GET` request to `${baseUrl}/info` and returns the mapped `SystemInfo` fields.
- `AppFooter.spec.ts` verifies that the footer mounts correctly, triggers `getSystemInfo` on initialization, and handles failure states (online/offline visual indicators).
- `SystemInfoModal.spec.ts` verifies that clicking the info icon renders the modal overlay showing categorized capabilities correctly.

## 2. Manual Verification

1. Start the frontend developer environment:
   ```bash
   npm run dev
   ```
2. Open the browser at `http://localhost:5173`.
3. Verify that the footer displays:
   - "Sharkophagus v1.0.0" (or similar version) if backend is running.
   - "Sharkophagus offline" (in red or styled warning color) if backend is offline.
4. If online, click the Info icon/button in the footer.
5. Verify that the "System Capabilities" modal overlay is displayed and you can browse the columns, formats, and taps lists.
