<script setup lang="ts">
import { ref, watch, inject, computed } from "vue";
import { X, Search, AlertCircle, CheckCircle2 } from "@lucide/vue";
import type { ApiClient, ConfigPreference } from "../types";
import { SharkophagusApi } from "../services/api";

const props = defineProps<{
  isOpen: boolean;
  sessionId: string | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const api = inject<ApiClient>("api") ?? new SharkophagusApi();

const configs = ref<ConfigPreference[]>([]);
const searchQuery = ref("");
const isLoading = ref(false);
const errorMsg = ref<string | null>(null);
const successMsg = ref<string | null>(null);

async function loadConfigs() {
  isLoading.value = true;
  errorMsg.value = null;
  try {
    if (props.sessionId) {
      configs.value = await api.getSessionConfig(props.sessionId);
    } else {
      configs.value = await api.getSystemConfig();
    }
  } catch (err: any) {
    errorMsg.value = err.message || "Failed to load configuration preferences.";
  } finally {
    isLoading.value = false;
  }
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      loadConfigs();
      searchQuery.value = "";
      errorMsg.value = null;
      successMsg.value = null;
    }
  },
  { immediate: true },
);

const filteredConfigs = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return configs.value;
  return configs.value.filter((c) => c.name.toLowerCase().includes(query));
});

async function handleUpdate(config: ConfigPreference, newValue: any) {
  if (!props.sessionId) return;

  const oldValue = config.value;
  config.value = newValue; // Optimistic update
  errorMsg.value = null;
  successMsg.value = null;

  try {
    await api.updateSessionConfig(props.sessionId, config.name, newValue);
    successMsg.value = `Successfully updated '${config.name}'`;
    // Hide success message after 3 seconds
    setTimeout(() => {
      if (successMsg.value?.includes(config.name)) {
        successMsg.value = null;
      }
    }, 3000);
  } catch (err: any) {
    config.value = oldValue; // Revert on failure
    errorMsg.value =
      err.message || `Failed to update configuration '${config.name}'.`;
  }
}

function handleOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains("modal-overlay")) {
    emit("close");
  }
}
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
      <div
        class="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <!-- Header -->
        <header class="modal-header">
          <div class="title-area">
            <h2 id="modal-title" class="modal-title">Preferences</h2>
          </div>
          <button
            class="modal-close-btn"
            @click="emit('close')"
            aria-label="Close modal"
          >
            <X :size="20" />
          </button>
        </header>

        <!-- Session Notice Warning -->
        <div v-if="!sessionId" class="session-warning">
          <AlertCircle :size="16" />
          <span>Active session required to modify settings</span>
        </div>

        <!-- Feedback Messages -->
        <div v-if="errorMsg" class="error-notice">
          <AlertCircle :size="16" />
          <span>{{ errorMsg }}</span>
        </div>
        <div v-if="successMsg" class="success-notice">
          <CheckCircle2 :size="16" />
          <span>{{ successMsg }}</span>
        </div>

        <!-- Search bar -->
        <div class="search-bar-container">
          <Search :size="16" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search preferences..."
            class="search-input"
          />
        </div>

        <!-- Body -->
        <main class="modal-body">
          <div v-if="isLoading" class="loading-state">
            Loading preferences...
          </div>
          <div v-else-if="filteredConfigs.length === 0" class="empty-state">
            No matching preferences found.
          </div>
          <div v-else class="configs-list">
            <div
              v-for="config in filteredConfigs"
              :key="config.name"
              class="config-item"
            >
              <div class="config-info">
                <span class="config-name">{{ config.name }}</span>
                <span class="config-type-badge">{{ config.type }}</span>
              </div>
              <div class="config-control">
                <!-- Checkbox for boolean -->
                <input
                  v-if="config.type === 'boolean'"
                  type="checkbox"
                  :checked="config.value"
                  :disabled="!sessionId"
                  @change="
                    handleUpdate(
                      config,
                      ($event.target as HTMLInputElement).checked,
                    )
                  "
                  class="checkbox-input"
                />

                <!-- Select dropdown for enum -->
                <select
                  v-else-if="config.type === 'enum' && config.choices"
                  :value="config.value"
                  :disabled="!sessionId"
                  @change="
                    handleUpdate(
                      config,
                      ($event.target as HTMLSelectElement).value,
                    )
                  "
                  class="select-input"
                >
                  <option
                    v-for="choice in config.choices"
                    :key="choice.value"
                    :value="choice.description"
                  >
                    {{ choice.description }}
                  </option>
                </select>

                <!-- Readonly for table/unknown -->
                <input
                  v-else-if="
                    config.type === 'table' || config.type === 'unknown'
                  "
                  type="text"
                  :value="config.value"
                  readonly
                  class="text-input readonly"
                />

                <!-- Text input for others -->
                <input
                  v-else
                  type="text"
                  :value="config.value"
                  :disabled="!sessionId"
                  @blur="
                    handleUpdate(
                      config,
                      ($event.target as HTMLInputElement).value,
                    )
                  "
                  @keyup.enter="($event.target as HTMLInputElement).blur()"
                  class="text-input"
                />
              </div>
            </div>
          </div>
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
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  width: 100%;
  max-width: 680px;
  height: 520px;
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

.session-warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(245, 158, 11, 0.1);
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  padding: 0.75rem 1.5rem;
  font-size: 0.85rem;
}

.error-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border-bottom: 1px solid rgba(239, 68, 68, 0.2);
  color: #f87171;
  padding: 0.75rem 1.5rem;
  font-size: 0.85rem;
}

.success-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(16, 185, 129, 0.1);
  border-bottom: 1px solid rgba(16, 185, 129, 0.2);
  color: #34d399;
  padding: 0.75rem 1.5rem;
  font-size: 0.85rem;
}

.search-bar-container {
  margin: 1rem 1.5rem 0.5rem 1.5rem;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #64748b;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: #f8fafc;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
  background: rgba(15, 23, 42, 0.7);
}

.modal-body {
  flex: 1;
  padding: 0.5rem 1.5rem 1.5rem 1.5rem;
  overflow-y: auto;
  min-height: 0;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem 0;
  color: #64748b;
  font-size: 0.9rem;
}

.configs-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  gap: 1.5rem;
}

.config-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.config-name {
  font-size: 0.9rem;
  font-weight: 500;
  word-break: break-all;
  color: #e2e8f0;
}

.config-type-badge {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #64748b;
  font-family: monospace;
}

.config-control {
  flex-shrink: 0;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3b82f6;
}

.checkbox-input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.select-input,
.text-input {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: #f8fafc;
  font-size: 0.85rem;
  padding: 6px 10px;
  width: 160px;
  transition: all 0.2s ease;
}

.select-input:focus,
.text-input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(15, 23, 42, 0.8);
}

.select-input:disabled,
.text-input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  background: rgba(15, 23, 42, 0.3);
}

.text-input.readonly {
  background: rgba(15, 23, 42, 0.2);
  border-style: dashed;
  color: #64748b;
  cursor: default;
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
</style>
