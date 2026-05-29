<script setup lang="ts">
import { ref, computed } from "vue";
import { Info } from "@lucide/vue";
import type { SystemInfo } from "../types";
import SystemInfoModal from "./SystemInfoModal.vue";

const props = defineProps<{
  systemInfo: SystemInfo | null;
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: "open-info"): void;
}>();

const isModalOpen = ref(false);

const statusText = computed(() => {
  if (props.isLoading) return "Loading system info...";
  if (!props.isOnline || props.error) return "Sharkophagus offline";
  return `Sharkophagus v${props.systemInfo?.version || "unknown"}`;
});

function handleInfoClick() {
  isModalOpen.value = true;
  emit("open-info");
}
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="status-indicator-container">
        <span
          class="indicator-dot"
          :class="{
            loading: props.isLoading,
            'loading-indicator': props.isLoading,
            online: props.isOnline && !props.isLoading,
            'online-indicator': props.isOnline && !props.isLoading,
            offline: !props.isOnline && !props.isLoading,
            'offline-indicator': !props.isOnline && !props.isLoading,
          }"
        ></span>
        <span
          class="status-text"
          :class="{ 'status-offline': !props.isOnline && !props.isLoading }"
        >
          {{ statusText }}
        </span>
      </div>

      <button
        v-if="props.isOnline && !props.isLoading && props.systemInfo"
        class="info-btn"
        @click="handleInfoClick"
        aria-label="View system capabilities"
        title="View system capabilities"
      >
        <Info class="info-icon" size="16" />
      </button>
    </div>
  </footer>

  <SystemInfoModal
    :is-open="isModalOpen"
    :system-info="props.systemInfo"
    @close="isModalOpen = false"
  />
</template>

<style scoped>
.app-footer {
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Inter", sans-serif;
}

.footer-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-indicator-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

.indicator-dot.online {
  background-color: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
}

.indicator-dot.offline {
  background-color: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
}

.indicator-dot.loading {
  background-color: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
  animation: pulse 1.5s infinite ease-in-out;
}

.status-text {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
}

.status-offline {
  color: #ef4444;
}

.info-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.info-btn:hover {
  color: #f8fafc;
  background-color: rgba(255, 255, 255, 0.08);
}

.info-icon {
  transition: transform 0.2s ease;
}

.info-btn:hover .info-icon {
  transform: scale(1.1);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>
