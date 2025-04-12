<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Data Room Type</h3>
    </div>
    <div class="row">
        <div class="col-lg-4 pe-sm-2 mb-3">
            <div class="card min-h-100">
                <div class="card-body">
                    <div class="my-3 t-bold h4">Room Type</div>
                    <form @submit.prevent="submit">
                    <div class="d-flex align-items-center">
                        <InputBaseInput
                                type="text"
                                v-model="type"
                                label="Room Type"
                                placeholder="Insert room type"
                                :class="'flex-grow-1 me-2'"
                            />
                        <ButtonBaseButton type="submit" variant="primary" class="mt-2 min-h-100 btn-md">Tambah</ButtonBaseButton>
                        </div>  
                    </form>
                    <hr />
                    <div class="table-responsive">
                        <client-only>
                            <DataTable
                                class="table table-striped table-bordered"
                                :columns="columns"
                                :data="roomTypes"
                                :options="options"
                                style="width: 100%"
                            >
                            <template #column-1="props">
                                <div class="d-flex justify-content-end">
                                    <button type="button" class="btn btn-primary mx-1" @click="deleteRoomType(props.rowData)">Edit</button>
                                    <button type="button" class="btn btn-primary mx-1" @click="viewProperties(props.rowData)">Properties</button>
                                </div>
                            </template>
                            </DataTable>
                        </client-only>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-8 ps-sm-2 mb-3">
            <div class="card min-h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="my-3 t-bold h4">Room Property</div>
                        <div class="my-3 t-bold h4">{{roomType}}</div>
                    </div>
                    <form @submit.prevent="addChecklistItem">
                        <div class="row align-items-center">
                            <div class="col-lg-8 mb-3 flex-grow-1 pe-4" id="multiselect-style">
                                <label class="form-label">Nama Property</label>
                                <Multiselect
                                    v-model="propertyName"
                                    :options="properties"
                                    :searchable="true"
                                    :multiple="false"
                                    :close-on-select="true"
                                    :clear-on-select="false"
                                    track-by="value"
                                    class="form-control form-control-md"
                                    placeholder="Pilih opsi"
                                    required
                                >
                                    <template #singleLabel="props">
                                        <span class="option__desc"><span class="option__title">{{ props.option.name }}</span></span>
                                    </template>
                                    <template #option="props">
                                        <div class="option__desc">
                                            <div class="option__title t-bold">{{ props.option.name }}</div>
                                            <div class="option__small small">{{ props.option.category }}</div>
                                        </div>
                                    </template>
                                </Multiselect>
                            </div>
                            <div class="col-lg-3">
                                <InputBaseInput
                                        type="number"
                                        v-model="quantity"
                                        label="Quantity"
                                        placeholder="Insert Quantity"
                                        :required="true"
                                    />
                               
                            </div>
                            <div class="col-lg-1">
                                <ButtonBaseButton type="submit" variant="primary" class="mt-2 min-h-100 btn-md">Tambah</ButtonBaseButton>
                            </div>
                        </div>  
                    </form>
                    <hr />
                    <div class="table-responsive">
                        <client-only>
                            <DataTable
                                class="table table-striped table-bordered"
                                :columns="roomPropertiesColumn"
                                :data="roomProperties"
                                style="width: 100%"
                            >
                            <template #column-3="props">
                                <div class="d-flex justify-content-end">
                                    <button type="button" class="btn btn-danger mx-1" @click="deleteProperties(props.rowData)">Hapus</button>
                                </div>
                            </template>
                            </DataTable>
                        </client-only>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-12 mb-3">
            <div class="card">
                <div class="card-body">
                    <div class="my-3 t-bold h4">List Property</div>
                    <form @submit.prevent="addProperty">
                        <div class="row">
                            <div class="col-lg-4">
                                <div class="mb-3">
                                    <label class="form-label">Category</label>
                                    <select class="form-select" v-model="category">
                                        <option value="">Select Category</option>
                                        <option v-for="option in categoryOptions" :key="option" :v-model="option">
                                            {{ option }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                          
                            <div class="col-lg-7">
                                <InputBaseInput
                                    type="text" 
                                    v-model="name"
                                    label="Nama Property"
                                    placeholder="Insert property name"
                                />
                            </div>
                            <div class="col-lg-1">
                                <label>&nbsp;</label>
                                <div class="mb-3">
                                    <ButtonBaseButton type="submit" variant="primary" class="mt-2 min-h-100 btn-md">Tambah</ButtonBaseButton>
                                </div>
                            </div>
                        </div>
                    </form>
                    <hr />
                    <client-only>
                        <DataTable
                            class="table table-striped table-bordered"
                            :columns="propertiesColumns"
                            :data="properties"
                            style="width: 100%"
                        />
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
    const { $bus } = useNuxtApp();
    navStore.setPage("Room");
    navStore.setSubpage("Room Type");
    const columns = ref([
        { title: "Type", data: "type" },
        { title: "Aksi", data: "id" }
    ]);
    const roomPropertiesColumn = ref([
        { title: "Category", data: "category" },
        { title: "Name", data: "name" },
        { title: "Qty", data: "quantity" },
        { title: "Aksi", data: "id" }
    ]);
    const categoryOptions = ref([
        'RUANGAN KAMAR MANDI',
        'RUANGAN DAPUR',
        'KAMAR PERTAMA',
        'KAMAR KEDUA',
        'ELEKTRONIK',
        'AKSESORIS',
        'AMINITIS'
    ])

    const propertiesColumns = ref([
        { title: "Category", data: "category" },
        { title: "Name", data: "name" }
    ]);
    const roomTypes = ref([]);
    const properties = ref([]);
    const roomProperties = ref([]);
    const category = ref('');
    const name = ref('');
    const type = ref('');
    const roomType = ref('');
    const propertyName = ref('');
    const quantity = ref('');
    const { data,status } = await $fetch(`${config.public.baseUrl}rooms/list-room-type`,{
        lazy: true,
        method: "POST",
        headers: {
        Authorization: "Bearer " + authStore.getToken,
        },
    });
    if(status == 1){
        console.log(data);
        roomTypes.value = data.room_type;
        data.properties.map((item)=>{
                item.value = item.name;
            });
       
        properties.value = data.properties;
        console.log(data.properties);
    }

    const options = ref({
        columnDefs:[
            { targets:1,className:'text-end'}
        ],
        
    })
    const submit = async () => {
        const { data, status } = await $fetch(`${config.public.baseUrl}rooms/create-room-type`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + authStore.getToken,
            },
            body: {
                type: type.value,
            },
        });
        if (status == 1) {
            roomTypes.value.push(data);
            type.value = "";
        }
    };

     const viewProperties = async (props) => {
        $bus.$emit('loading',true);
        roomType.value = props.type;
        const { data, status } = await $fetch(`${config.public.baseUrl}rooms/list-room-property`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + authStore.getToken,
            },
            body: {
                type: props.type,
            },
        });
        if (status == 1) {
            roomProperties.value = data;
        }
        $bus.$emit('loading',false);
    };

    const addChecklistItem = async () => {
        const { data, status } = await $fetch(`${config.public.baseUrl}rooms/create-room-property`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + authStore.getToken,
            },
            body: {
                room_type: roomType.value,
                name: propertyName.value.name,
                quantity: quantity.value,
            },
        });
        if (status == 1) {
            roomProperties.value.push(data);
            propertyName.value = "";
            quantity.value = "";
        }
    };

    const deleteRoomType = (props)=>{
        console.log(props.type);
    }

    const addProperty = async () => {
        const { data, status } = await $fetch(`${config.public.baseUrl}rooms/create-property`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + authStore.getToken,
            },
            body: {
                category: category.value,
                name: name.value,
            },
        });
        if (status == 1) {
            if(data !== null){
                properties.value.push(data);
            }
            category.value = "";
            name.value = "";
        }
    };
    const deleteProperties = async (props) => {
        const { data, status } = await $fetch(`${config.public.baseUrl}rooms/delete-room-property`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + authStore.getToken,
            },
            body: {
                id: props.id,
            },
        });
        if (status == 1) {
            let filtered = roomProperties.value.filter(item => item.id !== props.id);
            roomProperties.value = filtered;
        }
    };
    onMounted(() => {
        $bus.$emit("pagechange", { page: "Room", subpage: "Room Type" });
    });
</script>

<style>

</style>