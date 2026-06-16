<script setup lang="ts">
/**
 * FramesTable — Premium scrollable packet capture list view
 *
 * Displays packet rows fetched dynamically from backend. Supports
 * native HTML5 drag-and-drop column reordering, column visibility dropdown toggles,
 * infinite scroll pagination, and recovery from network errors.
 */

import { ref, computed, onMounted, inject, watch } from "vue";
import {
  Settings,
  RefreshCw,
  AlertTriangle,
  GripVertical,
  Eye,
  EyeOff,
} from "@lucide/vue";
import type { Frame, ColumnLayoutConfig, ApiClient } from "../types";

const props = defineProps<{
  sessionId: string;
  columns: string[];
  totalFrames: number;
}>();

const api = inject<ApiClient>("api");

/* ── Reactive State ── */
const frames = ref<Frame[]>([]);
const columns = ref<ColumnLayoutConfig[]>([]);
const loading = ref<boolean>(false);
const loadingMore = ref<boolean>(false);
const error = ref<string | null>(null);
const skip = ref<number>(0);
const limit = 100; // Chunk size
const isDropdownOpen = ref<boolean>(false);

/* Drag & Drop State */
let draggedIndex: number | null = null;

/* Load Column layout config from LocalStorage or initialize defaults */
function initColumns() {
  const firstCol = props.columns[0] || "No.";
  const systemNames = props.columns.slice(1);

  try {
    const cached = localStorage.getItem("sharkophagus_columns_layout");
    if (cached) {
      const { visibleNames, orderNames } = JSON.parse(cached);

      // Reconstruct based on cached order, verifying they still exist in props.columns
      const ordered: ColumnLayoutConfig[] = [];

      // Validate cache: if cached orderNames have no overlap with systemNames, discard cache
      const hasOverlap = orderNames.some((name: string) => systemNames.includes(name));
      if (!hasOverlap && systemNames.length > 0) {
        throw new Error("Cached layout mismatch");
      }

      orderNames.forEach((name: string) => {
        if (systemNames.includes(name)) {
          ordered.push({
            name,
            label: name,
            visible: visibleNames.includes(name),
          });
        }
      });

      // Append any new columns not present in cache
      systemNames.forEach((name) => {
        if (!ordered.some((o) => o.name === name)) {
          ordered.push({
            name,
            label: name,
            visible: true,
          });
        }
      });

      // Ensure at least one customizable column is visible if systemNames is not empty
      if (ordered.length > 0 && !ordered.some((c) => c.visible)) {
        ordered.forEach((c) => (c.visible = true));
      }

      columns.value = ordered;
      return;
    }
  } catch {
    // Fallback to default setup on cache errors or mismatch
  }

  // Initialize from scratch
  columns.value = systemNames.map((name) => ({
    name,
    label: name,
    visible: true,
  }));
}

/* Save Column layout to LocalStorage */
function saveLayout() {
  try {
    const visibleNames = columns.value
      .filter((c) => c.visible)
      .map((c) => c.name);
    const orderNames = columns.value.map((c) => c.name);
    localStorage.setItem(
      "sharkophagus_columns_layout",
      JSON.stringify({ visibleNames, orderNames }),
    );
  } catch {
    // Ignore storage failures
  }
}

/* Computed list of currently visible columns */
const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

/* Value lookup matching column name to original frame index */
function getCellValue(colName: string, frame: Frame): string {
  const originalIndex = props.columns.indexOf(colName);
  if (originalIndex === -1 || !frame.c || originalIndex >= frame.c.length) {
    return "";
  }
  return frame.c[originalIndex];
}

/* Protocol-specific color coding for premium styling */
function getCellClass(colName: string, frame: Frame): string {
  if (colName === "Protocol" || colName === "Info") {
    const protoIndex = props.columns.indexOf("Protocol");
    if (protoIndex !== -1 && frame.c && frame.c[protoIndex]) {
      const protocols = frame.c[protoIndex].toLowerCase();
      if (protocols.includes("tcp")) return "proto-tcp";
      if (protocols.includes("udp")) return "proto-udp";
      if (
        protocols.includes("http") ||
        protocols.includes("ssl") ||
        protocols.includes("tls")
      )
        return "proto-http";
      if (protocols.includes("dns")) return "proto-dns";
      if (protocols.includes("arp")) return "proto-arp";
      if (protocols.includes("icmp")) return "proto-icmp";
    }
  }
  return "";
}

/* Fetch initial packet chunk */
async function loadInitialFrames() {
  if (!api) return;
  loading.value = true;
  error.value = null;
  skip.value = 0;
  frames.value = [];

  try {
    const data = await api.getSessionFrames(props.sessionId, 0, limit);
    frames.value = data;
    skip.value = data.length;
  } catch (err: unknown) {
    error.value =
      err instanceof Error ? err.message : "Failed to load packets.";
  } finally {
    loading.value = false;
  }
}

/* Fetch subsequent packet chunk on scroll trigger */
async function loadMoreFrames() {
  if (!api || loadingMore.value || skip.value >= props.totalFrames) return;
  loadingMore.value = true;

  try {
    const data = await api.getSessionFrames(props.sessionId, skip.value, limit);
    if (data.length > 0) {
      frames.value = [...frames.value, ...data];
      skip.value += data.length;
    }
  } catch (err: unknown) {
    // Suppress scroll error to avoid disruptive layout, fallback message can be shown in console or status bar
    console.error("Failed to lazy load additional frames:", err);
  } finally {
    loadingMore.value = false;
  }
}

/* Scroll handler detecting bottom offset boundary */
function onScroll(e: Event) {
  const container = e.target as HTMLElement;
  if (!container) return;

  const threshold = 200; // Px trigger offset from bottom
  const isNearBottom =
    container.scrollHeight - container.scrollTop - container.clientHeight <
    threshold;

  if (isNearBottom) {
    loadMoreFrames();
  }
}

/* Dropdown toggles */
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function toggleColumn(colName: string) {
  const col = columns.value.find((c) => c.name === colName);
  if (col) {
    col.visible = !col.visible;
    saveLayout();
  }
}

/* Drag & Drop Column Reordering Handlers */
function onDragStart(index: number) {
  draggedIndex = index;
}

function onDrop(targetIndex: number) {
  if (draggedIndex === null || draggedIndex === targetIndex) return;

  const item = columns.value[draggedIndex];
  columns.value.splice(draggedIndex, 1);
  columns.value.splice(targetIndex, 0, item);

  saveLayout();
  draggedIndex = null;
}

/* Watch for changes in sessionId to reload packets */
watch(
  () => props.sessionId,
  () => {
    loadInitialFrames();
  },
);

/* Watch for columns config updates (e.g. new file uploaded) */
watch(
  () => props.columns,
  () => {
    initColumns();
  },
  { deep: true },
);

onMounted(() => {
  initColumns();
  loadInitialFrames();
});
</script>

<template>
  <div class="frames-dashboard card">
    <div class="frames-header">
      <h3 class="frames-title">
        <span class="frames-title-icon">🔌</span>
        Packet Sequence
      </h3>

      <div class="frames-controls">
        <!-- Columns Config Dropdown -->
        <div class="dropdown-wrapper">
          <button
            class="control-btn"
            :class="{ 'is-active': isDropdownOpen }"
            @click="toggleDropdown"
            aria-label="Configure display columns"
            aria-haspopup="true"
            :aria-expanded="isDropdownOpen"
          >
            <Settings class="btn-icon" />
            Columns
          </button>

          <!-- Dropdown Popup -->
          <div v-if="isDropdownOpen" class="columns-dropdown shadow-lg">
            <h4 class="dropdown-title">Toggle Columns</h4>
            <div class="dropdown-list">
              <!-- No. is locked -->
              <label class="dropdown-item is-disabled">
                <input type="checkbox" checked disabled />
                <span class="checkbox-label text-secondary">{{ props.columns[0] || 'No.' }} (Locked)</span>
              </label>

              <label
                v-for="col in columns"
                :key="col.name"
                class="dropdown-item"
              >
                <input
                  type="checkbox"
                  :checked="col.visible"
                  @change="toggleColumn(col.name)"
                />
                <span class="checkbox-label">{{ col.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="frames-error-banner card">
      <AlertTriangle class="error-banner-icon" />
      <div class="error-banner-content">
        <p class="error-banner-title">Failed to load packets</p>
        <p class="error-banner-message text-secondary">{{ error }}</p>
      </div>
      <button class="retry-btn" @click="loadInitialFrames">
        <RefreshCw class="btn-icon" />
        Retry
      </button>
    </div>

    <!-- Loading State -->
    <div
      v-else-if="loading && frames.length === 0"
      class="frames-loading-container"
    >
      <div class="spinner"></div>
      <p class="loading-text text-secondary">Loading frame sequence...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="frames.length === 0" class="frames-empty-container">
      <p class="empty-text text-secondary">No packets found in this capture.</p>
    </div>

    <!-- Table Display Container -->
    <div v-else class="table-scroll-container" @scroll="onScroll">
      <table class="frames-table">
        <thead>
          <tr>
            <!-- Packet Number column is locked, not draggable -->
            <th class="table-header locked">{{ props.columns[0] || 'No.' }}</th>
            <th
              v-for="(col, index) in visibleColumns"
              :key="col.name"
              class="table-header draggable"
              draggable="true"
              @dragstart="onDragStart(columns.indexOf(col))"
              @dragover.prevent
              @drop="onDrop(columns.indexOf(col))"
            >
              <div class="header-content">
                <GripVertical class="grip-icon" />
                <span>{{ col.label }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="frame in frames" :key="frame.num" class="table-row">
            <td class="table-cell locked text-mono text-accent">
              {{ frame.num }}
            </td>
            <td
              v-for="col in visibleColumns"
              :key="col.name"
              class="table-cell text-mono"
              :class="getCellClass(col.name, frame)"
            >
              {{ getCellValue(col.name, frame) }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Scroll loader status -->
      <div v-if="loadingMore" class="scroll-loader">
        <div class="spinner-sm"></div>
        <span class="text-secondary text-xs">Loading additional frames...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.frames-dashboard {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: var(--space-6);
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(16px);
  border: 1px solid var(--color-border-glass);
  border-radius: var(--radius-xl);
  gap: var(--space-4);
  position: relative;
}

.frames-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.frames-title {
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.frames-title-icon {
  font-size: 1.1em;
}

.frames-controls {
  position: relative;
}

.dropdown-wrapper {
  position: relative;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border-glass);
  color: var(--color-text-primary);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: all var(--duration-fast) ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-border-hover);
}

.control-btn.is-active {
  background: var(--color-accent-dim);
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* Columns dropdown list */
.columns-dropdown {
  position: absolute;
  top: calc(100% + var(--space-2));
  right: 0;
  width: 220px;
  background: #111827;
  border: 1px solid var(--color-border-glass);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  z-index: var(--z-overlay);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.dropdown-title {
  font-size: var(--text-xs);
  text-transform: uppercase;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
  font-weight: var(--weight-bold);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: var(--space-1);
}

.dropdown-list {
  display: flex;
  flex-direction: column;
  max-height: 250px;
  overflow-y: auto;
  gap: var(--space-1);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-1);
  cursor: pointer;
  font-size: var(--text-sm);
  border-radius: var(--radius-sm);
  transition: background var(--duration-fast) ease;
}

.dropdown-item:hover:not(.is-disabled) {
  background: rgba(255, 255, 255, 0.04);
}

.dropdown-item.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.checkbox-label {
  user-select: none;
}

/* Scrollable Container (limited to 25 rows) */
.table-scroll-container {
  width: 100%;
  max-height: 600px; /* Capped to exactly fit 25 rows at ~24px line-height */
  overflow: auto;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
}

.frames-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

/* Persistent Header */
.table-header {
  position: sticky;
  top: 0;
  background: #141b2b;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: var(--z-raised);
  user-select: none;
}

.table-header.draggable {
  cursor: grab;
}

.table-header.draggable:active {
  cursor: grabbing;
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.grip-icon {
  width: 12px;
  height: 12px;
  color: var(--color-text-muted);
  opacity: 0.5;
}

/* Rows & Cells */
.table-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: background var(--duration-fast) ease;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.table-cell {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-xs);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
}

/* Locked Leftmost Column */
.table-header.locked,
.table-cell.locked {
  position: sticky;
  left: 0;
  background: #0f1524;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 5;
  width: 65px;
  min-width: 65px;
  text-align: center;
}

.table-row:hover .table-cell.locked {
  background: #141b2a;
}

/* Protocol-Specific Color Coding (Wireshark Style) */
.proto-tcp {
  color: #a78bfa; /* Light purple */
}

.proto-udp {
  color: #34d399; /* Light green */
}

.proto-http {
  color: #fbbf24; /* Yellow */
}

.proto-dns {
  color: #60a5fa; /* Blue */
}

.proto-arp {
  color: #f472b6; /* Pink */
}

.proto-icmp {
  color: #fb7185; /* Soft rose */
}

/* Loading & Empty States */
.frames-loading-container,
.frames-empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  gap: var(--space-4);
  background: rgba(0, 0, 0, 0.15);
  border-radius: var(--radius-md);
  border: 1px dotted var(--color-border-glass);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(6, 182, 212, 0.15);
  border-top-color: var(--color-accent);
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}

.spinner-sm {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(6, 182, 212, 0.15);
  border-top-color: var(--color-accent);
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}

.loading-text,
.empty-text {
  font-size: var(--text-sm);
}

/* Scroll loader progress footer */
.scroll-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2);
  background: rgba(15, 21, 36, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* Error Banner State */
.frames-error-banner {
  display: flex;
  align-items: center;
  background: rgba(244, 63, 94, 0.1);
  border: 1px solid var(--color-danger);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  gap: var(--space-4);
}

.error-banner-icon {
  width: 24px;
  height: 24px;
  color: var(--color-danger);
  flex-shrink: 0;
}

.error-banner-content {
  flex-grow: 1;
}

.error-banner-title {
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
}

.error-banner-message {
  font-size: var(--text-xs);
  margin-top: 2px;
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-danger);
  border: none;
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  transition: opacity var(--duration-fast) ease;
}

.retry-btn:hover {
  opacity: 0.9;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
