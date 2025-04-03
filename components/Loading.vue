<template>
  <div v-if="isLoading" class="loading-overlay">
    <p>Loading...</p>
    <img src="@/assets/images/loading.gif" alt="Loading..." />
  </div>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
  isLoading: Boolean
});

watch(() => props.isLoading, (newVal) => {
  console.log('Loading.vue received isLoading:', newVal);
});
</script>

<style>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>