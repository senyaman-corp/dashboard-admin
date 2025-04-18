<template>
  <div>
    <CardBaseCard title="Rooms">
      <div class="row justify-content-end">
        <div class="col-lg-2 mb-1">
          <input
            v-model="searchQuery"
            @input="filterBySearch"
            type="text"
            class="form-control"
            placeholder="Search Room"
          />
        </div>
        <div class="col-lg-2 mb-1">
          <select
            class="form-select form-select-lg"
            @change="filterByStatus"
            v-model="roomStatus">
            <option value="">Pilih Status</option>
            <option v-for="rState in ['VR','VC','CO','OO']" :key="rState" :value="rState">{{ rState }}</option>
          </select>
        </div>
        <div class="col-lg-2 mb-1">
          <select
            class="form-select form-select-lg"
            @change="filterByView"
            v-model="roomView">
            <option value="">Pilih View</option>
            <option v-for="view in ['Mountain', 'City']" :key="view" :value="view">{{ view }}</option>
          </select>
        </div>
        <div class="col-lg-2 mb-1">
          <select
            class="form-select form-select-lg"
            :id="'year'"
            @change="filterByType"
            v-model="roomType">
            <option value="">Pilih Type</option>
            <option v-for="type in roomTypes" :key="type.id" :value="type.type">{{ type.type }}</option>
          </select>
        </div>

        <div class="col-lg-2 mb-1">
          <VueDatePicker
            v-model="date"
            month-picker
            auto-apply
            :format="'yyyy-MM'"
            @closed="searchRoom"
            class="mb-3"></VueDatePicker>
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
    <WidgetModalPad :modalId="'room-detail'">
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
          <div class="col-12">
            <div class="t-bold">Status</div>
            <div v-for="status in detail.status" :key="status.id">
              <div class="d-flex justify-content-between">
                <span>{{ status.status }}</span>
                <span v-if="status.status == 'EC'">{{ $moment(status.booking_room?.checkout_date).format('DD-MMMM-YYYY HH:mm') }}</span>
                <span v-else>{{ $moment(status.created_at).format('DD-MMMM-YYYY HH:mm')}}</span>
              </div>
              <div class="d-flex justify-content-between" v-if="status.created_by !== null && status.created_by !== undefined">
                <span>Petugas</span>
                <span>{{ status.created_by.name }}</span>
              </div>
              
              <!-- 
              <div v-if="status.status == 'EC'">
                <div class="t-bold">Booking</div>
                <div class="d-flex justify-content-between">
                  <span>Guest</span>
                  <span>{{ status.booking_room?.guest}}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Checkin</span>
                  <span>{{ $moment(status.booking_room?.checkin_date).format('DD MMMM YYYY HH:mm')}}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Checkout</span>
                  <span>{{ $moment(status.booking_room?.checkout_date).format('DD MMMM YYYY HH:mm')}}</span>
                </div>
                 -->
            </div>
            <div v-if="shouldShowButton(detail.status)" class="d-flex justify-content-end my-3">
                  <ButtonBaseButton @click="verifyList(detail)">
                    Verify
                  </ButtonBaseButton>
            </div>
            <div v-if="shouldShowChecklistButton(detail.status)" class="d-flex justify-content-end my-3">
                  <ButtonBaseButton @click="checkListRoom(detail)">
                    Checklist Room
                  </ButtonBaseButton>
            </div>
          </div>
        </div>
      </div>
    </WidgetModalPad>
  </div>
</template>

<script setup>
  import VueDatePicker from "@vuepic/vue-datepicker";
  import "@vuepic/vue-datepicker/dist/main.css";
  import {
    useAuthStore
  } from "~/stores/auth";
  import {
    useNavigatorStore
  } from "~/stores/navigator";
  const navStore = useNavigatorStore();
  const authStore = useAuthStore();
  const {
    $bus,
    $moment
  } = useNuxtApp();
  navStore.setPage("Housekeeping");
  navStore.setSubpage("Rooms");
  const config = useRuntimeConfig();
  const date = ref({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });
  const roomType = ref('');
  const roomView = ref('');
  const detail = ref({})
  // Sample rooms data - Replace with actual API call
  const rooms = ref([]);
  const preservedRooms = ref([]);
  const roomTypes = ref([]);
  const roomStatus = ref('');
  const searchQuery = ref('');
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const bulans = ['01', '02', '03', '04', '05', '06',
    '07', '08', '09`', '10', '11', '12'
  ];
  

  const selectedMonth = ref(months[date.value.month]);
  const selectedYear = ref(date.value.year.toString());
  //const loading = ref(false);
  // Calculate days in selected month
  //const years = ['2024', '2025', '2026'];
  const daysInMonth = computed(() => {
    const monthIndex = months.indexOf(selectedMonth.value);
    const year = parseInt(selectedYear.value);
    return new Date(year, monthIndex + 1, 0).getDate();
  });
  const initData = async () => {
    $bus.$emit('loading', true);
    const {
      data,
      status,
      statusCode
    } = await $fetch(`${config.public.baseUrl}housekeeping/room-status`, {
      method: 'POST',
      lazy: true,
      headers: {
        'Authorization': 'Bearer ' + authStore.getToken
      },
      body: {
        month: date.value.year + "-" + bulans[date.value.month],
      }

    }).catch(err=>{
      $bus.$emit('loading', false)
    });
    $bus.$emit('loading', false)
    if (status == 1) {
      rooms.value = data.rooms;
      preservedRooms.value = data.rooms;
      roomTypes.value = data.room_type;
      console.log(data);
    }
  }

  initData();

  function isHoliday(day) {
    if (date.value === undefined) {
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

  const searchRoom = () => {
    selectedMonth.value = months[date.value.month];
    console.log(selectedMonth.value)
    initData();
  }

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
      selectedDate = new Date()
    }
    let tanggal = y + "-" + m + "-" + d;

    $bus.$emit('loading', true);
    const response = await $fetch(`${config.public.baseUrl}rooms/status-detail`, {
      method: 'POST',
      lazy: true,
      headers: {
        'Authorization': 'Bearer ' + authStore.getToken
      },
      body: {
        id: id,
        date: tanggal
      }
    }).catch(err => {
      $bus.$emit('loading', false);
    })
    $bus.$emit('loading', false);
    if (response.status == 1) {
      detail.value = response.data;
      $bus.$emit('openModal', {
        id: 'room-detail'
      })
    }

  }

  const filterByType = () => {
    if (roomType.value == "") {
      rooms.value = preservedRooms.value;
      return;
    }
    if (preservedRooms.value.length > 0) {
      let filteredRooms = [];
      if (roomView.value !== '') {
        filteredRooms = preservedRooms.value.filter(room => room.type === roomType.value && room.view === roomView.value);
      } else {
        filteredRooms = preservedRooms.value.filter(room => room.type === roomType.value);
      }
      rooms.value = filteredRooms;
    }
  }
  const filterByView = () => {
    if (roomView.value == "") {
      rooms.value = preservedRooms.value;
      return;
    }
    if (preservedRooms.value.length > 0) {
      let filteredRooms = [];
      if (roomType.value !== '') {
        filteredRooms = preservedRooms.value.filter(room => room.type === roomType.value && room.view === roomView.value);
      } else {
        filteredRooms = preservedRooms.value.filter(room => room.view === roomView.value);
      }
      rooms.value = filteredRooms;
    }
  }

  const shouldShowButton = (status) => {
    const user = authStore.getUser;
    let lastStatus = status[status.length - 1];
    if(lastStatus !== undefined) {
      if(lastStatus.status === 'VC' && user.jabatan == 'Supervisor') {
        return true;
      }
    }
    return false;
  };

  const shouldShowChecklistButton = (status) => {
    let lastStatus = status[status.length - 1];
    if(lastStatus !== undefined) {
      if(lastStatus.status === 'CO' && lastStatus.tanggal == $moment().format('YYYY-MM-DD')) {
        return true;
      }
    }
    return false;
  };

  const verifyList = async (detail) => {
    let status = detail.status[0];
    if(status !== undefined) {
      $fetch(`${config.public.baseUrl}housekeeping/find-checklist-room`, {
        method: 'POST',
        lazy: true,
        headers: {
          'Authorization': 'Bearer '+ authStore.getToken
        },
        body: {
          id: status.room_id,
          date:status.tanggal
        }
      }).then(response => {
        if(response.status == 1) {
          navigateTo(`/housekeeping/detail/${response.data.id}`);
        } else {
          $bus.$emit('alert', {
            type: 'danger',
            message: 'Checklist Room belum dibuat'
          })
        }
      })
      .catch(err => {
        console.log(err);
      })

    }
    //navigateTo(`/housekeeping/detail/${detail.id}`);
  };

  function filterByStatus(event) {
      //roomStatus.value = newValue;
      if (preservedRooms.value.length > 0) {
          let filteredRooms = [];
          filteredRooms = preservedRooms.value.filter(room => {
            let prices = room.actual_prices;
            let toDay = new Date().getDate();
            console.log(prices[toDay-1]);

            return prices[toDay -1].status == roomStatus.value;
          });
          rooms.value = filteredRooms;
      }
      let days = [];
      for(let i=0; i<daysInMonth.value; i++) {
        days.push({
          room_id: '',
          tanggal: '',
          status:''
        })
      }
      if(rooms.value.length == 0) {
        rooms.value.push({
          id: ' ',
          room_number: ' ',
          type: ' ',
          view: ' ',
          actual_prices: days
        })
      }
  }

  const checkListRoom = async (detail) => {
    navigateTo(`/housekeeping/add-check-list?id=${detail.id}`);
    
  };

  
  // Watch for month/year changes
  watch([selectedMonth, selectedYear], () => {
    initializePrices();
  });

  onMounted(() => {
    initializePrices();
    $bus.$emit('pagechange', {
      page: 'Room',
      subpage: 'Index Room'
    });
  });

  definePageMeta({
    middleware: ["auth"]
  });

  onMounted(() => {
    $bus.$emit("pagechange", {
      page: "Housekeeping",
      subpage: "Rooms"
    });
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
.current-day{
  font-weight: bold;
  border: 2px solid #1e1e1e;
}
</style>