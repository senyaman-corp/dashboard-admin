<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <h3 class="font-medium">Room {{ index + 1 }}</h3>
      <ButtonBaseButton
        v-if="index > 0"
        @click="removeRoom(index)"
        variant="danger"
        type="button">
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
            locale="ID" required></VueDatePicker>
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
            locale="ID" required></VueDatePicker>
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
          :required="true" />
      </div>
      <div class="col-md-6">
        <InputAutonumeric
         
          v-model="discount"
          label="Discount"
          placeholder="Masukkan Harga Discount" />
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
            :required="true" />
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <InputBaseInput
            type="number"
            v-model="noofchildren"
            label="Jumlah Anak Anak"
            placeholder="Masukkan Jumlah Anak Anak" />
        </div>
      </div>
    </div>
    <hr />
    <h4 class="t-bold">Package And Charges</h4>
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="" class="form-label t-required">Booking Package</label>
          <select class="form-select form-select-lg mb-3" v-model="booking_package" required>
            <option value="" selected>Select Package</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Non Breakfast">Non Breakfast</option>
          </select>
          <div class="mb-3" v-if="booking_package === 'Breakfast'">
            <InputAutonumeric
              v-model="price_booking_package"
              label="Kupon Breakfast @2 Orang"
              :disabled="booking_package !== 'Breakfast'"
              :required="booking_package === 'Breakfast'"
              placeholder="Harga Breakfast" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label class="form-label">Additional Charge</label>
          <select class="form-select form-select-lg mb-3" v-model="additional_name" @change="addAdditionalCharge(additional_name)">
            <option value="" selected>Select Additional Charge</option>
            <option  v-for="charge in addChargesData" :key="charge.id" :value="charge.name">{{ charge.name }}</option>
          </select>
        </div>
        <div class="row" v-for="(charge,index) in additionalCharges" :key="index">
          <div class="col-md-4">
            <InputAutonumeric
              v-model="additionalCharges[index].price"
              label="Price"
              required
              placeholder="Masukkan Price" />
          </div>
          <div class="col-md-3">
            <InputBaseInput
              type="number"
              v-model="additionalCharges[index].qty"
              label="Quantity"
              required
              placeholder="Input Quantity" />
          </div>
          <div class="col-md-4">
            <InputAutonumeric
              type="number"
              v-model="additionalCharges[index].discount"
              label="Discount"
              required
              placeholder="Input Discount" />
          </div>
          <div class="col-md-1">
            <div class="mb-2">&nbsp;</div>
            <ButtonBaseButton
              @click="removeAdditionalCharge(index)"
              variant="danger"
              type="button" class="mt-1">
              <i class="fas fa-trash-alt"></i>
            </ButtonBaseButton>
          </div>

        </div>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label for="" class="form-label">Preebuy?</label>
          <select class="form-select form-select-lg" v-model="preebuy">
            <option value="" selected>Pilih Preebuy</option>
            <option value="1">Ya</option>
            <option value="0">Tidak</option>
          </select>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <label for="" class="form-label">Membawa kendaraan?</label>
          <select class="form-select form-select-lg" v-model="with_vehicle">
            <option value="" selected>Membawa kendaraan?</option>
            <option value="1">Ya</option>
            <option value="0">Tidak</option>
          </select>
        </div>
      </div>
    </div>
    <div class="row" v-if="with_vehicle == 1">
      <div class="col-md-6">
        <InputBaseInput
          v-model="no_pol"
          label="No Polisi Kendaraan"
          placeholder="Masukkan No Polisi Kendaraan" />
      </div>
      <div class="col-md-6" >
        <InputBaseInput
          v-model="jenis"
          label="Jenis Kendaraan"
          placeholder="Masukkan Jenis Kendaraan" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label">Periode</label>
          <select class="form-select form-select-lg" v-model="booking_period">
            <option value="harian">Harian</option>
            <option value="mingguan">Mingguan</option>
            <option value="bulanan">Bulanan</option>
          </select>
        </div>
      </div>
      <div class="col-md-6">
        <div class="text-end mt-5">
          <h5 class="text-end">
            Sub Total = Rp
            {{ subTotal.toLocaleString("id-ID") }}
          </h5>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
  const props = defineProps({
    index: {
      type: Number,
      required: true,
    },
  });

  import {
    useAuthStore
  } from "~/stores/auth";
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
  const preebuy = ref(0);
  const availableRooms = ref([]);
  const additional_name = ref("");
  const with_vehicle = ref('');
  const no_pol = ref("");
  const jenis = ref("");
  const merek = ref("");
  const subTotal = ref(0);
  const booking_period = ref("harian");
  const nextDay = ref(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
  const emit = defineEmits(["update:modelValue", "remove-room"]);
  const additionalCharges = ref([]);
  const addChargesData = ref([]);

  const {
    $bus,
    $moment
  } = useNuxtApp();

  const preBuyData = ref([]);
  const { data,status} = await $fetch(`${config.public.baseUrl}bookings/additional-charges`,{
    method: "POST",
    headers: {
      Authorization: "Bearer " + authStore.getToken,
    },
  });
  if(status == 1){
    addChargesData.value = data;
    
  }
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
      const {
        data,
        status,
        statusCode
      } = await $fetch(
        `${config.public.baseUrl}rooms/check-available-room`, {
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
    const {
      data,
      status
    } = await $fetch(
      `${config.public.baseUrl}pre-buy/data-availability`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + authStore.getToken,
        },
        body: {
          room_id: id,
          start_date: $moment(checkin_date.value).format('YYYY-MM-DD'),
          end_date: $moment(checkout_date.value).format('YYYY-MM-DD'),
        },
      }
    );
    if (status == 1) {
      preBuyData.value = data;
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
        let breakfast = price_booking_package.value ?
          parseInt(price_booking_package.value) :
          0;
        additionalCharges.value.forEach((item) => {
          jumlah += (item.price * item.qty) - item.discount;
        });
        jumlah -= disc;
        jumlah += breakfast;
      });

    }
    let earlyCheck = early_checkin.value ? parseInt(early_checkin.value) : 0;
    jumlah += earlyCheck;
    subTotal.value = jumlah;
  };

  const addAdditionalCharge = (name) => {
    let adDilter = additionalCharges.value.filter(itm => {
      return itm.name == name;
    });
    let adItemName = addChargesData.value.find(itm => {
      return itm.name == name;
    });
    if (name !== "" && adDilter.length == 0) {
      additionalCharges.value.push({
        name: name,
        price: adItemName.base_price,
        qty: 1,
        discount: adItemName.discount
      });
    }
  };
  const removeAdditionalCharge = (index) => {
    additionalCharges.value.splice(index, 1);
  };
  watch(booking_package, (newValue) => {
      if(newValue == 'Breakfast'){
        addChargesData.value.forEach(itm=>{
          if(itm.name == 'Breakfast'){
            price_booking_package.value = itm.base_price;
          }
        });
      }else{
        price_booking_package.value = 0;
      }
  });
  watch(
  () =>  [
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
      with_vehicle,
      no_pol,
      jenis,
      merek,
      subTotal,
      additionalCharges
    ],
  (newValue, oldValue) => {
    calculate();
    
      const modelValue = {
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
        additional_charges: JSON.stringify(additionalCharges.value),
        with_vehicle: with_vehicle.value,
        no_pol: no_pol.value,
        jenis: jenis.value,
        merek: merek.value,
        sub_total: subTotal.value,
        booking_period: booking_period.value
      };
      $bus.$emit("update:model-value", modelValue);
  },
  { deep: true });
  
</script>

<style></style>