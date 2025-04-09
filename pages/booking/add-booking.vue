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
          v-model="formData.age"
          label="Usia"
          placeholder="Masukkan Usia"
        />
        <InputBaseInput
          type="number"
          v-model="formData.no_telp"
          label="Nomor Telepon"
          placeholder="Masukkan No Telepon"
        />
        <InputBaseInput
          type="email"
          v-model="formData.email"
          label="Email"
          placeholder="Masukkan Email"
        />
        <InputBaseTextArea
          v-model="formData.address"
          label="Alamat"
          placeholder="Masukkan Alamat"
        />
        <InputBaseInput
          v-model="formData.gender"
          label="Jenis Kelamin"
          placeholder="Masukkan Jenis Kelamin"
        />
        <InputBaseInput
          v-model="formData.booking_type"
          label="Booking Type"
          placeholder="Masukkan Booking Type"
        />

        <InputBaseInput
          v-model="formData.no_pol"
          label="No Polisi Kendaraan"
          placeholder="Masukkan No Polisi Kendaraan"
        />
        <InputBaseInput
          v-model="formData.jenis"
          label="Jenis Kendaraan"
          placeholder="Masukkan Jenis Kendaraan"
        />
        <InputBaseInput
          v-model="formData.merek"
          label="Merek Kendaraan"
          placeholder="Masukkan Merek Kendaraan"
        />
        <InputBaseInput
          v-model="formData.total_price"
          label="Total Harga"
          placeholder="Masukkan Total Harga"
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
            <div class="row">
              <div class="col-md-6">
                <InputWithCombobox
                  v-model="roomSelection.room_id"
                  label="Select Room"
                  placeholder="Select Room"
                  :options="roomOptions"
                  :searchable="true"
                  :multiple="false"
                   @update:model-value="findPreBuyPrice(roomSelection)"
                />
              </div>
              <div class="col-md-6">
                <InputBaseInput
                  type="number"
                  v-model="roomSelection.discount"
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
                  <label for="">Booking Package</label>
                  <select
                    class="form-select form-select-lg"
                    v-model="roomSelection.booking_package"
                  >
                    <option value="" selected>Pilih Booking Package</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Breakfast">Non Breakfast</option>
                  </select>
                </div>
              </div>
              <div
                class="col-md-6"
                v-if="roomSelection.booking_package == 'Breakfast'"
              >
                <div class="mb-3">
                  <InputBaseInput
                    v-model="roomSelection.price_booking_package"
                    label="Price Booking Package"
                    placeholder="Masukkan Price Booking Package"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <InputBaseInput
                  v-model="formData.early_checkin"
                  label="Early Checkin?"
                  placeholder="Masukkan Early Checkin"
                />
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="">Preebuy?</label>
                  <select
                    class="form-select form-select-lg"
                    v-model="roomSelection.preebuy"
                  >
                    <option value="" selected>Pilih Preebuy</option>
                    <option v-for="prebuy in preBuyData" :key="prebuy.id" :value="prebuy.id">{{prebuy.vendor}}</option>
                 
                  </select>
                </div>
              </div>
            </div>
            <h5>
              Sub Total = Rp
              {{ calculateSubTotal(roomSelection).toLocaleString("id-ID") }}
            </h5>
          </div>
        </div>

        <div class="flex justify-between items-center mt-4">
          <ButtonBaseButton @click="addRoom" variant="secondary" type="button">
            Add Another Room
          </ButtonBaseButton>

          <div class="mt-3">
            <h5>
              Total: Rp {{ calculateTotal.toLocaleString("id-ID") }}
            </h5>
            <h5>
              TAX 23% = Rp {{ calculateTax.toLocaleString("id-ID") }}
            </h5>
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
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const { $bus, $readInputFile, $formatDate } = useNuxtApp();
const formData = ref({
  name: "",
  age: "",
  no_telp: "",
  email: "",
  address: "",
  gender: "",
  ktp: null,
  total_price: 0,
  no_pol: "",
  jenis: "",
  merek: "",
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
const availableRooms = ref([]);
const preBuyData = ref([]);
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


const handleSubmit = async () => {
  const form = new FormData();
  form.append("name", formData.value.name);
  form.append("age", formData.value.age);
  form.append("no_telp", formData.value.no_telp);
  form.append("email", formData.value.email);
  form.append("address", formData.value.address);
  form.append("gender", formData.value.gender);
  form.append("booking_type", formData.value.booking_type);
  form.append("total_price", formData.value.total_price);

  form.append("no_pol[]", formData.value.no_pol);
  form.append("jenis[]", formData.value.jenis);
  form.append("merek[]", formData.value.merek);

  formData.value.selectedRooms.forEach((room) => {
    const checkinDate = room.checkin_date
      ? room.checkin_date.toISOString().split("T")[0]
      : "";
    const checkoutDate = room.checkout_date
      ? room.checkout_date.toISOString().split("T")[0]
      : "";

    form.append("room_id[]", room.room_id || "");
    form.append("checkin_date[]", checkinDate);
    form.append("checkout_date[]", checkoutDate);
    form.append("booking_package[]", room.booking_package || "");
    form.append("price_booking_package[]", room.booking_package || 0);
    form.append("discount[]", room.discount || 0);
    form.append("early_checkin[]", room.early_checkin || 0);
    form.append("noofadult[]", room.noofadult || "");
    form.append("noofchildren[]", room.noofchildren || "");
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
      const checkin = new Date(startDate);
      const checkout = new Date(endDate);
      checkin.setHours(0, 0, 0, 0);
      checkout.setHours(0, 0, 0, 0);

      const getStayDates = () => {
        const dates = [];
        let current = new Date(checkin);
        while (current < checkout) {
          const y = current.getFullYear();
          const m = String(current.getMonth() + 1).padStart(2, "0");
          const d = String(current.getDate()).padStart(2, "0");
          dates.push(`${y}-${m}-${d}`);
          current.setDate(current.getDate() + 1);
        }
        return dates;
      };

      const stayDates = getStayDates();

      roomOptions.value = data.map((room) => {
        const priceMap = {};
        room.actual_prices.forEach((p) => {
          console.log("Price Object:", p);
          const date = p.tanggal;
          const price = parseFloat(p.price || 0);
          priceMap[date] = priceMap[date]
            ? Math.max(priceMap[date], price)
            : price;
        });

        const totalPrice = stayDates.reduce((sum, date) => {
          return sum + (priceMap[date] || 0);
        }, 0);

        return {
          label: `${room.room_number} - ${room.name} - ${
            room.type
          } - Rp ${totalPrice.toLocaleString("id-ID")}`,
          value: String(room.id),
          name: room.name,
          price: room.actual_prices,
          type: room.type,
          view: room.view,
          default_price: totalPrice,
        };
      });
    } else if (statusCode === 403) {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Error fetching available rooms:", error);
  }
};

const calculateSubTotal = (selection) => {
  const room = roomOptions.value.find(
    (r) => r.value === String(selection.room_id)
  );
  if (!room) return 0;

  const checkin = new Date(selection.checkin_date);
  const checkout = new Date(selection.checkout_date);
  checkin.setHours(0, 0, 0, 0);
  checkout.setHours(0, 0, 0, 0);

  const stayDates = [];
  const current = new Date(checkin);
  while (current < checkout) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, "0");
    const d = String(current.getDate()).padStart(2, "0");
    stayDates.push(`${y}-${m}-${d}`);
    current.setDate(current.getDate() + 1);
  }

  const priceMap = {};
  room.price.forEach((p) => {
    priceMap[p.tanggal] = parseFloat(p.price || 0);
  });

  const totalRoomPrice = stayDates.reduce((sum, date) => {
    return sum + (priceMap[date] || 0);
  }, 0);

  const discount = parseFloat(selection.discount) || 0;
  const bookingPackage = parseFloat(selection.price_booking_package) || 0;

  return totalRoomPrice - discount + bookingPackage;
};

const calculateTotal = computed(() => {
  return formData.value.selectedRooms.reduce((total, selection) => {
    return total + calculateSubTotal(selection);
  }, 0);
});

const calculateTax = computed(() => {
  return Math.round(calculateTotal.value * 0.23);
});

const calculateFinalPrice = computed(() => {
  return calculateTotal.value + calculateTax.value;
});

const handleStartDate = (index) => {};

const handleEndDate = (index) => {
  const startDate = formData.value.selectedRooms[index].checkin_date;
  const endDate = formData.value.selectedRooms[index].checkout_date;
  if (startDate && endDate) {
    searchRoom(startDate, endDate);
  }
};

const findPreBuyPrice = async (roomSelected) => {
  const {data,status} = await $fetch(`${config.public.baseUrl}pre-buy/data-availability`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authStore.getToken,
    },
    body: {
      room_id: roomSelected.room_id,
    },
  });
  if(status == 1){
    preBuyData.value = data;
  }
};






const today = ref(new Date().toISOString().split("T")[0]);
const selectRoom = (roomId, index) => {
  formData.value.selectedRooms[index].id = roomId;
};
const updateAvailableRooms = async () => {
  if (!formData.value.check_in || !formData.value.check_out) return;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);
};


watch(
  () => formData.value.selectedRooms,
  (rooms) => {
    rooms.forEach((roomSelection) => {
      roomSelection.sub_total = calculateSubTotal(roomSelection);
    });
  },
  { deep: true }
);

onMounted(() => {
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
