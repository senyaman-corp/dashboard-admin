<template>
  <div class="mb-3">
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <input
      :type="type"
      :id="id"
      class="form-control form-control-lg"
      v-model="model"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
    />
    <div v-if="error" class="text-danger mt-1">{{ error }}</div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  id: String,
  type: { type: String, default: "text" },
  placeholder: String,
  disabled: Boolean,
  error: String,
  required: {type:Boolean,default:false}
});

defineEmits(["update:modelValue"]);
const model = defineModel();
</script>