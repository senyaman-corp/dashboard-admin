<template>
  <NuxtLayout>
    <Loading :isLoading="isLoading" />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Loading from '@/components/Loading.vue';

const isLoading = ref(false);
const router = useRouter();

watch(isLoading, (newVal) => {
  console.log('Loading State:', newVal);
});

router.beforeEach(() => {
  console.log('Route change detected - Start loading');
  isLoading.value = true;
});

router.afterEach(() => {
  setTimeout(() => {
    console.log('Route changed - Stop loading');
    isLoading.value = false;
  }, 500);
});
</script>
