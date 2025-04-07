<template>
    <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Checklist Room</h3>
    </div>
    <div class="my-3 t-bold">Tambah Checklist Room</div>
    <form @submit.prevent="submit">
      <div class="d-flex align-items-center">
        <InputBaseInput
                type="text"
                v-model="name"
                label="Checklist Name"
                placeholder="Insert checklist name"
                :class="'flex-grow-1 me-2'"
              />
        <ButtonBaseButton type="submit" variant="primary" class="mt-2 min-h-100 btn-md">Tambah</ButtonBaseButton>
        </div>  
    </form>
    <hr />
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

    const response = await fetch(`${config.public.baseUrl}housekeeping/checklist-room`, {
      lazy: true,
      method: "POST",
      headers: {
        Authorization: "Bearer " + authStore.getToken,
      },
    })

    if (!response.ok) throw new Error("Failed to fetch users");

    const result = await response.json();
    checklistRooms.value = result.data;
onMounted(() => {
  $bus.$emit("pagechange", { page: "Housekeeping", subpage: "Checklist Room" });
});
</script>

<style>

</style>