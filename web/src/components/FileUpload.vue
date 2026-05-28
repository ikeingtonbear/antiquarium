<script setup lang="ts">
/**
 * FileUpload — Drag-and-Drop File Upload Component
 *
 * Centered dropzone with client-side file type and size validation.
 * Supports drag-and-drop and click-to-select with keyboard accessibility.
 *
 * @see plan.md §2 — Layout Grid and Drag-and-Drop File Upload
 * @see data-model.md §3 — Validation Rules
 */

import { ref } from "vue";
import { Upload } from "@lucide/vue";
import {
  EXTENSION_REGEX,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_LABEL,
  ALLOWED_EXTENSIONS,
} from "../types";

/* ── Emits ── */
const emit = defineEmits<{
  (e: "upload", file: File): void;
}>();

/* ── Reactive State ── */
const isDragOver = ref(false);
const validationError = ref<string | null>(null);
const isShaking = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

/* ── File Validation ── */
function validateFile(file: File): string | null {
  if (!EXTENSION_REGEX.test(file.name)) {
    return `Invalid file type: "${file.name}". Accepted: ${ALLOWED_EXTENSIONS.join(", ")}`;
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return `File size (${sizeMB} MB) exceeds the ${MAX_FILE_SIZE_LABEL} limit.`;
  }

  return null;
}

/* ── File Selection Handler ── */
function handleFile(file: File) {
  validationError.value = null;
  isShaking.value = false;

  const error = validateFile(file);

  if (error) {
    validationError.value = error;
    isShaking.value = true;
    setTimeout(() => {
      isShaking.value = false;
    }, 500);
    return;
  }

  emit("upload", file);
}

/* ── Input Change ── */
function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    handleFile(file);
  }
  /* Reset input so same file can be re-selected */
  target.value = "";
}

/* ── Drag Events ── */
function onDragEnter(event: DragEvent) {
  event.preventDefault();
  isDragOver.value = true;
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  isDragOver.value = true;
}

function onDragLeave() {
  isDragOver.value = false;
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  isDragOver.value = false;

  const file = event.dataTransfer?.files[0];
  if (file) {
    handleFile(file);
  }
}

/* ── Click / Keyboard ── */
let isOpeningDialog = false;

function openFileDialog() {
  if (isOpeningDialog) return;
  isOpeningDialog = true;
  fileInputRef.value?.click();
  isOpeningDialog = false;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openFileDialog();
  }
}
</script>

<template>
  <div class="file-upload-wrapper">
    <div
      class="dropzone"
      :class="{
        'dropzone--drag-over': isDragOver,
        'dropzone--error': validationError,
        'dropzone--shake': isShaking,
      }"
      role="button"
      tabindex="0"
      aria-label="Upload capture file"
      @click="openFileDialog"
      @keydown="onKeydown"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <input
        ref="fileInputRef"
        type="file"
        class="dropzone-input"
        :accept="ALLOWED_EXTENSIONS.join(',')"
        tabindex="-1"
        @change="onInputChange"
      />

      <div class="dropzone-content">
        <div class="dropzone-icon-wrapper">
          <Upload
            :size="48"
            :stroke-width="1.5"
            aria-hidden="true"
            class="dropzone-icon"
          />
        </div>

        <p class="dropzone-label">Drag &amp; drop your capture file here</p>
        <p class="dropzone-sublabel text-secondary">or click to browse</p>

        <div class="dropzone-meta">
          <span class="dropzone-extensions text-mono text-muted">
            .pcap · .pcapng · .cap · .dmp
          </span>
          <span class="dropzone-size-limit text-muted">
            Max {{ MAX_FILE_SIZE_LABEL }}
          </span>
        </div>
      </div>
    </div>

    <!-- Validation Error Message -->
    <Transition name="error-fade">
      <p
        v-if="validationError"
        class="validation-error text-danger"
        role="alert"
      >
        {{ validationError }}
      </p>
    </Transition>
  </div>
</template>

<style scoped>
.file-upload-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  animation: fadeIn var(--duration-slow) var(--ease-out-expo);
}

/* ── Dropzone ── */
.dropzone {
  width: 100%;
  padding: var(--space-16) var(--space-8);
  border: 2px dashed var(--color-text-muted);
  border-radius: var(--radius-2xl);
  background: var(--color-bg-card);
  cursor: pointer;
  position: relative;
  transition:
    border-color var(--duration-normal) ease,
    background var(--duration-normal) ease,
    transform var(--duration-normal) var(--ease-spring),
    box-shadow var(--duration-normal) ease;
}

.dropzone:hover {
  border-color: var(--color-accent);
  background: var(--color-bg-card-hover);
  box-shadow: var(--shadow-glow-accent);
}

.dropzone:focus-visible {
  border-color: var(--color-accent);
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Drag-over state */
.dropzone--drag-over {
  border-style: dotted;
  border-color: var(--color-accent);
  background: var(--color-accent-dim);
  transform: scale(1.02);
  box-shadow: var(--shadow-glow-accent);
}

/* Error state */
.dropzone--error {
  border-color: var(--color-danger);
  box-shadow: var(--shadow-glow-danger);
}

/* Shake animation for invalid files */
.dropzone--shake {
  animation: shake 0.5s ease;
}

/* Hidden file input */
.dropzone-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  /* Sits behind the dropzone visually but still captures events from form state */
  pointer-events: none;
}

/* ── Dropzone Content ── */
.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  pointer-events: none;
}

.dropzone-icon-wrapper {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--color-accent-dim);
  transition: background var(--duration-normal) ease;
}

.dropzone:hover .dropzone-icon-wrapper {
  background: var(--color-accent-glow);
}

.dropzone--drag-over .dropzone-icon-wrapper {
  background: var(--color-accent-glow);
}

.dropzone-icon {
  color: var(--color-accent);
  transition: transform var(--duration-normal) var(--ease-spring);
}

.dropzone:hover .dropzone-icon {
  transform: translateY(-2px);
}

.dropzone--drag-over .dropzone-icon {
  transform: translateY(-4px) scale(1.1);
}

.dropzone-label {
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
}

.dropzone-sublabel {
  font-size: var(--text-sm);
}

.dropzone-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  margin-top: var(--space-2);
}

.dropzone-extensions {
  font-size: var(--text-xs);
  letter-spacing: 0.05em;
}

.dropzone-size-limit {
  font-size: var(--text-xs);
}

/* ── Validation Error ── */
.validation-error {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  text-align: center;
  padding: var(--space-3) var(--space-5);
  background: var(--color-danger-glow);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-md);
}

.error-fade-enter-active {
  animation: fadeIn var(--duration-normal) var(--ease-out-expo);
}

.error-fade-leave-active {
  animation: fadeOut var(--duration-fast) ease;
}

/* ── Mobile ── */
@media (max-width: 480px) {
  .dropzone {
    padding: var(--space-10) var(--space-4);
  }

  .dropzone-label {
    font-size: var(--text-lg);
  }
}
</style>
