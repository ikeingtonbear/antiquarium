# Quickstart & Verification: Web UI Layout and Session Lifecycle Updates

This guide covers running the development server and verifying the UI layout and session changes.

## Development Environment Setup

All commands must be executed within the `web` workspace directory:

```bash
cd web
npm install
```

## Running the Dev Server

To launch the dev server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

## Verification & Testing

### Automated Unit Tests

Run the test suite using Vitest:

```bash
npm run test
```

Or run tests in watch mode:

```bash
npx vitest
```

### Manual Verification Checklist

1. **Upload Flow**: Upload a valid pcap file. Verify the upload progress completes and the `AnalysisModal` overlay opens.
2. **Decoupled Close**: Click the "Close" button (X or text) in the `AnalysisModal`. Verify that:
   - The modal closes.
   - The dashboard/session stays active (you see `StatsDashboard` with stats card grid).
3. **Reopen Details**: On the `StatsDashboard`, click "View Analysis Details". Verify the `AnalysisModal` overlay opens again.
4. **End Session**: Click "End Session" on the `StatsDashboard`. Verify the session is terminated and you return to the File Upload dropzone.
5. **Settings Menu**:
   - Verify the Settings (gear) button is rendered in the bottom-right corner.
   - Click the button; verify the menu pops up with an "Info" item.
   - Click "Info"; verify the system capabilities modal opens.
   - Verify clicking outside the settings menu closes it.
