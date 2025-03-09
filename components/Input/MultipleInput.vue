<template>
  <div class="mb-3">
    <label class="form-label">{{ label }}</label>
    <div v-for="(value, index) in model" :key="index" class="d-flex gap-2 mb-2">
      <input
        type="text"
        class="form-control"
        v-model="model[index]"
        :placeholder="`Item ${index + 1}`"
      />
      <button type="button" class="btn btn-danger" @click="removeInput(index)">
        &times;
      </button>
    </div>
    <button type="button" class="btn btn-primary mt-2" @click="addInput">
      + Add More
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  label: { type: String, default: "Multiple Inputs" },
  modelValue: { type: Array, default: () => [""] },
});

const emit = defineEmits(["update:modelValue"]);
const model = defineModel();

const addInput = () => {
  model.value.push("");
};

const removeInput = (index) => {
  model.value.splice(index, 1);
};
</script>