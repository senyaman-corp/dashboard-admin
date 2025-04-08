<template>
    <div class="mb-3" id="multiselect-style">
      <label v-if="label" :for="id" class="form-label">{{ label }}</label>
      <Multiselect
        v-model="selectedValue"
        :options="options"
        :searchable="searchable"
        :multiple="multiple"
        :close-on-select="true"
        :clear-on-select="false"
        :allow-empty="!required"
        track-by="value"
        label="label"
        class="form-control"
        placeholder="Pilih opsi"
        @update:modelValue="updateValue"
      >
        <template #singleLabel="props">
          <span class="option__desc"><span class="option__title">{{ props.option.label }}</span></span>
        </template>
        <template #option="props">
          <div class="option__desc">
            <div class="option__title t-bold">{{ props.option.value }}</div>
          </div>
        </template>
      </Multiselect>
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
 
  </style>