<template>
  <div class="analytics-dashboard">
    <h2 class="title">Analytics Dashboard</h2>
    <div v-if="activeTaps.length === 0" class="empty-state">
      <p>No active taps. Click "Add Tap" to analyze your capture.</p>
    </div>
    <div v-else class="taps-list">
      <div v-for="tap in activeTaps" :key="tap.id" class="tap-card">
        <h3>{{ tap.name }}</h3>
        <p class="tap-string">{{ tap.tapString }}</p>
        <div class="tap-results">
          <pre v-if="tap.results">{{
            JSON.stringify(tap.results, null, 2)
          }}</pre>
          <span v-else class="text-secondary">Awaiting results...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActiveTap } from "../types";

defineProps<{
  activeTaps: ActiveTap[];
}>();
</script>

<style scoped>
.analytics-dashboard {
  background: var(--color-surface);
  border: 1px solid var(--color-border-glass);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-top: var(--space-4);
  width: 100%;
}
.title {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  margin-bottom: var(--space-4);
}
.empty-state {
  text-align: center;
  color: var(--color-text-secondary);
  padding: var(--space-8) 0;
}
.taps-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.tap-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border-hover);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}
.tap-card h3 {
  font-size: var(--text-lg);
  margin-bottom: var(--space-1);
}
.tap-string {
  font-family: monospace;
  color: var(--color-accent);
  margin-bottom: var(--space-3);
  font-size: var(--text-sm);
}
.tap-results pre {
  background: rgba(0, 0, 0, 0.2);
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  overflow-x: auto;
  font-size: var(--text-sm);
}
</style>
