<template>
  <div class="card min-vh-65">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h3>Checkout</h3>
        
      </div>
    </div>
</div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
const config = useRuntimeConfig();
const authStore = useAuthStore();
const navStore = useNavigatorStore();
const { $bus, $dataTableOptions,$formatDateTime,$formatUtcDateTime } = useNuxtApp();
navStore.setPage("Booking");
navStore.setSubpage("Index Booking");
const router = useRouter();
const route = useRoute();
const booking_id = route.query.booking_id;
const room_id = route.query.room_id;
const booking = ref();
const initNookingData = async()=>{
  const res = await $fetch(config.public.baseUrl + 'bookings/booking-room-detail',{
    method:'POST',
    headers:{
      'Authorization':'Bearer '+authStore.getToken
    },
    lazy:true,
    body:{
      id:booking_id
    }
  });
  if(res.status == 1){
    booking.value = res.data;
    console.log(booking.value)
  }
}

initNookingData();
onMounted(() => {
   
});
</script>

<style>

</style>