<template>
  <div>
    <CardBaseCard title="Tambah User Role">
      <FormBaseForm @submit="handleSubmit">
        <InputBaseInput
          v-model="formData.name"
          label="Nama User"
          placeholder="Masukkan Nama User"
        />
        <InputBaseInput
          v-model="formData.type"
          label="Role User"
          placeholder="Masukkan Role User"
        />
        <InputBaseUpload
          label="Foto User"
          id="fileUpload"
          @fileSelected="handleFile"
        />
        <ButtonBaseButton type="submit" variant="primary"
          >Submit</ButtonBaseButton
        >
      </FormBaseForm>
    </CardBaseCard>
  </div>
</template>

<script setup>
import { ref } from "vue";

const formData = ref({
  name: "",
  description: "",
  file: null,
});

const submittedData = ref({
  name: "",
  description: "",
  file: null,
});

const handleFile = (file) => {
  formData.value.file = file;
};

const handleSubmit = () => {
  submittedData.value = { ...formData.value };
};

definePageMeta({
  middleware: ["auth"],
});
</script>
