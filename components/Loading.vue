<template>
  <Transition name="fade">
    <div v-if="show" class="loading-overlay">
      <img :src="loadingGif" alt="Loading..." class="w-20 h-20" />
    </div>
  </Transition>
</template>

<script setup>
import loadingGif from "@/assets/images/loading.gif";
const show = useState("loading");
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
