<template>
    <div>
        <CardBaseCard title="Tambah Properti">
            <FormBaseForm @submit="handleSubmit">
                <InputBaseInput v-model="formData.name" label="Nama Properti" placeholder="Masukkan Nama Properti" />
                <InputBaseInput v-model="formData.type" label="Tipe Properti" placeholder="Masukkan Tipe Properti" />
                <InputBaseInput v-model="formData.quantity" type="Number" label="Jumlah Properti" placeholder="Masukkan Jumlah Properti" />
                <InputBaseUpload label="Foto Properti" id="fileUpload" @fileSelected="handleFile" />
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
onMounted(() => {
  $bus.$emit('pagechange',{page:'Room',subpage:'Add Property'})
  });
definePageMeta({
    middleware: ["auth"]
  })
</script>
