<template>
  <div class="card min-vh-65">
    <div class="card-body">
        <h3>Checkout</h3>
        <div class="row">
          <div class="col-md-4">
            <div class="h4 t-bold">Guest</div>
            <div class="form-group">
              <label class="t-bold">Name</label>
              <div>{{booking.booking ? booking.booking.guest ? booking.booking.guest.name : '' : ''}}</div>
            </div>
            <div class="form-group">
              <label class="t-bold">Telp</label>
              <div>{{booking.booking ? booking.booking.guest ? booking.booking.guest.no_telp : '' : ''}}</div>
            </div>
             
          </div>
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
console.log(booking_id);
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
  $bus.$emit("pagechange", { page: "Booking", subpage: "Index Booking" });
});
definePageMeta({
  middleware: ["auth"],
});
</script>

<style>

</style>