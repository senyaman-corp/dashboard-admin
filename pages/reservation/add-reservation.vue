<template>
    <div>
        <CardBaseCard title="Tambah Reservasi">
            <FormBaseForm @submit="handleSubmit">
              <div class="mb-3">
                <label class="form-label">Nama Customer</label>
                <input type="text" class="form-control form-control-lg" v-model="customer_name" placeholder="Masukkan Nama Customer" required />
                <div v-if="error" class="text-danger mt-1"></div>
              </div>
              <div class="mb-3">
                <label  class="form-label">Nomor Telepon</label>
                <input type="text" class="form-control form-control-lg" inputmode="numeric" v-model="phone_number" placeholder="Masukkan Nomor Telepon" required />
                <div v-if="error" class="text-danger mt-1"></div>
              </div>
              <div class="mb-3">
                <label  class="form-label">Email</label>
                <input type="text" inputmode="email" class="form-control form-control-lg" v-model="email" placeholder="Masukkan Email" required />
                <div v-if="error" class="text-danger mt-1"></div>
              </div>
              <div class="mb-3">
                <label  class="form-label">Alamat</label>
                <textarea class="form-control form-control-lg" v-model="alamat" placeholder="Masukkan Alamat Customer" ></textarea>
                <div v-if="error" class="text-danger mt-1"></div>
              </div>
               
                <hr>
                <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label">Tanggal Checkin</label>
                        <VueDatePicker v-model="tanggal_checkin" auto-apply :format="'yyyy-MM-dd'" placeholder="Tanggal Checkin"></VueDatePicker>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label">Tanggal Checkout</label>
                        <VueDatePicker v-model="tanggal_checkout" auto-apply :format="'yyyy-MM-dd'" placeholder="Tanggal Checkout"></VueDatePicker>
                      </div>
                    </div>
                </div>
                
                
                <!-- <InputBaseInput v-model="formData.floor" label="Durasi Menginap" placeholder="Masukkan Durasi Menginap" /> -->
                <div class="mb-3">
                  <label  class="form-label">Rekomendasi</label>
                  <input type="text" inputmode="text" class="form-control form-control-lg" v-model="rekomendasi" placeholder="Rekomendasi Dari" />
                  <div v-if="error" class="text-danger mt-1"></div>
                </div>
                <div class="mb-3">
                  <label  class="form-label">Catatan</label>
                  <input type="text" inputmode="text" class="form-control form-control-lg" v-model="catatan" placeholder="Masukkan Catatan" />
                  <div v-if="error" class="text-danger mt-1"></div>
                </div>
                <ButtonBaseButton type="submit" variant="primary" size="lg">Submit</ButtonBaseButton>
            </FormBaseForm>
        </CardBaseCard>
    </div>
</template>

<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";
const authStore = useAuthStore();
const config = useRuntimeConfig();
const  customer_name = ref();
const  phone_number = ref();
const  email = ref();
const  alamat = ref();
const  rekomendasi = ref();
const  catatan = ref();
const  tanggal_checkin = ref();
const  tanggal_checkout = ref();



const handleFile = (file) => {
  formData.value.file = file;
};

const handleSubmit = async () => {
  const response = await $fetch(`${config.public.baseUrl}reservations/create`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authStore.getToken
            },
            body: {
              customer_name:customer_name.value,
              phone_number:phone_number.value,
              email:email.value,
              alamat:alamat.value,
              rekomendasi:rekomendasi.value,
              catatan:catatan.value,
              tanggal_checkin:tanggal_checkin.value,
              tanggal_checkout:tanggal_checkout.value
            }
        });
    if(response.status == 1){
      window.location.href = '/reservations';
    }
};
definePageMeta({
    middleware: ["auth"]
  })
</script>
<style>
  .dp__input{
    background-color: var(--bs-tertiary-bg);
  }
</style>
