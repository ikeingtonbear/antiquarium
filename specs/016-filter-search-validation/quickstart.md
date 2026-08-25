# Quickstart

This guide explains how to get started with the Filter Search Validation feature development.

## 1. Setup Backend
Ensure you have the Sharkophagus backend running locally, as the validation feature relies on the `/sessions/{sessionId}/check` endpoint.
```bash
# In the Sharkophagus workspace
cargo run
```

## 2. Setup Frontend
Start the Vue 3 development server for Antiquarium.
```bash
# In the Antiquarium workspace
npm run dev
```

## 3. Development Workflow
1. Navigate to `web/src/services/api.ts` and implement the `check` method according to the `contracts/api.md` definition.
2. Open `web/src/components/FilterBar.vue`.
3. Add a debounced watcher for `filterText` that calls `api.check`.
4. Update the UI state (`validationError`, `isValid`) based on the API response.
5. Bind the `disabled` property of the Apply button to the `isValid` computed state.
6. Add visual feedback (e.g. red text or a tooltip) displaying `validationError` when invalid.

## 4. Testing
Run the frontend unit tests to ensure your changes work as expected.
```bash
npm run test
```
Verify the feature manually in the browser by typing invalid and valid filters into the filter search bar and observing the Apply button state.
