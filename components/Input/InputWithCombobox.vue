<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      type="text"
      class="form-control"
      :id="id"
      v-model="searchTerm"
      @input="filterOptions"
      placeholder="Search..."
    />
    <select class="form-select mt-2" v-model="model">
      <option v-for="option in filteredOptions" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, default: "Select Option" },
  options: { type: Array, required: true },
  modelValue: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);
const model = defineModel();
const searchTerm = ref("");

const filteredOptions = computed(() => {
  return props.options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});
</script>