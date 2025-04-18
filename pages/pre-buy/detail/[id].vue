<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Pre Buy Detail</h3>
      <ButtonBaseButton 
                variant="primary"
                @click="updatePrebuy"
                >Tambah</ButtonBaseButton
                >
    </div>
    <div class="row">
      <div class="col-md-6 mb-3">
        <div class="card min-h-100">
          <div class="card-body">
           
            <div class="form-group">
              <label class="t-bold">Vendor</label>
              <div>{{prebuy.vendor}}</div>
            </div>
            <div class="form-group">
              <label class="t-bold">Start Date</label>
              <div>{{prebuy.start_date}}</div>
            </div>
            <div class="form-group">
              <label class="t-bold">End Date</label>
              <div>{{prebuy.end_date}}</div>
            </div>
            <div class="form-group">
              <label class="t-bold">Quantity</label>
              <div>{{prebuy.quantity}}</div>
            </div>
            <div class="form-group">
              <label class="t-bold">Total Price</label>
              <div>Rp.{{$formatAngka(prebuy.total_price)}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <div class="card min-h-100">
          <div class="card-body">
            <div class="h6 t-bold">Details</div>
            <div class="list-group">
              <div class="list-group-item bg-gray px-2">
                <div class="d-flex justify-content-between">
                    <div class="col-4 t-bold">Room Type</div>
                    <div class="col-1 t-bold text-center">Qty</div>
                    <div class="col-3 t-bold text-center">Booked</div>
                    <div class="col-2 t-bold text-center">Saldo</div>
                    <div class="col-2 t-bold text-end">Price</div>
                </div>
              </div>
              <div class="list-group-item px-2" v-for="item in prebuy.details" :key="item.id">
                <div class="d-flex justify-content-between">
                    <div class="col-4 flex-grow-1">{{ item.room_type }}</div>
                    <div class="col-1">{{ item.quantity }}</div>
                    <div class="col-3 text-center">{{ findBooked(item) }}</div>
                    <div class="col-2 text-center">{{ findSisa(item) }}</div>
                    <div class="col-2 text-end">{{ $formatAngka(item.price) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="card min-h-100">
          <div class="card-body">
          <h3 class="">Booking</h3>
          <div class="table-responsive mt-3 min-vh-65">
              <client-only>
                  <DataTable
                      class="table table-striped table-bordered"
                      :columns="columns"
                      style="width: 100%"
                      :data="prebuy.pre_buy_booking"
                      :options="options"
                      ref="table"
                      >
                      
                  </DataTable>
              </client-only>
          </div>
          </div>
        </div>
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
const { $bus ,$formatDateTime,$formatAngka} = useNuxtApp();
navStore.setPage("PreBuy");
navStore.setSubpage("Index PreBuy");
const route = useRoute();
const router = useRouter();
const prebuy = ref();
const { data,status} = await $fetch(config.public.baseUrl + 'pre-buy/detail',{
    method: "POST",
    headers: {
        Authorization: "Bearer " + authStore.getToken,
    },
    body:{
        id:route.params.id
    }
})
if(status == 1){
  prebuy.value = data;
}
const columns = [
  { title : 'Guest' ,data : 'guest'},
  { title : 'Checkin' ,data : 'checkin_date'},
  { title : 'Checkout' ,data : 'checkout_date'},
  { title : 'Room' ,data : 'name'},
  { title : 'Room Number' ,data : 'room_number'},
  { title : 'Type' ,data : 'type'},
  { title : 'View' ,data : 'view'},
];
const options = {
  columnDefs:[
    { targets:[0],className:'text-start'},
    { targets:[1,2],render:(data,type)=>{
      if(type ==='sort'){
          return data;
      }
      return $formatDateTime(data);
    }},
  ]
}

const findBooked = (item) =>{
  let booked = 0;
  item.room_booking.forEach((booking) => {
    console.log(item);
    if(booking.type == item.room_type){
      booked += booking.jumlah_booking;
    }
  });
  return booked;
}

const findSisa = (item) =>{
  return item.quantity - findBooked(item);
}

const updatePrebuy = ()=>{
  router.push('/pre-buy/add?vendor='+prebuy.value.vendor);
}

</script>

<style>

</style>

