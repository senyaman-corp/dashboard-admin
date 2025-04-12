<template>
  <div class="card">
    <div v-if="title" class="card-header">
      <h4>{{ title }}</h4>
    </div>
    <div class="card-body p-3 p-sm-4">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: "" },
});
</script>
