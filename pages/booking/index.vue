<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <div class="w-100 d-flex align-items-center justify-content-between">
        <h3>Data Booking</h3>
        <NuxtLink to="/booking/add-booking" class="btn btn-sm btn-success">New Booking</NuxtLink>
      </div>
      
      <div>
        <!-- <ButtonBaseButton variant="primary" to="/booking/add-booking" class="mx-3">Tambah Booking</ButtonBaseButton> -->
      </div>
    </div>
    <div class="mt-3">
      <TableBooking/>
    </div>
  </div>
</template>

<script setup>
const {$bus} = useNuxtApp();

  onMounted(() => {
    $bus.$emit('pagechange',{page:'Booking',subpage:'Index Booking'})
  });
  definePageMeta({
    middleware: ["auth"]
  })
</script>