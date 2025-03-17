<template>
  <div>
      <CardBaseCard title="Room Pricing Management">
          <div class="mb-4 flex justify-between items-center">
              <div class="flex gap-4">
                  <InputWithCombobox 
                      v-model="selectedMonth" 
                      :options="months" 
                      label="Month" 
                      :id="'month'" 
                  />
                  <InputWithCombobox 
                      v-model="selectedYear" 
                      :options="years" 
                      label="Year" 
                      :id="'year'" 
                  />
              </div>
              <ButtonBaseButton @click="searchPrice" variant="primary">
                  Save All Changes
              </ButtonBaseButton>
          </div>

          <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                      <tr>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                          <th v-for="day in daysInMonth" :key="day" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                              {{ day }}
                          </th>
                      </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="room in rooms" :key="room.id">
                          <td class="px-4 py-3 whitespace-nowrap">
                              {{ room.room_number }} - {{ room.name }}
                          </td>
                          
                          <td v-for="(price,index) in room.actual_prices" :key="index" class="px-2 py-2">
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
import { useAuthStore } from "~/stores/auth";
const authStore = useAuthStore();
const config = useRuntimeConfig();
const { $bus } = useNuxtApp();
import { ref, computed } from 'vue';

// Sample rooms data - Replace with actual API call
const rooms = ref([
  { id: 1, room_number: '101', name: 'Deluxe Mountain View' },
  { id: 2, room_number: '102', name: 'Studio City View' },
]);

const months = ['January', 'February', 'March', 'April', 'May', 'June', 
              'July', 'August', 'September', 'October', 'November', 'December'];
const years = ['2024', '2025', '2026'];

const selectedMonth = ref(months[new Date().getMonth()]);
const selectedYear = ref(new Date().getFullYear().toString());

// Calculate days in selected month
const daysInMonth = computed(() => {
  const monthIndex = months.indexOf(selectedMonth.value);
  const year = parseInt(selectedYear.value);
  return new Date(year, monthIndex + 1, 0).getDate();
});

const { data, status, statusCode} = await $fetch(`${config.public.baseUrl}rooms/list`,{
          method:'POST',
          lazy: true,
          headers:{
            'Authorization':'Bearer ' + authStore.getToken
          },
          
      });
      console.log("Rooms",data)
if(status == 1){
  rooms.value = data ;
  console.log("Rooms",rooms.value)
}else{
  if(statusCode == 403){
    //redirect login;
  }
}

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

// Handle price changes
const priceChanged = (roomId, day) => {
  console.log(`Price changed for room ${roomId} on day ${day}: ${roomPrices.value[roomId][day]}`);
};

// Save all price changes
const searchPrice = async () => {
  try {
      // Here you would implement the API call to save the prices
      console.log('Saving prices:', roomPrices.value);
      // await savePricesToAPI(roomPrices.value);
  } catch (error) {
      console.error('Error saving prices:', error);
  }
};

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
</style>