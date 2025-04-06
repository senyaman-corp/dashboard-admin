import { useAuthStore } from "~/stores/auth";
export default defineNuxtRouteMiddleware(async (to, from) => {
    
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    if (!authStore.isLoggedin) {
        if(authStore.email !== null){
          
            const { data,status } = await $fetch(`${config.public.dashboardUrl}api/login`, {
                method: "POST",
                lazy: true,
                body: {
                  email: authStore.email,
                  password: authStore.password,
                },
              });
              if (status == 1) {
                authStore.setToken(data);
                authStore.setLoggedin(true);
                console.log("Loggedin , Navigate Rooms");
                return navigateTo('/room');
                
              }
        }
        return navigateTo('/login');
    }
  });