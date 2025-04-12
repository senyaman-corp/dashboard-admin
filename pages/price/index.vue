<template>
  <div>
    <CardBaseCard title="Room Pricing Management">
      <div class="row justify-content-between">
        <div class="col-lg-1 flex-grow-1 mb-1">
          <NuxtLink to="/price/add-price">
            <ButtonBaseButton variant="primary"> Add Price </ButtonBaseButton>
          </NuxtLink>
        </div>
        <div class="col-lg-2 mb-1">
          <client-only>
            <InputWithCombobox
              v-model="roomView"
              :options="roomViewOptions"
             
              id="room-view"
              :placeholder="'Select Room View'"
              @update:modelValue="filterByView"
            />
          </client-only>
        </div>
        <div class="col-lg-2 mb-1">
          <client-only>
            <select
              class="form-select form-select-lg"
              :id="'year'"
              @change="filterByType"
              v-model="roomType"
            >
              <option value="" selected>Pilih Type</option>
              <option
                v-for="type in roomTypes"
                :key="type.id"
                :value="type.type"
              >
                {{ type.type }}
              </option>
            </select>
          </client-only>
        </div>
        <div class="col-lg-2 mb-1">
          <VueDatePicker
            v-model="date"
            month-picker
            auto-apply
            :format="'yyyy-MM'"
            @closed="searchRoom"
            class="mb-3"
          ></VueDatePicker>
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
            <tr v-for="(room, index) in rooms" :key="index">
              <td
                class="px-4 py-2 whitespace-nowrap border-bottom-1 border-gray-200"
              >
                <div class="t-bold">{{ room.type }}</div>
                <div class="small">{{ room.view }}</div>
              </td>

              <td
                v-for="(price, index) in room.price"
                :key="index"
                class="px-4 py-2 text-center border-bottom-1 border-gray-200"
              >
                <div>{{ $formatAngka(price.price) }}</div>
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
import { useNavigatorStore } from "~/stores/navigator";
const navStore = useNavigatorStore();
navStore.setPage("Room");
navStore.setSubpage("Index Price");
import { useAuthStore } from "~/stores/auth";
const authStore = useAuthStore();
const config = useRuntimeConfig();
const { $bus } = useNuxtApp();
const date = ref({
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
});
const roomType = ref('');
const roomTypes = ref([]);
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
const roomView = ref('');
const roomViewOptions = ref([
  { value: "", label: "Select Room View" },
  { value: "Mountain", label: "Mountain" },
  { value: "City", label: "City" },
]);
const selectedMonth = ref(months[date.value.month]);
const selectedYear = ref(date.value.year.toString());
const daysInMonth = computed(() => {
  const monthIndex = months.indexOf(selectedMonth.value);
  const year = parseInt(selectedYear.value);
  return new Date(year, monthIndex + 1, 0).getDate();
});
const initData = async () => {
  const { data, status, statusCode } = await $fetch(
    `${config.public.baseUrl}prices/list`,
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
    rooms.value = data.data;
    preservedRooms.value = data.data;
    roomTypes.value = data.room_type;
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
// Initialize room prices
const roomPrices = ref({});
initData();
// Initialize prices for each room

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
    let filteredRooms = [];
    if(roomView.value !== ''){
      filteredRooms = preservedRooms.value.filter(room => room.type === roomType.value && room.view === roomView.value);
    }else{
      filteredRooms = preservedRooms.value.filter(room => room.type === roomType.value);
    }
    rooms.value = filteredRooms;
  }
};
const filterByView = () => {
  if (roomView.value == "") {
    rooms.value = preservedRooms.value;
    return;
  }
  if (preservedRooms.value.length > 0) {
    let filteredRooms = [];
    if(roomType.value !== ''){
      filteredRooms = preservedRooms.value.filter((room) => room.view === roomView.value && room.type === roomType.value);
    }else{
      filteredRooms = preservedRooms.value.filter((room) => room.view === roomView.value);
    }
    rooms.value = filteredRooms;
  }
};

onMounted(() => {
  $bus.$emit("pagechange", { page: "Room", subpage: "Index Price" });
});

definePageMeta({
  middleware: ["auth"],
});
</script>
