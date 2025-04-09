<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3>Pre Buy Detail</h3>
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
              <div>{{prebuy.total_price}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <div class="card min-h-100">
          <div class="card-body">
            <div class="h6 t-bold">Details</div>
            <div class="list-group">
              <div class="list-group-item bg-gray">
                <div class="row justify-content-between">
                    <div class="col-md-8 t-bold">Room Type</div>
                    <div class="col-md-2 t-bold">Qty</div>
                    <div class="col-md-2 t-bold">Price</div>
                </div>
              </div>
              <div class="list-group-item" v-for="item in prebuy.details" :key="item.id">
                <div class="row justify-content-between">
                    <div class="col-md-8 flex-grow-1">{{ item.room_type }}</div>
                    <div class="col-md-2">{{ item.quantity }}</div>
                    <div class="col-md-2">{{ item.price }}</div>
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
const { $bus ,$dataTableOptions} = useNuxtApp();
navStore.setPage("PreBuy");
navStore.setSubpage("Index PreBuy");
const route = useRoute();
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
const options = {
  columnDefs:[
    { targets:[0],className:'text-start'},
  ]
}
</script>

<style>

</style>