# Quickstart: Display Frames Table

This guide shows you how to run the web application, execute unit tests, and manually verify the frames table.

## 1. Running the Development Server

Start the frontend application in development mode:

```bash
cd web
npm install
npm run dev
```

The web application will open at `http://localhost:5173`.

## 2. Running Automated Tests

To run the unit tests and ensure that the test suites verify the component's functionality under TDD:

```bash
cd web
# Run Vitest test runner
npm run test
```

To run coverage checks:

```bash
npm run test:coverage
```

## 3. Manual Verification Steps

1. Start the application and upload a valid PCAP file.
2. Verify that a frames list table is rendered below the statistics summary.
3. Verify that the table fits up to 25 rows and scrolling past displays more packets seamlessly.
4. Open the column selection dropdown to hide some columns and show them again.
5. Drag and drop column headers to verify reordering.
6. Refresh the page to confirm layout custom preferences are restored from `LocalStorage`.
7. Test offline/network error behavior (e.g. stop backend server) and verify the "API Error" retry banner renders inside the table container.
