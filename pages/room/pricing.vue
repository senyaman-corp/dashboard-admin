<template>
  <div>
    <CardBaseCard title="Room Pricing Management">
      <div class="row justify-content-end">
        <div class="col-lg-2">
          <select
            class="form-select form-select-lg"
            :id="'year'"
            @change="filterByType"
            v-model="roomType"
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
            :format="'yyyy-MM'"
            @closed="searchRoom"
            class="mb-3"
          ></VueDatePicker>a
        </div>
      </div>

      <div class="overflow-auto max-vh-65">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Room
              </th>
              <th
                v-for="day in daysInMonth"
                :key="day"
                class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase"
                :class="{ 'text-danger': isHoliday(day) }"
              >
                {{ day }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="room in rooms" :key="room.id">
              <td
                class="px-4 py-2 whitespace-nowrap border-bottom-1 border-gray-200"
              >
                <div class="t-bold">
                  {{ room.room_number }} - {{ room.name }}
                </div>
                <div class="small">{{ room.type }}</div>
              </td>

              <td
                v-for="(price, index) in room.actual_prices"
                :key="index"
                class="px-4 py-2 text-center border-bottom-1 border-gray-200"
                :class="{ 'text-danger': isHoliday(index + 1) }"
              >
                <div>{{ price.status }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardBaseCard>
  </div>
</template>

<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import { useAuthStore } from "~/stores/auth";
const authStore = useAuthStore();
const config = useRuntimeConfig();
const { $bus } = useNuxtApp();
const date = ref({
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
});
const roomType = ref();

const rooms = ref([]);
const preservedRooms = ref([]);
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
const selectedYear = ref(date.value.year.toString());
const dayInMOnthsName = [];

const daysInMonth = computed(() => {
  const monthIndex = months.indexOf(selectedMonth.value);
  const year = parseInt(selectedYear.value);
  return new Date(year, monthIndex + 1, 0).getDate();
});
const initData = async () => {
  const { data, status, statusCode } = await $fetch(
    `${config.public.baseUrl}rooms/list`,
    {
      method: "POST",
      lazy: true,
      headers: {
        Authorization: "Bearer " + authStore.getToken,
      },
      body: {
        month: date.value.year + "-" + bulans[date.value.month],
      },
    }
  );
  if (status == 1) {
    rooms.value = data;
    preservedRooms.value = data;
  } else {
    if (statusCode == 403) {
      //redirect login;
    }
  }
};

function isHoliday(day) {
  console.log("Day", daysInMonth.value);
  if (date.value === undefined) {
    return false;
  }
  const tanggal = new Date();
  tanggal.setFullYear(date.value.year, date.value.month, day);
  return tanggal.getDay() === 0 || tanggal.getDay() === 6;
}

const roomPrices = ref({});
initData();

const initializePrices = () => {
  rooms.value.forEach((room) => {
    if (!roomPrices.value[room.id]) {
      roomPrices.value[room.id] = {};
    }
    for (let day = 1; day <= daysInMonth.value; day++) {
      if (!roomPrices.value[room.id][day]) {
        roomPrices.value[room.id][day] = room.default_price || 0;
      }
    }
  });
};

const searchRoom = () => {
  selectedMonth.value = months[date.value.month];
  console.log(selectedMonth.value);
  initData();
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
  initializePrices();
});

onMounted(() => {
  initializePrices();
  $bus.$emit("pagechange", { page: "Room", subpage: "Index Room" });
});

definePageMeta({
  middleware: ["auth"],
});
</script>

<style scoped>
.overflow-x-auto {
  overflow-x: auto;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.max-vh-65 {
  max-height: 70vh;
  overflow-y: auto;
}
th {
  position: sticky;
  top: 0;
  background-color: #139b1f;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
}
</style>
