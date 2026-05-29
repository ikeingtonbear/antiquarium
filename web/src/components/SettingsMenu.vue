<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Settings } from "@lucide/vue";

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const emit = defineEmits<{
  (e: "open-info"): void;
}>();

function toggleMenu() {
  isOpen.value = !isOpen.value;
}

function handleInfoClick() {
  isOpen.value = false;
  emit("open-info");
}

function handleClickOutside(event: MouseEvent) {
  if (
    containerRef.value &&
    !containerRef.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="settings-menu-container" ref="containerRef">
    <button
      class="settings-btn"
      @click="toggleMenu"
      aria-label="Settings"
      title="Settings"
    >
      <Settings
        size="20"
        class="settings-icon"
        :class="{ 'is-open': isOpen }"
      />
    </button>

    <Transition name="fade-slide">
      <div v-if="isOpen" class="settings-popover card">
        <ul class="settings-list">
          <li>
            <button class="menu-item menu-item-info" @click="handleInfoClick">
              Info
            </button>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.settings-menu-container {
  position: fixed;
  bottom: var(--space-4);
  right: var(--space-4);
  z-index: var(--z-raised);
}

.settings-btn {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid var(--color-border-glass);
  color: var(--color-text-secondary);
  padding: var(--space-3);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-fast) ease;
  backdrop-filter: blur(8px);
}

.settings-btn:hover {
  color: var(--color-text-primary);
  border-color: var(--color-border-hover);
  background: rgba(30, 41, 59, 0.9);
  box-shadow: 0 0 12px var(--color-accent-glow);
}

.settings-icon {
  transition: transform var(--duration-normal) var(--ease-spring);
}

.settings-icon.is-open {
  transform: rotate(45deg);
}

.settings-popover {
  position: absolute;
  bottom: calc(100% + var(--space-2));
  right: 0;
  width: 220px;
  padding: var(--space-2);
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid var(--color-border-glass);
  border-radius: var(--radius-lg);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.5),
    var(--shadow-glow-accent);
}

.settings-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-item {
  width: 100%;
  text-align: left;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) ease;
}

.menu-item:hover {
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.08);
}

/* ── Transitions ── */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity var(--duration-fast) ease,
    transform var(--duration-fast) var(--ease-spring);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}
</style>
