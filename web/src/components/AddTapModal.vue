<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Taps</h2>
        <div class="tabs">
          <button
            class="tab-btn"
            :class="{ active: currentTab === 'add' }"
            @click="currentTab = 'add'"
          >
            Add Taps
          </button>
          <button
            class="tab-btn"
            :class="{ active: currentTab === 'active' }"
            @click="currentTab = 'active'"
          >
            Active Taps ({{ activeTaps.length }})
          </button>
        </div>
      </div>

      <div v-if="error" class="error">{{ error }}</div>

      <!-- Add Taps Tab -->
      <div v-if="currentTab === 'add'" class="tab-content add-tab">
        <div class="tap-counter">
          {{ selectedTaps.length }}/16 Taps Selected
        </div>
        <div class="categories-list">
          <div
            v-for="(taps, category) in groupedTaps"
            :key="category"
            class="category-accordion"
          >
            <button
              class="category-header"
              @click="toggleCategory(String(category))"
            >
              <span class="category-title">{{
                formatCategoryName(String(category))
              }}</span>
              <span class="category-count">{{ taps.length }}</span>
            </button>
            <div
              v-if="expandedCategories[String(category)]"
              class="category-body"
            >
              <button
                v-for="tap in taps"
                :key="tap.tap"
                class="tap-item-btn"
                :class="{ selected: selectedTaps.includes(tap.tap) }"
                @click="toggleTap(tap.tap)"
              >
                <span class="tap-name">{{ tap.name }}</span>
                <span class="tap-id">{{ tap.tap }}</span>
              </button>
            </div>
          </div>
        </div>
        <div class="actions">
          <button class="close-btn" @click="close">Close</button>
          <button
            class="apply-btn"
            @click="apply"
            :disabled="selectedTaps.length === 0"
          >
            Apply
          </button>
        </div>
      </div>

      <!-- Active Taps Tab -->
      <div v-if="currentTab === 'active'" class="tab-content active-tab">
        <AnalyticsDashboard :active-taps="activeTaps" />
        <div class="actions">
          <button class="close-btn" @click="close">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { InfoItem, ActiveTap } from "../types";
import AnalyticsDashboard from "./AnalyticsDashboard.vue";

const props = defineProps<{
  isOpen: boolean;
  availableTaps: InfoItem[];
  activeTaps?: ActiveTap[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "apply", payload: Record<string, string>): void;
}>();

const selectedTaps = ref<string[]>([]);
const error = ref("");
const expandedCategories = ref<Record<string, boolean>>({});
const currentTab = ref<"add" | "active">("add");

const activeTaps = computed(() => props.activeTaps || []);

const groupedTaps = computed(() => {
  const groups: Record<string, InfoItem[]> = {};
  for (const tap of props.availableTaps) {
    let category = "other";
    if (tap.tap.includes(":")) {
      category = tap.tap.split(":")[0];
    } else {
      category = tap.tap;
    }

    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(tap);
  }
  return groups;
});

const formatCategoryName = (cat: string) => {
  const names: Record<string, string> = {
    eo: "Export Objects",
    stat: "Statistics",
    follow: "Follow Stream",
    rtd: "Response Time Delay",
    srt: "Service Response Time",
    expert: "Expert Info",
  };
  return names[cat] || cat.toUpperCase();
};

const toggleCategory = (category: string) => {
  expandedCategories.value[category] = !expandedCategories.value[category];
};

const toggleTap = (tapString: string) => {
  const index = selectedTaps.value.indexOf(tapString);
  if (index > -1) {
    selectedTaps.value.splice(index, 1);
    error.value = "";
  } else {
    if (selectedTaps.value.length >= 16) {
      error.value = "Maximum limit of 16 taps reached.";
      return;
    }
    selectedTaps.value.push(tapString);
    error.value = "";
  }
};

const close = () => {
  selectedTaps.value = [];
  error.value = "";
  expandedCategories.value = {};
  currentTab.value = "add";
  emit("close");
};

const apply = () => {
  if (selectedTaps.value.length === 0) {
    error.value = "You must select at least one tap.";
    return;
  }

  const payload: Record<string, string> = {};
  selectedTaps.value.forEach((tap, index) => {
    payload[`tap${index}`] = tap;
  });

  error.value = "";
  emit("apply", payload);
  selectedTaps.value = [];
  currentTab.value = "active";
};
</script>

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

.modal-content {
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2rem;
  border-radius: 16px;
  min-width: 600px;
  max-width: 800px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  color: var(--color-text-primary);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
  font-size: var(--text-xl);
}

.tabs {
  display: flex;
  gap: 0.5rem;
  background: rgba(15, 23, 42, 0.5);
  padding: 0.25rem;
  border-radius: var(--radius-md);
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--color-text-primary);
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  font-weight: 500;
}

.tab-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  min-height: 0;
}

.add-tab {
  gap: 1rem;
}

.active-tab {
  gap: 1rem;
  overflow-y: auto;
}

.tap-counter {
  font-size: var(--text-sm);
  color: var(--color-accent);
  background: rgba(59, 130, 246, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  align-self: flex-start;
}

.error {
  color: var(--color-danger, #ef4444);
  background: rgba(239, 68, 68, 0.1);
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: var(--text-sm);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.categories-list {
  overflow-y: auto;
  flex-grow: 1;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-right: 0.5rem;
  min-height: 0;
}

.category-accordion {
  border: 1px solid var(--color-border-glass);
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
}

.category-header {
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: none;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: var(--color-text-primary);
  text-align: left;
}

.category-header:hover {
  background: rgba(15, 23, 42, 0.8);
}

.category-title {
  font-weight: 500;
}

.category-count {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.1rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
}

.category-body {
  padding: 0.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
}

.tap-item-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  text-align: left;
  transition: all 0.2s;
}

.tap-item-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.tap-item-btn.selected {
  background: rgba(59, 130, 246, 0.2);
  border-color: var(--color-accent);
}

.tap-name {
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  margin-bottom: 0.2rem;
}

.tap-id {
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  font-family: monospace;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: auto;
}

.close-btn {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-glass);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
}

.apply-btn {
  background: var(--color-accent, #3b82f6);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.apply-btn:hover:not(:disabled) {
  background: #2563eb;
}

.apply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
