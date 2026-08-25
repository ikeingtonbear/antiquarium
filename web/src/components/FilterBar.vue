<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { Search, AlertCircle, Check, X } from "@lucide/vue";
import { SharkophagusApi } from "../services/api";
import type { CompletionItem } from "../types";

const props = defineProps<{
  sessionId: string;
  initialFilter?: string;
}>();

const emit = defineEmits<{
  (e: "apply", filter: string): void;
}>();

const api = new SharkophagusApi();
const filterText = ref(props.initialFilter || "");
const suggestions = ref<CompletionItem[]>([]);
const showSuggestions = ref(false);
const activeIndex = ref(-1);
const isDebouncing = ref(false);
const isValidating = ref(false);
const validationError = ref<string | null>(null);

const isValid = computed(() => {
  return validationError.value === null && !isValidating.value;
});

const inputRef = ref<HTMLInputElement | null>(null);

let debounceTimeout: ReturnType<typeof setTimeout>;

// Fetch suggestions from API
const fetchSuggestions = async (prefix: string) => {
  if (!props.sessionId || !prefix.trim()) {
    suggestions.value = [];
    showSuggestions.value = false;
    return;
  }

  try {
    const res = await api.getComplete(props.sessionId, "field", prefix);
    suggestions.value = res.completions || [];
    showSuggestions.value = suggestions.value.length > 0;
    activeIndex.value = -1;
  } catch (e) {
    console.error("Failed to fetch autocomplete suggestions", e);
    suggestions.value = [];
    showSuggestions.value = false;
  }
};

// Handle user typing with debounce
const onInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  filterText.value = value;
  validationError.value = null; // Clear error on typing

  clearTimeout(debounceTimeout);
  isDebouncing.value = true;
  isValidating.value = true;

  debounceTimeout = setTimeout(async () => {
    isDebouncing.value = false;

    // Check validation if string is not empty
    if (value.trim()) {
      try {
        const checkRes = await api.check(
          props.sessionId,
          "filter",
          value.trim(),
        );
        if (!checkRes.valid) {
          validationError.value =
            checkRes.errorMessage || "Invalid filter syntax";
        } else {
          validationError.value = null;
        }
      } catch (e) {
        validationError.value = "Validation failed";
      }
    } else {
      validationError.value = null;
    }
    isValidating.value = false;

    const tokens = value.split(/[\s()]+/);
    const lastToken = tokens[tokens.length - 1];

    if (lastToken.length > 0) {
      fetchSuggestions(lastToken);
    } else {
      showSuggestions.value = false;
    }
  }, 500);
};

// Select a suggestion
const selectSuggestion = (index: number) => {
  if (index >= 0 && index < suggestions.value.length) {
    const suggestion = suggestions.value[index];
    const tokens = filterText.value.split(/([\s()]+)/);

    if (tokens.length > 0) {
      const last = tokens[tokens.length - 1];
      if (/^[\s()]+$/.test(last)) {
        filterText.value += suggestion.value;
      } else {
        tokens[tokens.length - 1] = suggestion.value;
        filterText.value = tokens.join("");
      }
    } else {
      filterText.value = suggestion.value;
    }

    showSuggestions.value = false;
    validationError.value = null;

    // Trigger validation since we updated the input
    clearTimeout(debounceTimeout);
    isValidating.value = true;
    debounceTimeout = setTimeout(async () => {
      try {
        const checkRes = await api.check(
          props.sessionId,
          "filter",
          filterText.value.trim(),
        );
        if (!checkRes.valid) {
          validationError.value =
            checkRes.errorMessage || "Invalid filter syntax";
        } else {
          validationError.value = null;
        }
      } catch (e) {
        validationError.value = "Validation failed";
      }
      isValidating.value = false;
    }, 500);

    // Focus back on input
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
};

// Keyboard navigation
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !showSuggestions.value) {
    applyFilter();
    return;
  }

  if (!showSuggestions.value) return;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      activeIndex.value = (activeIndex.value + 1) % suggestions.value.length;
      break;
    case "ArrowUp":
      e.preventDefault();
      activeIndex.value =
        activeIndex.value <= 0
          ? suggestions.value.length - 1
          : activeIndex.value - 1;
      break;
    case "Enter":
      if (activeIndex.value !== -1) {
        e.preventDefault();
        selectSuggestion(activeIndex.value);
      }
      break;
    case "Escape":
      showSuggestions.value = false;
      break;
  }
};

// Apply filter logic
const applyFilter = () => {
  if (!isValid.value) return;
  showSuggestions.value = false;
  emit("apply", filterText.value);
};

// Clear filter logic
const clearFilter = () => {
  filterText.value = "";
  validationError.value = null;
  isValidating.value = false;
  showSuggestions.value = false;
  clearTimeout(debounceTimeout);
  emit("apply", "");
};

// Close dropdown when clicking outside
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest(".filter-bar-wrapper")) {
    showSuggestions.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  clearTimeout(debounceTimeout);
});
</script>

<template>
  <div class="filter-bar-wrapper">
    <div class="filter-bar-container">
      <div class="filter-input-wrapper">
        <Search class="search-icon" :size="18" />
        <input
          ref="inputRef"
          type="text"
          :value="filterText"
          @input="onInput"
          @keydown="onKeyDown"
          class="filter-input"
          :class="{ 'has-error': validationError }"
          placeholder="Enter a display filter..."
          autocomplete="off"
        />

        <!-- Action Icons (Clear / Error) -->
        <div class="input-actions">
          <div
            v-if="validationError"
            class="error-icon-wrapper"
            :title="validationError"
          >
            <AlertCircle class="error-icon" :size="18" />
          </div>
          <div
            v-if="filterText"
            class="clear-icon-wrapper"
            @click="clearFilter"
            title="Clear filter"
          >
            <X class="clear-icon" :size="16" />
          </div>
        </div>

        <!-- Autocomplete Dropdown -->
        <ul v-if="showSuggestions" class="suggestions-dropdown">
          <li
            v-for="(suggestion, index) in suggestions"
            :key="index"
            :class="['suggestion-item', { active: index === activeIndex }]"
            @click="selectSuggestion(index)"
            @mouseover="activeIndex = index"
          >
            <span class="suggestion-value">{{ suggestion.value }}</span>
            <span v-if="suggestion.description" class="suggestion-desc">{{
              suggestion.description
            }}</span>
          </li>
        </ul>
      </div>

      <!-- Apply Button -->
      <button class="apply-btn" @click="applyFilter" :disabled="!isValid">
        <Check :size="16" style="margin-right: 4px" />
        Apply
      </button>
    </div>

    <!-- Prominent Error Message -->
    <div v-if="validationError" class="validation-message-prominent">
      {{ validationError }}
    </div>
  </div>
</template>

<style scoped>
.filter-bar-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
}

.filter-bar-container {
  display: flex;
  align-items: stretch;
  position: relative;
  width: 100%;
  gap: 8px;
}

.filter-input-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  color: var(--color-text-muted);
}

.filter-input {
  width: 100%;
  padding: 0.6rem 4rem 0.6rem 2.2rem;
  font-family: monospace;
  font-size: 14px;
  border: 1px solid var(--color-border-glass);
  border-radius: 4px;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.filter-input::placeholder {
  color: var(--color-text-muted);
}

.filter-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-accent-glow);
}

.filter-input.has-error {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 2px var(--color-danger-glow);
}

.input-actions {
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.error-icon-wrapper {
  color: var(--color-danger);
  display: flex;
  align-items: center;
  cursor: help;
}

.clear-icon-wrapper {
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.2s;
}

.clear-icon-wrapper:hover {
  color: var(--color-text-primary);
}

.validation-message-prominent {
  color: var(--color-danger);
  font-size: 0.85rem;
  margin-top: 6px;
  margin-left: 2px;
  font-weight: 500;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-glass);
  border-radius: 4px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
  list-style: none;
  padding: 0;
}

.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border-glass);
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item.active {
  background-color: var(--color-bg-card-hover);
  border-left: 2px solid var(--color-accent);
  padding-left: 10px; /* Compensate for the border */
}

.suggestion-value {
  font-family: monospace;
  font-weight: 500;
}

.suggestion-item.active .suggestion-value {
  color: var(--color-accent);
}

.suggestion-desc {
  font-size: 0.85em;
  color: var(--color-text-secondary);
}

.apply-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  background-color: var(--color-accent-dim);
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.apply-btn:hover:not(:disabled) {
  background-color: var(--color-accent);
  color: var(--color-bg);
}

.apply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
