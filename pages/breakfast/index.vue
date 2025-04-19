<template>
    <div class="card ">
        <div class="card-body">
            <div class="row justify-content-between align-items-center">
                <h3 class="col-lg-3 flex-grow-1 mb-1">Data Breakfast</h3>
                <!-- 
                <div class="col-lg-2 pe-sm-1 mb-1">
                    <div class="mb-3">
                        <VueDatePicker
                            v-model="list_date"
                            auto-apply
                            :format="'yyyy-MM-dd'"
                            placeholder="Pilih Tanggal"
                            @update:model-value="filterByDate(list_date)"
                            locale="ID" required></VueDatePicker>
                    </div>
                </div>
                 -->
                <div class="col-lg-2 ps-sm-1">
                    <InputSelect :options="rooms" v-model="room_id" placeholder="Room Number" @update:model-value="filterByRoom(room_id)" />
                </div>
            </div>
            <div class="mt-3">
                <div class="table-responsive mt-3 min-vh-65" id="style-datatable">
                    <client-only>
                        <DataTable
                            class="table table-striped table-bordered"
                            :columns="columns"
                            :options="options"
                            style="width: 100%"
                            ref="table">
                            <template #column-7="props">
                                <button class="btn btn-sm btn-default" @click="verify(props.rowData.id)" v-if="props.rowData.status == 0">
                                    <i class="far fa-square text-18"></i>
                                </button>
                                <i v-else class="fas fa-check-square text-primary text-18"></i>
                                <!-- 
                                <a class="dropdown-toggle btn btn-default" :class="{ 'text-danger' : props.rowData.status < 2}" data-bs-toggle="dropdown" data-target="#dropdown"
                                    aria-haspopup="true" aria-expanded="false">Aksi</a>
                                <ul id="dropdown" class="dropdown-menu p-2" aria-labelledby="dropdown">
                                    <li class="dropdown-item" v-if="props.rowData.status < 2">
                                        <a type="button" class="btn btn-default" @click="editList(props.rowData.id)">
                                            <i class="fas fa-edit me-2"></i>Edit</a>
                                    </li>
                                    <li class="dropdown-item" v-if="props.rowData.status < 2">
                                        <a type="button" class="btn btn-default" @click="deleteList(props.rowData.id)">
                                            <i class="fas fa-trash-alt me-2"></i>Delete</a>
                                    </li>
                                    <li class="dropdown-item" v-if="authStore.isSupervisor() && props.rowData.status < 2">
                                        <a type="button" class="btn btn-default" @click="viewDetail(props.rowData.id)">
                                            <i class="fas fa-info-circle me-2"></i>Detail
                                        </a>
                                    </li>
                                </ul>
                                 -->
                            </template>
                        </DataTable>
                    </client-only>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import VueDatePicker from "@vuepic/vue-datepicker";
    import "@vuepic/vue-datepicker/dist/main.css";
    import {
        useAuthStore
    } from "~/stores/auth";
    import {
        useNavigatorStore
    } from "~/stores/navigator";
    const navStore = useNavigatorStore();
    const authStore = useAuthStore();
    const {
        $bus,
        $dataTableOptions,
        $swal,
        $isAuthorized,
        $moment
    } = useNuxtApp();
    navStore.setPage("Co Working");
    navStore.setSubpage("Breakfast");
    const config = useRuntimeConfig();
    const rooms = ref([]);
    const room_id = ref('');
    const body = ref({})
    const columns = ref([{
            title: "Guest",
            data: "guest"
        },
        {
            title: "Room Name",
            data: "name"
        },
        {
            title: "Room Number",
            data: "room_number"
        },
        {
            title: "Tanggal",
            data: "tanggal"
        },
        
        {
            title: "Checkout Date",
            data: "checkout_date"
        },
        
        {
            title: "Status",
            data: "status"
        },
        {
            title: "Keterangan",
            data: "description"
        },
        {
            title: "Action",
            data: "id"
        },
    ]);
    const options = $dataTableOptions(config.public.baseUrl + 'co-working/breakfast', authStore.getToken, body.value);
    options.columnDefs = [{
            targets: [0],
            className: 'text-start'
        },
        {
            targets: [5],
            render: (data, type) => {
                if (type === 'sort') {
                    return data;
                }
                if (data == 0) {
                    return 'Pending';
                } else if (data == 1) {
                    return 'Taken';
                } 
                return '';
            }
        },
        {
            targets: [7],
            className: 'text-end'
        },
    ];
    options.footerCallback = function(row, data, start, end, display) {
        var api = this.api(),
            data;
        const json = api.ajax.json();
        if (json !== undefined) {
            rooms.value = json.rooms.map(item => {
                return {
                    label: `${item.room_number} - ${item.name}`,
                    value: item.id,
                    room_number: item.room_number,
                    name: item.name,
                };
            });
        }
    }

const filterByRoom = (value) => {
    body.value.room_id = value;
    if(dt != undefined){
        dt.ajax.reload();
    }
}

const verify = (id) => {
    console.log(id);
    $swal.fire({
        text:'Verify Breakfast?',
        showCancelButton:true,
        background:"#10c4a3",
        toast:true,
        customClass:{
            htmlContainer:'text-white',
            cancelButton:'btn-cancel'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $fetch(config.public.baseUrl + 'co-working/verify-breakfast', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + authStore.getToken,
                    'Content-Type': 'application/json',
                },
                body: { id: id }
                }).then((response) => {
                    if(response.status == 1){
                        $bus.$emit('alert',{
                            type:'success',
                            message:response.message
                        });
                        if(dt != undefined){
                            dt.ajax.reload();
                        }
                        
                    }else{
                        $bus.$emit('alert',{
                            type:'danger',
                            message:response.message
                        });
                    }
                })      
        }
    })
}
let dt;
const table = ref();
onMounted(() => {
    $bus.$emit("pagechange", {
      page: "Co Working",
      subpage: "Breakfast"
    });
    nextTick().then(() => {
      dt = table.value.dt;
    })
});
</script>

<style>
.btn-cancel{
    background-color:#ee09af !important;
}
</style>