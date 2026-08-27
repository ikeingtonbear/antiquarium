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
        <div class="pane-header-container">
          <h3 class="pane-header">Protocol Hierarchy</h3>
          <div
            class="followers-actions"
            v-if="frameDetail?.followers && frameDetail.followers.length > 0"
          >
            <button
              v-for="follower in frameDetail.followers"
              :key="follower.filter"
              @click="
                $emit('follow-stream', follower.protocol, follower.filter)
              "
              class="follower-btn"
            >
              Follow {{ follower.protocol }} Stream
            </button>
          </div>
        </div>
        <div class="pane-content">
          <LayerView
            :tree="frameDetail?.tree"
            :hovered-byte-range="hoveredByteRange"
            :selected-byte-range="selectedByteRange"
            @hover-layer="hoveredByteRange = $event"
            @select-layer="onLayerSelect"
          />
        </div>
      </div>
      <div class="pane pane-right">
        <HexdumpView
          :bytes="frameDetail?.bytes"
          :hovered-byte-range="hoveredByteRange"
          :selected-byte-range="selectedByteRange"
          :selected-single-byte="selectedSingleByte"
          @hover-byte="onHexHover"
          @select-byte="onHexSelect"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { FrameDetail, ByteRange } from "../types";
import { SharkophagusApi } from "../services/api";
import LayerView from "./LayerView.vue";
import HexdumpView from "./HexdumpView.vue";

const props = defineProps<{
  sessionId: string;
  frameId: number | null;
}>();

const emit = defineEmits<{
  (e: "follow-stream", protocol: string, filter: string): void;
}>();

const frameDetail = ref<FrameDetail | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const hoveredByteRange = ref<ByteRange | null>(null);
const selectedByteRange = ref<ByteRange | null>(null);
const selectedSingleByte = ref<number | null>(null);

const api = new SharkophagusApi();

function containsRange(h?: ByteRange, range?: ByteRange | null): boolean {
  if (!h || !range) return false;
  return h[0] <= range[0] && h[0] + h[1] >= range[0] + range[1];
}

function getDeepestLayerRange(
  nodes: any[] | undefined,
  range: ByteRange | null,
): ByteRange | null {
  if (!nodes || !range) return range;
  let bestMatch: ByteRange | null = null;

  function dfs(nList: any[]) {
    for (const node of nList) {
      if (
        node &&
        typeof node === "object" &&
        node.h &&
        containsRange(node.h, range)
      ) {
        bestMatch = node.h;
        if (node.n && Array.isArray(node.n)) {
          dfs(node.n);
        }
      }
    }
  }

  dfs(nodes);
  return bestMatch || range;
}

function onHexHover(range: ByteRange | null) {
  if (range && range[1] === 1) {
    hoveredByteRange.value = getDeepestLayerRange(
      frameDetail.value?.tree,
      range,
    );
  } else {
    hoveredByteRange.value = range;
  }
}

function onHexSelect(range: ByteRange | null) {
  if (range && range[1] === 1) {
    selectedSingleByte.value = range[0];
    selectedByteRange.value = getDeepestLayerRange(
      frameDetail.value?.tree,
      range,
    );
  } else {
    selectedSingleByte.value = null;
    selectedByteRange.value = range;
  }
}

function onLayerSelect(range: ByteRange | null) {
  selectedSingleByte.value = null;
  selectedByteRange.value = range;
}

watch(
  () => props.frameId,
  async (newFrameId) => {
    if (newFrameId === null) {
      frameDetail.value = null;
      hoveredByteRange.value = null;
      selectedByteRange.value = null;
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

.pane-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-surface-header, #252526);
  border-bottom: 1px solid var(--border-color, #333);
  padding-right: 12px;
}

.pane-header {
  margin: 0;
  padding: 8px 12px;
  font-size: 0.9em;
  font-weight: 600;
  color: var(--text-primary, #e0e0e0);
  border-bottom: none;
}

.followers-actions {
  display: flex;
  gap: 8px;
}

.follower-btn {
  background: #007acc;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  cursor: pointer;
}

.follower-btn:hover {
  background: #005f9e;
}

.pane-content {
  flex: 1;
  overflow: auto;
  padding: 8px 12px;
}
</style>
