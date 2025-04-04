<template>
  <div class="mb-3">
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <textarea
      :id="id"
      class="form-control"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
    <div v-if="error" class="text-danger mt-1">{{ error }}</div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  id: String,
  rows: { type: Number, default: 3 },
  placeholder: String,
  disabled: Boolean,
  error: String,
});

defineEmits(["update:modelValue"]);
</script>
