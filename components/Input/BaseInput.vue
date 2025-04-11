<template>
  <div class="mb-3">
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <input
      :type="type"
      :id="id"
      class="form-control"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="modelValue"
      :required="required"
      @input="$emit('update:modelValue', $event.target.value)"
      autocomplete="off"
      :list="list ? 'vendorList' : ''"
    />
    <datalist v-if="list" id="vendorList">
      <option v-for="item in list" :key="item">{{ item }}</option>
    </datalist>
    <div v-if="error" class="text-danger mt-1">{{ error }}</div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  id: String,
  type: { type: String, default: "text" },
  placeholder: String,
  disabled: Boolean,
  error: String,
  required: { type: Boolean, default: false },
  list:{ type: Array }
});

defineEmits(["update:modelValue"]);
</script>
