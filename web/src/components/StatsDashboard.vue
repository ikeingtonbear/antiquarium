<script setup lang="ts">
/**
 * StatsDashboard — Capture Statistics Dashboard Component
 *
 * Displays packet capture analysis results in a responsive 2x2 card grid
 * with an Acknowledge button for session termination.
 *
 * @see plan.md §4 — Capture Statistics Dashboard
 */

import { computed } from "vue";
import { Layers, HardDrive, Clock, File } from "@lucide/vue";
import type { CaptureStatistics } from "../types";

/* ── Props & Emits ── */
const props = defineProps<{
  fileName: string;
  fileSize: number;
  statistics: CaptureStatistics;
  isDeleting: boolean;
}>();

const emit = defineEmits<{
  (e: "end-session"): void;
  (e: "show-details"): void;
}>();

/* ── Formatters ── */

/** Format a number with locale-aware thousands separators */
function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/** Format bytes to human-readable size */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const units = ["Bytes", "KB", "MB", "GB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

/** Format duration to seconds with 3 decimal places */
function formatDuration(seconds: number): string {
  return `${seconds.toFixed(3)}s`;
}

/* ── Computed Stats Cards ── */
const cards = computed(() => [
  {
    id: "filename",
    label: "File Name",
    value: props.fileName,
    icon: File,
    color: "accent",
  },
  {
    id: "filesize",
    label: "File Size",
    value: formatBytes(props.fileSize),
    icon: HardDrive,
    color: "accent",
  },
  {
    id: "frames",
    label: "Frames",
    value: formatNumber(props.statistics.frames),
    icon: Layers,
    color: "accent",
  },
  {
    id: "duration",
    label: "Duration",
    value: formatDuration(props.statistics.duration),
    icon: Clock,
    color: "accent",
  },
]);

/* ── Handlers ── */
function handleAcknowledge() {
  if (!props.isDeleting) {
    emit("acknowledge");
  }
}
</script>

<template>
  <div class="stats-dashboard">
    <h2 class="dashboard-title">
      <span class="dashboard-title-icon" aria-hidden="true">📊</span>
      Capture Analysis
    </h2>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div
        v-for="card in cards"
        :key="card.id"
        class="stat-card card"
        :class="`stat-card--${card.color}`"
      >
        <div class="stat-card-header">
          <component
            :is="card.icon"
            :size="20"
            :stroke-width="1.5"
            aria-hidden="true"
            class="stat-card-icon"
          />
          <span class="stat-card-label text-secondary">{{ card.label }}</span>
        </div>
        <p class="stat-card-value text-mono">{{ card.value }}</p>
      </div>
    </div>

    <!-- Actions Bar -->
    <div class="dashboard-actions">
      <button
        class="btn-end-session"
        :disabled="isDeleting"
        @click="emit('end-session')"
      >
        <span v-if="isDeleting" class="btn-spinner" aria-hidden="true"></span>
        <span v-if="isDeleting">Closing Session...</span>
        <span v-else>End Session</span>
      </button>

      <button
        class="btn-view-details"
        :disabled="isDeleting"
        @click="emit('show-details')"
      >
        View Analysis Details
      </button>
    </div>
  </div>
</template>

<style scoped>
.stats-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-8);
  width: 100%;
  animation: fadeIn var(--duration-slow) var(--ease-out-expo);
}

.dashboard-title {
  font-size: var(--text-2xl);
  font-weight: var(--weight-semibold);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.dashboard-title-icon {
  font-size: 1.2em;
}

/* ── Stats Grid ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  width: 100%;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  transition:
    transform var(--duration-normal) var(--ease-spring),
    box-shadow var(--duration-normal) ease,
    border-color var(--duration-normal) ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card--accent:hover {
  border-color: rgba(6, 182, 212, 0.2);
  box-shadow: var(--shadow-glow-accent);
}

.stat-card-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.stat-card-icon {
  color: var(--color-accent);
}

.stat-card-label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-card-value {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  word-break: break-all;
}

/* ── Actions Bar ── */
.dashboard-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  align-items: center;
  width: 100%;
}

.btn-end-session {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: white;
  background: linear-gradient(135deg, var(--color-danger), #b91c1c);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md), var(--shadow-glow-danger);
  transition:
    transform var(--duration-normal) var(--ease-spring),
    box-shadow var(--duration-normal) ease,
    opacity var(--duration-normal) ease;
  min-width: 180px;
}

.btn-end-session:hover:not(:disabled) {
  transform: scale(1.04);
  box-shadow:
    var(--shadow-lg),
    0 0 30px rgba(244, 63, 94, 0.3);
}

.btn-end-session:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-end-session:focus-visible {
  outline: 2px solid var(--color-danger);
  outline-offset: 2px;
}

.btn-end-session:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-view-details {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--color-border-glass);
  border-radius: var(--radius-lg);
  transition:
    transform var(--duration-normal) var(--ease-spring),
    background var(--duration-normal) ease,
    border-color var(--duration-normal) ease;
  min-width: 180px;
}

.btn-view-details:hover:not(:disabled) {
  transform: scale(1.04);
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--color-border-hover);
}

.btn-view-details:active:not(:disabled) {
  transform: scale(0.98);
}

/* ── Spinner ── */
.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card-value {
    font-size: var(--text-lg);
  }
}
</style>
