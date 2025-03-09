<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data User Role</h3>
      <div>
        <ButtonBaseButton variant="primary" to="/user-role/add-user-role" class="mx-3">Tambah User Role</ButtonBaseButton>
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