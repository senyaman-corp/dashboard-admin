<template>
   <div class="modal-overlay" v-show="isWarningVisible" @click="closeModal" ref="warning">
        <div class="modal-content-1" @click.stop>
          <div class="d-flex justify-content-center">
            <div class="page w-100">
              <div class="card card-radius">
                <div class="card-body">
                  <slot></slot>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
</template>

<script setup>
    const isVisible = ref(false)
    const isWarningVisible = ref(false)
    const { $bus } = useNuxtApp()
    
    const closeModal = () => {
        isVisible.value = false
        isWarningVisible.value = false;
    }
    onMounted(() => {
        $bus.$on('openModal', () => {
            isVisible.value = true
            isWarningVisible.value = true;
        })
    })
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content-1 {
    background: white;
    padding: 8px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin: 1rem;
    min-width:20rem;
}
</style>