<template>
    <div>
        <CardBaseCard title="Tambah Kamar">
            <FormBaseForm @submit="handleSubmit">
                <InputBaseInput v-model="formData.name" label="Nama Kamar" placeholder="Masukkan Nama Kamar" />
                <InputBaseInput v-model="formData.type" label="Tipe Kamar" placeholder="Masukkan Tipe Kamar" />
                <InputBaseInput v-model="formData.view" label="View Kamar" placeholder="Masukkan View Kamar" />
                <InputBaseInput v-model="formData.floor" label="Lantai Kamar" placeholder="Masukkan Lantai Kamar" />
                <InputBaseInput v-model="formData.floor" label="Properti Kamar" placeholder="Masukkan Properti Kamar" />
                <InputBaseInput v-model="formData.floor" label="Ukuran Kamar" placeholder="Masukkan Ukuran Kamar" />
                <InputBaseInput v-model="formData.floor" label="Defaul Harga Kamar" placeholder="Masukkan Defaul Harga Kamar" />
                <InputBaseUpload label="Foto Kamar" id="fileUpload" @fileSelected="handleFile" />
                <ButtonBaseButton type="submit" variant="primary">Submit</ButtonBaseButton>
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
</script>
