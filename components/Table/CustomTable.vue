<template>
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
            <div class="t-bold">{{ room.room_number }} - {{ room.name }}</div>
            <div class="small">{{ room.type }}({{ room.view }})</div>
          </td>

          <td
            v-for="(price, index) in room.actual_prices"
            :key="index"
            class="px-4 py-2 text-center border-bottom-1 border-gray-200"
            :class="[
              'room-item',
              't-bold',
              'text-16',
              {
                'badge-success p-2': price.status === 'VR',
                'badge-info p-2': price.status === 'VC',
                'badge-warning p-2': price.status === 'VD',
                'badge-danger p-2': price.status === 'OO',
                'text-danger': isHoliday(index + 1),
              },
            ]"
          >
            <div @click="$emit('view-detail', room.id, index)">
              {{ price.status }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  rooms: Array,
  daysInMonth: Number,
  isHoliday: Function,
});

defineEmits(["view-detail"]);
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
