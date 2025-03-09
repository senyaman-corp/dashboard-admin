<template>
    <div>
        <CardBaseCard title="Tambah Harga">
            <FormBaseForm @submit="handleSubmit">
                <InputBaseInput v-model="formData.name" label="Nama Harga" placeholder="Masukkan Nama Harga" />
                <InputBaseInput v-model="formData.default_price" type="Number" label="Harga Default" placeholder="Masukkan Harga Default" />
                <InputBaseInput v-model="formData.discount" type="Number" label="Harga Diskon" placeholder="Masukkan Harga Diskon" />
                <InputBaseInput v-model="formData.total_price" type="Number" label="Total Harga" placeholder="Masukkan Total Harga" />
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
