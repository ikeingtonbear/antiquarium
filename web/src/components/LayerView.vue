<template>
  <div class="layer-view">
    <div v-if="!tree || tree.length === 0" class="no-layers">
      No layers available
    </div>
    <ul v-else class="layer-list">
      <li v-for="(node, index) in tree" :key="index" class="layer-node">
        <template v-if="typeof node !== 'object' || node === null">
          <div class="layer-value">{{ node }}</div>
        </template>
        <template v-else>
          <div
            class="layer-header"
            :class="{
              hovered: isHovered(node),
              selected: isSelected(node),
            }"
            @click="onNodeClick($event, node)"
            @mouseenter="onNodeHover(node)"
            @mouseleave="onNodeLeave"
          >
            <span
              class="expander"
              v-if="hasChildren(node)"
              @click.stop="toggleNode(node)"
            >
              {{ isExpanded(node) ? "▼" : "▶" }}
            </span>
            <span class="expander-placeholder" v-else></span>
            <span class="layer-content">
              <span class="layer-label">{{ node.l || "Unknown Layer" }}</span>
            </span>
          </div>
          <div
            class="layer-children"
            v-if="hasChildren(node) && isExpanded(node)"
          >
            <LayerView
              :tree="node.n"
              :hovered-byte-range="hoveredByteRange"
              :selected-byte-range="selectedByteRange"
              @hover-layer="emit('hover-layer', $event)"
              @select-layer="emit('select-layer', $event)"
            />
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import type { ByteRange } from "../types";

const props = defineProps<{
  tree?: any[];
  hoveredByteRange?: ByteRange | null;
  selectedByteRange?: ByteRange | null;
}>();

const emit = defineEmits<{
  (e: "hover-layer", range: ByteRange | null): void;
  (e: "select-layer", range: ByteRange | null): void;
}>();

const expandedNodes = ref(new Set<any>());

function toggleNode(node: any) {
  if (!hasChildren(node)) return;
  if (expandedNodes.value.has(node)) {
    expandedNodes.value.delete(node);
  } else {
    expandedNodes.value.add(node);
  }
}

function hasChildren(node: any): boolean {
  return Array.isArray(node.n) && node.n.length > 0;
}

function isExpanded(node: any): boolean {
  return expandedNodes.value.has(node);
}

function onNodeHover(node: any) {
  if (node.h && Array.isArray(node.h) && node.h.length === 2) {
    emit("hover-layer", node.h as [number, number]);
  } else {
    emit("hover-layer", null);
  }
}

function onNodeLeave() {
  emit("hover-layer", null);
}

function onNodeClick(event: MouseEvent, node: any) {
  if (node.h && Array.isArray(node.h) && node.h.length === 2) {
    emit("select-layer", node.h as [number, number]);
  }
  // If it doesn't have h, or even if it does, clicking the header should also toggle if it has children and we didn't click the expander
  // Wait, if it has children, maybe clicking the content expands too?
  // We'll let the user click the expander to expand, and the content to select.
}

function containsRange(h?: ByteRange, range?: ByteRange | null): boolean {
  if (!h || !range) return false;
  return h[0] <= range[0] && h[0] + h[1] >= range[0] + range[1];
}

function isEqual(h?: ByteRange, range?: ByteRange | null): boolean {
  if (!h || !range) return false;
  return h[0] === range[0] && h[1] === range[1];
}

function isBestMatch(node: any, range: ByteRange | null): boolean {
  if (!range || !node.h) return false;
  if (!containsRange(node.h, range)) return false;
  if (isEqual(node.h, range)) return true;

  if (hasChildren(node)) {
    for (const child of node.n) {
      if (containsRange(child.h, range)) {
        return false;
      }
    }
  }
  return true;
}

function isHovered(node: any) {
  return isBestMatch(node, props.hoveredByteRange || null);
}

function isSelected(node: any) {
  return isBestMatch(node, props.selectedByteRange || null);
}

// Auto-expand parents if they contain the selected range
watch(
  () => props.selectedByteRange,
  (newRange) => {
    if (!newRange || !props.tree) return;
    for (const node of props.tree) {
      if (
        hasChildren(node) &&
        containsRange(node.h, newRange) &&
        !isEqual(node.h, newRange)
      ) {
        expandedNodes.value.add(node);
      }
    }
  },
  { immediate: true },
);

watch(
  () => props.tree,
  () => {
    expandedNodes.value.clear();
  },
);
</script>

<style scoped>
.layer-view {
  font-family: var(--font-mono, monospace);
  font-size: 0.85em;
  color: var(--text-primary, #e0e0e0);
}

.no-layers {
  padding: 16px;
  color: var(--text-muted, #888);
  font-style: italic;
}

.layer-list {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}

.layer-children {
  padding-left: 16px;
}

.layer-node {
  margin-bottom: 2px;
}

.layer-header {
  display: flex;
  align-items: flex-start;
  padding: 2px 4px;
  cursor: pointer;
  border-radius: 2px;
}

.layer-header:hover {
  background: var(--bg-hover, rgba(255, 255, 255, 0.1));
}

.layer-header.hovered {
  background-color: var(--bg-hover, rgba(200, 200, 200, 0.2));
}

.layer-header.selected {
  background-color: var(--bg-highlight, rgba(156, 220, 254, 0.4));
}

.expander {
  display: inline-block;
  width: 16px;
  color: var(--text-muted, #888);
  font-size: 0.8em;
  margin-top: 2px;
  user-select: none;
  cursor: pointer;
}

.expander-placeholder {
  display: inline-block;
  width: 16px;
}

.layer-content {
  flex: 1;
}

.layer-label {
  font-weight: 500;
  color: var(--text-highlight, #9cdcfe);
}

.layer-value {
  margin-left: 4px;
  color: var(--text-value, #ce9178);
  word-break: break-all;
}
</style>
