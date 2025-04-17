<template>
  <div class="mb-3" id="multiselect-style">
    <label v-if="label" :for="id" class="form-label" :class="{'t-required': required }">{{ label }}</label>
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
      placeholder="Pilih opsi"
      @update:modelValue="updateValue"
    >
      <template #singleLabel="props">
        <span class="option__desc"
          ><span class="option__title">{{ props.option.label }}</span></span
        >
      </template>
      <template #option="props">
        <div class="">
          <div class="option__title mb-2 t-bold">{{ props.option.room_number + '-' + props.option.name }}</div>
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
    props.options.find((opt) => opt.value === props.modelValue) || null
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
      selectedValue.value = props.options.find((opt) => opt.value === newValue) || null;
    },
    { immediate: true }
  );
</script>
<style></style>
