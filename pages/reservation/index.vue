<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Reservasi</h3>
      <div>
        <ButtonBaseButton
          variant="primary"
          to="/reservation/add-reservation"
          class="mx-3"
          >Tambah Reservasi</ButtonBaseButton
        >
      </div>
    </div>
    <div class="table-responsive">
      <client-only>
        <DataTable
          class="table table-striped table-bordered"
          :columns="columns"
          :data="reservation"
          style="width: 100%"
        />
      </client-only>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
const { $bus } = useNuxtApp();
const authStore = useAuthStore();
const config = useRuntimeConfig();

const reservation = ref([]);
const columns = ref([
  { title: "Guest Name", data: "customer_name" },
  { title: "No Telp", data: "phone_number" },
  { title: "Checkin", data: "tanggal_checkin" },
  { title: "Checkout", data: "tanggal_checkout" },
  { title: "Durasi", data: "duration" },
  { title: "Created", data: "created_at" },
  { title: "Action", data: "id" },
]);

const fetchReservation = async () => {
  try {
    const response = await fetch(`${config.public.baseUrl}reservations/list`, {
      lazy: true,
      method: "POST",
      headers: {
        Authorization: "Bearer " + authStore.getToken,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch users");

    const result = await response.json();
    reservation.value = result.data;
  } catch (error) {
    console.error("Error fetching reservation:", error);
  }
};

onMounted(() => {
  fetchReservation();
  $bus.$emit("pagechange", {
    page: "Reservation",
    subpage: "Index Reservation",
  });
});

definePageMeta({
  middleware: ["auth"],
});
</script>
