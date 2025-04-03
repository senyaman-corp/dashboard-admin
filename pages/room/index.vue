<template>
  <div>
    <CardBaseCard title="Room Pricing Management">
      <div class="mb-4 flex justify-between items-center">
        <div class="flex gap-4">
          <InputWithCombobox v-model="selectedMonth" :options="months" label="Month" id="month" />
          <InputWithCombobox v-model="selectedYear" :options="years" label="Year" id="year" />
        </div>
        <ButtonBaseButton variant="primary" @click="searchPrice">
          Save All Changes
        </ButtonBaseButton>
      </div>

      <div class="table-responsive">
        <ClientOnly>
          <DataTable
            class="table table-striped table-bordered"
            :columns="columns"
            :data="formattedRooms"
            style="width:100%"
          />
        </ClientOnly>
      </div>
    </CardBaseCard>
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


const { data: roomsData } = await useAsyncData("rooms", async () => {
  return await $fetch(`${config.public.baseUrl}rooms/list`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authStore.getToken,
    },
  });
}, { lazy: true });

const rooms = computed(() => roomsData.value?.data || []);

const columns = computed(() => {
  const headers = [
    { title: "Room", data: "roomInfo" }
  ];

  dateRange.value.forEach(day => {
    headers.push({ title: day.title, data: `prices.${day.date}` });
  });

  return headers;
});

const formattedRooms = computed(() => {
  return rooms.value.map(room => {
    const priceMap = {};

    dateRange.value.forEach(day => {
      const foundPrice = room.actual_prices?.find(p => p.tanggal.startsWith(day.date));
      priceMap[day.date] = foundPrice ? `${foundPrice.status} - ${foundPrice.price}` : "-";
    });

    return {
      roomInfo: `${room.room_number} - ${room.type} - ${room.name}`,
      prices: priceMap
    };
  });
});

const priceChanged = (roomId, day) => {
};

const searchPrice = async () => {
  try {
  } catch (error) {
  }
};

watch([selectedMonth, selectedYear], () => {
  formattedRooms.value;
});

onMounted(() => {
  $bus.$emit("pagechange", { page: "Room", subpage: "Index Room" });
});

definePageMeta({
  middleware: ["auth"]
});
</script>
