<template>
  <div class="card min-vh-65">
    <div class="card-body">
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
              style="width: 100%"
              :options="options"
              ref="table"
            >
            <template #column-8="props">
                <a class="dropdown-toggle btn btn-default" data-bs-toggle="dropdown" data-target="#dropdown" aria-haspopup="true" aria-expanded="false">Aksi</a>
                <ul id="dropdown" class="dropdown-menu p-2" aria-labelledby="dropdown">
                    <li class="dropdown-item">
                      <a type="button" class="btn btn-default" @click="deleteBooking(props.rowData.id)">
                        <i class="fas fa-trash-alt me-2"></i>Delete
                      </a>
                    </li>
                    <li class="dropdown-item">
                      <a type="button" class="btn btn-default" @click="viewDetail(props.rowData.id)">
                          <i class="fas fa-info-circle me-2"></i>Detail
                      </a>
                    </li>
                    <li class="dropdown-item">
                      <button class="btn btn-default" target="_blank" @click="checkout(props.rowData.id_booking_room)">
                        <i class="fas fa-luggage-cart me-2"></i>Checkout
                      </button>
                    </li>
                </ul>
            </template>
            </DataTable>
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBookingStore } from "@/stores/booking";
import { useAuthStore } from "~/stores/auth";
const config = useRuntimeConfig();
const authStore = useAuthStore();
const navStore = useNavigatorStore();
const { $bus, $dataTableOptions,$formatDateTime } = useNuxtApp();
navStore.setPage("Booking");
navStore.setSubpage("Index Booking");
const router = useRouter();
const columns = ref([
  { title: "Guest Name", data: "name" },
  { title: "No Telp", data: "no_telp" },
  { title: "Unit", data: "room_number" },
  { title: "Type", data: "room_type" },
  { title: "View", data: "room_view" },
  { title: "Checkin", data: "checkin_date" },
  { title: "Checkout", data: "checkout_date" },
  { title: "Package", data: "booking_package" },
  { title: "Action", data: "id" },

]);
const options = $dataTableOptions(config.public.baseUrl + 'bookings/list', authStore.getToken);
options.columnDefs = [
  { targets:[0],className:'text-start'},
  { targets:[8],className:'text-end'},
  { targets:[5,6],className:'text-end',render:(data,type)=>{
    if(type ==='sort'){
        return data;
    }
    return $formatDateTime(data);
  }}
];
const checkout = async (id)=>{
  router.push('/booking/checkout?booking_id='+id);
}

let dt;
const table = ref();
onMounted(() => {
  $bus.$emit("pagechange", { page: "Booking", subpage: "Index Booking" });
  nextTick().then(() => {
    dt = table.value.dt;
  })
});

definePageMeta({
  middleware: ["auth"],
});
</script>
