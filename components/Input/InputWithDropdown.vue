<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <select class="form-select" :id="id" >
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  id: { type: String },
  label: { type: String, default: "Select Option" },
  options: { type: Array, required: true },
  modelValue: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);
//const model = defineModel();
</script>