# Quickstart: Settings Visual Cleanup

This quickstart guides you through running the development server and verifying the settings layout cleanup and dynamic grouping.

## 1. Local Development Setup

To start the frontend application in development mode:

```bash
cd web
npm install
npm run dev
```

The app will be available locally at `http://localhost:5173`.

## 2. Running Verification Tests

To verify both unit tests and UI rendering logic:

```bash
cd web
# Run all unit tests including new formatting and grouping tests
npm run test
```

## 3. Manual Verification Steps

1. Launch the web interface and open the settings modal.
2. Select the **Capture** category in the left sidebar.
3. Verify that settings like `capture.devices_hide`, `capture.devices_pmode`, and `capture.devices_buffersize` are grouped in a card titled **Devices**.
4. Verify that their field labels are displayed as **Hide**, **Promiscuous Mode**, and **Buffer Size** instead of their raw technical names.
5. Click the collapse/expand toggle on the **Devices** card to confirm it toggles correctly with a smooth transition.
6. Type `devices` in the search bar and verify that search results group matching settings under category headers and then by subgroups.
