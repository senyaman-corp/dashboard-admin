<template>
  <div class="overflow-auto max-vh-65">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase th-room-name th-sticky">
            Room
          </th>
          <th
            v-for="day in daysInMonth"
            :key="day"
            class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase"
            :class="{ 'text-danger': isHoliday(day) }">
            {{ day }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="room in rooms" :key="room.id">
          <td
            class="px-4 whitespace-nowrap border-bottom-1 border-gray-200 td-room-name">
            <div class="t-bold">{{ room.room_number }} - {{ room.name }}</div>
            <div class="small">{{ room.type }}({{ room.view }})</div>
          </td>

          <td
            v-for="(price, index) in room.actual_prices"
            :key="index"
            class="px-4 text-center border-bottom-1 border-gray-200"
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
            ]">
            <div @click="$emit('view-detail', room.id, index)">
              {{ price.status }}
            </div>
          </td>
        </tr>
       
      </tbody>
      <tfoot class="summary-footer">
        <tr>
            <td class="px-4 whitespace-nowrap border-bottom-1 border-gray-200 td-room-name">
              <div class="w-100 text-16 text-center t-bold">Bulanan</div>
              <div class="w-100 text-16 text-center">Ocupancies</div>
              <div class="w-100 text-16 text-center">Procent</div>
              </td>
            <td
              v-for="(sum, index) in summary"
              :key="index"
              class="text-center border-bottom-1 border-gray-200">
              <div class="w-100 text-16 text-center t-bold bg-label-info text-primary">{{ parseInt(sum.bulanan) > 0 ? sum.bulanan : '-' }}</div>
              <div class="w-100 text-16 text-center bg-label-danger text-hitem">{{ parseInt(sum.total) > 0 ? sum.total : '-' }}</div>
              <div class="w-100 text-16 text-center text-info">{{ (sum.total / rooms.length * 100).toFixed(1) }} %</div>
            </td>
          </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
 const props =  defineProps({
    rooms: Array,
    daysInMonth: Number,
    isHoliday: Function,
    summary:Array
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

  .td-room-name {
    left: 0px;
    position: sticky;
    background-color: #fff;
    ;
  }

  .th-sticky {
    left: 0px;
    position: sticky;
  }

  .th-room-name {
    z-index: 3;
  }
  .summary-footer{
    position:sticky;
    bottom:0;
    background-color: #fff;
  }
  .text-hitem{
  color:#000 !important;
  }
</style>