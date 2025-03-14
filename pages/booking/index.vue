<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Booking</h3>
      <div>
        <!-- <ButtonBaseButton variant="primary" to="/booking/add-booking" class="mx-3">Tambah Booking</ButtonBaseButton> -->
      </div>
    </div>
    <div class="mt-3">
      <DataTables />
    </div>
  </div>
</template>

<script setup>
import DataTables from "@/components/Table/DataTables.vue";
import {useBookingStore} from "@/stores/booking";
import { useAuthStore } from "~/stores/auth";
const config = useRuntimeConfig();
const bookingStore = useBookingStore();
const authStore = useAuthStore();
const {$bus} = useNuxtApp();
const { data, status, statusCode} = await $fetch(`${config.public.baseUrl}bookings/list`,{
            method:'POST',
            lazy: true,
            headers:{
              'Authorization':'Bearer ' + authStore.getToken
            }
        })
  if(status == 1){
    bookingStore.setBooking(data);
  }else{
    if(statusCode == 403){
      //redirect login;
    }
  }

  onMounted(() => {
    $bus.$emit('pagechange',{page:'Booking',subpage:'Index Booking'})
  });
  definePageMeta({
    middleware: ["auth"]
  })
</script>