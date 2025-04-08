<template>
  <div class="mb-3" id="multiselect-style">
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <Multiselect
      v-model="selectedValue"
      :options="options"
      :searchable="searchable"
      :multiple="multiple"
      :close-on-select="!multiple"
      :clear-on-select="false"
      :allow-empty="!required"
      track-by="value"
      label="label"
      class="form-control"
      :placeholder="placeholder"
      @update:modelValue="updateValue"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";

const props = defineProps({
  modelValue: [String, Number, Array, Object],
  options: { type: Array, required: true },
  label: String,
  id: String,
  multiple: Boolean,
  searchable: { type: Boolean, default: true },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: "Pilih opsi" },
});

const emit = defineEmits(["update:modelValue"]);

const selectedValue = ref(
  props.multiple
    ? props.options.filter((opt) => props.modelValue.includes(opt.value))
    : props.options.find((opt) => opt.value === props.modelValue) || null
);

const updateValue = (value) => {
  if (Array.isArray(value)) {
    emit(
      "update:modelValue",
      value.map((item) => item.value)
    );
  } else {
    emit("update:modelValue", value?.value || "");
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = props.multiple
      ? props.options.filter((opt) => newValue.includes(opt.value))
      : props.options.find((opt) => opt.value === newValue) || null;
  },
  { immediate: true }
);
</script>
<style>
#multiselect-style .multiselect {
  min-height: 18px !important;
}
#multiselect-style .multiselect__tags {
  min-height: 18px !important;
  padding: 0 !important;
  border-radius: 0 !important;
  border: 0 !important;
  background: 0 !important;
}
#multiselect-style .multiselect__input,
.multiselect__single {
  border-radius: 0 !important;
  background: 0 !important;
  font-size: 0.8rem !important;
}
#multiselect-style span {
  margin-bottom: 0px !important;
}
.multiselect{
  padding-left:0 !important;
  padding-right:0 !important;
}
.multiselect__placeholder,.multiselect__input{
  padding-left:.5rem !important;
  padding-right:.5rem !important;
}
</style>