<template>
  <div>
    <CardBaseCard title="Room Pricing Management">
      <div class="row justify-content-between">
        <div class="col-lg-1 flex-grow-1">
          <NuxtLink to="/price/add-price">
            <ButtonBaseButton variant="primary"> Add Price </ButtonBaseButton>
          </NuxtLink>
        </div>
        <div class="col-lg-2">
          <select
            class="form-select form-select-lg"
            v-model="roomType"
            @change="searchRoom"
          >
            <option value="">Pilih Type</option>
            <option value="Studio">Studio</option>
            <option value="2 BR-A">2 BR-A</option>
            <option value="2 BR-B">2 BR-B</option>
            <option value="2 BR-C">2 BR-C</option>
            <option value="2 BR-D">2 BR-D</option>
            <option value="Suite">Suite</option>
          </select>
        </div>
        <div class="col-lg-2">
          <VueDatePicker
            v-model="date"
            month-picker
            auto-apply
            format="yyyy-MM"
            @update:modelValue="searchRoom"
            class="mb-3"
          ></VueDatePicker>
        </div>
      </div>

      <div class="table-responsive">
        <client-only>
          <DataTable
            class="table table-striped table-bordered"
            :columns="columns"
            :data="formattedPrices"
            style="width: 100%"
          />
        </client-only>
      </div>
    </CardBaseCard>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const authStore = useAuthStore();
const config = useRuntimeConfig();
const { $bus } = useNuxtApp();

const date = ref({
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
});
const roomType = ref("");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const bulans = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09`",
  "10",
  "11",
  "12",
];
const years = ["2024", "2025", "2026"];

const selectedMonth = ref(months[date.value.month]);

const { data: pricesData } = await useAsyncData(
  "prices",
  async () => {
    return await $fetch(`${config.public.baseUrl}prices/list`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + authStore.getToken,
      },
      body: {
        month: date.value.year + "-" + bulans[date.value.month],
      },
    });
  },
  { lazy: true }
);

const prices = computed(() => pricesData.value?.data || []);

const dateRange = computed(() => {
  const startDate = new Date();
  const dates = [];

  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const formattedDate = currentDate.toISOString().split("T")[0];
    dates.push({
      title: currentDate.getDate().toString(),
      date: formattedDate,
    });
  }

  return dates;
});

const columns = computed(() => {
  const headers = [{ title: "Price", data: "priceInfo" }];
  dateRange.value.forEach((day) => {
    headers.push({ title: day.title, data: `prices.${day.date}` });
  });
  return headers;
});

const filteredPrices = computed(() => {
  return prices.value.filter((price) => {
    const matchType = !roomType.value || price.type === roomType.value;
    const matchMonth =
      date.value || price.price.some((p) => p.date.startsWith(date.value));

    console.log("matchMonth", date.value);
    return matchType && matchMonth;
  });
});

const formattedPrices = computed(() => {
  return filteredPrices.value.map((price) => {
    const priceMap = {};
    dateRange.value.forEach((day) => {
      const foundPrice = price.price?.find((p) => p.date.startsWith(day.date));
      priceMap[day.date] = foundPrice ? foundPrice.price : "-";
    });
    return {
      priceInfo: `${price.type} - ${price.view}`,
      prices: priceMap,
    };
  });
});

const searchRoom = () => {
  fetchPrices();
};

watch(date, () => {
  selectedMonth.value = months[date.value.month];
  searchRoom();
});

onMounted(() => {
  $bus.$emit("pagechange", { page: "price", subpage: "Index Price" });
});

definePageMeta({
  middleware: ["auth"],
});
</script>
