<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Booking</h3>
      <div>
        <!-- <ButtonBaseButton variant="primary" to="/booking/add-booking" class="mx-3">Tambah Booking</ButtonBaseButton> -->
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