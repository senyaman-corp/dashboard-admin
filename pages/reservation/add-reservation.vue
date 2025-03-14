<template>
    <div>
        <CardBaseCard title="Tambah Reservasi">
            <FormBaseForm @submit="handleSubmit">
                <InputBaseInput v-model="formData.name" label="Nama Customer" placeholder="Masukkan Nama Customer" />
                <InputBaseInput v-model="formData.type" label="Jenis Kelamin" placeholder="Masukkan Jenis Kelamin" />
                <InputBaseInput v-model="formData.floor" label="Nomor Telephone" placeholder="Masukkan Nomor Telephone" />
                <InputBaseInput v-model="formData.floor" type="email" label="Email" placeholder="Masukkan Email" />
                <InputBaseInput v-model="formData.floor" type="number" label="Usia" placeholder="Masukkan Usia" />
                <InputBaseTextArea v-model="formData.view" label="Alamat" placeholder="Masukkan Alamat" />
                <hr>
                <InputBaseInput v-model="formData.floor" label="Tanggal Checkin" placeholder="Masukkan Tanggal Checkin" />
                <InputBaseInput v-model="formData.floor" label="Tanggal Checkout" placeholder="Masukkan Tanggal Checkout" />
                <InputBaseInput v-model="formData.floor" label="Durasi Menginap" placeholder="Masukkan Durasi Menginap" />
                <InputBaseInput v-model="formData.floor" label="Rekomendasi Dari" placeholder="Masukkan Rekomendasi Dari" />
                <InputBaseInput v-model="formData.floor" label="Catatan" placeholder="Masukkan Catatan" />
                <InputBaseUpload label="Foto KTP" id="fileUpload" @fileSelected="handleFile" />
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
definePageMeta({
    middleware: ["auth"]
  })
</script>
