<template>
  <div class="card min-vh-65">
    <div class="card-body">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <h3>Tambah PreBuy</h3>
                <form @submit.prevent="handleSubmit">
                    <InputBaseInput
                    v-model="formData.vendor" required
                    label="Vendor"
                    placeholder="Masukkan Nama Vendor"
                    type="text" inputmode="text"
                    :list="vendors"
                    />
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label t-required">Start Date</label>
                                <VueDatePicker
                                    v-model="formData.start_date"
                                    auto-apply
                                    :format="'yyyy-MM-dd'"
                                    class="mb-3" required
                                    :min-date="new Date()"
                                    locale="ID"
                                />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label t-required">End Date</label>
                                <VueDatePicker
                                    v-model="formData.end_date"
                                    auto-apply
                                    :format="'yyyy-MM-dd'"
                                    class="mb-3" required
                                    :min-date="new Date()"
                                    locale="ID"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="list-group">
                        <div class="list-group-item bg-gray">
                            <div class="row justify-content-between">
                                <div class="col-lg-8 t-bold flex-grow-1">Room Type</div>
                                <div class="col-lg-2">Quantity</div>
                                <div class="col-lg-2">Price Per Room</div>
                            </div>
                        </div>
                        <div v-for="(item,index) in roomTypes" :key="item.id">
                        <div class="list-group-item" v-if="item == 'Studio'">
                            <div class="row justify-content-between" >
                                <div class="col-lg-8 t-bold flex-grow-1">{{ item }}</div>
                                <div class="col-lg-2">
                                    <InputAutonumeric
                                        v-model="formData.quantity[index]" :currencySymbol="' '"
                                        placeholder="Room Quantity"
                                        />
                                    
                                </div>
                                <div class="col-lg-2">
                                    <InputAutonumeric
                                        v-model="formData.price[index]"
                                        placeholder="Price Per Room"
                                        />
                                  
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>   
                    <div class="d-flex justify-content-end my-4">
                        <button type="submit" class="btn btn-primary btn-lg">Submit</button>
                    </div>
                    <div class="error">
                        {{ error }}
                    </div>
                </form>
            </div>
        </div>
       
    </div>
  </div>
</template>

<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useAuthStore } from "~/stores/auth";
import { useNavigatorStore } from "~/stores/navigator";
const navStore = useNavigatorStore();
const authStore = useAuthStore();
const config = useRuntimeConfig();
const { $bus ,$dataTableOptions} = useNuxtApp();
navStore.setPage("PreBuy");
navStore.setSubpage("Index PreBuy");
const router = useRouter();
const route = useRoute();
const formData = ref({
  vendor: "",
  room_types: [],
  quantity: [],
  price: [],
  start_date: null,
  end_date: null,
});
const vendors = ref([]);
const roomTypes = ref([]);
const error = ref('');
const { data,status} = await $fetch(`${config.public.baseUrl}pre-buy/data`, {
  method: "POST",
  headers: {
    Authorization: "Bearer " + authStore.getToken,
  },
});

if(status == 1){
    vendors.value = data.vendors;
    roomTypes.value = data.room_types.filter(itm=>{
        return itm == 'Studio';
    })
    roomTypes.value.map((item,index) => {
        formData.value.quantity.push(0);
        formData.value.price.push(0);
    })
}
const handleSubmit = async () => {
    formData.value.room_types = roomTypes.value;
    const { data, status,message } = await $fetch(`${config.public.baseUrl}pre-buy/create`, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + authStore.getToken,
        },
         body: formData.value,
    });
    if(status == 1){
        router.push('/pre-buy');
    }else{
        error.value = message;
    }
}

onMounted(() => {
  $bus.$emit("pagechange", { page: "PreBuy", subpage: "Add PreBuy" });
  let vName = route.query.vendor;
  if(vName !== undefined){
    formData.value.vendor = vName;
  }
});
</script>

<style>

</style>