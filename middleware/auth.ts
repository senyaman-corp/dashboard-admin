import { useAuthStore } from "~/stores/auth";
export default defineNuxtRouteMiddleware((to, from) => {
    console.log(to);
    console.log(from);
    const authStore = useAuthStore(); // Or any other auth technique
    if (!authStore.isLoggedin) {
        return navigateTo('/login');
    }
  });