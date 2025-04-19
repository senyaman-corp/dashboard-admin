<template>
  <div class="card min-vh-65">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h3>Data User Role</h3>
        <div>
          <ButtonBaseButton
            v-if="user !== null && user.jabatan == 'Superadmin'"
            variant="primary"
            to="/user-role/add-user-role"
            class="btn-md"
            >Tambah User</ButtonBaseButton
          >
        </div>
      </div>
      <div class="table-responsive mt-3 min-vh-65" id="style-datatable">
        <client-only>
          <DataTable
            class="table table-striped table-bordered"
            :columns="columns"
            style="width: 100%"
            :options="options"
          >
            <template #column-6="props">
              <a
                class="dropdown-toggle btn btn-default"
                data-bs-toggle="dropdown"
                data-target="#dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                >Aksi</a
              >
              <ul
                id="dropdown"
                class="dropdown-menu p-2"
                aria-labelledby="dropdown"
              >
                <li
                  class="dropdown-item"
                  v-if="user !== null && user.jabatan == 'Superadmin'"
                >
                  <a
                    type="button"
                    class="btn btn-default"
                    @click="deleteUser(props.rowData.id)"
                  >
                    <i class="fas fa-trash-alt me-2"></i>Delete</a
                  >
                </li>
                <li class="dropdown-item">
                  <a
                    type="button"
                    class="btn btn-default"
                    @click="viewUser(props.rowData.id)"
                  >
                    <i class="fas fa-info-circle me-2"></i>Detail
                  </a>
                </li>
              </ul>
            </template>
          </DataTable>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
const { $dataTableOptions } = useNuxtApp();
import { useNavigatorStore } from "~/stores/navigator";
const authStore = useAuthStore();
const config = useRuntimeConfig();
const navStore = useNavigatorStore();
const { $bus } = useNuxtApp();
navStore.setPage("User_roles");
navStore.setSubpage("Index User");
const users = ref([]);
const columns = ref([
  { title: "ID", data: "id" },
  { title: "Name", data: "name" },
  { title: "Email", data: "email" },
  { title: "Telepon", data: "telp" },
  { title: "Jabatan", data: "jabatan" },
  { title: "Roles", data: "roles" },
  { title: "Action", data: "id" },
]);
const options = $dataTableOptions(
  config.public.baseUrl + "users/list",
  authStore.getToken
);
options.columnDefs = [
  { targets: [0], className: "text-start" },
  { targets: [6], className: "text-end" },
];

const user = ref({});
user.value = authStore.getUser;

const fetchUsers = async () => {
  try {
    const response = await $fetch(`${config.public.baseUrl}users/list`, {
      lazy: true,
      method: "POST",
      headers: {
        Authorization: "Bearer " + authStore.getToken,
      },
    });
    console.log(response);
    if (response.status == 1) {
      users.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const deleteUser = async (id) => {
  try {
    const { data, status } = await $fetch(
      `${config.public.baseUrl}users/delete`,
      {
        lazy: true,
        method: "POST",
        headers: {
          Authorization: "Bearer " + authStore.getToken,
        },
        body: {
          id: id,
        },
      }
    );

    if (status == 1) {
      //users.value = data;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
fetchUsers();

onMounted(() => {
  $bus.$emit("pagechange", { page: "User_roles", subpage: "Index User" });
  //fetchUsers();
});

definePageMeta({
  middleware: ["auth"],
});
</script>
