<template>
  <div class="layer-view">
    <div v-if="!tree || tree.length === 0" class="no-layers">
      No layers available
    </div>
    <ul v-else class="layer-list">
      <li v-for="(node, index) in tree" :key="index" class="layer-node">
        <!-- If it's a primitive or has no label/children, just render JSON -->
        <template v-if="typeof node !== 'object' || node === null">
          <div class="layer-value">{{ node }}</div>
        </template>
        <template v-else>
          <div
            class="layer-header"
            @click="toggleNode(node)"
            @mouseenter="onNodeHover(node)"
            @mouseleave="onNodeLeave"
          >
            <span class="expander" v-if="hasChildren(node)">
              {{ isExpanded(node) ? "▼" : "▶" }}
            </span>
            <span class="expander-placeholder" v-else></span>
            <span class="layer-label">{{ node.l || "Unknown Layer" }}</span>
          </div>
          <div
            class="layer-children"
            v-if="hasChildren(node) && isExpanded(node)"
          >
            <LayerView
              :tree="node.n"
              @hover-node="emit('hover-node', $event)"
            />
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  tree?: any[];
}>();

// Simple Set to track expanded state of nodes by object reference
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

const emit = defineEmits<{
  (e: "hover-node", range: [number, number] | null): void;
}>();

function onNodeHover(node: any) {
  if (node.h && Array.isArray(node.h) && node.h.length === 2) {
    emit("hover-node", node.h as [number, number]);
  } else {
    emit("hover-node", null);
  }
}

function onNodeLeave() {
  emit("hover-node", null);
}

// Reset expanded state when tree completely changes
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

.expander {
  display: inline-block;
  width: 16px;
  color: var(--text-muted, #888);
  font-size: 0.8em;
  margin-top: 2px;
  user-select: none;
}

.expander-placeholder {
  display: inline-block;
  width: 16px;
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
