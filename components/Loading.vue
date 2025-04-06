<template>
  <div v-show="isLoading" class="loading-overlay">
    <div class="text-center">
      <p>Loading...</p>
      <img src="@/assets/images/loading.gif" alt="Loading..." />
    </div>
  </div>
</template>

<script setup>
import { watch } from "vue";
const { $bus } = useNuxtApp();

const isLoading = ref(false);

onMounted(() => {
  $bus.$on("loading", (loading) => {
    isLoading.value = loading;
  });
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
