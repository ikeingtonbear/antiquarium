<script setup lang="ts">
/**
 * StatsDashboard — Capture Statistics Dashboard Component
 *
 * Displays packet capture analysis results in a responsive 3x2 card grid
 * with an Acknowledge button for session termination.
 *
 * @see plan.md §4 — Capture Statistics Dashboard
 */

import { computed } from 'vue';
import {
  Layers,
  HardDrive,
  Clock,
  CalendarRange,
  CalendarClock,
} from '@lucide/vue';
import type { CaptureStatistics } from '../types';

/* ── Props & Emits ── */
const props = defineProps<{
  statistics: CaptureStatistics;
  isDeleting: boolean;
}>();

const emit = defineEmits<{
  (e: 'acknowledge'): void;
}>();

/* ── Formatters ── */

/** Format a number with locale-aware thousands separators */
function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

/** Format bytes to human-readable size */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const units = ['Bytes', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

/** Format duration to seconds with 3 decimal places */
function formatDuration(seconds: number): string {
  return `${seconds.toFixed(3)}s`;
}

/** Format ISO timestamp to readable format */
function formatTimestamp(iso?: string): string {
  if (!iso) return 'N/A';
  try {
    const date = new Date(iso);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const ms = String(date.getUTCMilliseconds()).padStart(3, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`;
  } catch {
    return 'N/A';
  }
}

/* ── Computed Stats Cards ── */
const cards = computed(() => [
  {
    id: 'frames',
    label: 'Frames',
    value: formatNumber(props.statistics.frames),
    icon: Layers,
    color: 'accent',
  },
  {
    id: 'bytes',
    label: 'Bytes',
    value: formatBytes(props.statistics.bytes),
    icon: HardDrive,
    color: 'accent',
  },
  {
    id: 'duration',
    label: 'Duration',
    value: formatDuration(props.statistics.duration),
    icon: Clock,
    color: 'accent',
  },
  {
    id: 'first-packet',
    label: 'First Packet',
    value: formatTimestamp(props.statistics.firstPacketTime),
    icon: CalendarRange,
    color: 'success',
  },
  {
    id: 'last-packet',
    label: 'Last Packet',
    value: formatTimestamp(props.statistics.lastPacketTime),
    icon: CalendarClock,
    color: 'success',
  },
]);

/* ── Handlers ── */
function handleAcknowledge() {
  if (!props.isDeleting) {
    emit('acknowledge');
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

    <!-- Acknowledge Button -->
    <button
      class="btn-acknowledge"
      :disabled="isDeleting"
      @click="handleAcknowledge"
    >
      <span v-if="isDeleting" class="btn-spinner" aria-hidden="true"></span>
      <span v-if="isDeleting">Closing Session...</span>
      <span v-else>✓ Acknowledge &amp; Close</span>
    </button>
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
  grid-template-columns: repeat(3, 1fr);
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

.stat-card--success:hover {
  border-color: rgba(16, 185, 129, 0.2);
  box-shadow: var(--shadow-glow-success);
}

.stat-card-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.stat-card-icon {
  color: var(--color-accent);
}

.stat-card--success .stat-card-icon {
  color: var(--color-success);
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

/* ── Acknowledge Button ── */
.btn-acknowledge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: white;
  background: linear-gradient(135deg, var(--color-success), #059669);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md), var(--shadow-glow-success);
  transition:
    transform var(--duration-normal) var(--ease-spring),
    box-shadow var(--duration-normal) ease,
    opacity var(--duration-normal) ease;
  min-width: 220px;
}

.btn-acknowledge:hover:not(:disabled) {
  transform: scale(1.04);
  box-shadow: var(--shadow-lg), 0 0 30px rgba(16, 185, 129, 0.3);
}

.btn-acknowledge:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-acknowledge:focus-visible {
  outline: 2px solid var(--color-success);
  outline-offset: 2px;
}

.btn-acknowledge:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card-value {
    font-size: var(--text-lg);
  }
}
</style>
