<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <select class="form-select" :id="id" v-model="selectedValue">
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  id: { type: String },
  label: { type: String, default: "Select Option" },
  options: { type: Array, required: true },
  modelValue: { type: String, default: "" },
});

const selectedValue = ref(
 props.options.find((opt) => opt.value === props.modelValue) || null
);
const emit = defineEmits(["update:modelValue"]);
//const model = defineModel();
</script>
