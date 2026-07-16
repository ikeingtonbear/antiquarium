<script setup lang="ts">
/**
 * StatsDashboard — Capture Statistics Dashboard Component
 *
 * Refactored to render as a compact, unified top horizontal navigation
 * header to maximize screen space for the primary packet viewer.
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
  (e: "acknowledge"): void;
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
</script>

<template>
  <div class="stats-header-bar">
    <!-- Shrunken Logo & Tagline -->
    <div class="header-logo-section">
      <span class="logo-icon">🦈</span>
      <span class="logo-title">Sharkophagus</span>
      <span class="logo-tagline">Analysis</span>
    </div>

    <!-- Inline Metadata Details -->
    <div class="header-meta-section">
      <div v-for="card in cards" :key="card.id" class="meta-item">
        <component
          :is="card.icon"
          :size="14"
          :stroke-width="1.5"
          aria-hidden="true"
          class="meta-icon"
        />
        <span
          class="meta-value text-mono"
          :title="card.label + ': ' + card.value"
          >{{ card.value }}</span
        >
      </div>
    </div>

    <!-- Actions Bar -->
    <div class="header-actions-section">
      <button
        class="btn-end-session"
        :disabled="isDeleting"
        @click="emit('end-session')"
      >
        <span v-if="isDeleting" class="btn-spinner" aria-hidden="true"></span>
        <span v-if="isDeleting">Closing...</span>
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
.stats-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-3) var(--space-5);
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(16px);
  border: 1px solid var(--color-border-glass);
  border-radius: var(--radius-lg);
  gap: var(--space-4);
  animation: fadeIn var(--duration-slow) var(--ease-out-expo);
}

.header-logo-section {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.logo-icon {
  font-size: 1.2rem;
}

.logo-title {
  font-weight: var(--weight-bold);
  font-size: var(--text-base);
  color: var(--color-text-primary);
}

.logo-tagline {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  border-left: 1px solid rgba(255, 255, 255, 0.15);
  padding-left: var(--space-2);
}

.header-meta-section {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  overflow: hidden;
  flex-grow: 1;
  justify-content: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  min-width: 0;
}

.meta-icon {
  color: var(--color-accent);
  flex-shrink: 0;
}

.meta-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions-section {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.btn-end-session {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: white;
  background: linear-gradient(135deg, var(--color-danger), #b91c1c);
  border: none;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm), var(--shadow-glow-danger);
  transition:
    transform var(--duration-normal) var(--ease-spring),
    box-shadow var(--duration-normal) ease,
    opacity var(--duration-normal) ease;
  cursor: pointer;
}

.btn-end-session:hover:not(:disabled) {
  transform: scale(1.03);
  box-shadow:
    var(--shadow-md),
    0 0 15px rgba(244, 63, 94, 0.2);
}

.btn-end-session:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-end-session:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-view-details {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border-glass);
  border-radius: var(--radius-md);
  transition:
    transform var(--duration-normal) var(--ease-spring),
    background var(--duration-normal) ease,
    border-color var(--duration-normal) ease;
  cursor: pointer;
}

.btn-view-details:hover:not(:disabled) {
  transform: scale(1.03);
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-border-hover);
}

.btn-view-details:active:not(:disabled) {
  transform: scale(0.98);
}

/* Spinner */
.btn-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .stats-header-bar {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-3);
  }

  .header-meta-section {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .header-actions-section {
    justify-content: flex-end;
  }
}
</style>
