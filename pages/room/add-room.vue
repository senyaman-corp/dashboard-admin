<template>
  <div>
    <CardBaseCard title="Tambah Kamar">
      <FormBaseForm @submit="handleSubmit">
        <InputBaseInput
          v-model="formData.room_number"
          label="Nomor Kamar"
          placeholder="Masukkan Nomor Kamar"
          required
        />
        <InputBaseInput
          v-model="formData.name"
          label="Nama Kamar"
          placeholder="Masukkan Nama Kamar"
        />
        <InputWithCombobox
          v-model="formData.type"
          :options="roomTypes"
          label="Tipe Kamar"
          id="type"
          placeholder="Pilih Tipe Ruangan"
        />
        <InputWithCombobox
          v-model="formData.view"
          :options="roomView"
          label="View Kamar"
          id="view"
          placeholder="Masukkan View Kamar"
        />
        <InputBaseInput
          v-model="formData.floor_number"
          label="Lantai Kamar"
          placeholder="Masukkan Lantai Kamar"
        />
        <InputBaseInput
          v-model="formData.size"
          label="Ukuran Kamar"
          placeholder="Masukkan Ukuran Kamar"
        />
        <InputAutonumeric
          v-model="formData.default_price"
          label="Default Harga Kamar"
          placeholder="Masukkan Default Harga Kamar"
        />
        <InputBaseUpload
          label="Foto Kamar"
          id="fileUpload"
          @fileSelected="handleFile"
          accept=".jpg,.jpeg,.png"
        />
        <NuxtImg :src="fotoKamar" class="foto-kamar"></NuxtImg>
        <ButtonBaseButton type="submit" variant="primary"
          >Submit</ButtonBaseButton
        >
      </FormBaseForm>
    </CardBaseCard>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useNavigatorStore } from "~/stores/navigator";
const navStore = useNavigatorStore();
navStore.setPage("Room");
navStore.setSubpage("Add Room");
const { $bus, $readInputFile } = useNuxtApp();
const config = useRuntimeConfig();
const authStore = useAuthStore();
const roomTypes = ref([]);
const { data, status, statusCode} = await $fetch(`${config.public.baseUrl}rooms/list-room-type`,{
          method:'POST',
          lazy: true,
          headers:{
            'Authorization':'Bearer ' + authStore.getToken
          },
      });
if(status == 1){
 
  data.room_type.map((item) => {
    item.value = item.type
    item.label= item.type;
  });
  console.log(data.room_type);
  roomTypes.value = data.room_type;
}
const roomView = ref([
  { value: "Mountain", label: "Mountain" },
  { value: "City", label: "City" },
]);

const formData = ref({
  room_number: "",
  name: "",
  type: "",
  view: "",
  floor_number: "",
  status: "",
  default_price: "",
  size: "",
  file: null,
});
const fotoKamar = ref(null);

const handleFile = (file) => {
  formData.value.file = file;
  var reader = new FileReader();
  reader.onload = function (e) {
    fotoKamar.value = e.target.result;
    console.log(e.target.result);
  };
  reader.readAsDataURL(file);
};

const handleSubmit = async () => {
  const form = new FormData();
  form.append("room_number", formData.value.room_number);
  form.append("name", formData.value.name);
  form.append("type", formData.value.type);
  form.append("view", formData.value.view);
  form.append("floor_number", formData.value.floor_number);
  form.append("status", "VR");
  form.append("default_price", formData.value.default_price);
  form.append("size", formData.value.size);

  if (formData.value.file) {
    form.append("file", formData.value.file);
  }

  try {
    $fetch(`${config.public.baseUrl}rooms/create`, {
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

onMounted(() => {
  $bus.$emit("pagechange", { page: "Room", subpage: "Room" });
});
definePageMeta({
  middleware: ["auth"],
});
</script>
