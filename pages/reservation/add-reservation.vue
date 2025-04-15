<template>
  <div>
    <CardBaseCard title="Tambah Reservasi">
      <FormBaseForm @submit="handleSubmit">
        <div class="row">
          <div class="col-md-6">
            <InputBaseInput
              v-model="formData.customer_name"
              label="Nama Customer"
              placeholder="Masukkan Nama Customer"
              required
            />
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label t-required">Jenis Kelamin</label>
              <select class="form-select form-select-lg" v-model="formData.gender">
                <option value="" selected>Pilih Jenis Kelamin</option>
                <option value="Male">Laki-Laki</option>
                <option value="Female">Perempuan</option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <InputBaseInput
              v-model="formData.phone_number"
              type="number"
              label="Nomor Telephone"
              placeholder="Masukkan Nomor Telephone"
              required
            />
          </div>
          <div class="col-md-6">
            <InputBaseInput
              v-model="formData.email"
              type="email"
              label="Email"
              placeholder="Masukkan Email"
            />
          </div>
          <div class="col-md-6"></div>
          
        </div>
        
       
        
        <InputBaseTextArea
          v-model="formData.alamat"
          label="Alamat"
          placeholder="Masukkan Alamat"
          required
        />
        <hr />
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label t-required">Tanggal Checkin</label>
              <VueDatePicker
                v-model="formData.tanggal_checkin"
                auto-apply
                :format="'yyyy-MM-dd'"
                :enable-time-picker="false"
                placeholder="Tanggal Checkin"
                required
              ></VueDatePicker>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label t-required">Tanggal Checkout</label>
              <VueDatePicker
                v-model="formData.tanggal_checkout"
                auto-apply
                :format="'yyyy-MM-dd'"
                :enable-time-picker="false"
                placeholder="Tanggal Checkout"
                required
              ></VueDatePicker>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Rekomendasi</label>
              <select class="form-select form-select-lg" v-model="formData.rekomendasi">
                <option value="" selected>Pilih Rekomendasi</option>
                <option value="Media Sosial">Media Sosial</option>
                <option value="Banner/Pamflet">Banner/Pamflet</option>
                <option value="Repeat Stay">Repeat Stay</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <InputBaseInput
                type="number"
                v-model="formData.jumlah_kamar"
                label="Jumlah Kamar"
                placeholder="Masukkan Jumlah kamar"
              />
            </div>
             
          </div>
        </div>
        <InputBaseInput
          v-model="formData.catatan"
          label="Catatan"
          placeholder="Masukkan Catatan"
        />
        <InputAutonumeric
            v-model="formData.down_payment"
            label="Down Payment"
            placeholder="Masukkan DB Reservasi"
            
          />
        <ButtonBaseButton type="submit" variant="primary" size="lg"
          >Submit</ButtonBaseButton
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

const authStore = useAuthStore();
const config = useRuntimeConfig();
const { $moment ,$swal, $bus} = useNuxtApp();
const formData = ref({
  customer_name: "",
  phone_number: "",
  email: "",
  alamat: "",
  rekomendasi: "",
  catatan: "",
  tanggal_checkin: "",
  tanggal_checkout: "",
  gender:'',
  down_payment:0,
  jumlah_kamar:0,
});

const handleSubmit = async () => {
  const formattedCheckIn = $moment(formData.value.tanggal_checkin);
  const formattedCheckOut = $moment(formData.value.tanggal_checkout);
  const form = new FormData();
  form.append("customer_name", formData.value.customer_name);
  form.append("phone_number", formData.value.phone_number);
  form.append("email", formData.value.email);
  form.append("alamat", formData.value.alamat);
  form.append("gender", formData.value.gender);
  form.append("rekomendasi", formData.value.rekomendasi);
  form.append("catatan", formData.value.catatan);
  form.append("tanggal_checkin", formattedCheckIn);
  form.append("tanggal_checkout", formattedCheckOut);
  form.append("down_payment", formData.value.down_payment);
  $bus.$emit('loading',true);
  try {
    $fetch(`${config.public.baseUrl}reservations/create`, {
      method: "POST",
      lazy: true,
      body: form,
      headers: {
        Authorization: "Bearer " + authStore.getToken,
      },
    }).then((response) => {
      $bus.$emit('loading',false);
      if (response.status == 1) {
        $swal.fire({
          title: "Berhasil!",
          text: response.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        navigateTo("/reservation");
      } else {
        $swal.fire({
          title: "Gagal!",
          text: response.message,
          position: "bottom-end",
        });
      }
    });
  } catch (error) {
    $bus.$emit('loading',false);
    console.error("Request failed:", error);
  }
};

definePageMeta({
  middleware: ["auth"],
});
</script>
