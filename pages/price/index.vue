<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Harga</h3>
      <div>
        <ButtonBaseButton variant="primary" to="/price/add-price" class="mx-3">Tambah Harga</ButtonBaseButton>
      </div>
    </div>
    <div class="table-responsive">
      <DataTable
        class="table table-striped table-bordered"
        :columns="columns"
        :data="formattedPrices"
        style="width:100%"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const config = useRuntimeConfig();
const { $bus } = useNuxtApp();

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const years = ["2024", "2025", "2026"];

const selectedMonth = ref(months[new Date().getMonth()]);
const selectedYear = ref(new Date().getFullYear().toString());

const dateRange = computed(() => {
  const startDate = new Date();
  const dates = [];

  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const formattedDate = currentDate.toISOString().split("T")[0];
    dates.push({ 
      title: currentDate.getDate().toString(), 
      date: formattedDate 
    });
  }

  return dates;
});

const { data: pricesData } = await useAsyncData("prices", async () => {
  return await $fetch(`${config.public.baseUrl}prices/list`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authStore.getToken,
    },
  });
}, { lazy: true });

const prices = computed(() => pricesData.value?.data || []);

const columns = computed(() => {
  const headers = [
    { title: "Price", data: "priceInfo" }
  ];

  dateRange.value.forEach(day => {
    headers.push({ title: day.title, data: `prices.${day.date}` });
  });

  return headers;
});

const formattedPrices = computed(() => {
  return prices.value.map(price => {
    const priceMap = {};

    dateRange.value.forEach(day => {
      const foundPrice = price.price?.find(p => p.date.startsWith(day.date));
      priceMap[day.date] = foundPrice ? foundPrice.price : "-";
    });

    return {
      priceInfo: `${price.type} - ${price.view}`,
      prices: priceMap
    };
  });
});

watch([selectedMonth, selectedYear], () => {
  formattedPrices.value;
});

onMounted(() => {
  $bus.$emit('pagechange',{page:'price',subpage:'Index Price'})
});

definePageMeta({
    middleware: ["auth"]
  })
</script>