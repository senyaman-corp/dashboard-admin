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
              placeholder="Masukkan Nama Tamu"
            />
          </div>
          <div class="col-6">
            <label class="form-label">Jenis Kelamin</label>
            <select
              class="form-select form-select-lg"
              v-model="formData.gender"
            >
              <option value="" selected>Pilih Jenis Kelamin</option>
              <option value="Male">Laki-Laki</option>
              <option value="Female">Perempuan</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <InputBaseInput
              type="number"
              v-model="formData.no_telp"
              label="Nomor Telepon"
              placeholder="Masukkan No Telepon"
            />
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
            <label class="form-label">Booking Type</label>
            <select
              class="form-select form-select-lg"
              v-model="formData.booking_type"
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
          placeholder="Masukkan Alamat"
        />

        <InputBaseUpload
          label="Foto KTP"
          id="fileUpload"
          @fileSelected="handleFile"
          accept=".jpg,.jpeg,.png"
        />
        <NuxtImg :src="fotoKTP" class="foto-kamar"></NuxtImg>

        <!-- Room Selection -->
        <div class="space-y-4">
          <div
            v-for="(roomSelection, index) in formData.selectedRooms"
            :key="index"
            class="border p-4 rounded-lg"
          >
            <WidgetRoomBooking :index="index" @remove-room="removeRoom" />
          </div>
        </div>

        <div class="flex justify-between items-center mt-4">
          <ButtonBaseButton @click="addRoom" variant="secondary" type="button">
            Add Another Room
          </ButtonBaseButton>

          <div class="mt-3">
            <h5>Total: Rp {{ calculateTotal.toLocaleString("id-ID") }}</h5>
            <h5>TAX 23% = Rp {{ calculateTax.toLocaleString("id-ID") }}</h5>
            <h5>
              Final Price = Rp {{ calculateFinalPrice.toLocaleString("id-ID") }}
            </h5>
          </div>
        </div>

        <ButtonBaseButton type="submit" variant="primary" class="mt-4"
          >Submit Booking</ButtonBaseButton
        >
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
const formData = ref({
  name: "",
  age: "",
  no_telp: "",
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
      additional_name: "",
      additional_qty: 0,
      additional_base_price: 0,
      additional_discount: 0,
      additional_total_price: 0,
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
    form.append("additional_name[]", room.additional_name || "");
    form.append("additional_qty[]", room.additional_qty || "");
    form.append("additional_base_price[]", room.additional_base_price || "");
    form.append("additional_discount[]", room.additional_discount || "");
    form.append("additional_total_price[]", room.additional_total_price || 0);
    form.append("with_vehicle[]", room.with_vehicle || null);
    form.append("no_pol[]", room.no_pol || "");
    form.append("jenis[]", room.jenis || "");
    form.append("merek[]", room.merek || "");
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
        console.error("Error:", response);
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
  return Math.ceil(calculateTotal.value * 0.23 /1000) * 1000;
});
const calculateFinalPrice = computed(() => {
  formData.value.total_price = calculateTotal.value + calculateTax.value;
  return calculateTotal.value + calculateTax.value;
});

onMounted(() => {
  $bus.$emit("pagechange", { page: "Booking", subpage: "Index Booking" });
  $bus.$on("update:model-value", (value) => {
    formData.value.selectedRooms[value.index] = value;
    console.log(value);
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
</style>
