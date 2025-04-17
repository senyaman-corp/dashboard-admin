<template>
  <div class="card ">
    <div class="card-body">
      <div class="row justify-content-between align-items-center">
        <h3 class="col-lg-3 flex-grow-1 mb-1">Data Booking</h3>
        <div class="col-lg pe-sm-1 mb-1">
          <label class="">
            <input type="checkbox" class="form-check-input me-2" v-model="isChecked" @change="showExpectedCheckout"> Expected Checkout
          </label>
        </div>
        <div class="col-lg-2 pe-sm-1 mb-1">
          <select class="form-select form-select-md"
              :id="'year'"
              @change="filterByType"
              v-model="roomType"
            >
              <option value="" selected>Pilih Type</option>
              <option
                v-for="type in roomTypes"
                :key="type.id"
                :value="type.type"
              >
                {{ type.type }}
              </option>
            </select>
        </div>
       
        <div class="col-lg-2 pe-sm-1 mb-1">
          <select class="form-select form-select-md"
              :id="'year'"
              @change="filterByView"
              v-model="roomView"
            >
              <option value="" selected>Pilih View</option>
              <option value="Mountain">Mountain</option>
              <option value="City">City</option>
            </select>
        </div>
        <div class="col-lg-2 pe-sm-1 mb-1">
          <ButtonBaseButton
            variant="primary"
            to="/booking/add-booking"
            class="w-100"
            >Tambah Booking</ButtonBaseButton
          >
        </div>
      </div>
      <div class="mt-3">
        <div class="table-responsive min-vh-65">
          <client-only>
            <DataTable
              class="table table-striped table-bordered"
              :columns="columns"
              style="width: 100%"
              :options="options"
              ref="table"
            >
            <template #column-8="props">
                <a class="dropdown-toggle btn btn-default" data-bs-toggle="dropdown" data-target="#dropdown" aria-haspopup="true" aria-expanded="false">Aksi</a>
                <ul id="dropdown" class="dropdown-menu p-2" aria-labelledby="dropdown">
                    <li class="dropdown-item" v-if="props.rowData.status !== 'Checkout'">
                      <a type="button" class="btn btn-default" @click="deleteBooking(props.rowData.id)">
                        <i class="fas fa-trash-alt me-2"></i>Delete
                      </a>
                    </li>
                    <li class="dropdown-item">
                      <a type="button" class="btn btn-default" @click="viewDetail(props.rowData.id)">
                          <i class="fas fa-info-circle me-2"></i>Detail
                      </a>
                    </li>
                    <li class="dropdown-item" v-if="props.rowData.status !== 'Checkout'">
                      <a type="button" class="btn btn-default" @click="addAdditionalCharge(props.rowData.id_booking_room)">
                          <i class="fas fa-plus me-2"></i>Additional Charge
                      </a>
                    </li>
                    <li class="dropdown-item" v-if="props.rowData.status !== 'Checkout'">
                      <a type="button" class="btn btn-default" @click="extendsBooking(props.rowData.id_booking_room)">
                          <i class="fas fa-plus me-2"></i>Extends
                      </a>
                    </li>
                    <li class="dropdown-item" v-if="props.rowData.status !== 'Checkout'">
                      <button class="btn btn-default" target="_blank" @click="checkout(props.rowData.id_booking_room)">
                        <i class="fas fa-luggage-cart me-2"></i>Checkout
                      </button>
                    </li>
                </ul>
            </template>
            </DataTable>
          </client-only>
        </div>
      </div>
      <div class="row justify-content-end align-items-center my-4">
        <div class="col-lg-2 pe-sm-0">
          <VueDatePicker
            v-model="start_date"
            auto-apply
            :format="'yyyy-MM-dd'"
            locale="ID"
            uid="startDate"
            :class="'form-control-sm'"
          ></VueDatePicker>
        </div>
        <div class="col-lg-2 px-sm-0">
          <VueDatePicker
            v-model="end_date"
            auto-apply
            :format="'yyyy-MM-dd'"
            uid="endDate"
            locale="ID"
            :class="'form-control-sm'"
          ></VueDatePicker>
        </div>
        <div class="col-lg-1 px-3 ps-sm-0">
          <ButtonBaseButton 
            variant="primary" @click="exportBooking" class="btn-md w-100" style="height:34px;">
              <i class="fas fa-file-excel me-2"></i>Export
            </ButtonBaseButton
          >
        </div>
      </div>
    </div>
    <WidgetModalPad :title="'Additional Charges'" :size="'modal-lg'">
      <form @submit.prevent="handleAddAdditionalCharge">
        <WidgetAdditionalCharge :addChargesData="addChargesData" @update:additionalCharges="updateAdditionalCharges" />
        <div class="d-flex justify-content-end">
          <ButtonBaseButton type="submit" variant="primary" class="mt-4 btn-lg">Tambah</ButtonBaseButton>
        </div>
      </form>
    </WidgetModalPad>
  </div>
</template>

<script setup>
import { useBookingStore } from "@/stores/booking";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useAuthStore } from "~/stores/auth";
import { useRoomStore } from "~/stores/room";
const config = useRuntimeConfig();
const authStore = useAuthStore();
const navStore = useNavigatorStore();
const { $bus, $dataTableOptions,$formatDateTime,$moment,$swal } = useNuxtApp();
const roomStore = useRoomStore();
const roomTypes = roomStore.getRoomTypes;
const roomType = ref('');
const roomView = ref('');
const start_date = ref(new Date());
const end_date = ref(new Date());
const addChargesData = ref([]);
const additionalCharges = ref([]);
const isChecked = ref(false);

navStore.setPage("Booking");
navStore.setSubpage("Index Booking");
const router = useRouter();
const columns = ref([
  { title: "Guest Name", data: "name" },
  { title: "No Telp", data: "no_telp" },
  { title: "Unit", data: "room_number" },
  { title: "Type", data: "room_type" },
  { title: "View", data: "room_view" },
  { title: "Checkin", data: "checkin_date" },
  { title: "Checkout", data: "checkout_date" },
  { title: "Package", data: "booking_package" },
  { title: "Action", data: "id" },
]);
const body = ref({
  type:'',
  view:'',
  expected_checkout:0,
})
const options = $dataTableOptions(config.public.baseUrl + 'bookings/list', authStore.getToken,body.value);
options.order = [[8,'DESC']];
options.columnDefs = [
  { targets:[0],className:'text-start'},
  { targets:[8],className:'text-end'},
  { targets:[5,6],className:'text-end',render:(data,type)=>{
    if(type ==='sort'){
        return data;
    }
    return $formatDateTime(data);
  }}
];

const selectedId = ref('');
const addAdditionalCharge = async (id)=>{
  const { data,status} = await $fetch(`${config.public.baseUrl}bookings/additional-charges`,{
    method: "POST",
    headers: {
      Authorization: "Bearer " + authStore.getToken,
    },
  });
  if(status == 1){
    addChargesData.value = data;
    selectedId.value = id;
    $bus.$emit("openModal", {});
  }
  //router.push('/booking/add-additional-charge?id='+id);
}
const checkout = async (id)=>{
  router.push('/booking/checkout?booking_id='+id);
}
const deleteBooking = async (id)=>{
  $swal.fire({
    title:'Delete Booking',
    text:'Yakin akan dihapus?',
    icon:'warning',
    showCancelButton:true,
    confirmButtonText:'Ya',
    cancelButtonText:'Tidak'
  }).then(async(result)=>{
    $bus.$emit('loading',false);
    if(result.isConfirmed){
      const response = await $fetch(`${config.public.baseUrl}bookings/cancel`,{
        method:'POST',
        headers:{
          'Authorization':'Bearer ' + authStore.getToken
        },
        body:{
          id:id
        }
      }).catch(err=>{
        $bus.$emit('loading',false);
      })
      if(response.status == 1){
        $swal.fire({
          icon:'success',
          title:'Berhasil',
          text:'Berhasil menghapus booking'
        })
        dt.ajax.reload();
      }else{
        $swal.fire({
          icon:'error',
          title:'Gagal',
          text:'Gagal menghapus booking'
        })
      }
    }
  })
   
}

const filterByType = async()=>{
  body.value.type = roomType.value;
  dt.ajax.reload();
}
const filterByView = async()=>{
  body.value.view = roomView.value;
  dt.ajax.reload();
}

const exportBooking = async()=>{
  let url = `${config.public.dashboardUrl}api/export-booking?token=${authStore.getToken}&start_date=${$moment(start_date.value).format('YYYY-MM-DD')}&end_date=${$moment(end_date.value).format('YYYY-MM-DD')}`;
  console.log(url);
  const link = document.createElement('a')
      link.href = url;
      link.download = 'booking.xlsx'
      link.target = '_blank'
      link.click() 
}

const handleAddAdditionalCharge = async () => {
  const form = new FormData();
  form.append('booking_id',selectedId.value);
  additionalCharges.value.forEach(charge=>{
    form.append('name[]',charge.name);
    form.append('price[]',charge.price);
    form.append('quantity[]',charge.qty);
    form.append('discount[]',charge.discount);
  });
  const { data,status} = await $fetch(`${config.public.baseUrl}bookings/add-additional-charges`,{
    method: "POST",
    headers: {
      Authorization: "Bearer " + authStore.getToken,
    },
    body:form
  });
  if(status == 1){
    //addChargesData.value = data;
    dt.ajax.reload();
    $bus.$emit("closeModal", {});
  }

}

const updateAdditionalCharges = (data)=>{
  console.log("Additional Charges",data); 
  additionalCharges.value = data;
}

const viewDetail = async (id)=>{
  router.push('/booking/detail/'+id);
}

const showExpectedCheckout = (e)=>{
  if(e.target.checked){
    body.value.expected_checkout = 1;
  }else{
    body.value.expected_checkout = 0;
  }
  dt.ajax.reload();
}


const extendsBooking = async (id)=>{
  $swal.fire({
    title:'Extends Booking',
    text:'Yakin akan diperpanjang?',
    icon:'warning',
    showCancelButton:true
  }).then(async result=>{
    if(result.isConfirmed){
      const { data,status} = await $fetch(`${config.public.baseUrl}bookings/extends`,{
        method:'POST',
        headers:{
          'Authorization':'Bearer ' + authStore.getToken
        },
        body:{
          id:id
        }
      })
    }
  })
}



let dt;
const table = ref();
onMounted(() => {
  $bus.$emit("pagechange", { page: "Booking", subpage: "Index Booking" });
  nextTick().then(() => {
    dt = table.value.dt;
  })
});

definePageMeta({
  middleware: ["auth"],
});
</script>
<style>
  #dp-input-startDate, #dp-input-endDate{
    padding:.2rem 2rem !important;
  }
</style>
