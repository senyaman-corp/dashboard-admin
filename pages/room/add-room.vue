<template>
    <div>
        <CardBaseCard title="Tambah Kamar">
            <FormBaseForm @submit="handleSubmit">
                <InputBaseInput v-model="formData.room_number" label="Nomor Kamar" placeholder="Masukkan Nomor Kamar" />
                <InputBaseInput v-model="formData.name" label="Nama Kamar" placeholder="Masukkan Nama Kamar" />
                <InputWithCombobox v-model="formData.type" :options="['Deluxe','Studio']" label="Tipe Kamar" :id="'type'"  />
                <InputWithCombobox v-model="formData.view" :options="['Mountain','City']" label="View Kamar" placeholder="Masukkan View Kamar" :id="'view'" />
                <InputBaseInput v-model="formData.floor_number" label="Lantai Kamar" placeholder="Masukkan Lantai Kamar" />
                <!-- <InputBaseInput v-model="formData.floor" label="Properti Kamar" placeholder="Masukkan Properti Kamar" /> -->
                <InputBaseInput v-model="formData.size" label="Ukuran Kamar" placeholder="Masukkan Ukuran Kamar" />
                <InputBaseInput v-model="formData.default_price" label="Default Harga Kamar" placeholder="Masukkan Defaul Harga Kamar" />
                <NuxtImg :src="fotoKtp" class="foto-ktp"></NuxtImg>
                <InputBaseUpload label="Foto Kamar" id="fileUpload" @fileSelected="handleFile" accept=".jpg,.jpeg,.png"/>
                <ButtonBaseButton type="submit" variant="primary">Submit</ButtonBaseButton>
            </FormBaseForm>
        </CardBaseCard>
    </div>
</template>

<script setup>
const { $bus,$readInputFile} = useNuxtApp();
import { ref } from "vue";

const formData = ref({
  room_number:'',
  name: "",
  type:'',
  view:'',
  floor_number:'',
  status:'',
  default_price:'',
  size:'',
  description: "",
  username_wifi:'',
  password_wifi:'',
  file: null,
});
const fotoKtp = ref(null);
const submittedData = ref({
  name: "",
  description: "",
  file: null,
});

const handleFile = (file) => {
  console.log(file)
  formData.value.file = file;
  var reader = new FileReader();
  reader.onload = function (e) {
    fotoKtp.value = e.target.result;
    console.log(e.target.result);
  }
  reader.readAsDataURL(file);
};

const handleSubmit = () => {
  submittedData.value = { ...formData.value };
  console.log(submittedData.value)
};
onMounted(() => {
  $bus.$emit('pagechange',{page:'Room',subpage:'Add Room'})
  });
definePageMeta({
    middleware: ["auth"]
  })
</script>
