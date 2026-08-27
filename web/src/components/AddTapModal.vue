<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2>Add New Tap</h2>
      <div v-if="error" class="error">{{ error }}</div>

      <div class="form-group">
        <label for="tapSelect">Select a Tap:</label>
        <select id="tapSelect" v-model="selectedTap">
          <option disabled value="">Please select one</option>
          <option v-for="tap in availableTaps" :key="tap.tap" :value="tap.tap">
            {{ tap.name }} ({{ tap.tap }})
          </option>
        </select>
      </div>

      <div class="actions">
        <button class="close-btn" @click="close">Cancel</button>
        <button class="apply-btn" @click="apply" :disabled="!selectedTap">
          Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { InfoItem } from "../types";

const props = defineProps<{
  isOpen: boolean;
  availableTaps: InfoItem[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "apply", tapString: string): void;
}>();

const selectedTap = ref("");
const error = ref("");

const close = () => {
  selectedTap.value = "";
  error.value = "";
  emit("close");
};

const apply = () => {
  if (!selectedTap.value) {
    error.value = "You must select a tap.";
    return;
  }

  // Validation: ensure the selected tap is actually in availableTaps
  const isValid = props.availableTaps.some((t) => t.tap === selectedTap.value);
  if (!isValid) {
    error.value = "Invalid tap selected.";
    return;
  }

  error.value = "";
  emit("apply", selectedTap.value);
  selectedTap.value = "";
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
  min-width: 400px;
  color: var(--color-text-primary);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: var(--text-xl);
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

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.form-group select {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--color-border-glass);
  color: var(--color-text-primary);
  padding: 0.75rem;
  border-radius: var(--radius-md);
  outline: none;
  font-size: var(--text-base);
}

.form-group select:focus {
  border-color: var(--color-accent);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
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
