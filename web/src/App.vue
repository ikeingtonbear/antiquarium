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

import { ref, onMounted, onUnmounted, watch, provide } from "vue";
import type {
  AppState,
  CaptureSession,
  CaptureStatistics,
  CaptureAnalysis,
  SystemInfo,
} from "./types";
import FileUpload from "./components/FileUpload.vue";
import AnalysisModal from "./components/AnalysisModal.vue";
import StatsDashboard from "./components/StatsDashboard.vue";
import ErrorNotification from "./components/ErrorNotification.vue";
import AppFooter from "./components/AppFooter.vue";
import SystemInfoModal from "./components/SystemInfoModal.vue";
import SettingsMenu from "./components/SettingsMenu.vue";
import ConfigModal from "./components/ConfigModal.vue";
import FramesTable from "./components/FramesTable.vue";
import PacketDetails from "./components/PacketDetails.vue";
import FollowStreamModal from "./components/FollowStreamModal.vue";
import { SharkophagusApi } from "./services/api";

/* ── Reactive State ── */
const appState = ref<AppState>("idle");
const session = ref<CaptureSession | null>(null);
const statistics = ref<CaptureStatistics | null>(null);
const analysis = ref<CaptureAnalysis | null>(null);
const uploadProgress = ref<number>(0);
const errorMessage = ref<string | null>(null);
const isTransitioning = ref<boolean>(false);
const isAnalysisModalOpen = ref<boolean>(false);
const selectedFrameId = ref<number | null>(null);

/* ── Follow Stream State ── */
const followStreamData = ref<{ protocol: string; filter: string } | null>(null);
const framesTableRef = ref<any>(null);

/* ── System Info State ── */
const systemInfo = ref<SystemInfo | null>(null);
const isOnline = ref<boolean>(false);
const isInfoLoading = ref<boolean>(false);
const infoError = ref<string | null>(null);
const isInfoModalOpen = ref<boolean>(false);
const isPreferencesOpen = ref<boolean>(false);

/* ── API Client ── */
const api = new SharkophagusApi();
provide("api", api);

/* ── Exit Protection ── */
function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (appState.value === "uploading" || appState.value === "deleting") {
    e.preventDefault();
    /* Modern browsers ignore custom text but still show a prompt */
    e.returnValue = "";
  }
}

onMounted(async () => {
  window.addEventListener("beforeunload", handleBeforeUnload);

  /* Query system info on load */
  isInfoLoading.value = true;
  infoError.value = null;
  try {
    systemInfo.value = await api.getSystemInfo();
    isOnline.value = true;
  } catch (err: unknown) {
    isOnline.value = false;
    infoError.value =
      err instanceof Error ? err.message : "Failed to load system info.";
  } finally {
    isInfoLoading.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});

/* ── Upload Handler ── */
async function handleUpload(file: File) {
  appState.value = "uploading";
  uploadProgress.value = 0;
  errorMessage.value = null;

  let sessionResult: CaptureSession | null = null;
  try {
    sessionResult = await api.createSession(file, (progress) => {
      uploadProgress.value = progress;
    });

    session.value = sessionResult;

    /* Fetch statistics and analysis in parallel */
    const [stats, analysisResult] = await Promise.all([
      api.getStatistics(sessionResult.id),
      api.getAnalysis(sessionResult.id),
    ]);
    statistics.value = stats;
    analysis.value = analysisResult;

    appState.value = "ready";
    isAnalysisModalOpen.value = true;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Upload failed. Please try again.";
    errorMessage.value = message;

    // Clean up session if it was created
    if (sessionResult) {
      try {
        await api.closeSession(sessionResult.id);
      } catch {
        // Ignore background cleanup failures on error path
      }
    }

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
  analysis.value = null;
  uploadProgress.value = 0;
  appState.value = "idle";

  isTransitioning.value = false;
}

/* ── Error Dismiss ── */
function handleFollowStream(protocol: string, filter: string) {
  followStreamData.value = { protocol, filter };
  if (framesTableRef.value) {
    framesTableRef.value.applyFilter(filter);
  }
}

function handleDismissError() {
  errorMessage.value = null;
}

/* ── Capabilities Modal Actions ── */
function handleOpenInfo() {
  isInfoModalOpen.value = true;
}
</script>

<template>
  <main
    class="app-container"
    :class="{ 'is-ready': appState === 'ready' || appState === 'deleting' }"
  >
    <header
      class="app-header"
      v-if="appState !== 'ready' && appState !== 'deleting'"
    >
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

      <!-- State: READY / DELETING — Stats Dashboard and Analysis Modal Overlay -->
      <section
        v-else-if="appState === 'ready' || appState === 'deleting'"
        key="dashboard"
        class="app-view"
        :class="{ 'is-exiting': isTransitioning }"
        style="display: flex; flex-direction: column; gap: var(--space-8)"
      >
        <StatsDashboard
          v-if="statistics && session"
          :statistics="statistics"
          :file-name="session.fileName"
          :file-size="session.fileSize"
          :is-deleting="appState === 'deleting'"
          @end-session="handleAcknowledge"
          @show-details="isAnalysisModalOpen = true"
        />

        <FramesTable
          ref="framesTableRef"
          v-if="session && statistics"
          :session-id="session.id"
          :columns="
            statistics.columns && statistics.columns.length > 0
              ? statistics.columns
              : systemInfo &&
                  systemInfo.columns &&
                  systemInfo.columns.length > 0
                ? systemInfo.columns.map((c) => c.name)
                : [
                    'No.',
                    'Time',
                    'Source',
                    'Destination',
                    'Protocol',
                    'Length',
                    'Info',
                  ]
          "
          :total-frames="statistics.frames"
          @select-frame="selectedFrameId = $event"
        />

        <PacketDetails
          v-if="session && statistics"
          :session-id="session.id"
          :frame-id="selectedFrameId"
          @follow-stream="handleFollowStream"
        />

        <FollowStreamModal
          v-if="followStreamData && session"
          :session-id="session.id"
          :protocol="followStreamData.protocol"
          :filter="followStreamData.filter"
          @close="followStreamData = null"
        />

        <AnalysisModal
          v-if="isAnalysisModalOpen && statistics && analysis && session"
          :statistics="statistics"
          :analysis="analysis"
          :is-closing="appState === 'deleting'"
          @close="isAnalysisModalOpen = false"
        />
      </section>
    </Transition>

    <!-- Global App Footer -->
    <AppFooter
      :system-info="systemInfo"
      :is-online="isOnline"
      :is-loading="isInfoLoading"
      :error="infoError"
    />

    <!-- Settings Menu Toggle -->
    <SettingsMenu
      v-if="isOnline && !isInfoLoading && systemInfo"
      @open-info="handleOpenInfo"
      @open-preferences="isPreferencesOpen = true"
    />

    <!-- System Capabilities Modal -->
    <SystemInfoModal
      :is-open="isInfoModalOpen"
      :system-info="systemInfo"
      @close="isInfoModalOpen = false"
    />

    <!-- Config Preferences Modal -->
    <ConfigModal
      :is-open="isPreferencesOpen"
      :session-id="session?.id || null"
      @close="isPreferencesOpen = false"
    />
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
  transition: max-width var(--duration-normal) var(--ease-out-expo);
}

.app-container.is-ready {
  max-width: 100%;
  width: 100%;
  padding: 0 var(--space-6);
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
