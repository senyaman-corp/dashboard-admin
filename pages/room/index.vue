<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Kamar</h3>
      <div>
        <ButtonBaseButton variant="primary" to="/room/add-room" class="mx-3">Tambah Kamar</ButtonBaseButton>
      </div>
    </div>
    <div class="mt-3">
      <DataTables />
    </div>
  </div>
</template>

<script setup>
import DataTables from "@/components/Table/DataTables.vue";

import { useAuthStore } from "~/stores/auth";
import { useNavigatorStore } from "~/stores/navigator";
const navStore = useNavigatorStore();
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

  onMounted(() => {
    navStore.setPage("Room");
    navStore.setSubpage("Index Room");
  });

  definePageMeta({
    middleware: ["auth"]
  })
</script>