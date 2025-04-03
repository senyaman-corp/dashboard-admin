<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Properti</h3>
      <div>
        <ButtonBaseButton variant="primary" to="/property/add-property" class="mx-3">Tambah Properti</ButtonBaseButton>
      </div>
    </div>
    <div class="table-responsive">
      <DataTable
        class="table table-striped table-bordered"
        :columns="columns"
        :data="formattedRooms"
        style="width:100%"
      />
    </div>
  </div>
</template>

<script setup>
const {$bus} = useNuxtApp();

onMounted(() => {
  $bus.$emit('pagechange',{page:'Room',subpage:'Index Property'})
  });
definePageMeta({
    middleware: ["auth"]
  })
</script>