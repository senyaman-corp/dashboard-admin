<template>
  <div class="row">
        <div class="col-lg-4 pe-sm-2 mb-3">
            <div class="card min-h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="card-title mb-0">Additional Charges</h5>
                    </div>
                    <form @submit.prevent="submit">
                        <div class="form-group row align-items-center mb-2">
                            <label  class="col-sm-3 t-bold">Name</label>
                            <div class="col-lg-9">
                                <input type="text" v-model="name"
                                    placeholder="Insert cherge name" class="form-control" />
                            </div>
                        </div>
                        <div class="form-group row align-items-center mb-2">
                            <label  class="col-sm-3 t-bold">Price</label>
                            <div class="col-lg-9">
                                <input type="text" v-model="base_price"
                                    placeholder="Insert base price" class="form-control" />
                            </div>
                        </div>
                        <div class="form-group d-flex justify-content-end">
                            <ButtonBaseButton type="submit" variant="primary" class="mt-2 min-h-100 btn-md">Tambah</ButtonBaseButton> 
                        </div>
                        
                    </form>
                    <hr />
                    <div class="table-responsive">
                        <client-only>
                            <DataTable
                                class="table table-striped table-bordered"
                                :columns="columns"
                                style="width: 100%"
                                :options="options"
                                ref="table"
                            >
                            <template #column-2="props">
                                <a type="button" class="btn btn-default" @click="deleteItem(props.rowData.id)">
                                    <i class="fas fa-trash-alt me-2"></i>
                                </a>
                            </template>
                            </DataTable>
                        </client-only>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useNavigatorStore } from "~/stores/navigator";
    import { useAuthStore } from "~/stores/auth";
    const config = useRuntimeConfig();
    const navStore = useNavigatorStore();
    const authStore = useAuthStore();
    const { $bus,$dataTableOptions,$swal } = useNuxtApp();
    navStore.setPage("Room");
    navStore.setSubpage("Additional Charges");
    const name = ref('');
    const base_price = ref('');
    const columns = [
        { title : 'Name' ,data: 'name'},
        { title : 'Price' ,data: 'base_price'},
        { title : 'Action',data: 'id'},
    ]
    const options = $dataTableOptions(config.public.baseUrl + 'rooms/data-additional-charges', authStore.getToken);
    options.columnDefs = [
        { targets:[1],render:(data,type)=>{
            if(type === 'sort'){
                return data;
            }
            return new Intl.NumberFormat('ID').format(data);
        }},
        { targets:[2],className:'text-end'}
    ]
    const submit = async () => {
        const data = {
            name: name.value,
            base_price: base_price.value,
        };
        const { result, status } = await $fetch(`${config.public.baseUrl}rooms/create-additional-charges`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data
        });
        if (status == 1) {
           if(dt !== undefined){
                dt.ajax.reload();
            }
        }
    };

    const deleteItem = async (id) => {
        $swal.fire({
            title:'Delete Additional Charge',
            text:'Yakin akan dihapus?',
            icon:'warning',
            showCancelButton:true,
            confirmButtonText:'Ya',
            cancelButtonText:'Tidak'
        }).then(result=>{
            if(result.value){
                deleteData(id);
            }
        })
    }

    const deleteData = async (id) => {
        const { result, status } = await $fetch(`${config.public.baseUrl}rooms/delete-additional-charges`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authStore.token}`,
            },
            body: {
                id: id
            }
        });
        if (status == 1) {
            if(dt !== undefined){
                dt.ajax.reload();
            }
        }
    };

    let dt;
    const table = ref();
    onMounted(() => {
        $bus.$emit("pagechange", { page: "Room", subpage: "Additional Charges" });
        nextTick().then(() => {
            dt = table.value.dt;
        });
    });
    definePageMeta({
        middleware: ["auth"],
    });
</script>

<style>

</style>