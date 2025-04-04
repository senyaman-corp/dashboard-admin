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
        :data="formattedRooms"
        style="width: 100%"
      />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});
</script>
