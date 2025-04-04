<template>
  <div class="mb-3">
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <input
      type="file"
      :id="id"
      class="form-control"
      @change="handleFileUpload"
      :disabled="disabled"
      :accept="accept"
    />
    <div v-if="error" class="text-danger mt-1">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  label: String,
  id: String,
  disabled: Boolean,
  error: String,
  accept: String,
});

const emit = defineEmits(["fileSelected"]);
const file = ref(null);

const handleFileUpload = (event) => {
  file.value = event.target.files[0];
  emit("fileSelected", file.value);
};
</script>
