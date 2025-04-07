<template>
    <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Checklist Room</h3>
      <NuxtLink :to="'/housekeeping/add-check-list'" class="btn btn-primary" variant="primary">Tambah</NuxtLink>
    </div>
    
    <div class="table-responsive">
      <DataTable
        class="table table-striped table-bordered"
        :columns="columns"
        :data="checklistRooms"
        style="width: 100%"
      />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
import { useNavigatorStore } from "~/stores/navigator";
const navStore = useNavigatorStore();
const authStore = useAuthStore();
const { $bus } = useNuxtApp();
navStore.setPage("Housekeeping");
navStore.setSubpage("Checklist Room");
const config = useRuntimeConfig();
const columns = ref([
  { title: "Room Name", data: "name" },
  { title: "Room Number", data: "room_number" },
  { title: "Tanggal", data: "tanggal" },
  { title: "Housekeeper", data: "housekeeper" },
  { title: "Supervisor", data: "supervisor" },
  { title: "Verified At", data: "verified_at" },
  { title: "Action", data: "id" },
]);
const checklistRooms = ref([]);

const {data,status} = await $fetch(`${config.public.baseUrl}housekeeping/checklist-room`, {
  lazy: true,
  method: "POST",
  headers: {
    Authorization: "Bearer " + authStore.getToken,
  },
})

if(status == 1){
  checklistRooms.value = data;
}
const submit = async () => {
  const { data, status } = await $fetch(`${config.public.baseUrl}housekeeping/checklist-room`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authStore.getToken,
    },
    body: {
      name: name,
    },
  });
  if (status == 1) {
    checklistRooms.value.push(data);
    name = "";
  }
};
onMounted(() => {
  $bus.$emit("pagechange", { page: "Housekeeping", subpage: "Checklist Room" });
});
</script>

<style>

</style>