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

<script setup></script>
<script setup>
const config = useRuntimeConfig();
import { useAuthStore } from "~/stores/auth";
const authStore = useAuthStore();
const { $formatAngka, $formatDate } = useNuxtApp();
const loading = ref(false);
const headers = ref([
  { text: "Guest Name", value: "guest_name" },
  { text: "No Telp", value: "no_telp" },
  { text: "Created", value: "created" },
  { text: "Sub Total", value: "sub_total" },
  { text: "Discount", value: "discount" },
  { text: "Tax", value: "tax" },
  { text: "Deposit", value: "deposit" },
  { text: "Total", value: "total" },
  { text: "Action", value: "action" },
]);
const items = ref([]);
const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: "age",
  sortType: "desc",
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
  const { data, status, statusCode } = await $fetch(
    `${config.public.baseUrl}bookings/list`,
    {
      method: "POST",
      lazy: true,
      headers: {
        Authorization: "Bearer " + authStore.getToken,
      },
      body: serverOptions.value,
    }
  );
  if (status == 1) {
    let result = [];
    data.forEach((item) => {
      result.push({
        guest_name: item.name,
        no_telp: item.no_telp,
        created: $formatDate(item.created_at),
        sub_total: $formatAngka(item.subtotal),
        discount: $formatAngka(item.discount),
        tax: $formatAngka(item.taxamount),
        deposit: $formatAngka(item.deposit),
        total: $formatAngka(item.total_price),
        action: item.id,
      });
    });
    items.value = result;
    console.log("Items", items.value);
    //bookingStore.setBooking(data);
  } else {
    console.log("Load data error ", data);
    if (statusCode == 403) {
      //redirect login;
    }
  }
};
loadFromServer();
</script>
<style scoped></style>
