<template>
  <div class="hexdump-container">
    <h3 class="hexdump-header">Raw Packet Data</h3>
    <div v-if="!bytes" class="no-data">No raw data available</div>
    <div v-else class="hexdump-content">
      <div class="hexdump-row" v-for="row in hexdumpRows" :key="row.offset">
        <span class="offset">{{ row.offsetHex }}</span>
        <span class="hex-bytes">
          <span
            v-for="(b, i) in row.bytes"
            :key="i"
            class="hex-byte"
            :class="{ highlighted: isHighlighted(row.offset + i) }"
            >{{ b.hex }}</span
          >
        </span>
        <span class="ascii-bytes">
          <span
            v-for="(b, i) in row.bytes"
            :key="i"
            class="ascii-byte"
            :class="{ highlighted: isHighlighted(row.offset + i) }"
            >{{ b.ascii }}</span
          >
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  bytes?: string;
  activeRange?: [number, number] | null;
}>();

const decodedBytes = computed(() => {
  if (!props.bytes) return new Uint8Array();
  try {
    const binString = atob(props.bytes);
    const bytes = new Uint8Array(binString.length);
    for (let i = 0; i < binString.length; i++) {
      bytes[i] = binString.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    return new Uint8Array();
  }
});

const hexdumpRows = computed(() => {
  const bytes = decodedBytes.value;
  const rows = [];
  for (let i = 0; i < bytes.length; i += 16) {
    const rowBytes = [];
    for (let j = 0; j < 16; j++) {
      if (i + j < bytes.length) {
        const val = bytes[i + j];
        rowBytes.push({
          hex: val.toString(16).padStart(2, "0").toUpperCase(),
          ascii: val >= 32 && val <= 126 ? String.fromCharCode(val) : ".",
        });
      }
    }
    rows.push({
      offset: i,
      offsetHex: i.toString(16).padStart(4, "0").toUpperCase(),
      bytes: rowBytes,
    });
  }
  return rows;
});

function isHighlighted(index: number) {
  if (!props.activeRange) return false;
  const [offset, length] = props.activeRange;
  return index >= offset && index < offset + length;
}
</script>

<style scoped>
.hexdump-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-surface, #1e1e1e);
  color: var(--text-primary, #e0e0e0);
  border-left: 1px solid var(--border-color, #333);
  overflow: hidden;
}

.hexdump-header {
  margin: 0;
  padding: 8px 12px;
  font-size: 0.9em;
  font-weight: 600;
  background: var(--bg-surface-header, #252526);
  border-bottom: 1px solid var(--border-color, #333);
}

.no-data {
  padding: 16px;
  color: var(--text-muted, #888);
  font-style: italic;
  text-align: center;
}

.hexdump-content {
  flex: 1;
  overflow: auto;
  padding: 8px 12px;
  font-family: "Courier New", Courier, monospace;
  font-size: 0.85em;
  white-space: pre;
}

.hexdump-row {
  display: flex;
  margin-bottom: 2px;
}

.offset {
  color: var(--text-muted, #888);
  margin-right: 16px;
  user-select: none;
}

.hex-bytes {
  display: flex;
  width: 350px; /* enough for 16 bytes: 16 * (2chars + margin) */
  flex-shrink: 0;
  margin-right: 16px;
}

.hex-byte {
  margin-right: 4px;
}

.ascii-bytes {
  display: flex;
  color: var(--text-secondary, #aaa);
}

.ascii-byte {
  display: inline-block;
  width: 8px; /* fixed width for alignment */
  text-align: center;
}

.highlighted {
  background-color: var(--bg-highlight, rgba(156, 220, 254, 0.3));
  color: #fff;
  border-radius: 2px;
}
</style>
