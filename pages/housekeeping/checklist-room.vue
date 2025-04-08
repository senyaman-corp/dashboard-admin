<template>
    <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Checklist Room</h3>
      <NuxtLink :to="'/housekeeping/add-check-list'" class="btn btn-primary" variant="primary">Tambah</NuxtLink>
    </div>
    
    <div class="table-responsive mt-3 min-vh-65">
      <DataTable
        class="table table-striped table-bordered"
        :columns="columns"
        :options="options"
        style="width: 100%"
        ref="table"
      >
      <template #column-6="props">
          <a class="dropdown-toggle btn btn-default" data-bs-toggle="dropdown" data-target="#dropdown" aria-haspopup="true" aria-expanded="false">Aksi</a>
          <ul id="dropdown" class="dropdown-menu p-2" aria-labelledby="dropdown">
              <li class="dropdown-item">
              <a type="button" class="btn btn-default" @click="deleteList(props.rowData.id)">
                  <i class="fas fa-trash-alt me-2"></i>Delete</a>
              </li>
              <li class="dropdown-item">
              <a type="button" class="btn btn-default" @click="viewDetail(props.rowData.id)">
                  <i class="fas fa-info-circle me-2"></i>Detail
              </a>
              </li>
          </ul>
      </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
import { useNavigatorStore } from "~/stores/navigator";
const navStore = useNavigatorStore();
const authStore = useAuthStore();
const { $bus,$dataTableOptions,$swal } = useNuxtApp();
navStore.setPage("Housekeeping");
navStore.setSubpage("Checklist Room");
const config = useRuntimeConfig();
const router = useRouter();
const columns = ref([
  { title: "Room Name", data: "name" },
  { title: "Room Number", data: "room_number" },
  { title: "Tanggal", data: "tanggal" },
  { title: "Housekeeper", data: "housekeeper" },
  { title: "Supervisor", data: "supervisor" },
  { title: "Verified At", data: "verified_at" },
  { title: "Action", data: "id" },
]);
const options = $dataTableOptions(config.public.baseUrl + 'housekeeping/checklist-room', authStore.getToken);
options.columnDefs = [
  { targets:[0],className:'text-start'},
  { targets:[6],className:'text-end'},
];
const deleteList = async (id) => {
  $swal.fire({
        title:'Hapus Checklist',
        text:'Yakin akan menghapus room checklist ini?',
        icon:'error',
        showCancelButton:true
    }).then(async (result) => {
        if (result.isConfirmed) {
          const { data, status } = await $fetch(`${config.public.baseUrl}housekeeping/delete-check-list`, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + authStore.getToken,
            },
            body: {
              id: id,
            },
          });
          if (status == 1) {
            if (dt !== undefined) {
              dt.ajax.reload();
            }
          }
        }
    })
  };
const viewDetail = async (id) => {
  router.push("/housekeeping/detail/" + id);
};
let dt;
const table = ref();
onMounted(() => {
  $bus.$emit("pagechange", { page: "Housekeeping", subpage: "Checklist Room" });
  const user = authStore.getUser;
  nextTick().then(() => {
    dt = table.value.dt;
  })
});
</script>

<style>

</style>