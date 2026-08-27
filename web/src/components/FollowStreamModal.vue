<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Follow {{ protocol }} Stream</h2>
        <button class="close-button" @click="$emit('close')">
          <X class="icon" />
        </button>
      </div>

      <div class="modal-body">
        <div v-if="loading" class="loading">Loading stream payload...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="streamData" class="stream-container">
          <div class="stream-meta">
            <span
              ><strong>Client:</strong> {{ streamData.chost }}:{{
                streamData.cport
              }}
              ({{ streamData.cbytes }} bytes)</span
            >
            <span
              ><strong>Server:</strong> {{ streamData.shost }}:{{
                streamData.sport
              }}
              ({{ streamData.sbytes }} bytes)</span
            >
          </div>
          <div class="payloads">
            <template v-for="(payload, idx) in streamData.payloads" :key="idx">
              <div
                class="payload-chunk"
                :class="payload.s === 0 ? 'client-payload' : 'server-payload'"
              >
                {{ decodeBase64(payload.d) }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { X } from "@lucide/vue";
import type { FollowResponse } from "../types";
import { SharkophagusApi } from "../services/api";

const props = defineProps<{
  sessionId: string;
  protocol: string;
  filter: string;
}>();

defineEmits<{
  (e: "close"): void;
}>();

const loading = ref(true);
const error = ref<string | null>(null);
const streamData = ref<FollowResponse | null>(null);

const decodeBase64 = (b64: string) => {
  try {
    return atob(b64);
  } catch {
    return "<binary data>";
  }
};

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    const api = new SharkophagusApi();
    streamData.value = await api.followStream(
      props.sessionId,
      props.protocol,
      props.filter,
    );
  } catch (err: any) {
    error.value = err.message || "Failed to follow stream";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-bg-card, #161e2e);
  color: var(--color-text-primary, #f1f5f9);
  border: 1px solid var(--color-border-glass, rgba(255, 255, 255, 0.08));
  border-radius: 8px;
  width: 80%;
  max-width: 900px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid var(--color-border-glass, rgba(255, 255, 255, 0.08));
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--color-text-secondary, #94a3b8);
}

.close-button:hover {
  color: var(--color-text-primary, #f1f5f9);
}

.modal-body {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.loading,
.error {
  padding: 20px;
  text-align: center;
}

.error {
  color: var(--color-danger, #f43f5e);
}

.stream-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 8px;
  background-color: var(--color-bg, #0b0f19);
  border: 1px solid var(--color-border-glass, rgba(255, 255, 255, 0.08));
  border-radius: 4px;
  color: var(--color-text-secondary, #94a3b8);
}

.payloads {
  font-family: var(--font-mono, monospace);
  white-space: pre-wrap;
  word-break: break-all;
  background-color: var(--color-bg, #0b0f19);
  border: 1px solid var(--color-border-glass, rgba(255, 255, 255, 0.08));
  color: var(--color-text-primary, #f1f5f9);
  padding: 16px;
  border-radius: 4px;
}

.client-payload {
  color: var(--color-danger, #f43f5e); /* distinct color for client data */
}

.server-payload {
  color: var(--color-accent, #06b6d4); /* distinct color for server data */
}
</style>
