<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Booking</h3>
      <div>
        <ButtonBaseButton variant="primary" to="/booking/add-booking" class="mx-3">Tambah Booking</ButtonBaseButton>
      </div>
    </div>
    <div class="mt-3">
      <div class="table-responsive">
        <DataTable
          class="table table-striped table-bordered"
          :columns="columns"
          :data="bookings"
          style="width:100%"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {useBookingStore} from "@/stores/booking";
import { useAuthStore } from "~/stores/auth";
const config = useRuntimeConfig();
const bookingStore = useBookingStore();
const authStore = useAuthStore();
const {$bus} = useNuxtApp();

// const { data, status, statusCode} = await $fetch(`${config.public.baseUrl}bookings/list`,{
//   method:'POST',
//   lazy: true,
//   headers:{
//     'Authorization':'Bearer ' + authStore.getToken
//   }
// })

// if(status == 1){
//   bookingStore.setBooking(data);
// }else{
//   if(statusCode == 403){
//     //redirect login;
//   }
// }
const bookings = ref([]);
const columns = ref([
  { title: "Name Customer", data: "name" },
  { title: "No Telephone", data: "no_telp" },
  { title: "Total", data: "total_price" },
  { title: "Deposit", data: "deposit" },
]);

const fetchBookings = async () => {
  try {
    const response = await fetch(`${config.public.baseUrl}bookings/list`, {
      lazy: true,
      method: "POST",
      headers: {
        Authorization: "Bearer " + authStore.getToken
      }
    });

    if (!response.ok) throw new Error("Failed to fetch users");

    const result = await response.json();
    bookings.value = result.data; 
    bookingStore.setBooking(result.data);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

onMounted(() => {
  $bus.$emit('pagechange',{page:'Booking',subpage:'Index Booking'})
  fetchBookings();
});

definePageMeta({
  middleware: ["auth"]
})
</script>