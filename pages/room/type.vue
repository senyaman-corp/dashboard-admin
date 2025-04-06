<template>
  
</template>

<script setup>
    import { useNavigatorStore } from "~/stores/navigator";
    const navStore = useNavigatorStore();
    const { $bus } = useNuxtApp();
    navStore.setPage("Room");
    navStore.setSubpage("Room Type");
    onMounted(() => {
        $bus.$emit("pagechange", { page: "Room", subpage: "Room Type" });
    });
</script>

<style>

</style>