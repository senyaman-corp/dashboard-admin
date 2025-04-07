<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Booking</h3>
      <div>
        <ButtonBaseButton
          variant="primary"
          to="/booking/add-booking"
          class="mx-3"
          >Tambah Booking</ButtonBaseButton
        >
      </div>
    </div>
    <div class="mt-3">
      <div class="table-responsive">
        <client-only>
          <DataTable
            class="table table-striped table-bordered"
            :columns="columns"
            :data="bookings"
            style="width: 100%"
          />
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBookingStore } from "@/stores/booking";
import { useAuthStore } from "~/stores/auth";
const config = useRuntimeConfig();
const bookingStore = useBookingStore();
const authStore = useAuthStore();
const navStore = useNavigatorStore();
const { $bus } = useNuxtApp();
navStore.setPage("Booking");
navStore.setSubpage("Index Booking");

const bookings = ref([]);
const totalRecords = ref(0);
const columns = ref([
  { title: "Guest Name", data: "name" },
  { title: "No Telp", data: "no_telp" },
  { title: "Created", data: "created_at" },
  { title: "Sub Total", data: "subtotal" },
  { title: "Discount", data: "discount" },
  { title: "Tax", data: "taxamount" },
  { title: "Deposit", data: "deposit" },
  { title: "Total", data: "total_price" },
]);

  const {data,status }  = await $fetch(`${config.public.baseUrl}bookings/list`, {
    lazy: true,
    method: "POST",
    headers: {
      Authorization: "Bearer " + authStore.getToken,
    },
    
  },{ initialCache: false });
  if (status == 1){
    bookings.value = data.data;
    bookingStore.setBooking(data);
    totalRecords.value = data.record_total;
  }


onMounted(() => {
  $bus.$emit("pagechange", { page: "Booking", subpage: "Index Booking" });
});

definePageMeta({
  middleware: ["auth"],
});
</script>
