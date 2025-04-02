<template>
    <div>
      <client-only>
        <EasyDataTable
          id="data-table"
          :headers="headers"
          :items="items"
          alternating
          table-class="table table-hover table-bordered table-striped"
          v-model:server-options="serverOptions"
        />
      </client-only>
    </div>
  </template>
  <script setup>
    const config = useRuntimeConfig();
    import { useAuthStore } from "~/stores/auth";
    const authStore = useAuthStore();
    const { $formatAngka,$formatDate } = useNuxtApp();
    const loading = ref(false);
    const headers = ref([
        { text : 'Guest Name' , value : 'customer_name'},
        { text : 'No Telp', value : 'phone_number'},
        { text : 'Checkin', value : 'tanggal_checkin'},
        { text : 'Checkout', value : 'tanggal_checkout'},
        { text : 'Durasi', value : 'duration'},
        { text : 'Created', value : 'created_at'},
        { text : 'Action', value : 'id'},
    ]);
    const items = ref([]);
    const serverOptions = ref({
            page: 1,
            rowsPerPage: 10,
            sortBy: 'age',
            sortType: 'desc',
        });
    watch(
            serverOptions,
            (value) => {
            loadFromServer();
            },
            { deep: true }
        );
    
    

    const loadFromServer = async () => {
        loading.value = true;
        const { data, status, statusCode} = await $fetch(`${config.public.baseUrl}reservations/list`,{
                method:'POST',
                lazy: true,
                headers:{
                    'Authorization':'Bearer ' + authStore.getToken
                },
                body:serverOptions.value
            })
        if(status == 1){
            let result = [];
            data.forEach(item => {
                result.push({
                    customer_name: item.customer_name,
                    phone_number: item.phone_number,
                    tanggal_checkin: item.tanggal_checkin,
                    tanggal_checkout: item.tanggal_checkout,
                    duration: item.duration,
                    created_at: $formatDate(item.created_at),
                    id: item.id,
                });
            });
            items.value = result;
            console.log("Items",items.value)
            //bookingStore.setBooking(data);
            }else{
            console.log("Load data error ", data);
            if(statusCode == 403){
                //redirect login;
            }
        }
    }
    loadFromServer();
</script>

<style>

</style>