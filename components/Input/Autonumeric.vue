<template>
  <div class="mb-3">
    <label v-if="label" :for="id" class="form-label" :class="{'t-required': required }">{{ label }}</label>
    <input
      ref="input"
      :id="id"
      :placeholder="placeholder"
      class="form-control"
      :required="required"
      :disabled="disabled"
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
  currencySymbol: String,
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  flex: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);
const input = ref(null);
let autoNumericInstance = null;

onMounted(() => {
  autoNumericInstance = new AutoNumeric(input.value, props.modelValue || 0, {
    digitGroupSeparator: ".",
    decimalCharacter: ",",
    decimalPlaces: 0,
    currencySymbol: props.currencySymbol ? props.currencySymbol : "Rp ",
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
