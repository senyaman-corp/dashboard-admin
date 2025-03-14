import { useAuthStore } from "~/stores/auth";
export default defineNuxtRouteMiddleware((to, from) => {
  
    const authStore = useAuthStore(); // Or any other auth technique
    if (!authStore.isLoggedin) {
        return navigateTo('/login');
    }
  });