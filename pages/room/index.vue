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
          <select
            class="form-select form-select-lg"
            :id="'year'"
            @change="filterByType"
            v-model="roomType"
          >
            <option value="" selected>Pilih Type</option>
            <option v-for="type in roomTypes" :key="type.id" :value="type.type">{{ type.type }}</option>
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
            <tr v-for="room in rooms" :key="room.id">
              <td
                class="px-4 py-2 whitespace-nowrap border-bottom-1 border-gray-200"
              >
                <div class="t-bold">
                  {{ room.room_number }} - {{ room.name }}
                </div>
                <div class="small">{{ room.type }}({{ room.view }})</div>
              </td>

              <td
                v-for="(price, index) in room.actual_prices"
                :key="index"
                class="px-4 py-2 text-center border-bottom-1 border-gray-200"
                :class="{ 'text-danger': isHoliday(index + 1) }"
              >
                <div class="room-item" @click="viewDetail(room.id, index)">
                  {{ price.status }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import { useAuthStore } from "~/stores/auth";
const authStore = useAuthStore();
const navStore = useNavigatorStore();
navStore.setPage("Room");
navStore.setSubpage("Index Room");
const config = useRuntimeConfig();
const { $bus } = useNuxtApp();
const date = ref({ month:new Date().getMonth(), year:new Date().getFullYear()});
const roomType = ref('');
const detail = ref({})
// Sample rooms data - Replace with actual API call
const rooms = ref([]);
const preservedRooms = ref([]);
const roomTypes = ref([]);
const months = ['January', 'February', 'March', 'April', 'May', 'June', 
              'July', 'August', 'September', 'October', 'November', 'December'];
const bulans = ['01', '02', '03', '04', '05', '06', 
              '07', '08', '09`', '10', '11', '12'];
const years = ['2024', '2025', '2026'];

const selectedMonth = ref(months[date.value.month]);
const selectedYear = ref(date.value.year.toString());
const loading = ref(false);
// Calculate days in selected month
const daysInMonth = computed(() => {
  const monthIndex = months.indexOf(selectedMonth.value);
  const year = parseInt(selectedYear.value);
  return new Date(year, monthIndex + 1, 0).getDate();
});
const initData = async()=>{
  $bus.$emit('loading',true)
  const { data, status, statusCode} = await $fetch(`${config.public.baseUrl}rooms/list`,{
          method:'POST',
          lazy: true,
          headers:{
            'Authorization':'Bearer ' + authStore.getToken
          },
          body:{
            month:date.value.year + "-" + bulans[date.value.month],
          }
          
      });
  $bus.$emit('loading',false)
  if(status == 1){
    rooms.value = data.rooms ;
    preservedRooms.value = data.rooms;
    roomTypes.value = data.room_type;
    console.log(data);
  }else{
    if(statusCode == 403){
    //redirect login;
    }
  }
}
initData();
function isHoliday (day){
  if(date.value === undefined){
    return false;
  }
  const tanggal = new Date();
  tanggal.setFullYear(date.value.year, date.value.month, day);
  return tanggal.getDay() === 0 || tanggal.getDay() === 6;
};
// Initialize room prices
const roomPrices = ref({});
// Initialize prices for each room
const initializePrices = () => {
  rooms.value.forEach(room => {
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

const searchRoom = ()=>{
 selectedMonth.value = months[date.value.month];
 console.log(selectedMonth.value)
  initData();
}

const viewDetail = async(id,index)=>{
  let y = date.value.year;
  let m = date.value.month + 1;
  let d = index + 1;
  if(m < 10){
    m = "0" + m;
  }
  if(d < 10){
    d = "0" + d;
  }
  
  let selectedDate = new Date(y, m, d);
  if(date.value === undefined){
    selectedDate =  new Date()
  }
  let tanggal = y + "-" + m + "-" + d;
  $bus.$emit('loading',true)
  const response = await $fetch(`${config.public.baseUrl}rooms/detail`,{
          method:'POST',
          lazy: true,
          headers:{
            'Authorization':'Bearer '+ authStore.getToken
          },
          body:{
            id:id,
            date:tanggal
          }
    })
    $bus.$emit('loading',false)
    if(response.status == 1){
      detail.value = response.data;
      $bus.$emit('openModal',{
       
      })
    }
    console.log(response)
    
}

const filterByType = ()=>{
  if(roomType.value == ""){
    rooms.value = preservedRooms.value;
    return;
  }
  if(preservedRooms.value.length > 0){
    const filteredRooms = preservedRooms.value.filter(room => room.type === roomType.value);
    rooms.value = filteredRooms;
  }
}

// Watch for month/year changes
watch([selectedMonth, selectedYear], () => {
  initializePrices();
});

onMounted(() => {
  initializePrices();
  $bus.$emit('pagechange', { page: 'Room', subpage: 'Index Room' });
});

definePageMeta({
  middleware: ["auth"]
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
  background-color: #38c66c;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
}
.room-item {
  cursor: pointer;
}
</style>
