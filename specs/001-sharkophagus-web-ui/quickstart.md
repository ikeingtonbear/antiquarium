# Quickstart: Sharkophagus Web UI Frontend

This guide describes how to run and test the Sharkophagus Web UI frontend locally.

---

## 1. Prerequisites

- **Node.js**: v18+ (if running bare-metal locally)
- **Docker & Docker Compose**: (highly recommended, satisfies Constitution Principle VI)

---

## 2. Running with Docker (Recommended)

To run the frontend containerized and avoid polluting your host environment:

1. **Build and start the container**:
   ```bash
   docker compose -f web/docker-compose.yml up --build
   ```
2. **Access the application**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.
3. **Environment Configuration**:
   The development container is pre-configured to point to the local backend API at `http://localhost:8080/v1` via the `VITE_API_URL` environment variable.

---

## 3. Running Locally (Bare-metal)

If you prefer to run the Vite pipeline natively on your system:

1. **Navigate to the web directory**:
   ```bash
   cd web
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   VITE_API_URL=http://localhost:8080/v1 npm run dev
   ```

---

## 4. Running Tests (TDD Cycle)

In accordance with the project constitution, you must run tests regularly and write tests *before* writing component logic.

### 4.1 Running Vitest Natively
- **Run tests in watch mode** (best for active development):
  ```bash
  npm run test
  ```
- **Run tests with coverage verification**:
  ```bash
  npm run test:coverage
  ```

### 4.2 Running Vitest in Docker
- **Run tests inside the development container**:
  ```bash
  docker compose -f web/docker-compose.yml run --rm web npm run test:coverage
  ```

---

## 5. Build and Deploy

To create the production build bundle:
```bash
npm run build
```
The output assets will be generated in `web/dist/`, ready to be served by any static file server.
