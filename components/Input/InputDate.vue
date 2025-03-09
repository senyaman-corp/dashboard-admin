<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      type="date"
      :id="id"
      class="form-control"
      v-model="model"
    />
  </div>
</template>

<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, default: "Select Date" },
  modelValue: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);
const model = defineModel();
</script>