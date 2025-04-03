import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const isLoading = ref(false);

  nuxtApp.hook('page:start', () => {
    isLoading.value = true;
  });

  nuxtApp.hook('page:finish', () => {
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  });

  nuxtApp.provide('isLoading', isLoading);
});