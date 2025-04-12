<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Customer</h3>
      <div>
        <!-- <ButtonBaseButton variant="primary" to="/price/add-price" class="mx-3">Tambah Harga</ButtonBaseButton> -->
      </div>
    </div>
    <div class="table-responsive">
      <DataTable
        class="table table-striped table-bordered"
        :columns="columns"
        :options="options"
        style="width: 100%"
      />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
import { useNavigatorStore } from "~/stores/navigator";
const navStore = useNavigatorStore();
const config = useRuntimeConfig();
const authStore = useAuthStore();
const { $bus,$dataTableOptions } = useNuxtApp();
navStore.setPage("Guests");
navStore.setSubpage("Index Guest");

const options = $dataTableOptions(config.public.baseUrl + 'guests/list', authStore.getToken);
options.columnDefs = [
  { targets:[7], render: (data, type, row, meta) =>{
    return '';
  },className: 'text-end'}
]
const columns = [
  { title : 'Name' ,data:'name'},
  { title : 'Email' ,data:'email'},
  { title : 'Phone' ,data:'no_telp'},
  { title : 'Alamat' ,data:'address'},
  { title : 'Gender' ,data:'gender'},
  { title : 'Umur' ,data:'age'},
  { title : 'Pekerjaan' ,data:'pekerjaan'},
  { title : 'Action' ,data:'id'},
]
onMounted(() => {
  $bus.$emit("pagechange", { page: "Guests", subpage: "Index Guest" });
});
definePageMeta({
  middleware: ["auth"],
});
</script>
