<template>
  <div>
    <CardBaseCard title="Tambah Booking">
      <FormBaseForm @submit="handleSubmit">
        <!-- Guest Information -->
        <div class="row">
          <div class="col-6">
            <InputBaseInput
              v-model="formData.name"
              label="Nama Lengkap"
              placeholder="Masukkan Nama Tamu" required
            />
          </div>
          <div class="col-6">
            <label class="form-label t-required">Jenis Kelamin</label>
            <select
              class="form-select form-select-lg"
              v-model="formData.gender" required
            >
              <option value="" selected>Pilih Jenis Kelamin</option>
              <option value="Male">Laki-Laki</option>
              <option value="Female">Perempuan</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <label class="form-label t-required">Nomor Telepon</label>
            <vue-tel-input v-model="formData.no_telp" :inputOptions="inputOptions" :mode="'international'" @validate="onValidate" @blur="searchGuest" :required="true"></vue-tel-input>
           
          </div>
          <div class="col-6">
            <InputBaseInput
              v-model="formData.age"
              label="Usia"
              placeholder="Masukkan Usia"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <InputBaseInput
              type="email"
              v-model="formData.email"
              label="Email"
              placeholder="Masukkan Email"
            />
          </div>
          <div class="col-6">
            <label class="form-label t-required">Booking Type</label>
            <select
              class="form-select form-select-lg"
              v-model="formData.booking_type" required
            >
              <option value="" selected>Pilih Booking Type</option>
              <option value="walk in">Walk In</option>
              <option value="call">Call</option>
              <option value="ota">OTA</option>
            </select>
          </div>
        </div>
        <InputBaseTextArea
          v-model="formData.address"
          label="Alamat"
          placeholder="Masukkan Alamat" required
        />

        <InputBaseUpload
          label="Foto KTP"
          id="fileUpload"
          @fileSelected="handleFile"
          accept=".jpg,.jpeg,.png"
        />
        <NuxtImg :src="fotoKTP" class="foto-kamar mb-3"></NuxtImg>

        <!-- Room Selection -->
        <div class="space-y-4">
          <div
            v-for="(roomSelection, index) in formData.selectedRooms"
            :key="index"
            class="border p-2 p-sm-4 rounded-lg"
          >
            <WidgetRoomBooking :index="index" @remove-room="removeRoom" />
          </div>
        </div>
        
        <div class="flex justify-between items-center mt-4">
          <ButtonBaseButton @click="addRoom" variant="secondary" type="button">
            Add Another Room
          </ButtonBaseButton>
        </div>
        
        <div class="row justify-content-end">
          <div class="col-md-1">
            <h5>Total</h5>
            
          </div>
          <div class="col-md-1 text-end">
            <h5>{{ calculateTotal.toLocaleString("id-ID") }}</h5>
          </div>
        </div>
        <div class="row justify-content-end">
          <div class="col-md-2 d-flex justify-content-between">
            <label class="text-18 form-check-label">
              Include Tax
            </label>
            <input
                type="checkbox"
                class="form-check-input"
                v-model="includeTax"
              />
          </div>
        </div>
        <div class="row justify-content-end" v-if="includeTax">
          <div class="col-md-1">
            <h5>TAX</h5>
          </div>
          <div class="col-md-1 text-end">
            <h5>{{ calculateTax.toLocaleString("id-ID") }}</h5>
          </div>
        </div>
        <div class="row justify-content-end">
          <div class="col-md-1">
            <h5>Grand Total</h5>
            
          </div>
          <div class="col-md-1 text-end">
            <h5>{{ calculateFinalPrice.toLocaleString("id-ID") }}</h5>
          </div>
        </div>
        
        <div class="d-flex justify-content-end">
          <ButtonBaseButton type="submit" variant="primary" class="mt-4 btn-lg">Submit Booking</ButtonBaseButton>
        </div>
      </FormBaseForm>
    </CardBaseCard>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";
const config = useRuntimeConfig();
const authStore = useAuthStore();
const { $bus, $swal, $formatDate } = useNuxtApp();
const includeTax = ref(false);
const formData = ref({
  guest_id: "",
  name: "",
  age: "",
  no_telp: "",
  countryCode:'',
  email: "",
  address: "",
  gender: "",
  ktp: null,
  total_price: 0,
  booking_type: "",
  selectedRooms: [
    {
      room_id: "",
      checkin_date: "",
      checkout_date: "",
      booking_package: "",
      price_booking_package: 0,
      preebuy: "",
      discount: 0,
      noofadult: "",
      noofchildren: "",
      early_checkin: 0,
      additional_charges:[],
      /*
      additional_name: "",
      additional_qty: 0,
      additional_base_price: 0,
      additional_discount: 0,
      additional_total_price: 0,
      */
      with_vehicle: null,
      no_pol: "",
      jenis: "",
      merek: "",
    },
  ],
});
const fotoKTP = ref(null);
const handleFile = (file) => {
  formData.value.ktp = file;
  var reader = new FileReader();
  reader.onload = function (e) {
    fotoKTP.value = e.target.result;
    console.log(e.target.result);
  };
  reader.readAsDataURL(file);
};

const inputOptions = {
    placeholder:'Masukan nomor telepon',
    required:true,
    showdialcode:true
  }

// Add another room selection
const addRoom = () => {
  formData.value.selectedRooms.push({ room_id: null });
};

// Remove a room selection
const removeRoom = (index) => {
  formData.value.selectedRooms.splice(index, 1);
};
const handleSubmit = async () => {
  $bus.$emit("loading", true);
  const form = new FormData();
  form.append("name", formData.value.name);
  form.append("age", formData.value.age);
  form.append("no_telp", formData.value.no_telp);
  form.append("email", formData.value.email);
  form.append("address", formData.value.address);
  form.append("gender", formData.value.gender);
  form.append("booking_type", formData.value.booking_type);
  form.append("total_price", formData.value.total_price);
  formData.value.selectedRooms.forEach((room) => {
    const checkinDate = room.checkin_date
      ? `${room.checkin_date.toISOString().split("T")[0]} 14:00:00`
      : "";
    const checkoutDate = room.checkout_date
      ? `${room.checkout_date.toISOString().split("T")[0]} 12:00:00`
      : "";
    form.append('guest_id',formData.value.guest_id || '');
    form.append("room_id[]", room.room_id || "");
    form.append("checkin_date[]", checkinDate);
    form.append("checkout_date[]", checkoutDate);
    form.append("booking_package[]", room.booking_package || "");
    form.append("price_booking_package[]", room.price_booking_package || 0);
    form.append("discount[]", room.discount || 0);
    form.append("pre_buy[]", room.preebuy || "");
    form.append("early_checkin[]", room.early_checkin || 0);
    form.append("noofadult[]", room.noofadult || "");
    form.append("noofchildren[]", room.noofchildren || "");
    form.append("additional_charges[]", room.additional_charges || []);
    
    /*
    form.append("additional_qty[]", room.additional_qty || "");
    form.append("additional_base_price[]", room.additional_base_price || "");
    form.append("additional_discount[]", room.additional_discount || "");
    form.append("additional_total_price[]", room.additional_total_price || 0);
    */
    form.append("with_vehicle[]", room.with_vehicle);
    form.append("no_pol[]", room.no_pol || "");
    form.append("jenis[]", room.jenis || "");
    form.append("merek[]", room.merek || "");
    form.append("booking_period[]", room.booking_period || "");
    form.append('include_tax',includeTax.value ? 1 : 0)
  });

  if (formData.value.ktp) {
    form.append("ktp", formData.value.ktp);
  }

  try {
    $fetch(`${config.public.baseUrl}bookings/create`, {
      method: "POST",
      lazy: true,
      body: form,
      headers: {
        Authorization: "Bearer " + authStore.getToken,
      },
    }).then((response) => {
      $bus.$emit("loading", false);
      if (response.status == 1) {
        $swal
          .fire({
            title: "Booking",
            text: "Booking Berhasil",
            icon: "success",
            confirmButtonText: "OK",
          })
          .then((result) => {
            if (result.isConfirmed) {
              navigateTo("/booking");
            }
          });
      } else {
        $swal.fire({
          position: "bottom-end",
          text: response.message,
          showConfirmButton: true,
        })
      }
    });
  } catch (error) {
    $bus.$emit("loading", false);
    console.error("Request failed:", error);
  }
};

const calculateTotal = computed(() => {
  return formData.value.selectedRooms.reduce((total, selection) => {
    if(selection.sub_total){
      return total + selection.sub_total;
    }
    return total;
  }, 0);
});
const calculateTax = computed(() => {
  return includeTax.value ? Math.ceil(calculateTotal.value * 0.23 /1000) * 1000 : 0;
});
const calculateFinalPrice = computed(() => {
  formData.value.total_price = calculateTotal.value + calculateTax.value;
  return calculateTotal.value + calculateTax.value;
});
const onValidate = (phoneObject)=>{
  formData.value.countryCode = phoneObject.country;
}

const searchGuest = async (event) => {
  console.log(event.target.value);
  let phone = event.target.value;
  if(phone){
    phone = phone.replace(/\D/g, '');
    $bus.$emit("loading", true);
    const { data,status} = await $fetch(`${config.public.baseUrl}guests/find-by-phone`,{
      method:'POST',
      headers:{
        'Authorization':'Bearer ' + authStore.getToken
      },
      body:{
        no_telp:phone
      }
    });
    $bus.$emit("loading", false);
    if(status == 1){
      formData.value.name = data.name || '';
      formData.value.email = data.email || '';
      formData.value.age = data.age || '';
      formData.value.gender = data.gender || '';
      formData.value.address = data.address || '';
      formData.value.no_telp = data.no_telp || '';
      
      fotoKTP.value = data.ktp ? `${config.public.dashboardUrl}api/foto-ktp?token=${authStore.getToken}&id=${data.id}` : '';
      formData.value.countryCode = data.country_code || '';
      formData.value.guest_id = data.id || '';
    }
  }
}

onMounted(() => {
  $bus.$emit("pagechange", { page: "Booking", subpage: "Index Booking" });
  $bus.$on("update:model-value", (value) => {
    formData.value.selectedRooms[value.index] = value;
  });
});

definePageMeta({
  middleware: ["auth"],
});
</script>

<style scoped>
.room-selection {
  border: 1px solid #e2e8f0;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
}
.max-vh-50 {
  max-height: 30vh;
  overflow-y: auto;
}
tr {
  cursor: pointer;
}
tr.selected {
  background: linear-gradient(90deg, #b5e4b6, transparent);
}
.vue-tel-input{
  border:1px solid #f0f0f0;
}
.form-check-input{
  border:1px solid #a5aeb1 !important;
}
</style>
