<template>
  <div>
    <CardBaseCard title="Tambah Booking">
      <FormBaseForm @submit="handleSubmit">
        <!-- Guest Information -->
        <InputBaseInput
          v-model="formData.name"
          label="Nama Lengkap"
          placeholder="Masukkan Nama Tamu"
        />
        <InputBaseInput
          type="number"
          v-model="formData.no_telp"
          label="Nomor Telepon"
          placeholder="Masukkan No Telepon"
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
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-medium">Room {{ index + 1 }}</h3>
              <ButtonBaseButton
                v-if="index > 0"
                @click="removeRoom(index)"
                variant="danger"
                type="button" >
                Remove Room
              </ButtonBaseButton>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Tanggal Checkin</label>
                  <VueDatePicker
                    v-model="roomSelection.checkin_date"
                    auto-apply
                    :format="'yyyy-MM-dd'"
                    placeholder="Tanggal Checkin"
                    @update:model-value="handleStartDate(index)"
                  ></VueDatePicker>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Tanggal Checkout</label>
                  <VueDatePicker
                    v-model="roomSelection.checkout_date"
                    auto-apply
                    :format="'yyyy-MM-dd'"
                    placeholder="Tanggal Checkout"
                    @update:model-value="handleEndDate(index)"
                  ></VueDatePicker>
                </div>
              </div>
            </div>
            <InputWithCombobox
              v-model="roomSelection.room_id"
              label="Select Room"
              placeholder="Select Room"
              :options="roomOptions"
              :searchable="true"
              :multiple="false"
             
            />
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <InputBaseInput
                    type="number"
                    v-model="roomSelection.noofadult"
                    label="Jumlah Dewasa"
                    placeholder="Masukkan Jumlah Dewasa"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <InputBaseInput
                    type="number"
                    v-model="roomSelection.noofchildren"
                    label="Jumlah Anak Anak"
                    placeholder="Masukkan Jumlah Anak Anak"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <InputBaseInput
                    v-model="roomSelection.booking_type"
                    label="Booking Type"
                    placeholder="Masukkan Booking Type"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <InputBaseInput
                    v-model="roomSelection.booking_package"
                    label="Booking Package"
                    placeholder="Masukkan Booking Package"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center mt-4">
          <ButtonBaseButton @click="addRoom" variant="secondary" type="button">
            Add Another Room
          </ButtonBaseButton>

          <div class="text-right">
            <div class="text-lg font-bold">
              Total: {{ formatPrice(calculateTotal) }}
            </div>
            <div class="text-sm text-gray-600">
              {{ getTotalNights }} night(s)
            </div>
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
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const { $bus, $readInputFile,$formatDate } = useNuxtApp();
const formData = ref({
  name: "",
  no_telp: "",
  ktp: null,
  //   room_id:[],
  //   checkin_date: [],
  //   checkout_date: [],
  //   current_price: [],
  //   booking_package: [],
  //   noofadult: [],
  //   noofchildren: [],
  //   booking_type: [],
  gender: "",
  total_price: 0,
  selectedRooms: [
    {
      room_id: "",
      checkin_date: "",
      checkout_date: "",
      current_price: "",
      booking_package: "",
      noofadult: "",
      noofchildren: "",
      booking_type: "",
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

const roomOptions = ref([]);

const fetchRooms = async () => {
  try {
    const response = await $fetch(`${config.public.baseUrl}rooms/list`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + authStore.getToken,
      },
    });
    console.log("API Response:", response);
    if (response.status === 1 && Array.isArray(response.data)) {
      roomOptions.value = response.data.map((room) => ({
        label: `<div class="text-bold">${room.room_number} - ${room.name} - ${room.type}</div>`,
        value: String(room.id),
       
      }));
    } else {
      console.error("Error fetching rooms:", response);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
};

const availableRooms = ref([]);
const today = ref(new Date().toISOString().split("T")[0]);

// Computed property for total nights
const getTotalNights = computed(() => {
  if (!formData.value.check_in || !formData.value.check_out) return 0;
  const checkIn = new Date(formData.value.check_in);
  const checkOut = new Date(formData.value.check_out);
  return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
});

// Computed property for total price
const calculateTotal = computed(() => {
  let total = 0;
  formData.value.selectedRooms.forEach((selection) => {
    const room = availableRooms.value.find((r) => r.id === selection.room_id);
    if (room) {
      total += room.default_price * getTotalNights.value;
    }
  });
  return total;
});

// Format price with currency
const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);
};

// Add another room selection
const addRoom = () => {
  console.log("Adding room");
  formData.value.selectedRooms.push({ room_id: null });
};

// Remove a room selection
const removeRoom = (index) => {
  formData.value.selectedRooms.splice(index, 1);
};

// Update available rooms based on date selection
const updateAvailableRooms = async () => {
  if (!formData.value.check_in || !formData.value.check_out) return;

  
};

const handleSubmit = async () => {
  const form = new FormData();
  form.append("name", formData.value.name);
  form.append("no_telp", formData.value.no_telp);
  //   form.append("room_id[]", formData.value.room_id);
  //   form.append("checkin_date[]", formData.value.checkin_date);
  //   form.append("checkout_date[]", formData.value.checkout_date);
  //   form.append("current_price[]", formData.value.current_price);
  //   form.append("booking_package[]", formData.value.booking_package);
  //   form.append("noofadult[]", formData.value.noofadult);
  //   form.append("noofchildren[]", formData.value.noofchildren);
  //   form.append("booking_type[]", formData.value.booking_type);
  form.append("gender", formData.value.gender);
  form.append("total_price", formData.value.total_price);

  formData.value.selectedRooms.forEach((room) => {
    const checkinDate = $formatDate(room.checkin_date);
    const checkoutDate = $formatDate(room.checkout_date);
    form.append("room_id[]", room.room_id || "");
    form.append("checkin_date[]", checkinDate);
    form.append("checkout_date[]", checkoutDate);
    form.append("current_price[]", room.current_price || "");
    form.append("booking_package[]", room.booking_package || "");
    form.append("noofadult[]", room.noofadult || "");
    form.append("noofchildren[]", room.noofchildren || "");
    form.append("booking_type[]", room.booking_type || "");
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
      if (response.status == 1) {
        console.log("Success:", response);
      } else {
        console.error("Error:", response);
      }
    });
  } catch (error) {
    console.error("Request failed:", error);
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
      availableRooms.value = data;
      roomOptions.value = data.map((room) => ({
        label: `${room.room_number} - ${room.name} - ${room.type}`,
        value: String(room.id),
        name:room.name,
        price:room.actual_prices,
        type:room.type,
        view:room.view,
        default_price:room.default_price
      }));
    
    } else if (statusCode === 403) {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Error fetching available rooms:", error);
  }

}

const handleStartDate = (index) => {
 
};

const handleEndDate = (index) => {
  const startDate = formData.value.selectedRooms[index].checkin_date;
  const endDate = formData.value.selectedRooms[index].checkout_date;
  if (startDate && endDate) {
    searchRoom(startDate, endDate);
  }
}
const selectRoom = (roomId,index) => {
  formData.value.selectedRooms[index].id = roomId;
}
/*
watch([roomSelection.room_id], (newValue) => {
  console.log(newValue)
});
*/
onMounted(() => {
  //updateAvailableRooms();
  //fetchRooms();
  $bus.$emit("pagechange", { page: "Booking", subpage: "Index Booking" });
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
.max-vh-50{
  max-height: 30vh;
  overflow-y: auto;
}
tr{
  cursor: pointer;
}
tr.selected{
  background: linear-gradient(90deg, #b5e4b6, transparent);
}
</style>
