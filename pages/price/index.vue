<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Harga</h3>
      <div>
        <ButtonBaseButton variant="primary" to="/price/add-price" class="mx-3">Tambah Harga</ButtonBaseButton>
      </div>
    </div>
    <div class="mt-3">
      <DataTables />
    </div>
  </div>
</template>

<script setup>
import DataTables from "@/components/Table/DataTables.vue";
const {$bus} = useNuxtApp();
onMounted(() => {
  $bus.$emit('pagechange',{page:'Room',subpage:'Index Price'})
  });
definePageMeta({
    middleware: ["auth"]
  })
</script>