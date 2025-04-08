<template>
  <div>
    <CardBaseCard title="Room Pricing Management">
      <div class="row justify-content-end">
        <div class="col-lg-1 flex-grow-1">
          <NuxtLink to="/room/add-room">
            <ButtonBaseButton variant="primary"> Add Room </ButtonBaseButton>
          </NuxtLink>
        </div>
        <div class="col-lg-2">
          <client-only>
            <InputWithCombobox
              v-model="roomView"
              :options="roomViewOptions"
              class="mx-3"
              id="room-view"
              :placeholder="'Select Room View'"
              @update:modelValue="filterByView"
            />
          </client-only>
        </div>
        <div class="col-lg-2">
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
        <div class="col-lg-2">
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
        <TableCustomTable
          :rooms="rooms"
          :days-in-month="daysInMonth"
          :is-holiday="isHoliday"
          @view-detail="viewDetail"
        />
      </div>
    </CardBaseCard>
    <WidgetModalPad>
      <div class="container-fluid px-1">
        <div class="row gy-2">
          <div class="col-12 d-flex justify-content-between">
            <span class="text-muted fw-semibold">Room Name:</span>
            <span class="fw-medium">{{ detail.name }}</span>
          </div>
          <div class="col-12 d-flex justify-content-between">
            <span class="text-muted fw-semibold">Room Number:</span>
            <span class="fw-medium">{{ detail.room_number }}</span>
          </div>
          <div class="col-12 d-flex justify-content-between">
            <span class="text-muted fw-semibold">Room Type:</span>
            <span class="fw-medium">{{ detail.type }}</span>
          </div>
          <div class="col-12 d-flex justify-content-between">
            <span class="text-muted fw-semibold">View:</span>
            <span class="fw-medium">{{ detail.view }}</span>
          </div>
          <div class="col-12 d-flex justify-content-between">
            <span class="text-muted fw-semibold">Price:</span>
            <span class="fw-medium">
              {{
                detail.price !== undefined
                  ? detail.price.length > 0
                    ? "Rp." + $formatAngka(detail.price[0].price)
                    : "Rp." + $formatAngka(detail.default_price)
                  : "Rp." + $formatAngka(detail.default_price)
              }}
            </span>
          </div>
          <div class="col-12 d-flex justify-content-between">
            <span class="text-muted fw-semibold">Date:</span>
            <span class="fw-medium">
              {{
                detail.price !== undefined
                  ? detail.price.length > 0
                    ? detail.price[0].tanggal
                    : detail.date
                  : detail.date
              }}
            </span>
          </div>
        </div>
      </div>
    </WidgetModalPad>
  </div>
</template>

<script setup>
import { ref } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import { useAuthStore } from "~/stores/auth";
import "@vuepic/vue-datepicker/dist/main.css";

const authStore = useAuthStore();
const config = useRuntimeConfig();
const { $bus } = useNuxtApp();
const date = ref({
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
});
const roomType = ref();
const roomTypes = ref([]);
const roomView = ref();
const detail = ref({});
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
const roomTypeOptions = ref([]);
const roomViewOptions = [
  { label: "Pilih View", value: "" },
  { label: "Mountain", value: "Mountain" },
  { label: "City", value: "City" },
];

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
    rooms.value = data.rooms;
    preservedRooms.value = data.rooms;
    roomTypes.value = data.room_type;
  } else {
    if (statusCode == 403) {
      //redirect login;
    }
  }
};

function isHoliday(day) {
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
  initData();
};

const viewDetail = async (id, index) => {
  let y = date.value.year;
  let m = date.value.month + 1;
  let d = index + 1;
  if (m < 10) {
    m = "0" + m;
  }
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
  if (response.status == 1) {
    detail.value = response.data;
    $bus.$emit("openModal", {});
  }
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

const filterByView = () => {
  if (roomView.value == "") {
    rooms.value = preservedRooms.value;
    return;
  }
  if (preservedRooms.value.length > 0) {
    const filteredRooms = preservedRooms.value.filter(
      (room) => room.view === roomView.value
    );
    rooms.value = filteredRooms;
  }
};

watch([selectedMonth, selectedYear], () => {
  initializePrices();
});

onMounted(() => {
  initializePrices();
  $bus.$emit("pagechange", { page: "Room", subpage: "Room" });
});

definePageMeta({
  middleware: ["auth"],
});
</script>
