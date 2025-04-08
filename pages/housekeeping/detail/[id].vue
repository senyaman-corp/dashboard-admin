<template>
    <div>
      <div class="card">
          <div class="card-body">
            <div class="h4 t-bold">Detail Checklist Room</div>
            <div class="form-group row">
                <label class="col-md-2 t-bold">Room Name</label>
                <div class="col-md-10">{{ checkListRoom.name }}</div>
            </div>
            <div class="form-group row">
                <label class="col-md-2 t-bold">Room Number</label>
                <div class="col-md-10">{{ checkListRoom.room_number }}</div>
            </div>
            <div class="form-group row">
                <label class="col-md-2 t-bold">Date</label>
                <div class="col-md-10">{{ checkListRoom.tanggal }}</div>
            </div>
            <div class="form-group row">
                <label class="col-md-2 t-bold">Housekeeper</label>
                <div class="col-md-10">{{ checkListRoom.housekeeper }}</div>
            </div>
            <div class="list-group">
                <div class="list-group-item bg-gray">
                    <div class="d-flex justify-content-between">
                        <div class="t-bold px-3">NO</div>
                        <div class="flex-grow-1 t-bold">Item Name</div>
                        <div class="t-bold">Status</div>
                    </div>
                </div>
                <div class="list-group-item" v-for="(item,index) in checklistItems" :key="item.id">
                    <div class="d-flex justify-content-between">
                        <input type="hidden" :value="item.id" name="item_ids[]" >
                        <div class="t-bold px-4">{{index + 1}}</div>
                        <div class="flex-grow-1">{{item.name}}</div>
                        <div class="" >
                            <i class="fas fa-check-circle text-18" v-if="itemChecked.includes(item.name)"></i>
                            <i class="fas fa-times-circle text-18 text-danger" v-else></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-end my-4">
                <button @click="outOfOrder" class="btn btn-danger btn-md mx-1">Out Of Order</button>
                <button @click="verify" class="btn btn-primary btn-md mx-1">Verify</button>
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
  const { $bus,$swal } = useNuxtApp();
  navStore.setPage("Housekeeping");
  navStore.setSubpage("Checklist Room");
  const config = useRuntimeConfig();
  const checklistItems = ref([]);
  const itemChecked = ref([]);
  const checkListRoom = ref();
  const route  = useRoute();
  const { data, status } = await $fetch(`${config.public.baseUrl}housekeeping/detail-checklist-room`, {
      method: "POST",
      headers: {
          Authorization: "Bearer " + authStore.getToken,
      },
      body: {
          id: route.params.id,
      },
  });
  if (status == 1) {
    checkListRoom.value = data.data;
    checklistItems.value = data.items
    itemChecked.value = JSON.parse(checkListRoom.value.checklist_items);
  }

  const outOfOrder = async () => {
    $swal.fire({
        title:'Cancel Checklist',
        text:'Yakin akan membatalkan room checklist ini?',
        icon:'error',
        showCancelButton:true
    }).then(async (result) => {
        if(result.isConfirmed){
            const res = await $fetch(`${config.public.baseUrl}housekeeping/out-of-order`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + authStore.getToken,
                },
                body: {
                    id: route.params.id,
                },
            });
            if (res.status == 1) {
                navigateTo("/housekeeping/checklist-room");
            } else {
                
            }
        }
        
    })
  }

  const verify = async () => {
    $swal.fire({
        title:'Verify Checklist',
        text:'Yakin akan melakukan verifikasi untuk room checklist ini?',
        icon:'warning',
        showCancelButton:true
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await $fetch(`${config.public.baseUrl}housekeeping/verify`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + authStore.getToken,
                },
                body: {
                    id: route.params.id,
                },
            });
            if (res.status == 1) {
               
                navigateTo("/housekeeping/checklist-room");
            } else {
            }
        }
    })
   
  } 
  </script>
  
  <style>
  
  </style>