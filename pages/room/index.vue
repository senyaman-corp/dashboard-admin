<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Kamar</h3>
      <div>
        <ButtonBaseButton variant="primary" to="/room/add-room" class="mx-3">Tambah Kamar</ButtonBaseButton>
      </div>
    </div>
    <div class="mt-3">
      <DataTables />
    </div>
  </div>
</template>

<script setup>
import DataTables from "@/components/Table/DataTables.vue";
</script>