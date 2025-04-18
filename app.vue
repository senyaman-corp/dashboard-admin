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
const { $bus,$swal } = useNuxtApp();
const isLoading = ref(false);
const router = useRouter();

watch(isLoading, (newVal) => {
  console.log('Loading State:', newVal);
});

onMounted(()=>{
  $bus.$on('alert',(data)=>{
    let bg = '#fff';
    if(data.type === 'success'){
      bg = '#28a745';
    }else if(data.type === 'danger'){
      bg = '#dc3545';
    }
    $swal.fire({
      text: data.message,
      toast:true,
      position:'bottom-end',
      background:bg,
      showConfirmButton:false,
      timer:3000,
      customClass:{
        htmlContainer:'text-white'
      }
    });
  })
})
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
