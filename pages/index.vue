<template>
  <div>
    <div v-if="user && (user.roles === 'Direksi' || user.roles === 'Admin')">
      <WidgetDashboard />
    </div>
    <div v-else class="d-flex justify-content-center align-items-center min-vh-65">
      <div>
        <NuxtImg class="w-100" preload loading="lazy" :src="'/assets/images/logo_cordova.png'" alt="logo" />
        <h2 class="mt-4 text-primary text-center">SELAMAT DATANG</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useNavigatorStore } from "~/stores/navigator";
import { useAuthStore } from "~/stores/auth";
const navStore = useNavigatorStore();
const authStore = useAuthStore();
navStore.setPage("Home");
navStore.setSubpage("Home");
const { $bus,$swal } = useNuxtApp();
const formData = ref({
  date: "",
  combo: "",
  dropdown: "",
  items: [""],
});
const user = authStore.getUser;
const submit = () => {
  console.log("Submitted:", formData.value);
};
onMounted(() => {
  $bus.$emit("pagechange", { page: "Home", subpage: "Home" });
  
});
definePageMeta({
  middleware: ["auth"],
});
</script>
