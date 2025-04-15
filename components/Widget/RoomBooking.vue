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
          <label class="form-label t-required">Tanggal Checkin</label>
          <VueDatePicker
            v-model="checkin_date"
            auto-apply
            :format="'yyyy-MM-dd'"
            placeholder="Tanggal Checkin"
            @update:model-value="handleStartDate(checkin_date)"
            :min-date="new Date()"
            locale="ID" required
          ></VueDatePicker>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label t-required">Tanggal Checkout</label>
          <VueDatePicker
            v-model="checkout_date"
            auto-apply
            :format="'yyyy-MM-dd'"
            placeholder="Tanggal Checkout"
            @update:model-value="handleEndDate(checkout_date)"
            :min-date="nextDay"
            locale="ID" required
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
          :required="true"
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
            :required="true"
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
          <label for="" class="form-label t-required">Booking Package</label>
          <select class="form-select form-select-lg" v-model="booking_package" required>
            <option value="" selected>Pilih Booking Package</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Non Breakfast">Non Breakfast</option>
          </select>
        </div>
      </div>
      <div class="col-md-6" v-if="booking_package == 'Breakfast'">
        <div class="mb-3">
          <InputAutonumeric
              v-model="price_booking_package"
              label="Price Booking Package"
              placeholder="Masukkan Price Booking Package" 
              />
         
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <InputAutonumeric
          v-model="early_checkin"
          label="Early Checkin?"
          placeholder="Masukkan Early Checkin"
        />
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <label for="" class="form-label">Preebuy?</label>
          <select class="form-select form-select-lg" v-model="preebuy">
            <option value="" selected>Pilih Preebuy</option>
            <option
              v-for="prebuy in preBuyData"
              :key="prebuy.id"
              :value="prebuy.id"
            >
              {{ prebuy.vendor }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <label class="form-label">Additional Charge</label>
        <select class="form-select form-select-lg" v-model="additional_name">
          <option value="" selected>Select Additional Charge</option>
          <option value="Extra Bed">Extra Bed</option>
        </select>
      </div>
      <div class="col-6">
        <InputBaseInput
          type="number"
          v-model="additional_qty"
          label="Quantity"
          placeholder="Input Quantity"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <InputAutonumeric
          type="number"
          v-model="additional_base_price"
          label="Price"
          placeholder="Input Price"
        />
      </div>
      <div class="col-6">
        <InputAutonumeric
          type="number"
          v-model="additional_discount"
          label="Discount"
          placeholder="Input Discount"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label for="" class="form-label">Membawa kendaraan?</label>
          <select class="form-select form-select-lg" v-model="with_vehicle">
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
const room_id = ref("");
const discount = ref(0);
const noofadult = ref(null);
const noofchildren = ref(null);
const booking_package = ref("");
const price_booking_package = ref(0);
const early_checkin = ref(0);
const preebuy = ref("");
const availableRooms = ref([]);
const additional_name = ref("");
const additional_qty = ref(0);
const additional_base_price = ref(0);
const additional_discount = ref(0);
const additional_total_price = ref(0);
const with_vehicle = ref(0);
const no_pol = ref("");
const jenis = ref("");
const merek = ref("");
const subTotal = ref(0);
const nextDay = ref(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
const emit = defineEmits(["update:modelValue", "remove-room"]);
const { $bus,$formatUtcDateTime,$moment } = useNuxtApp();

const preBuyData = ref([]);

const removeRoom = (index) => {
  emit("remove-room", index);
};

const handleStartDate = () => {
  nextDay.value.setDate(new Date(checkin_date.value).getDate() + 1);
};

const handleEndDate = () => {
  if (checkin_date.value && checkout_date.value) {
    searchRoom($moment(checkin_date.value).format('YYYY-MM-DD HH:mm'), $moment(checkout_date.value).format('YYYY-MM-DD HH:mm'));
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
        };
      });
    } else if (statusCode === 403) {
      navigateTo("/login");
    }
  } catch (error) {
    console.error("Error fetching available rooms:", error);
  }
};

const findPreBuyPrice = async (id) => {
  const { data, status } = await $fetch(
    `${config.public.baseUrl}pre-buy/data-availability`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + authStore.getToken,
      },
      body: {
        room_id: id,
      },
    }
  );
  if (status == 1) {
    preBuyData.value = data;
    console.log(preBuyData.value);
  }
};
const calculate = () => {
  const result = availableRooms.value.find(
    (room) => room.value === room_id.value
  );
  let jumlah = 0;
  if (result !== undefined) {
    let price = result.price;
    price.forEach((item) => {
      jumlah += parseInt(item.price);
      let disc = discount.value ? parseInt(discount.value) : 0;
      let breakfast = price_booking_package.value
        ? parseInt(price_booking_package.value)
        : 0;
      let add_qty = additional_qty.value
        ? parseInt(additional_qty.value)
        : 0;
      let add_price = additional_base_price.value
        ? parseInt(additional_base_price.value)
        : 0;
      let add_disc = additional_discount.value
        ? parseInt(additional_discount.value)
        : 0;
      let add_total = additional_total_price.value
        ? parseInt(additional_total_price.value)
        : 0;
      jumlah -= disc;
      jumlah += breakfast;
      additional_total_price.value = (add_qty * add_price) - add_disc;
      jumlah += additional_total_price.value;
    });
    
  }
  let earlyCheck = early_checkin.value ? parseInt(early_checkin.value) : 0;
  jumlah += earlyCheck;
  subTotal.value = jumlah;
};

watch(
  [
    checkin_date,
    checkout_date,
    room_id,
    discount,
    noofadult,
    noofchildren,
    booking_package,
    price_booking_package,
    early_checkin,
    preebuy,
    additional_name,
    additional_qty,
    additional_base_price,
    additional_discount,
    additional_total_price,
    with_vehicle,
    no_pol,
    jenis,
    merek,
    subTotal,
  ],
  (newValue) => {
    calculate();
    console.log("SUbTotal",subTotal.value)
    $bus.$emit("update:model-value", {
      index: props.index,
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
      additional_name: additional_name.value,
      additional_qty: additional_qty.value,
      additional_base_price: additional_base_price.value,
      additional_discount: additional_discount.value,
      additional_total_price: additional_total_price.value,
      with_vehicle: with_vehicle.value,
      no_pol: no_pol.value,
      jenis: jenis.value,
      merek: merek.value,
      sub_total: subTotal.value,
    });
  }
);

console.log($moment().format('YYYY-MM-DD HH:mm:ss'));
</script>

<style></style>
