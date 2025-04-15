<template>
    <div>
        <CardBaseCard title="Tambah Harga">
            <FormBaseForm @submit="handleSubmit">
                <div class="form-group">
                  <label class="t-bold">Tanggal</label>
                  <VueDatePicker v-model="formData.date" :format="'yyyy-MM-dd'" multi-dates :id="'date-picker-1'" class="mb-3"></VueDatePicker>
                </div>
                <InputSelect 
                  v-model="formData.room_type" 
                  label="Type Room" 
                  placeholder="Type Room" 
                  :options="roomTypes" 
                />
                <InputSelect 
                  v-model="formData.room_view" 
                  label="Type Room" 
                  placeholder="Type Room" 
                  :options="roomView" 
                />
                <InputAutonumeric
                  v-model="formData.price"
                  label="Harga Kamar"
                  placeholder="Masukkan Harga Kamar"
                />
                <ButtonBaseButton type="submit" variant="primary">Submit</ButtonBaseButton>
            </FormBaseForm>
        </CardBaseCard>
    </div>
</template>

<script setup>

import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const config = useRuntimeConfig();
const authStore = useAuthStore();
import { useNavigatorStore } from "~/stores/navigator";
const navStore = useNavigatorStore();
navStore.setPage("Room");
navStore.setSubpage("Index Price");
const { $bus,$swal,$moment } = useNuxtApp();
const formData = ref({
  room_type: "",
  room_view: "",
  date: null,
  price: 0,
});

const roomOptions = ref([]);
const roomTypes = ref([]);
const getTypes = async () => {
  const res = await $fetch(`${config.public.baseUrl}rooms/list-room-type`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authStore.getToken,
    },
  });

  roomTypes.value = res.data.room_type.map((item) => ({
    value: item.type,
    label: item.type,
  }));
};
getTypes();
const roomView = ref([
  { value: "Mountain", label: "Mountain" },
  { value: "City", label: "City" },
]);

const handleSubmit = async () => {
  //$bus.$emit('loading',true);
  const selectedDate = [];
  formData.value.date.forEach(dt=>{
    selectedDate.push($moment(dt).format("YYYY-MM-DD"));
  }) 

  const form = new FormData();
  form.append("room_type", formData.value.room_type);
  form.append("view", formData.value.room_view);
  form.append("date", selectedDate);
  form.append("price", formData.value.price);
  try {
    $fetch(`${config.public.baseUrl}prices/create`, {
      method: "POST",
      lazy: true,
      body: form,
      headers: {
        Authorization: "Bearer " + authStore.getToken,
      },
    }).then(response=>{
      $bus.$emit('loading',false);
      if(response.status == 1){
        navigateTo('/price');
      }else{
        $swal.fire(response.message);
      }        
    })
  } catch (error) {
    $swal.fire(error);
    console.error("Request failed:", error);
  }
};

onMounted(() => {
  $bus.$emit("pagechange", { page: "Room", subpage: "Price" });
});

definePageMeta({
  middleware: ["auth"],
});
</script>
<style>
  #date-picker-1 .dp--tp-wrap{
    display:none;
  }
</style>
