<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Reservasi</h3>
      <div>
        <ButtonBaseButton variant="primary" to="/reservation/add-reservation" class="mx-3">Tambah Reservasi</ButtonBaseButton>
      </div>
    </div>
    <div class="mt-3">
      <DataTables />
    </div>
  </div>
</template>

<script setup>
import DataTables from "@/components/Table/DataTables.vue";
const { $bus} = useNuxtApp();

onMounted(() => {
    $bus.$emit('pagechange',{page:'Reservation',subpage:'Index Reservation'})
  });
definePageMeta({
    middleware: ["auth"]
  })
</script>