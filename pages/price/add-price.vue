<template>
    <div>
        <CardBaseCard title="Tambah Harga">
            <FormBaseForm @submit="handleSubmit">
                <div class="form-group">
                  <label class="t-bold">Tanggal</label>
                  <VueDatePicker v-model="formData.date" auto-apply :format="'yyyy-MM-dd'" class="mb-3"></VueDatePicker>
                </div>
                <InputWithCombobox 
                  v-model="formData.room_type" 
                  label="Type Room" 
                  placeholder="Type Room" 
                  :options="roomTypes" 
                />
                <InputWithCombobox 
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
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const config = useRuntimeConfig();
const authStore = useAuthStore();

const formData = ref({
  room_type: '',
  room_view:'',
  date: null,
  price: 0,
});

const roomOptions = ref([]);
const roomTypes = ref([
  { value: "Studio", label: "Studio" },
  { value: "2 BR-A", label: "2 BR-A" },
  { value: "2 BR-B", label: "2 BR-B" },
  { value: "2 BR-C", label: "2 BR-C" },
  { value: "2 BR-D", label: "2 BR-D" },
  { value: "Suite", label: "Suite" },
]);

const roomView = ref([
  { value: "Mountain", label: "Mountain" },
  { value: "City", label: "City" },
]);

const handleSubmit = async () => {
  console.log('data', formData.value)
  const formattedDate = formData.value.date ? formData.value.date.toISOString().split("T")[0] : "";

  const form = new FormData();

  form.append("room_type", formData.value.room_type);
  form.append("view", formData.value.room_view);
  form.append("date", formattedDate);
  form.append("price", formData.value.price);

  try {
    $fetch(`${config.public.baseUrl}prices/create`,{
      method:'POST',
      lazy: true,
      body:form,
      headers:{
        'Authorization':'Bearer ' + authStore.getToken
      },
    }).then(response=>{
      if(response.status == 1){
        console.log("Success:", response);
      }else{
        console.error("Error:", response);
      }        
    })
  } catch (error) {
    console.error("Request failed:", error);
  }
};

definePageMeta({
    middleware: ["auth"]
  })
</script>
