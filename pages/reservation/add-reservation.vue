<template>
  <div>
    <CardBaseCard title="Tambah Reservasi">
      <FormBaseForm @submit="handleSubmit">
        <InputBaseInput
          v-model="formData.customer_name"
          label="Nama Customer"
          placeholder="Masukkan Nama Customer"
        />
        <InputBaseInput
          v-model="formData.phone_number"
          type="number"
          label="Nomor Telephone"
          placeholder="Masukkan Nomor Telephone"
        />
        <InputBaseInput
          v-model="formData.email"
          type="email"
          label="Email"
          placeholder="Masukkan Email"
        />
        <InputBaseTextArea
          v-model="formData.alamat"
          label="Alamat"
          placeholder="Masukkan Alamat"
        />
        <hr />
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Tanggal Checkin</label>
              <VueDatePicker
                v-model="formData.tanggal_checkin"
                auto-apply
                :format="'yyyy-MM-dd'"
                placeholder="Tanggal Checkin"
              ></VueDatePicker>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Tanggal Checkout</label>
              <VueDatePicker
                v-model="formData.tanggal_checkout"
                auto-apply
                :format="'yyyy-MM-dd'"
                placeholder="Tanggal Checkout"
              ></VueDatePicker>
            </div>
          </div>
        </div>
        <InputBaseInput
          v-model="formData.rekomendasi"
          label="Rekomendasi Dari"
          placeholder="Masukkan Rekomendasi Dari"
        />
        <InputBaseInput
          v-model="formData.catatan"
          label="Catatan"
          placeholder="Masukkan Catatan"
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

const formData = ref({
  customer_name: "",
  phone_number: "",
  email: "",
  alamat: "",
  rekomendasi: "",
  catatan: "",
  tanggal_checkin: "",
  tanggal_checkout: "",
});

const handleSubmit = async () => {
  const formattedCheckIn = formData.value.tanggal_checkin
    ? formData.value.tanggal_checkin.toISOString().split("T")[0]
    : "";
  const formattedCheckOut = formData.value.tanggal_checkout
    ? formData.value.tanggal_checkout.toISOString().split("T")[0]
    : "";

  const form = new FormData();
  form.append("customer_name", formData.value.customer_name);
  form.append("phone_number", formData.value.phone_number);
  form.append("email", formData.value.email);
  form.append("alamat", formData.value.alamat);
  form.append("rekomendasi", formData.value.rekomendasi);
  form.append("catatan", formData.value.catatan);
  form.append("tanggal_checkin", formattedCheckIn);
  form.append("tanggal_checkout", formattedCheckOut);

  try {
    $fetch(`${config.public.baseUrl}reservations/create`, {
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

definePageMeta({
  middleware: ["auth"],
});
</script>
