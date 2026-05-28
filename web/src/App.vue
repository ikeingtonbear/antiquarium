<script setup lang="ts">
/**
 * Sharkophagus Web UI — Root Application Component
 *
 * Manages the global application state machine and orchestrates
 * transitions between the FileUpload, Upload Progress, StatsDashboard,
 * and ErrorNotification views.
 *
 * @see data-model.md §2 — Client-Side Lifecycle & State Machine
 */

import { ref, onMounted, onUnmounted, watch } from "vue";
import type { AppState, CaptureSession, CaptureStatistics } from "./types";
import FileUpload from "./components/FileUpload.vue";
import StatsDashboard from "./components/StatsDashboard.vue";
import ErrorNotification from "./components/ErrorNotification.vue";
import { SharkophagusApi } from "./services/api";

/* ── Reactive State ── */
const appState = ref<AppState>("idle");
const session = ref<CaptureSession | null>(null);
const statistics = ref<CaptureStatistics | null>(null);
const uploadProgress = ref<number>(0);
const errorMessage = ref<string | null>(null);
const isTransitioning = ref<boolean>(false);

/* ── API Client ── */
const api = new SharkophagusApi();

/* ── Exit Protection ── */
function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (appState.value === "uploading" || appState.value === "deleting") {
    e.preventDefault();
    /* Modern browsers ignore custom text but still show a prompt */
    e.returnValue = "";
  }
}

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});

/* ── Upload Handler ── */
async function handleUpload(file: File) {
  appState.value = "uploading";
  uploadProgress.value = 0;
  errorMessage.value = null;

  try {
    const result = await api.createSession(file, (progress) => {
      uploadProgress.value = progress;
    });

    session.value = result;

    /* Fetch statistics immediately after upload */
    const stats = await api.getStatistics(result.id);
    statistics.value = stats;

    appState.value = "ready";
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Upload failed. Please try again.";
    errorMessage.value = message;
    appState.value = "idle";
    uploadProgress.value = 0;
  }
}

/* ── Session Termination Handler ── */
async function handleAcknowledge() {
  if (!session.value) return;

  appState.value = "deleting";
  errorMessage.value = null;

  try {
    await api.closeSession(session.value.id);
    await resetToIdle();
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to close session. Please try again.";
    errorMessage.value = message;
    appState.value = "ready";
  }
}

/* ── State Reset (with animation) ── */
async function resetToIdle() {
  isTransitioning.value = true;
  /* Wait for fade-out animation (300ms per plan.md) */
  await new Promise((resolve) => setTimeout(resolve, 300));

  session.value = null;
  statistics.value = null;
  uploadProgress.value = 0;
  appState.value = "idle";

  isTransitioning.value = false;
}

/* ── Error Dismiss ── */
function handleDismissError() {
  errorMessage.value = null;
}
</script>

<template>
  <main class="app-container">
    <header class="app-header">
      <h1 class="app-title">
        <span class="app-title-icon">🦈</span>
        Sharkophagus
      </h1>
      <p class="app-subtitle text-secondary">
        Packet Capture Analysis Dashboard
      </p>
    </header>

    <!-- Error Notification Toast -->
    <ErrorNotification
      v-if="errorMessage"
      :message="errorMessage"
      @dismiss="handleDismissError"
    />

    <!-- State: IDLE — File Upload Dropzone -->
    <Transition name="view-fade" mode="out-in">
      <section
        v-if="appState === 'idle'"
        key="upload"
        class="app-view"
        :class="{ 'is-exiting': isTransitioning }"
      >
        <FileUpload @upload="handleUpload" />
      </section>

      <!-- State: UPLOADING — Progress Indicator -->
      <section
        v-else-if="appState === 'uploading'"
        key="progress"
        class="app-view"
      >
        <div class="upload-progress-container card">
          <div class="progress-header">
            <span class="progress-icon" aria-hidden="true">📡</span>
            <h2 class="progress-title">Uploading Capture...</h2>
          </div>

          <div class="progress-details text-secondary">
            <span v-if="session" class="progress-filename text-mono">
              {{ session.fileName }}
            </span>
          </div>

          <div
            class="progress-bar-track"
            role="progressbar"
            :aria-valuenow="uploadProgress"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Upload progress"
          >
            <div
              class="progress-bar-fill"
              :style="{ width: `${uploadProgress}%` }"
            ></div>
          </div>

          <p class="progress-percentage text-mono text-accent">
            {{ Math.round(uploadProgress) }}%
          </p>
        </div>
      </section>

      <!-- State: READY / DELETING — Statistics Dashboard -->
      <section
        v-else-if="appState === 'ready' || appState === 'deleting'"
        key="dashboard"
        class="app-view"
        :class="{ 'is-exiting': isTransitioning }"
      >
        <StatsDashboard
          v-if="statistics && session"
          :statistics="statistics"
          :file-name="session.fileName"
          :file-size="session.fileSize"
          :is-deleting="appState === 'deleting'"
          @acknowledge="handleAcknowledge"
        />
      </section>
    </Transition>
  </main>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 820px;
  gap: var(--space-8);
}

.app-header {
  text-align: center;
  animation: fadeIn var(--duration-slow) var(--ease-out-expo);
}

.app-title {
  font-size: var(--text-4xl);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
}

.app-title-icon {
  font-size: 1.2em;
}

.app-subtitle {
  font-size: var(--text-lg);
  margin-top: var(--space-2);
}

.app-view {
  width: 100%;
}

/* ── View Transitions ── */
.view-fade-enter-active {
  animation: fadeIn var(--duration-slow) var(--ease-out-expo);
}

.view-fade-leave-active {
  animation: fadeOut var(--duration-normal) ease;
}

.is-exiting {
  animation: fadeOut 300ms ease forwards;
}

/* ── Upload Progress ── */
.upload-progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  padding: var(--space-10);
  animation: fadeIn var(--duration-slow) var(--ease-out-expo);
}

.progress-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.progress-icon {
  font-size: var(--text-3xl);
  animation: pulse 2s ease-in-out infinite;
}

.progress-title {
  font-size: var(--text-2xl);
  font-weight: var(--weight-semibold);
}

.progress-details {
  font-size: var(--text-sm);
}

.progress-filename {
  word-break: break-all;
}

.progress-bar-track {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  background: linear-gradient(
    90deg,
    var(--color-accent),
    #38bdf8,
    var(--color-accent)
  );
  background-size: 200% 100%;
  animation: progressGlow 2s linear infinite;
  transition: width var(--duration-normal) var(--ease-out-expo);
  box-shadow: var(--shadow-glow-accent);
}

.progress-percentage {
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
}
</style>
