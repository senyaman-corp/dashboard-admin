<template>
  <div class="mb-3">
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <input
      ref="input"
      :id="id"
      :placeholder="placeholder"
      class="form-control"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import AutoNumeric from "autonumeric";

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  id: String,
  placeholder: String,
  options: Object,
});

const emit = defineEmits(["update:modelValue"]);
const input = ref(null);
let autoNumericInstance = null;

onMounted(() => {
  autoNumericInstance = new AutoNumeric(input.value, props.modelValue || 0, {
    digitGroupSeparator: ".",
    decimalCharacter: ",",
    decimalPlaces: 2,
    currencySymbol: "Rp ",
    currencySymbolPlacement: "p",
    watchExternalChanges: true,
    modifyValueOnWheel: false,
    ...props.options,
  });

  input.value.addEventListener("input", () => {
    emit("update:modelValue", autoNumericInstance.getNumber());
  });
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (autoNumericInstance && newValue !== autoNumericInstance.getNumber()) {
      autoNumericInstance.set(newValue);
    }
  }
);

onBeforeUnmount(() => {
  if (autoNumericInstance) {
    autoNumericInstance.remove();
  }
});
</script>
