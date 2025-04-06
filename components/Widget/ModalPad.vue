<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    role="dialog"
    v-if="isWarningVisible"
    @click.self="closeModal"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content border-0 shadow-lg rounded-4">
        <div class="modal-header bg-light border-0 rounded-top-4">
          <h5 class="modal-title fw-bold text-success">
            <i class="bi bi-info-circle-fill me-2"></i> Room Detail
          </h5>
          <button type="button" class="btn-close" @click="closeModal" />
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const isWarningVisible = ref(false);
const { $bus } = useNuxtApp();

const closeModal = () => {
  isWarningVisible.value = false;
};

onMounted(() => {
  $bus.$on("openModal", () => {
    isWarningVisible.value = true;
  });
});
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>