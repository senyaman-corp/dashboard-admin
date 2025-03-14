<template>
  <div>
        <CardBaseCard title="Tambah Booking">
            <FormBaseForm @submit="handleSubmit">
                <InputBaseInput v-model="name" label="Nama Lengkap" placeholder="Masukkan Nama Tamu" />
                <InputBaseInput v-model="no_telp" label="Nomor Telepon" placeholder="Masukkan No Telepon" />
                <InputBaseUpload v-model="ktp" label="Foto KTP" :accept="'.jpg,.jpeg,.png'" />
                <!-- 
                <InputBaseInput v-model="formData.floor" label="Lantai Kamar" placeholder="Masukkan Lantai Kamar" />
                <InputBaseInput v-model="formData.floor" label="Properti Kamar" placeholder="Masukkan Properti Kamar" />
                <InputBaseInput v-model="formData.floor" label="Ukuran Kamar" placeholder="Masukkan Ukuran Kamar" />
                <InputBaseInput v-model="formData.floor" label="Defaul Harga Kamar" placeholder="Masukkan Defaul Harga Kamar" />
                <InputBaseUpload label="Foto Kamar" id="fileUpload" @fileSelected="handleFile" />
                 -->
                <ButtonBaseButton type="submit" variant="primary">Submit</ButtonBaseButton>
            </FormBaseForm>
        </CardBaseCard>
    </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
const config = useRuntimeConfig();
const authStore = useAuthStore();
const rooms = ref([]);
const { data, status, statusCode} = await $fetch(`${config.public.baseUrl}rooms/list`,{
            method:'POST',
            lazy: true,
            headers:{
              'Authorization':'Bearer ' + authStore.getToken
            },
            body:{
                date:new Date('Y-m-d')
            }
        });
        console.log("Rooms",data)
  if(status == 1){
    rooms.value = data ;
    console.log("Rooms",rooms.value)
  }else{
    if(statusCode == 403){
      //redirect login;
    }
  }
  definePageMeta({
    middleware: ["auth"]
  })
</script>

<style>

</style>