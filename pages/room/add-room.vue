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

const { $bus, $readInputFile } = useNuxtApp();
const config = useRuntimeConfig();
const authStore = useAuthStore();

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
  $bus.$emit("pagechange", { page: "Room", subpage: "Add Room" });
});
definePageMeta({
  middleware: ["auth"],
});
</script>
