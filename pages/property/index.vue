<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Properti</h3>
      <div>
        <ButtonBaseButton variant="primary" to="/property/add-property" class="mx-3">Tambah Properti</ButtonBaseButton>
      </div>
    </div>
    <div class="mt-3">
      <DataTables />
    </div>
  </div>
</template>

<script setup>
import DataTables from "@/components/Table/DataTables.vue";
definePageMeta({
    middleware: ["auth"]
  })
</script>