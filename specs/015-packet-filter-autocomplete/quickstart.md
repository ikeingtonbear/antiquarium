# Quickstart: Packet Filter Autocomplete

## Getting Started

1. Include the `FilterBar.vue` component in your view:
```vue
<template>
  <div>
    <FilterBar :sessionId="currentSessionId" @apply="handleApplyFilter" />
  </div>
</template>

<script setup lang="ts">
import FilterBar from '@/components/FilterBar.vue';

// Define the handler
const handleApplyFilter = (filter: string) => {
  // Apply the filter to the data table
  packetTable.setFilter(filter);
};
</script>
```

2. The `FilterBar` automatically handles:
- Fetching and displaying autocomplete suggestions.
- Keyboard and mouse navigation of the suggestion dropdown.
- Preventing invalid filters from being applied.
- Triggering the `apply` event only when appropriate.
