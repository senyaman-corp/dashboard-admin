<template>
    <div>
        <CardBaseCard title="Tambah Harga">
            <FormBaseForm @submit="handleSubmit">
              <div class="form-group">
                <label class="t-bold">Tanggal</label>
                <VueDatePicker v-model="date" auto-apply :format="'yyyy-MM-dd'" class="mb-3"></VueDatePicker>
              </div>
              <div class="form-group">
                <label class="t-bold">Type Kamar</label>
                <select class="form-select form-select-lg" id="room-type" v-model="room_type">
                    <option value="">Pilih Type</option>
                    <option value="Studio">Studio</option>
                    <option value="2 BR-A">2 BR-A</option>
                    <option value="2 BR-B">2 BR-B</option>
                    <option value="2 BR-C">2 BR-C</option>
                    <option value="2 BR-D">2 BR-D</option>
                    <option value="Suite">Suite</option>
                </select>
              </div>
              <div class="form-group">
                <label class="t-bold">View</label>
                <select class="form-select form-select-lg" id="view" v-model="view">
                    <option value="">Pilih View</option>
                    <option value="City">City</option>
                    <option value="Mountain">Mountain</option>
                </select>
              </div>
              <div class="form-group mb-3">
                <label class="t-bold">Harga</label>
                <input type="text" v-model="price" class="form-control form-control-lg" placeholder="Masukkan Harga" />
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
const { $bus } = useNuxtApp();
const date = ref();
const room_type = ref();
const view= ref();
const price = ref('');


const handleFile = (file) => {
  formData.value.file = file;
};

const handleSubmit = async () => {
  //submittedData.value = { ...formData.value };
  const response = await $fetch(`${config.public.baseUrl}prices/create`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authStore.getToken
            },
            body: {
              date:date.value,
              room_type:room_type.value,
              view:view.value,
              price:price.value
            }
        });
  if(response.status == 1){
    window.location.href = '/price';
  }

}
definePageMeta({
    middleware: ["auth"]
  })
</script>
