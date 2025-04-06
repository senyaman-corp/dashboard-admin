<template>
  
</template>

<script setup>
const navStore = useNavigatorStore();
const { $bus } = useNuxtApp();
navStore.setPage("Housekeeping");
navStore.setSubpage("Index Housekeeping");

onMounted(() => {
  $bus.$emit("pagechange", { page: "Housekeeping", subpage: "Index Housekeeping" });
});
</script>

<style>

</style>