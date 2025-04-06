<template>
  <div>
    <CardBaseCard title="Tambah User Role">
      <FormBaseForm @submit="handleSubmit">
        <InputBaseInput
          v-model="formData.name" required
          label="Nama User"
          placeholder="Masukkan Nama User"
        />
        <InputBaseInput
          v-model="formData.email" required
          label="Email"
          placeholder="Masukkan Email"
          type="email" inputmode="email"
        />
        <InputBaseInput
          v-model="formData.password" required
          label="Password"
          placeholder="Masukkan Password"
          type="password" inputmode="text"
        />
        <InputWithDropdown
          id="role"
          v-model="formData.roles"
          label="Role User"
          placeholder="Pilih Role User"
          :options="['Admin', 'User']"
        />
        <InputBaseUpload
          label="Foto User"
          id="fileUpload"
          @fileSelected="handleFile"
        />
        <ButtonBaseButton type="submit" variant="primary" class="btn-lg"
          >Submit</ButtonBaseButton
        >
      </FormBaseForm>
    </CardBaseCard>
  </div>
</template>

<script setup>
import { ref } from "vue";
const navStore = useNavigatorStore();
const { $bus } = useNuxtApp();
navStore.setPage("User_roles");
navStore.setSubpage("Index User");
const formData = ref({
  name: "",
  email:'',
  password:'',
  roles:'',
});

const submittedData = ref({
  name: "",
  description: "",
  file: null,
});

const handleFile = (file) => {
  formData.value.file = file;
};

const handleSubmit = () => {
  console.log(formData.value);
  //submittedData.value = { ...formData.value };
};

onMounted(() => {
  $bus.$emit("pagechange", { page: "User_roles", subpage: "Index User" });
});

definePageMeta({
  middleware: ["auth"],
});
</script>
