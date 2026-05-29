<script setup lang="ts">
import { ref } from "vue";
import { X, Layers, Database, FileCode, Terminal } from "@lucide/vue";
import type { SystemInfo } from "../types";

const props = defineProps<{
  isOpen: boolean;
  systemInfo: SystemInfo | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

type ActiveTab = "columns" | "formats" | "taps" | "filters";
const activeTab = ref<ActiveTab>("columns");

function handleOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains("modal-overlay")) {
    emit("close");
  }
}
</script>

<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen && systemInfo"
      class="modal-overlay"
      @click="handleOverlayClick"
    >
      <div
        class="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <!-- Header -->
        <header class="modal-header">
          <div class="title-area">
            <h2 id="modal-title" class="modal-title">System Capabilities</h2>
            <span class="version-badge">v{{ systemInfo.version }}</span>
          </div>
          <button
            class="modal-close-btn"
            @click="emit('close')"
            aria-label="Close modal"
          >
            <X size="20" />
          </button>
        </header>

        <!-- Navigation Tabs -->
        <nav class="modal-tabs">
          <button
            class="tab-button"
            :class="{ active: activeTab === 'columns' }"
            @click="activeTab = 'columns'"
          >
            <Layers size="16" />
            Columns
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'formats' }"
            @click="activeTab = 'formats'"
          >
            <FileCode size="16" />
            Formats
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'taps' }"
            @click="activeTab = 'taps'"
          >
            <Database size="16" />
            Taps & Stats
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'filters' }"
            @click="activeTab = 'filters'"
          >
            <Terminal size="16" />
            Filters
          </button>
        </nav>

        <!-- Tab Body -->
        <main class="modal-body">
          <Transition name="tab-fade" mode="out-in">
            <!-- Columns Tab -->
            <div
              v-if="activeTab === 'columns'"
              key="columns"
              class="tab-content"
            >
              <h3 class="section-title">Supported Display Columns</h3>
              <p class="section-desc">
                The format fields and mappings available for display rendering.
              </p>

              <div v-if="systemInfo.columns.length === 0" class="empty-state">
                No columns configured.
              </div>
              <div v-else class="table-container">
                <table class="cap-table">
                  <thead>
                    <tr>
                      <th>Column Name</th>
                      <th>Format Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="col in systemInfo.columns" :key="col.name">
                      <td class="text-semibold">{{ col.name }}</td>
                      <td>
                        <code class="code-badge">{{ col.format }}</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Formats Tab -->
            <div
              v-else-if="activeTab === 'formats'"
              key="formats"
              class="tab-content"
            >
              <div class="split-sections">
                <!-- Capture Types -->
                <div class="sub-section">
                  <h3 class="section-title">File Formats</h3>
                  <p class="section-desc">
                    Supported packet capture storage structures.
                  </p>

                  <div
                    v-if="systemInfo.capture_types.length === 0"
                    class="empty-state"
                  >
                    No file formats supported.
                  </div>
                  <div v-else class="formats-list">
                    <div
                      v-for="item in systemInfo.capture_types"
                      :key="item.name"
                      class="format-card"
                    >
                      <span class="format-badge">{{ item.name }}</span>
                      <span class="format-desc">{{ item.description }}</span>
                    </div>
                  </div>
                </div>

                <!-- Encap Types -->
                <div class="sub-section">
                  <h3 class="section-title">Link Encapsulations</h3>
                  <p class="section-desc">Supported data-link layer headers.</p>

                  <div
                    v-if="systemInfo.encap_types.length === 0"
                    class="empty-state"
                  >
                    No encapsulation types supported.
                  </div>
                  <div v-else class="formats-list">
                    <div
                      v-for="item in systemInfo.encap_types"
                      :key="item.name"
                      class="format-card"
                    >
                      <span class="format-badge encap">{{ item.name }}</span>
                      <span class="format-desc">{{ item.description }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Taps & Stats Tab -->
            <div
              v-else-if="activeTab === 'taps'"
              key="taps"
              class="tab-content"
            >
              <h3 class="section-title">Analysis Modules</h3>
              <p class="section-desc">
                Pre-compiled analytical taps and engines available in this
                build.
              </p>

              <div class="grid-sections">
                <!-- General Stats & Taps -->
                <div class="stats-group">
                  <h4>Statistics & Taps</h4>
                  <div class="tag-cloud">
                    <span
                      v-for="item in systemInfo.stats"
                      :key="item.name"
                      class="tag"
                      :title="item.tap"
                    >
                      {{ item.name }}
                    </span>
                    <span
                      v-for="item in systemInfo.taps"
                      :key="item.name"
                      class="tag"
                      :title="item.tap"
                    >
                      {{ item.name }}
                    </span>
                  </div>
                </div>

                <!-- Network Stats -->
                <div class="stats-group">
                  <h4>Network Analytics (`nstat`)</h4>
                  <div class="tag-cloud">
                    <span
                      v-if="systemInfo.nstat.length === 0"
                      class="placeholder-text"
                      >None</span
                    >
                    <span
                      v-for="item in systemInfo.nstat"
                      :key="item.name"
                      class="tag nstat"
                      :title="item.tap"
                    >
                      {{ item.name }}
                    </span>
                  </div>
                </div>

                <!-- Conversations -->
                <div class="stats-group">
                  <h4>Conversations (`convs`)</h4>
                  <div class="tag-cloud">
                    <span
                      v-if="systemInfo.convs.length === 0"
                      class="placeholder-text"
                      >None</span
                    >
                    <span
                      v-for="item in systemInfo.convs"
                      :key="item.name"
                      class="tag convs"
                      :title="item.tap"
                    >
                      {{ item.name }}
                    </span>
                  </div>
                </div>

                <!-- Flows & Follows -->
                <div class="stats-group">
                  <h4>Flow & Stream Follows</h4>
                  <div class="tag-cloud">
                    <span
                      v-for="item in systemInfo.seqa"
                      :key="item.name"
                      class="tag follow"
                      :title="item.tap"
                    >
                      {{ item.name }} (Flow)
                    </span>
                    <span
                      v-for="item in systemInfo.follow"
                      :key="item.name"
                      class="tag follow"
                      :title="item.tap"
                    >
                      Follow {{ item.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filters Tab -->
            <div
              v-else-if="activeTab === 'filters'"
              key="filters"
              class="tab-content"
            >
              <h3 class="section-title">Supported Filter Fields</h3>
              <p class="section-desc">
                Active protocol fields and symbols for search queries.
              </p>

              <div v-if="systemInfo.ftypes.length === 0" class="empty-state">
                No filter fields available.
              </div>
              <div v-else class="filter-cloud">
                <span
                  v-for="field in systemInfo.ftypes"
                  :key="field"
                  class="filter-tag"
                >
                  {{ field }}
                </span>
              </div>
            </div>
          </Transition>
        </main>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(8, 12, 24, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
}

.modal-container {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  width: 100%;
  max-width: 680px;
  height: 480px;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.5),
    0 10px 10px -5px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(59, 130, 246, 0.1);
  overflow: hidden;
  font-family: "Inter", sans-serif;
  color: #f8fafc;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.title-area {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.version-badge {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.2);
  font-size: 0.75rem;
  font-family: monospace;
  padding: 2px 8px;
  border-radius: 9999px;
  font-weight: 600;
}

.modal-close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition:
    color 0.2s,
    background-color 0.2s;
  display: flex;
}

.modal-close-btn:hover {
  color: #f8fafc;
  background-color: rgba(255, 255, 255, 0.08);
}

/* Tabs */
.modal-tabs {
  display: flex;
  background: rgba(15, 23, 42, 0.4);
  padding: 4px;
  gap: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.tab-button {
  flex: 1;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 8px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.04);
}

.tab-button.active {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Body */
.modal-body {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  min-height: 0;
}

.tab-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.section-desc {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0 0 1rem 0;
}

/* Table styling */
.table-container {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.2);
}

.cap-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;
}

.cap-table th,
.cap-table td {
  padding: 10px 14px;
}

.cap-table th {
  background: rgba(15, 23, 42, 0.4);
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.cap-table td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.cap-table tr:last-child td {
  border-bottom: none;
}

.text-semibold {
  font-weight: 600;
}

.code-badge {
  font-family: monospace;
  background: rgba(15, 23, 42, 0.5);
  padding: 2px 6px;
  border-radius: 4px;
  color: #38bdf8;
  font-size: 0.8rem;
}

/* Formats Split */
.split-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  height: 100%;
}

.sub-section {
  display: flex;
  flex-direction: column;
}

.formats-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  max-height: 250px;
}

.format-card {
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.format-badge {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  width: max-content;
}

.format-badge.encap {
  color: #a855f7;
  background: rgba(168, 85, 247, 0.1);
}

.format-desc {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* Taps & Stats Group */
.grid-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.stats-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stats-group h4 {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #cbd5e1;
  margin: 0;
  letter-spacing: 0.05em;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  background: rgba(15, 23, 42, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 10px;
  border-radius: 8px;
  min-height: 80px;
  align-content: flex-start;
  max-height: 120px;
  overflow-y: auto;
}

.tag {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 2px 8px;
  border-radius: 4px;
  color: #e2e8f0;
}

.tag.nstat {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
}

.tag.convs {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.2);
}

.tag.follow {
  color: #ec4899;
  background: rgba(236, 72, 153, 0.1);
  border-color: rgba(236, 72, 153, 0.2);
}

.placeholder-text {
  font-size: 0.75rem;
  color: #475569;
  font-style: italic;
}

/* Filters Tab */
.filter-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  background: rgba(15, 23, 42, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 12px;
  border-radius: 8px;
  max-height: 250px;
  overflow-y: auto;
}

.filter-tag {
  font-family: monospace;
  font-size: 0.75rem;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.15);
  padding: 2px 8px;
  border-radius: 4px;
}

.empty-state {
  font-size: 0.85rem;
  color: #475569;
  text-align: center;
  padding: 2rem;
  background: rgba(15, 23, 42, 0.2);
  border: 1px dotted rgba(255, 255, 255, 0.08);
  border-radius: 8px;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container {
  animation: modalScaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-leave-active .modal-container {
  animation: modalScaleDown 0.2s ease;
}

@keyframes modalScaleUp {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}

@keyframes modalScaleDown {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0.9);
  }
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.15s ease;
}

.tab-fade-enter-from,
.tab-fade-leave-to {
  opacity: 0;
}
</style>
