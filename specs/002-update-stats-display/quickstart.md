# Quickstart: Stats Display Update

## 1. Running the Test Suite

All tests must pass. You can run the vitest unit and integration test suite inside the containerized environment or locally.

To run tests:
```bash
cd web
npm run test:unit
```

---

## 2. Dev Environment Setup

To run the local development server:
```bash
cd web
npm run dev
```

The application will run locally at `http://localhost:5173`.
Ensure that the API server is configured using the environment variable `VITE_API_URL` if it differs from the default `http://localhost:8080/v1`.
