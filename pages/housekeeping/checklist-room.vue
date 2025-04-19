<template>
  <CardBaseCard title="Data Checklist Room">
    <div class="row justify-content-end align-items-start">
      <div class="col-md-2">
        <VueDatePicker
          v-model="list_date"
          auto-apply
          :format="'yyyy-MM-dd'"
          placeholder="Pilih Tanggal"
          @update:model-value="filterByDate(list_date)"
          locale="ID"
          required
        ></VueDatePicker>
      </div>
      <div class="col-md-2">
        <InputWithCombobox
          :options="rooms"
          v-model="room_id"
          placeholder="Room Number"
          @update:model-value="filterByRoom(room_id)"
        />
      </div>
      <div class="col-md-1 text-end">
        <NuxtLink
          :to="'/housekeeping/add-check-list'"
          class="btn btn-primary btn-md"
          variant="primary"
          >Tambah</NuxtLink
        >
      </div>
    </div>

    <div class="table-responsive min-vh-65" id="style-datatable">
      <client-only>
        <DataTable
          class="table table-striped table-bordered"
          :columns="columns"
          :options="options"
          style="width: 100%"
          ref="table"
        >
          <template #column-7="props">
            <a
              class="dropdown-toggle btn btn-default"
              :class="{ 'text-danger': props.rowData.status < 2 }"
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
              <li class="dropdown-item" v-if="props.rowData.status < 2">
                <a
                  type="button"
                  class="btn btn-default"
                  @click="editList(props.rowData.id)"
                >
                  <i class="fas fa-edit me-2"></i>Edit</a
                >
              </li>
              <li class="dropdown-item" v-if="props.rowData.status < 2">
                <a
                  type="button"
                  class="btn btn-default"
                  @click="deleteList(props.rowData.id)"
                >
                  <i class="fas fa-trash-alt me-2"></i>Delete</a
                >
              </li>
              <li
                class="dropdown-item"
                v-if="authStore.isSupervisor() && props.rowData.status < 2"
              >
                <a
                  type="button"
                  class="btn btn-default"
                  @click="viewDetail(props.rowData.id)"
                >
                  <i class="fas fa-info-circle me-2"></i>Detail
                </a>
              </li>
            </ul>
          </template>
        </DataTable>
      </client-only>
    </div>
  </CardBaseCard>
</template>

<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useAuthStore } from "~/stores/auth";
import { useNavigatorStore } from "~/stores/navigator";
const navStore = useNavigatorStore();
const authStore = useAuthStore();
const { $bus, $dataTableOptions, $swal, $isAuthorized, $moment } = useNuxtApp();
navStore.setPage("Housekeeping");
navStore.setSubpage("Checklist Room");
const config = useRuntimeConfig();
const router = useRouter();
const rooms = ref([]);
const room_id = ref("");
const body = ref({});
const columns = ref([
  {
    title: "Room Name",
    data: "name",
  },
  {
    title: "Room Number",
    data: "room_number",
  },
  {
    title: "Tanggal",
    data: "tanggal",
  },
  {
    title: "Housekeeper",
    data: "housekeeper",
  },
  {
    title: "Supervisor",
    data: "supervisor",
  },
  {
    title: "Status",
    data: "status",
  },
  {
    title: "Verified At",
    data: "verified_at",
  },
  {
    title: "Action",
    data: "id",
  },
]);
const options = $dataTableOptions(
  config.public.baseUrl + "housekeeping/checklist-room",
  authStore.getToken,
  body.value
);
options.columnDefs = [
  {
    targets: [0],
    className: "text-start",
  },
  {
    targets: [5],
    render: (data, type) => {
      if (type === "sort") {
        return data;
      }
      if (data == 0) {
        return "Pending";
      } else if (data == 1) {
        return "Out Of Order";
      } else {
        return "Verified";
      }
      return "";
    },
  },
  {
    targets: [7],
    className: "text-end",
  },
];
options.footerCallback = function (row, data, start, end, display) {
  var api = this.api(),
    data;
  const json = api.ajax.json();
  if (json !== undefined) {
    rooms.value = json.rooms.map((item) => {
      return {
        label: `${item.room_number} - ${item.name}`,
        value: item.id,
        room_number: item.room_number,
        name: item.name,
      };
    });
  }
};
const deleteList = async (id) => {
  $swal
    .fire({
      title: "Hapus Checklist",
      text: "Yakin akan menghapus room checklist ini?",
      icon: "error",
      showCancelButton: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        const { data, status } = await $fetch(
          `${config.public.baseUrl}housekeeping/delete-check-list`,
          {
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
          if (dt !== undefined) {
            dt.ajax.reload();
          }
        }
      }
    });
};
const viewDetail = async (id) => {
  router.push("/housekeeping/detail/" + id);
};
const editList = async (id) => {
  navigateTo("/housekeeping/edit-check-list?checklist_id=" + id);
};

const filterByRoom = async (room_id) => {
  body.value.room_id = room_id;
  if (dt !== undefined) {
    dt.ajax.reload();
  }
};

const filterByDate = (date) => {
  body.value.date = date != null ? $moment(date).format("YYYY-MM-DD") : "";
  if (dt !== undefined) {
    dt.ajax.reload();
  }
};
let dt;
const table = ref();
onMounted(() => {
  $bus.$emit("pagechange", {
    page: "Housekeeping",
    subpage: "Checklist Room",
  });
  if (!authStore.isAuthorized("housekeeping")) {
    navigateTo("/login");
  }
  nextTick().then(() => {
    dt = table.value.dt;
  });
});
</script>

<style></style>
