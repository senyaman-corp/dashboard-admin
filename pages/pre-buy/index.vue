<template>
  <div class="card min-vh-65">
    <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
            <h3>Data Pre Buy</h3>
            <div>
                <ButtonBaseButton 
                variant="primary"
                to="/pre-buy/add"
                >Tambah</ButtonBaseButton
                >
            </div>
        </div>
        <div class="table-responsive mt-3 min-vh-65">
            <client-only>
                <DataTable
                    class="table table-striped table-bordered"
                    :columns="columns"
                    style="width: 100%"
                    :options="options"
                    ref="table"
                    >
                    <template #column-7="props">
                        <a class="dropdown-toggle btn btn-default" data-bs-toggle="dropdown" data-target="#dropdown" aria-haspopup="true" aria-expanded="false">Aksi</a>
                        <ul id="dropdown" class="dropdown-menu p-2" aria-labelledby="dropdown">
                            <li class="dropdown-item">
                            <a type="button" class="btn btn-default" @click="deletePrebuy(props.rowData.id)">
                                <i class="fas fa-trash-alt me-2"></i>Delete</a>
                            </li>
                            <li class="dropdown-item">
                            <a type="button" class="btn btn-default" @click="viewDetail(props.rowData.id)">
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
import { useAuthStore } from "~/stores/auth";
import { useNavigatorStore } from "~/stores/navigator";
const navStore = useNavigatorStore();
const authStore = useAuthStore();
const config = useRuntimeConfig();
const { $bus ,$dataTableOptions} = useNuxtApp();
navStore.setPage("PreBuy");
navStore.setSubpage("Index PreBuy");
const router = useRouter();
const options = $dataTableOptions(config.public.baseUrl + 'pre-buy/list', authStore.getToken);
options.columnDefs = [
  { targets:[0],className:'text-start'},
  { targets:[7],className:'text-end'},
  { targets:[5],className:'text-end',render:(data,type)=>{
    if(type === 'sort'){
        return data;
    }
    return new Intl.NumberFormat('ID').format(data);
  }},
  {targets:[6],render:(data,type)=>{
            return data.length;
        }},
];

const columns = ref([
  { title: "ID", data: "id" },
  { title: "Vendor", data: "vendor" },
  { title: "Start Date", data: "start_date" },
  { title: "End Date", data: "end_date" },
  { title: "Quantity", data: "quantity" },
  { title: "Total Price", data: "total_price" },
  { title: "Booking", data: "pre_buy_booking" },
  { title: "Action", data: "id" },
]);

const deletePrebuy = async (id) => {
    const { data, status } = await $fetch(`${config.public.baseUrl}pre-buy/delete`, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + authStore.getToken,
        },
        body:{
            id:id
        }
    });
    if(status == 1){
        if(dt !== undefined){
            dt.ajax.reload();
        }
    }
}

const viewDetail = async (id) => {
   router.push('/pre-buy/detail/'+id);
}

let dt;
const table = ref();

onMounted(() => {
  $bus.$emit("pagechange", { page: "PreBuy", subpage: "Index PreBuy" });
  nextTick().then(() => {
    dt = table.value.dt;
  })
});
</script>

<style>

</style>