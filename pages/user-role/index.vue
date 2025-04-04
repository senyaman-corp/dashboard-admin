<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data User Role</h3>
      <div>
        <ButtonBaseButton
          variant="primary"
          to="/user-role/add-user-role"
          class="mx-3"
          >Tambah User Role</ButtonBaseButton
        >
      </div>
    </div>
    <div class="table-responsive mt-3">
      <client-only>
        <DataTable
          class="table table-striped table-bordered"
          :columns="columns"
          :data="users"
          style="width: 100%"
        />
      </client-only>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
const authStore = useAuthStore();
const config = useRuntimeConfig();

const users = ref([]);
const columns = ref([
  { title: "ID", data: "id" },
  { title: "Name", data: "name" },
  { title: "Email", data: "email" },
]);

const fetchUsers = async () => {
  try {
    const response = await fetch(`${config.public.baseUrl}users/list`, {
      lazy: true,
      method: "POST",
      headers: {
        Authorization: "Bearer " + authStore.getToken,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch users");

    const result = await response.json();
    users.value = result.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

onMounted(() => {
  fetchUsers();
});

definePageMeta({
  middleware: ["auth"],
});
</script>
