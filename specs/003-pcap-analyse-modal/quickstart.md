# Quickstart: PCAP Analyse Modal

This document describes how to execute the test suite and verify the feature manually.

## 1. Running the Test Suite

All tests must be run using the project's testing configuration.

### Run Unit and Component Tests (Vite/Vitest)

Execute the test suite inside the `web/` directory:

```bash
cd web
npm run test
```

Or run tests in watch/UI mode:

```bash
npm run test -- --ui
```

---

## 2. Manual Verification Checklist

After implementation, perform these verification steps:

1. **Upload Flow**:
   - Drag and drop or select a valid PCAP file.
   - Observe that the upload progress bar completes.
   - Confirm that the UI transitions to displaying the Analysis Modal overlay.

2. **Modal Content**:
   - Verify that the modal lists:
     - Filename (e.g. `capture.pcap`)
     - Filesize (formatted, e.g. `1.2 MB` or `500 KB`)
     - Duration (e.g. `4.53s`)
     - Frames count
   - Verify that the analysis information displays the list of protocols and epoch start/end timestamps formatted cleanly.

3. **Dismiss Flow**:
   - Click the "Close" button.
   - Verify that the modal closes and the UI resets back to the initial dropzone view.
   - Check network logs to ensure `DELETE /sessions/{sessionId}` was successfully called.
