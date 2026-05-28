<script setup lang="ts">
/**
 * ErrorNotification — Floating Error Toast Component
 *
 * A dismissible floating toast notification placed in the top-right
 * corner of the viewport. Slides in from the right using a spring
 * easing curve. Auto-fades after 6 seconds with a shrinking visual
 * timer bar at the bottom.
 *
 * @see plan.md §5 — Floating Error Notifications
 */

import { onMounted, onUnmounted, ref } from "vue";

/* ── Props & Emits ── */
const props = defineProps<{
  message: string;
}>();

const emit = defineEmits<{
  (e: "dismiss"): void;
}>();

/* ── Auto-Dismiss Timer ── */
const AUTO_DISMISS_MS = 6000;
let timerId: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  timerId = setTimeout(() => {
    emit("dismiss");
  }, AUTO_DISMISS_MS);
});

onUnmounted(() => {
  if (timerId !== null) {
    clearTimeout(timerId);
  }
});

/* ── Dismiss Handler ── */
function handleDismiss() {
  if (timerId !== null) {
    clearTimeout(timerId);
    timerId = null;
  }
  emit("dismiss");
}
</script>

<template>
  <div class="error-toast" role="alert" aria-live="assertive">
    <div class="error-toast-content">
      <span class="error-toast-icon" aria-hidden="true">⚠️</span>
      <p class="error-toast-message">{{ message }}</p>
      <button
        class="error-toast-close"
        aria-label="Dismiss error"
        @click="handleDismiss"
      >
        ✕
      </button>
    </div>
    <div class="error-toast-timer" aria-hidden="true"></div>
  </div>
</template>

<style scoped>
.error-toast {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  z-index: var(--z-toast);
  max-width: 420px;
  width: calc(100% - var(--space-12));
  background: var(--color-bg-card);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-glow-danger), var(--shadow-lg);
  overflow: hidden;
  animation: slideInRight var(--duration-slow) var(--ease-out-expo) forwards;
}

.error-toast-content {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
}

.error-toast-icon {
  flex-shrink: 0;
  font-size: var(--text-xl);
  line-height: 1.4;
}

.error-toast-message {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: var(--leading-relaxed);
}

.error-toast-close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  transition:
    color var(--duration-fast) ease,
    background var(--duration-fast) ease;
}

.error-toast-close:hover {
  color: var(--color-danger);
  background: var(--color-danger-glow);
}

.error-toast-timer {
  height: 3px;
  background: var(--color-danger);
  animation: shrinkWidth 6s linear forwards;
}
</style>
