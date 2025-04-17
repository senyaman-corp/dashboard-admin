<template>
  <div>
    <CardBaseCard title="Room Management">
      <div class="row justify-content-end align-items-center mb-3">
        <div class="col-lg-1 flex-grow-1 mb-1">
          <NuxtLink to="/room/add-room">
            <ButtonBaseButton variant="primary"> Add Room </ButtonBaseButton>
          </NuxtLink>
        </div>
        <div class="col-lg-2 mb-1">
          
            <select
              v-model="roomView"
              id="room-view"
              placeholder="'Select Room View'"
              @change="filterByView"
              class="form-select form-select-md"
            >
            <option value="" selected>Pilih View</option>
            <option value="Mountain">Mountain</option>
            <option value="City">City</option>
            </select>
          
        </div>
        <div class="col-lg-2 mb-1">
          <client-only>
            <select
              class="form-select form-select-md"
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
            uid="searchDate"
          ></VueDatePicker>
        </div>
      </div>

      <div class="overflow-auto max-vh-65">
        <TableCustomTable
          :rooms="rooms"
          :days-in-month="daysInMonth"
          :is-holiday="isHoliday"
          @view-detail="viewDetail"
          :summary="summary"
        />
      </div>
    </CardBaseCard>
    <WidgetModalPad :title="'Room Detail'">
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
          <div class="t-bold">Status</div>
          <div  v-for="status in detail.status" :key="status.id">
            <div class="d-flex justify-content-between">
              <span>{{ status.status }}</span>
              <span>{{ $moment(status.created_at).format('DD-MMMM-YYYY HH:mm')}}</span>
            </div>
          </div>
          <div v-if="detail.booking_room_price !== null">
              <div class="d-flex justify-content-between">
                <div class="t-bold">Booking</div>
                <div>ID : {{ detail.booking_room_price?.booking_id }}</div>
              </div>
              <div class="d-flex justify-content-between">
                <span>Guest</span>
                <span>{{ detail.booking_room_price?.booking_room?.booking?.guest?.name}}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>Checkin</span>
                <span>{{ detail.booking_room_price?.booking_room?.checkin_date}}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>Checkout</span>
                <span>{{ detail.booking_room_price?.booking_room?.checkout_date}}</span>
              </div>
             
          </div>
          
        </div>
      </div>
    </WidgetModalPad>
  </div>
</template>

<script setup>
import { ref } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import { useNavigatorStore } from "~/stores/navigator";
import { useAuthStore } from "~/stores/auth";
import { useRoomStore } from "~/stores/room";
const navStore = useNavigatorStore();
const roomStore = useRoomStore();
import "@vuepic/vue-datepicker/dist/main.css";

const authStore = useAuthStore();
navStore.setPage("Room");
navStore.setSubpage("Index Room");
const config = useRuntimeConfig();
const { $bus } = useNuxtApp();
const date = ref({
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
});
const roomType = ref('');
const roomTypes = ref([]);
const roomView = ref('');
const detail = ref({});
const rooms = ref([]);
const preservedRooms = ref([]);
const bookingRoom = ref(null);
const summary = ref([]);
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
  $bus.$emit('loading',true)
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
  ).catch(err=>{
    $bus.$emit('loading',false)
  });
  $bus.$emit('loading',false)
  if (status == 1) {
    rooms.value = data.rooms;
    preservedRooms.value = data.rooms;
    //summary.value = data.summary;
    roomTypes.value = data.room_type;
    roomStore.setRoomTypes(data.room_type);
    calculatePercentage(rooms.value);
  } else {
    if (statusCode == 403) {
      //redirect login;
    }
  }
};
const calculatePercentage = (rooms) => {
    summary.value = [];
    rooms.forEach((room) => {
      room.actual_prices.forEach((price, index) => {
        if (summary.value[index]) {
          summary.value[index].bulanan += price.periode === "bulanan" ? 1 : 0;
          summary.value[index].total += price.status == "O" ? 1 : 0;
        } else {
          summary.value[index] = {
            bulanan: price.periode === "bulanan" ? 1 : 0,
            total: price.status == "O" ? 1 : 0,
          };
        }
      });
    });
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

  $bus.$emit('loading',true);
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
  $bus.$emit('loading',false);
  if (response.status == 1) {
    detail.value = response.data;
    $bus.$emit("openModal", {});
  }
};

const filterByType = () => {
  if (roomType.value == "" && roomView.value == "") {
    rooms.value = preservedRooms.value;
    calculatePercentage(rooms.value);
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
    calculatePercentage(rooms.value);
  }
};

const filterByView = () => {
  if (roomView.value == "" && roomType.value == "") {
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
    calculatePercentage(rooms.value);
  }
};

const checkoutDay = (date)=>{
 let now = new Date().toLocaleDateString('ID');
 let cDate = new Date(date).toLocaleDateString('ID');
 if(now === cDate){
    return true;
 }else{
  return false;
 }
}

const checkout = async(id)=>{
  navigateTo('/booking/checkout?booking_id='+id);
}

const bookingAvailable = (status)=>{
  status.forEach(s=>{
    if(s.booking_room !== null){
      bookingRoom.value = s.booking_room;
    }
  });
  return bookingRoom.value !== null;
}

const statusEC = (status)=>{
  status.forEach(s=>{
    if(s.status == 'EC'){
      return true;
    }
  });
  return false;
}

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

<style>
  #dp-input-searchDate{
    padding: .2rem 2rem !important;
  }
</style>
