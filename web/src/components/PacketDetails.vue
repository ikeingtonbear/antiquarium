<template>
  <div class="packet-details">
    <div v-if="!frameId" class="placeholder">
      Select a packet to view details
    </div>
    <div v-else-if="loading" class="loading">Loading packet details...</div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else class="split-pane">
      <div class="pane pane-left">
        <h3 class="pane-header">Protocol Hierarchy</h3>
        <div class="pane-content">
          <LayerView
            :tree="frameDetail?.tree"
            @hover-node="activeByteRange = $event"
          />
        </div>
      </div>
      <div class="pane pane-right">
        <HexdumpView
          :bytes="frameDetail?.bytes"
          :active-range="activeByteRange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { FrameDetail } from "../types";
import { SharkophagusApi } from "../services/api";
import LayerView from "./LayerView.vue";
import HexdumpView from "./HexdumpView.vue";

const props = defineProps<{
  sessionId: string;
  frameId: number | null;
}>();

const frameDetail = ref<FrameDetail | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const activeByteRange = ref<[number, number] | null>(null);

const api = new SharkophagusApi();

watch(
  () => props.frameId,
  async (newFrameId) => {
    if (newFrameId === null) {
      frameDetail.value = null;
      activeByteRange.value = null;
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const detail = await api.getSessionFrameDetail(
        props.sessionId,
        newFrameId,
      );
      frameDetail.value = detail;
    } catch (err: any) {
      error.value = err.message || "Failed to load packet details";
      frameDetail.value = null;
    } finally {
      loading.value = false;
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.packet-details {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 200px;
  background: var(--bg-surface, #1e1e1e);
  border-top: 1px solid var(--border-color, #333);
}

.placeholder,
.loading,
.error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted, #888);
  font-style: italic;
  padding: 24px;
}

.error {
  color: var(--text-error, #f48771);
}

.split-pane {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pane-left {
  flex: 1;
}

.pane-right {
  flex: 1;
  border-left: 1px solid var(--border-color, #333);
}

.pane-header {
  margin: 0;
  padding: 8px 12px;
  font-size: 0.9em;
  font-weight: 600;
  background: var(--bg-surface-header, #252526);
  border-bottom: 1px solid var(--border-color, #333);
  color: var(--text-primary, #e0e0e0);
}

.pane-content {
  flex: 1;
  overflow: auto;
  padding: 8px 12px;
}
</style>
