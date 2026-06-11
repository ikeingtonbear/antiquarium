<script setup lang="ts">
import { ref, watch, inject, computed } from "vue";
import { X, Search, AlertCircle, CheckCircle2 } from "@lucide/vue";
import type { ApiClient, ConfigPreference, PreferenceCategory } from "../types";
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

const selectedCategoryId = ref("all");
const isMobile = ref(false);

const categories = computed<PreferenceCategory[]>(() => {
  const list: PreferenceCategory[] = [
    { id: "all", label: "All Preferences" }
  ];

  const namespaces = new Set<string>();
  configs.value.forEach((c) => {
    const parts = c.name.split(".");
    if (parts.length > 1) {
      namespaces.add(parts[0]);
    }
  });

  const sortedNamespaces = Array.from(namespaces).sort();

  const guiCategories: PreferenceCategory[] = [];
  const captureCategories: PreferenceCategory[] = [];
  const protocolCategories: PreferenceCategory[] = [];

  sortedNamespaces.forEach((ns) => {
    if (ns === "gui") {
      guiCategories.push({ id: "gui", label: "User Interface", prefix: "gui." });
    } else if (ns === "capture" || ns === "cap") {
      captureCategories.push({ id: ns, label: "Capture", prefix: ns + "." });
    } else {
      protocolCategories.push({
        id: "protocol-" + ns,
        label: ns.toUpperCase(),
        prefix: ns + ".",
        isProtocol: true
      });
    }
  });

  list.push(...guiCategories);
  list.push(...captureCategories);
  list.push(...protocolCategories);

  return list;
});

const groupedConfigs = computed<Record<string, ConfigPreference[]>>(() => {
  const groups: Record<string, ConfigPreference[]> = {
    all: configs.value
  };

  categories.value.forEach((cat) => {
    if (cat.id !== "all") {
      groups[cat.id] = [];
    }
  });

  configs.value.forEach((c) => {
    const parts = c.name.split(".");
    if (parts.length > 1) {
      const ns = parts[0];
      if (ns === "gui") {
        groups["gui"]?.push(c);
      } else if (ns === "capture" || ns === "cap") {
        groups[ns]?.push(c);
      } else {
        groups["protocol-" + ns]?.push(c);
      }
    }
  });

  return groups;
});

interface SearchGroup {
  category: PreferenceCategory;
  configs: ConfigPreference[];
}

const searchGroups = computed<SearchGroup[]>(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return [];

  const matches = configs.value.filter((c) => c.name.toLowerCase().includes(query));

  const groupsMap: Record<string, ConfigPreference[]> = {};
  matches.forEach((c) => {
    const parts = c.name.split(".");
    let catId = "all";
    if (parts.length > 1) {
      const ns = parts[0];
      if (ns === "gui") {
        catId = "gui";
      } else if (ns === "capture" || ns === "cap") {
        catId = ns;
      } else {
        catId = "protocol-" + ns;
      }
    }
    if (!groupsMap[catId]) {
      groupsMap[catId] = [];
    }
    groupsMap[catId].push(c);
  });

  const list: SearchGroup[] = [];
  categories.value.forEach((cat) => {
    const catMatches = groupsMap[cat.id];
    if (catMatches && catMatches.length > 0) {
      list.push({
        category: cat,
        configs: catMatches
      });
    }
  });

  return list;
});

const activeCategoryLabel = computed(() => {
  if (searchQuery.value.trim()) return "Search Results";
  const cat = categories.value.find((c) => c.id === selectedCategoryId.value);
  return cat ? cat.label : "Preferences";
});

const activeCategoryDescription = computed(() => {
  if (searchQuery.value.trim()) return `Showing preferences matching "${searchQuery.value}" grouped by category.`;
  const cat = categories.value.find((c) => c.id === selectedCategoryId.value);
  if (!cat) return "";
  if (cat.id === "all") return "View and search all configuration preferences.";
  if (cat.id === "gui") return "Configure visual options, layout, and user interface preferences.";
  if (cat.id === "capture" || cat.id === "cap") return "Configure packet capture interfaces and buffer options.";
  if (cat.isProtocol) return `Configure parser and dissection options for the ${cat.label} protocol.`;
  return "";
});

function getPrefDisplayName(configName: string, categoryId?: string): string {
  const catId = categoryId || selectedCategoryId.value;
  if (catId === "all") return configName;
  const activeCat = categories.value.find(c => c.id === catId);
  if (activeCat && activeCat.prefix && configName.startsWith(activeCat.prefix)) {
    return configName.substring(activeCat.prefix.length);
  }
  return configName;
}

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
      selectedCategoryId.value = "all";
      errorMsg.value = null;
      successMsg.value = null;
    }
  },
  { immediate: true },
);

const filteredConfigs = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (query) {
    return configs.value.filter((c) => c.name.toLowerCase().includes(query));
  }
  return groupedConfigs.value[selectedCategoryId.value] || [];
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
          <div class="two-column-layout">
            <!-- Left Sidebar Navigation -->
            <aside class="sidebar-container" role="navigation" aria-label="Categories">
              <ul class="categories-list">
                <li
                  v-if="searchQuery.trim()"
                  class="category-item active search-results-item"
                >
                  Search Results
                </li>
                <template v-else>
                  <li
                    class="category-item"
                    :class="{ active: selectedCategoryId === 'all' }"
                    @click="selectedCategoryId = 'all'"
                  >
                    All Preferences
                  </li>
                  <li
                    v-for="cat in categories.filter(c => !c.isProtocol && c.id !== 'all')"
                    :key="cat.id"
                    class="category-item"
                    :class="{ active: selectedCategoryId === cat.id }"
                    @click="selectedCategoryId = cat.id"
                  >
                    {{ cat.label }}
                  </li>
                  <li v-if="categories.some(c => c.isProtocol)" class="sidebar-section-header">
                    Protocols
                  </li>
                  <li
                    v-for="cat in categories.filter(c => c.isProtocol)"
                    :key="cat.id"
                    class="category-item protocol-item"
                    :class="{ active: selectedCategoryId === cat.id }"
                    @click="selectedCategoryId = cat.id"
                  >
                    {{ cat.label }}
                  </li>
                </template>
              </ul>
            </aside>

            <!-- Right Detailed Settings Panel -->
            <section class="settings-panel">
              <div v-if="isLoading" class="loading-state">
                Loading preferences...
              </div>
              <div v-else>
                <!-- Category info header -->
                <div class="category-info-header">
                  <h3 class="category-title">{{ activeCategoryLabel }}</h3>
                  <p class="category-description">{{ activeCategoryDescription }}</p>
                </div>

                <!-- If search query is active, render grouped results -->
                <div v-if="searchQuery.trim()" class="search-results-container">
                  <div v-if="searchGroups.length === 0" class="empty-state">
                    No matching preferences found.
                  </div>
                  <div v-else class="search-groups-list">
                    <div 
                      v-for="group in searchGroups" 
                      :key="group.category.id"
                      class="search-group"
                    >
                      <h4 class="search-group-header">{{ group.category.label }}</h4>
                      <div class="configs-list">
                        <div
                          v-for="config in group.configs"
                          :key="config.name"
                          class="config-item"
                        >
                          <div class="config-info">
                            <span class="config-name">{{ getPrefDisplayName(config.name, group.category.id) }}</span>
                            <span class="config-full-name">{{ config.name }}</span>
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
                    </div>
                  </div>
                </div>

                <!-- If search is NOT active, render standard category view -->
                <div v-else>
                  <div v-if="filteredConfigs.length === 0" class="empty-state">
                    No matching preferences found.
                  </div>
                  <div v-else class="configs-list">
                    <div
                      v-for="config in filteredConfigs"
                      :key="config.name"
                      class="config-item"
                    >
                      <div class="config-info">
                        <span class="config-name">{{ getPrefDisplayName(config.name) }}</span>
                        <span v-if="selectedCategoryId !== 'all'" class="config-full-name">{{ config.name }}</span>
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
                </div>
              </div>
            </section>
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
  max-width: 800px;
  height: 600px;
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
  padding: 0;
  min-height: 0;
  display: flex;
}

.two-column-layout {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
}

.sidebar-container {
  width: 200px;
  flex-shrink: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(15, 23, 42, 0.2);
  overflow-y: auto;
  padding: 1rem 0;
}

.categories-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.category-item {
  padding: 0.5rem 1.25rem;
  font-size: 0.85rem;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 2px solid transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-item:hover {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.04);
}

.category-item.active {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
  border-left-color: #3b82f6;
  font-weight: 600;
}

.sidebar-section-header {
  padding: 0.75rem 1.25rem 0.25rem 1.25rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.protocol-item {
  padding-left: 1.75rem;
}

.settings-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1.5rem 1.5rem 1.5rem;
  overflow-y: auto;
  min-height: 0;
}

.category-info-header {
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.category-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #f8fafc;
  margin: 0 0 0.25rem 0;
}

.category-description {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

.config-full-name {
  font-size: 0.75rem;
  color: #475569;
  font-family: monospace;
  word-break: break-all;
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

.search-results-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.search-group-header {
  font-size: 0.85rem;
  font-weight: 600;
  color: #3b82f6;
  margin: 0;
  padding-bottom: 0.25rem;
  border-bottom: 1px dashed rgba(59, 130, 246, 0.2);
  letter-spacing: 0.025em;
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
