<template>
  <div>
    <h1>Hello</h1>
    <CardBaseCard title="Test" class="mt-4">
      <InputDate id="date" v-model="formData.date" label="Pick a Date" />
      <InputWithCombobox id="combo" v-model="formData.combo" :options="['Apple', 'Banana', 'Cherry']" label="Select a Fruit" />
      <InputWithDropdown id="dropdown" v-model="formData.dropdown" :options="['Red', 'Blue', 'Green']" label="Pick a Color" />
      <InputMultipleInput v-model="formData.items" label="Add Items" />
      <hr>
      <ButtonBaseButton variant="success" @click="submit">Button</ButtonBaseButton>
      <ButtonBaseButton variant="primary" to="/room" class="mx-3">Link Button</ButtonBaseButton>
    </CardBaseCard>
  </div>
</template>

<script setup>
import { ref } from "vue";

const formData = ref({
  date: "",
  combo: "",
  dropdown: "",
  items: [""],
});

const submit = () => {
  console.log("Submitted:", formData.value);
};
definePageMeta({
  middleware: ["auth"]
})
</script>
