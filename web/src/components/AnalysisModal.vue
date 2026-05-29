<script setup lang="ts">
/**
 * AnalysisModal — Capture Stats and Analysis Modal Component
 *
 * Displays packet capture details overlay containing filename, filesize,
 * duration, frame count, detected protocols list, and timestamps.
 */

import { computed } from "vue";
import { Layers, HardDrive, Clock, File, Activity } from "@lucide/vue";
import type { CaptureStatistics, CaptureAnalysis } from "../types";

/* ── Props & Emits ── */
const props = defineProps<{
  statistics: CaptureStatistics;
  analysis: CaptureAnalysis;
  isClosing: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

/* ── Formatters ── */

/** Format a number with locale-aware thousands separators */
function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/** Format bytes to human-readable size */
function formatBytes(bytes?: number): string {
  if (!bytes) return "0 Bytes";
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

function formatEpoch(epoch: number): string {
  return epoch.toFixed(3);
}

/* ── Handlers ── */
function handleClose() {
  if (!props.isClosing) {
    emit("close");
  }
}
</script>

<template>
  <div
    class="modal-backdrop"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div class="modal-content card">
      <header class="modal-header">
        <h2 id="modal-title" class="modal-title">
          <span class="modal-title-icon" aria-hidden="true">🦈</span>
          Session Analysis Complete
        </h2>
      </header>

      <div class="modal-body">
        <!-- Section: General Status -->
        <section class="analysis-section">
          <h3 class="section-title">
            <component :is="File" :size="16" class="section-icon" />
            Capture Metadata
          </h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">File Name</span>
              <span class="stat-value text-mono">{{
                statistics.filename || "Unknown"
              }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">File Size</span>
              <span class="stat-value text-mono">{{
                formatBytes(statistics.bytes)
              }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Duration</span>
              <span class="stat-value text-mono">{{
                formatDuration(statistics.duration)
              }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Frames Count</span>
              <span class="stat-value text-mono">{{
                formatNumber(statistics.frames)
              }}</span>
            </div>
          </div>
        </section>

        <!-- Section: Analysis Details -->
        <section class="analysis-section">
          <h3 class="section-title">
            <component :is="Activity" :size="16" class="section-icon" />
            Deep Analysis
          </h3>
          <div class="analysis-details">
            <div class="detail-item">
              <span class="detail-label">Protocols Detected</span>
              <div class="protocol-tags">
                <span
                  v-for="proto in analysis.protocols"
                  :key="proto"
                  class="protocol-tag text-mono"
                >
                  {{ proto }}
                </span>
                <span v-if="!analysis.protocols.length" class="text-secondary"
                  >None</span
                >
              </div>
            </div>
            <div class="time-range-grid">
              <div class="stat-item">
                <span class="stat-label">First Packet Epoch</span>
                <span class="stat-value text-mono">{{
                  formatEpoch(analysis.first)
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Last Packet Epoch</span>
                <span class="stat-value text-mono">{{
                  formatEpoch(analysis.last)
                }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer class="modal-footer">
        <button
          class="modal-close-btn"
          :disabled="isClosing"
          @click="handleClose"
        >
          <span v-if="isClosing" class="btn-spinner" aria-hidden="true"></span>
          <span v-if="isClosing">Closing Session...</span>
          <span v-else>Close</span>
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 10, 12, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn var(--duration-normal) ease;
}

.modal-content {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  padding: var(--space-8);
  gap: var(--space-6);
  background: rgba(20, 20, 25, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.5),
    var(--shadow-glow-accent);
  animation: scaleIn var(--duration-slow) var(--ease-out-expo);
  overflow-y: auto;
}

.modal-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: var(--space-4);
}

.modal-title {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.modal-title-icon {
  font-size: 1.2em;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.analysis-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.section-title {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.section-icon {
  color: var(--color-accent);
}

/* Stats grids and items */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.stat-value {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  word-break: break-all;
}

.analysis-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.detail-label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.protocol-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.protocol-tag {
  background: rgba(6, 182, 212, 0.15);
  color: var(--color-accent);
  border: 1px solid rgba(6, 182, 212, 0.3);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  text-transform: uppercase;
  font-weight: var(--weight-bold);
}

.time-range-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding-top: var(--space-4);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: var(--space-4);
}

.modal-close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: white;
  background: linear-gradient(135deg, var(--color-accent), #0284c7);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition:
    transform var(--duration-normal) var(--ease-spring),
    opacity var(--duration-normal) ease;
}

.modal-close-btn:hover:not(:disabled) {
  transform: scale(1.03);
  box-shadow: var(--shadow-glow-accent);
}

.modal-close-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.modal-close-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .stats-grid,
  .time-range-grid {
    grid-template-columns: 1fr;
  }
}
</style>
