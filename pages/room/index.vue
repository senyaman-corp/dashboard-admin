<template>
  <div>
    <CardBaseCard title="Room Pricing Management">
      <div class="row justify-content-end">
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
        <ClientOnly>
          <DataTable
            class="table table-striped table-bordered"
            :columns="columns"
            :data="formattedRooms"
            style="width: 100%"
          />
        </ClientOnly>
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
  month: new Date().getMonth() + 1,
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
      date: formattedDate,
    });
  }

  return dates;
});

const { data: roomsData } = await useAsyncData(
  "rooms",
  async () => {
    return await $fetch(`${config.public.baseUrl}rooms/list`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + authStore.getToken,
      },
      body: {
        month: date.value.year + "-" + bulans[date.value.month - 1],
      },
    });
  },
  { lazy: true }
);

const rooms = computed(() => roomsData.value?.data || []);

const columns = computed(() => {
  const headers = [{ title: "Room", data: "roomInfo" }];

  dateRange.value.forEach((day) => {
    headers.push({ title: day.title, data: `prices.${day.date}` });
  });

  return headers;
});

const formattedRooms = computed(() => {
  return rooms.value.map((room) => {
    const priceMap = {};

    dateRange.value.forEach((day) => {
      const foundPrice = room.actual_prices?.find((p) =>
        p.tanggal.startsWith(day.date)
      );
      priceMap[day.date] = foundPrice
        ? `${foundPrice.status} - ${foundPrice.price}`
        : "-";
    });

    return {
      roomInfo: `${room.room_number} - ${room.type} - ${room.name}`,
      prices: priceMap,
    };
  });
});

const priceChanged = (roomId, day) => {};

const searchPrice = async () => {
  try {
  } catch (error) {}
  if (d < 10) {
    d = "0" + d;
  }

  let selectedDate = new Date(y, m, d);
  if (date.value === undefined) {
    selectedDate = new Date();
  }
  let tanggal = y + "-" + m + "-" + d;
  console.log(tanggal);

  const response = await $fetch(`${config.public.baseUrl}rooms/detail`, {
    method: "POST",
    lazy: true,
    headers: {
      Authorization: "Bearer " + authStore.getToken,
    },
    body: {
      id: id,
      date: tanggal,
    },
  });
  console.log(response);
  if (response.status == 1) {
    detail.value = response.data;
    $bus.$emit("openModal", {});
  }
  console.log(response);
};

const filterByType = () => {
  if (roomType.value == "") {
    rooms.value = preservedRooms.value;
    return;
  }
  if (preservedRooms.value.length > 0) {
    const filteredRooms = preservedRooms.value.filter(
      (room) => room.type === roomType.value
    );
    rooms.value = filteredRooms;
  }
};

watch([selectedMonth, selectedYear], () => {
  formattedRooms.value;
});

onMounted(() => {
  $bus.$emit("pagechange", { page: "Room", subpage: "Index Room" });
});

definePageMeta({
  middleware: ["auth"],
});
</script>
