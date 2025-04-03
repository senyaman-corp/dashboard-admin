<template>
    <div>
        <CardBaseCard title="Tambah Harga">
            <FormBaseForm @submit="handleSubmit">
                <InputWithCombobox 
                  v-model="formData.room_id" 
                  label="Select Room" 
                  placeholder="Select Room" 
                  :options="roomOptions" 
                  multiple
                />
                <InputAutonumeric
                  v-model="formData.price"
                  label="Harga Kamar"
                  placeholder="Masukkan Harga Kamar"
                />
                <InputBaseInput v-model="formData.date" type="date" label="Tanggal" placeholder="Masukkan Tanggal" />
                <ButtonBaseButton type="submit" variant="primary">Submit</ButtonBaseButton>
            </FormBaseForm>
        </CardBaseCard>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "~/stores/auth";


const config = useRuntimeConfig();
const authStore = useAuthStore();

const formData = ref({
  room_id: [],
  date: null,
  price: 0,
});

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
        label: `${room.room_number} - ${room.name} - ${room.type}`,
        value: String(room.id),
      }));
    } else {
      console.error("Error fetching rooms:", response);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
};

const handleSubmit = async () => {
  const form = new FormData();

  formData.value.room_id.forEach((id) => 
    form.append("room_id[]", id)
  );
  form.append("date", formData.value.date);
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

onMounted(fetchRooms);

definePageMeta({
    middleware: ["auth"]
  })
</script>
