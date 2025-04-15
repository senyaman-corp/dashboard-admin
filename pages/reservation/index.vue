<template>
  <div class="card">
  <div class="card-body p-3 p-sm-4">
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Reservasi</h3>
      <div>
        <ButtonBaseButton
          variant="primary"
          to="/reservation/add-reservation"
          class="btn-md"
          >Tambah</ButtonBaseButton
        >
      </div>
    </div>
    <div class="table-responsive">
      <client-only>
        <DataTable
          class="table table-striped table-bordered"
          :columns="columns"
          :options="options"
          style="width: 100%"
        >
        <template #column-6="props">
              <a class="dropdown-toggle btn btn-default" data-bs-toggle="dropdown" data-target="#dropdown" aria-haspopup="true" aria-expanded="false">Aksi</a>
              <ul id="dropdown" class="dropdown-menu p-2" aria-labelledby="dropdown">
                  <li class="dropdown-item">
                    <a type="button" class="btn btn-default" @click="deleteReservation(props.rowData.id)">
                      <i class="fas fa-trash-alt me-2"></i>Delete
                    </a>
                  </li>
                  <li class="dropdown-item">
                    <a type="button" class="btn btn-default" @click="viewDetail(props.rowData.id)">
                        <i class="fas fa-info-circle me-2"></i>Detail
                    </a>
                  </li>
                 
                  <li class="dropdown-item">
                    <button class="btn btn-default" target="_blank" @click="booking(props.rowData.id_booking_room)">
                      <i class="fas fa-luggage-cart me-2"></i>Booking
                    </button>
                  </li>
              </ul>
          </template>
        </DataTable>
      </client-only>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
const { $bus,$dataTableOptions,$moment } = useNuxtApp();
const navStore = useNavigatorStore();
navStore.setPage("Reservation");
navStore.setSubpage("Index Reservation");
const authStore = useAuthStore();
const config = useRuntimeConfig();

const options = $dataTableOptions(config.public.baseUrl + 'reservations/list', authStore.getToken);
options.columnDefs = [
  { targets:[6], render: (data, type, row, meta) =>{
    return '';
  },className: 'text-end'},
  { targets:[5], render: (data, type, row, meta) =>{
    return $moment(data).format('DD MMMM YYYY');
  }},
]
const columns = ref([
  { title: "Guest Name", data: "customer_name" },
  { title: "No Telp", data: "phone_number" },
  { title: "Checkin", data: "tanggal_checkin" },
  { title: "Checkout", data: "tanggal_checkout" },
  { title: "Durasi", data: "duration" },
  { title: "Created", data: "created_at" },
  { title: "Action", data: "id" },
]);

const deleteReservation = async (id) => {

}
const viewDetail = async (id) => {
}
const booking = async (id) => {
  navigateTo('/booking/add-booking?reservation_id='+id);
}

onMounted(() => {
  $bus.$emit("pagechange", {
    page: "Reservation",
    subpage: "Index Reservation",
  });
});

definePageMeta({
  middleware: ["auth"],
});
</script>
