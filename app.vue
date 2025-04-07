<template>
  <Loading />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Loading from '@/components/Loading.vue';
const { $bus } = useNuxtApp();
const isLoading = ref(false);
const router = useRouter();

watch(isLoading, (newVal) => {
  console.log('Loading State:', newVal);
});

/*
router.beforeEach(() => {
  console.log('Route change detected - Start loading');
  isLoading.value = true;
  $bus.$emit('loading', true);
});

router.afterEach(() => {
  setTimeout(() => {
    console.log('Route changed - Stop loading');
    isLoading.value = false;
    $bus.$emit('loading', false);
  }, 100);
});
*/
</script>
