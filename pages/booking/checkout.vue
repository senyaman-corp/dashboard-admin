<template>
  <div class="card min-vh-65">
    <div class="card-body">
        <h3>Checkout</h3>
        <div class="row">
          <div class="col-md-4">
            <div class="h4 t-bold">Guest</div>
            <div class="form-group">
              <label class="t-bold">Name</label>
              <div>{{booking.booking ? booking.booking.guest ? booking.booking.guest.name : '' : ''}}</div>
            </div>
            <div class="form-group">
              <label class="t-bold">Telp</label>
              <div>{{booking.booking ? booking.booking.guest ? booking.booking.guest.no_telp : '' : ''}}</div>
            </div>
          </div>
          <div class="col-md-12">
            <div class="table-responsive w-100">
              <client-only>
                <DataTable class="table table-striped table-bordered" :data="data" :columns="columns" :options="options" />
              </client-only>
            </div>
            <div class="row justify-content-end">
              <div class="col-md-1">
                <div class="t-bold">Total</div>
              </div>
              <div class="col-md-1">
                <div class="t-bold">{{$formatAngka(total)}}</div>
              </div>
            </div>
            <div class="row justify-content-end">
              <div class="col-md-1">
                <div class="t-bold">Tax</div>
              </div>
              <div class="col-md-1">
                <div class="t-bold">{{$formatAngka(tax)}}</div>
              </div>
            </div>
            <div class="row justify-content-end">
              <div class="col-md-1">
                <div class="t-bold">Grand Total</div>
              </div>
              <div class="col-md-1">
                <div class="t-bold">{{$formatAngka(total + tax)}}</div>
              </div>
            </div>
            <div class="d-flex justify-content-end my-4">
              <ButtonBaseButton variant="primary" @click="prosesCheckout" class="btn-lg">Checkout</ButtonBaseButton>
            </div>
          </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
const config = useRuntimeConfig();
const authStore = useAuthStore();
const navStore = useNavigatorStore();
const { $bus, $dataTableOptions,$swal,$moment } = useNuxtApp();
navStore.setPage("Booking");
navStore.setSubpage("Index Booking");
const router = useRouter();
const route = useRoute();
const booking_id = route.query.booking_id;
//const room_id = route.query.room_id;
const booking = ref({});
const data = ref([]);
const total = ref(0);
const tax = ref(0);
const initNookingData = async()=>{
  const res = await $fetch(config.public.baseUrl + 'bookings/booking-room-detail',{
    method:'POST',
    headers:{
      'Authorization':'Bearer '+authStore.getToken
    },
    lazy:true,
    body:{
      id:booking_id
    }
  });
  if(res.status == 1){
    booking.value = res.data;
    console.log(booking.value)
    data.value = booking.value.booking_room_price.map((b,index)=>{
        return {
          name:b.room.name + ' - '+b.room.room_number,
          unit:1,
          keterangan: $moment(b.tanggal).format('DD-MMMM-YYYY') + '   s/d    ' + $moment(b.end_date).format('DD-MMMM-YYYY'),
          price:b.price,
          discount:b.discount,
          sub_total:b.price - b.discount,
          index:index
        }
    });
    data.value.map((d,index)=>{
      let tgl = booking.value.booking_room_price[index].tanggal;
      let addCharges = booking.value.booking_room_price[index].additional_charges;
      addCharges.map((addCha)=>{
        if(addCha.tanggal === tgl ){
          let item = {
            name:'',
            unit:'',
            keterangan:addCha.name,
            price:addCha.total_amount,
            discount:addCha.discount,
            sub_total:addCha.total_amount - addCha.discount,
            index:index
          }
          data.value.push(item);
        }
      });
     
    });
    data.value = data.value.sort((a,b)=>{
      return a.index - b.index;
    });
    
    
    let booki = booking.value.booking;
    tax.value = parseInt(booki.taxamount);
  
    data.value.map((d)=>{
      total.value += parseInt(d.sub_total);
    });
  }
}
const options = {
  order:[[6,'asc']],
  bPaginate:false,
  bFilter:false,
  columnDefs:[
      { targets:[6],visible:false},
      { targets:[3,4,5],render:(data,type)=>{
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR',maximumFractionDigits: 0 }).format(data);
      }}
  ],
}
const columns = [
  { title: "Room Name", data: "name" },
  { title: "Unit", data: "unit" },
  { title: "Keterangan", data: "keterangan" },
  { title: "Price", data: "price" },
  { title: "Discount", data: "discount" },
  { title: "Sub Total", data: "sub_total" },
  { title: "Action", data: "index" },
]

const prosesCheckout = async()=>{
  $swal.fire({
    title:'Checkout',
    text:'Yakin akan checkout?',
    icon:'warning',
    showCancelButton:true,
    confirmButtonColor:'#3085d6',
    cancelButtonColor:'#d33',
    confirmButtonText:'Ya',
    cancelButtonText:'Tidak'
  }).then((result)=>{
    if(result.isConfirmed){
      $fetch(config.public.baseUrl + 'bookings/process-checkout',{
        method:'POST',
        headers:{
          'Authorization':'Bearer '+authStore.getToken
        },
        lazy:true,
        body:{
          booking_id:booking_id,
          room_id:booking.value.room_id
        }
      }).then(resp=>{
        if(resp.status == 1){
          $swal.fire({
            title:'Checkout',
            text:'Checkout Berhasil',
            icon:'success',
            confirmButtonText:'OK'
          }).then((result)=>{
            if(result.isConfirmed){
              navigateTo('/booking');
            }
          })
        }else{
          $swal.fire(`Request failed: ${resp.message}`)
        }
      })
    }
  })

}

initNookingData();
onMounted(() => {
  $bus.$emit("pagechange", { page: "Booking", subpage: "Index Booking" });
});
definePageMeta({
  middleware: ["auth"],
});
</script>

<style>

</style>