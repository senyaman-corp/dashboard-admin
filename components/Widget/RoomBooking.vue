<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <h3 class="font-medium">Room {{ index + 1 }}</h3>
      <ButtonBaseButton
        v-if="index > 0"
        @click="removeRoom(index)"
        variant="danger"
        type="button"
      >
        Remove Room
      </ButtonBaseButton>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label">Tanggal Checkin</label>
          <VueDatePicker
            v-model="checkin_date"
            auto-apply
            :format="'yyyy-MM-dd'"
            placeholder="Tanggal Checkin"
            @update:model-value="handleStartDate(checkin_date)"
            :min-date="new Date()"
          ></VueDatePicker>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label">Tanggal Checkout</label>
          <VueDatePicker
            v-model="checkout_date"
            auto-apply
            :format="'yyyy-MM-dd'"
            placeholder="Tanggal Checkout"
            @update:model-value="handleEndDate(checkout_date)"
            :min-date="nextDay"
          ></VueDatePicker>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <InputRoomSelect
          v-model="room_id"
          :label="'Select Room'"
          placeholder="Select Room"
          :options="availableRooms"
          :searchable="true"
          :multiple="false"
          @update:model-value="findPreBuyPrice(room_id)"
        />
      </div>
      <div class="col-md-6">
        <InputBaseInput
          type="number"
          v-model="discount"
          label="Discount"
          placeholder="Masukkan Harga Discount"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <InputBaseInput
            type="number"
            v-model="noofadult"
            label="Jumlah Dewasa"
            placeholder="Masukkan Jumlah Dewasa"
          />
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <InputBaseInput
            type="number"
            v-model="noofchildren"
            label="Jumlah Anak Anak"
            placeholder="Masukkan Jumlah Anak Anak"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label for="" class="form-label">Booking Package</label>
          <select
            class="form-select form-select-lg"
            v-model="booking_package"
          >
            <option value="" selected>Pilih Booking Package</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Non Breakfast">Non Breakfast</option>
          </select>
        </div>
      </div>
      <div class="col-md-6" v-if="booking_package == 'Breakfast'">
        <div class="mb-3">
          <InputBaseInput
            v-model="price_booking_package"
            label="Price Booking Package"
            placeholder="Masukkan Price Booking Package"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <InputBaseInput
          v-model="early_checkin"
          label="Early Checkin?"
          placeholder="Masukkan Early Checkin"
        />
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <label for="" class="form-label">Preebuy?</label>
          <select
            class="form-select form-select-lg"
            v-model="preebuy"
          >
            <option value="" selected>Pilih Preebuy</option>
            <option v-for="prebuy in preBuyData" :key="prebuy.id" :value="prebuy.id">{{prebuy.vendor}}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label for="" class="form-label">Membawa kendaraan?</label>
          <select
            class="form-select form-select-lg"
            v-model="with_vehicle"
          >
            <option value="" selected>Membawa kendaraan?</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
      </div>
      <div class="col-md-6" v-if="with_vehicle == 1">
        <InputBaseInput
          v-model="no_pol"
          label="No Polisi Kendaraan"
          placeholder="Masukkan No Polisi Kendaraan"
        />
      </div>
    </div>
    <div class="row" v-if="with_vehicle == 1">
      <div class="col-md-6">
        <InputBaseInput
          v-model="jenis"
          label="Jenis Kendaraan"
          placeholder="Masukkan Jenis Kendaraan"
        />
      </div>
      <div class="col-md-6">
        <InputBaseInput
          v-model="merek"
          label="Merek Kendaraan"
          placeholder="Masukkan Merek Kendaraan"
        />
      </div>
    </div>
    <h5>
      Sub Total = Rp
      {{ subTotal.toLocaleString("id-ID") }}
    </h5>
  </div>
</template>

<script setup>
const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
 
 
});
import { useAuthStore } from "~/stores/auth";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
const config = useRuntimeConfig();
const authStore = useAuthStore();
const checkin_date = ref(new Date());
const checkout_date = ref(new Date());
const room_id = ref('');
const discount = ref('0');
const noofadult = ref('0');
const noofchildren = ref('0');
const booking_package = ref("");
const price_booking_package = ref('0');
const early_checkin = ref('0');
const preebuy = ref("");
// const roomOptions = ref([]);
const availableRooms = ref([]);
const with_vehicle = ref(0);
const no_pol = ref("");
const jenis = ref("");
const merek = ref("");
const subTotal = ref(0);
const nextDay = ref(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
const emit = defineEmits(["update:modelValue","remove-room"]);
const { $bus } = useNuxtApp();

const preBuyData = ref([]);

const removeRoom = (index) => {
  emit("remove-room", index);
};
const calculateSubTotal = (selection) => {
    return '';
}

const handleStartDate = () => {
    nextDay.value.setDate(new Date(checkin_date.value).getDate() + 1);
  
};

const handleEndDate = () => {
  if (checkin_date.value && checkout_date.value) {
    searchRoom(checkin_date.value, checkout_date.value);
  }
};

const searchRoom = async (startDate, endDate) => {
  try {
    const { data, status, statusCode } = await $fetch(
      `${config.public.baseUrl}rooms/check-available-room`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + authStore.getToken,
        },
        body: {
          start_date: startDate,
          end_date: endDate,
        },
      }
    );

    if (status === 1) {
        availableRooms.value = data.map((room) => {
            return {
                label: `${room.room_number} - ${room.name}`,
                value: room.id,
                room_number: room.room_number,
                name: room.name,
                price: room.actual_prices,
                type: room.type,
                view: room.view,
                default_price: room.default_price,
            }
        });
    } else if (statusCode === 403) {
      navigateTo("/login");
    }
  } catch (error) {
    console.error("Error fetching available rooms:", error);
  }
};

const findPreBuyPrice = async (id) => {
  const {data,status} = await $fetch(`${config.public.baseUrl}pre-buy/data-availability`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authStore.getToken,
    },
    body: {
      room_id: id,
    },
  });
  if(status == 1){
    preBuyData.value = data;
    console.log(preBuyData.value);
  }
};
const calculate = () => {
    const result = availableRooms.value.find(room => room.value === room_id.value);
    let jumlah =0;
    if(result !== undefined){
        let price = result.price;
        price.forEach(item=>{
            jumlah += parseInt(item.price);
        })
    }
    let disc = discount.value ? parseInt(discount.value) : 0;
    let breakfast = price_booking_package.value ? parseInt(price_booking_package.value) : 0;
    let earlyCheck = early_checkin.value ? parseInt(early_checkin.value) : 0;
    jumlah -= disc;
    jumlah += breakfast;
    jumlah += earlyCheck;
    subTotal.value = jumlah;
}

watch([
    checkin_date,checkout_date,room_id,discount,noofadult,noofchildren,
    booking_package,price_booking_package,early_checkin,
    preebuy,with_vehicle,no_pol,jenis,merek],(newValue)=>{
        calculate();
        $bus.$emit('update:model-value',{
            index:props.index,
            checkin_date: checkin_date.value,
            checkout_date: checkout_date.value,
            room_id: room_id.value,
            discount: discount.value,
            noofadult: noofadult.value,
            noofchildren: noofchildren.value,
            booking_package: booking_package.value,
            price_booking_package: price_booking_package.value,
            early_checkin: early_checkin.value,
            preebuy: preebuy.value,
            with_vehicle: with_vehicle.value,
            no_pol: no_pol.value,
            jenis: jenis.value,
            merek: merek.value,
            sub_total: subTotal.value
        })
    }
)

</script>

<style></style>
