<template>
  <div>
    <CardBaseCard title="Tambah User">
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
          v-model="formData.telp"
          label="Telepon"
          placeholder="Masukkan No Telp"
          type="text" inputmode="numeric"
        />
        <InputBaseInput
          v-model="formData.password" required
          label="Password"
          placeholder="Masukkan Password"
          type="password" inputmode="text"
        />
        <div class="mb-3">
          <label  class="form-label">Roles</label>
          <select class="form-select" v-model="formData.roles">
            <option v-for="option in ['Admin', 'Housekeeping', 'Front Office', 'Accounting', 'Technical']" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label  class="form-label">Jabatan</label>
          <select class="form-select" v-model="formData.jabatan">
            <option v-for="option in ['Staff', 'Supervisor', 'Manager', 'Direktur']" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
      
        <InputBaseUpload
          label="Foto User"
          id="fileUpload"
          @fileSelected="handleFile"
        />
        <div class="error my-3">{{error}}</div>
        <ButtonBaseButton type="submit" variant="primary" class="btn-lg"
          >Submit</ButtonBaseButton
        >
      </FormBaseForm>
    </CardBaseCard>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
const navStore = useNavigatorStore();
const { $bus } = useNuxtApp();
navStore.setPage("User_roles");
navStore.setSubpage("Index User");
const config = useRuntimeConfig();
const authStore = useAuthStore();
const router = useRouter();
const formData = ref({
  name: "",
  email:'',
  password:'',
  roles:'',
  telp:'',
  jabatan:'',
  file: null,
});
const error = ref('');
const submittedData = ref({
  name: "",
  description: "",
  file: null,
});

const handleFile = (file) => {
  formData.value.file = file;
};

const handleSubmit = async () => {
  const { data, status,message } = await $fetch(`${config.public.baseUrl}users/create`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authStore.getToken,
    },
    body: formData.value,
  })
  if(status == 1){
    router.push('/user-role');
  }else{
    error.value = message;
  }
  //submittedData.value = { ...formData.value };
};

onMounted(() => {
  $bus.$emit("pagechange", { page: "User_roles", subpage: "Index User" });
});

definePageMeta({
  middleware: ["auth"],
});
</script>
