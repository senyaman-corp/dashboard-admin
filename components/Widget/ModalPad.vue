<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    role="dialog"
    v-if="isWarningVisible"
    @click.self="closeModal"
  >
    <div class="modal-dialog modal-dialog-centered" :class="size" role="document">
      <div class="modal-content border-0 shadow-lg rounded-4">
        <div class="modal-header bg-light border-0 rounded-top-4">
          <h5 class="modal-title fw-bold text-success">
            <i class="bi bi-info-circle-fill me-2"></i> {{ title || 'Room Detail' }}
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
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "modal-md",
  },
  modalId: {
    type: String,
    required: true,
  },
})
const isWarningVisible = ref(false);
const { $bus } = useNuxtApp();

const closeModal = () => {
  isWarningVisible.value = false;
};

onMounted(() => {
  // $bus.$on("openModal", () => {
  //   isWarningVisible.value = true;
  // });
  // $bus.$on("closeModal", () => {
  //   isWarningVisible.value = false;
  // });
  $bus.$on("openModal", (payload) => {
    if (payload?.id === props.modalId) {
      isWarningVisible.value = true;
    }
  });

  $bus.$on("closeModal", (payload) => {
    if (payload?.id === props.modalId) {
      isWarningVisible.value = false;
    }
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