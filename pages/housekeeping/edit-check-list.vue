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
              <form @submit.prevent="submit">
                  <div class="list-group">
                      <div class="list-group-item bg-gray">
                          <div class="d-flex justify-content-between">
                              <div class="t-bold px-3">NO</div>
                              <div class="flex-grow-1 t-bold">Item Name</div>
                              <div class="">
                                  <input
                                      type="checkbox"
                                      @change="toggleSelector"
                                      />
                              </div>
                          </div>
                      </div>
                      <div class="list-group-item" v-for="(item,index) in checklistItems" :key="item.id">
                          <div class="d-flex justify-content-between">
                              <input type="hidden" :value="item.id" name="item_ids[]" >
                              <div class="t-bold px-4">{{index + 1}}</div>
                              <div class="flex-grow-1">{{item.name}}</div>
                              <div class="">
                                  <input
                                      type="checkbox"
                                      v-model="itemChecked"
                                      :checked="selectedItems.includes(item.name)"
                                      :value="item.id"
                                      />
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="d-flex justify-content-end my-4">
                      <button type="submit" class="btn btn-primary btn-lg">Submit</button>
                  </div>
              </form>
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
  const { $bus,$swal } = useNuxtApp();
  navStore.setPage("Housekeeping");
  navStore.setSubpage("Checklist Room");
  const config = useRuntimeConfig();
  const checkListRoom = ref(null);
  const checklistItems = ref([]);
  const itemChecked = ref([]);
  const selectedItems = ref([]);
  const date = ref('');
  const roomId = ref('');
  const router = useRouter();
  const route = useRoute();
  const { data, status } = await $fetch(`${config.public.baseUrl}housekeeping/detail-checklist-room`, {
      method: "POST",
      headers: {
          Authorization: "Bearer " + authStore.getToken,
      },
      body: {
          id: route.query.checklist_id,
      },
  });
  if (status == 1) {
    checkListRoom.value = data.data;
    checklistItems.value = data.items;
    selectedItems.value = JSON.parse(checkListRoom.value.checklist_items);
   
  }
  
  const submit = async () => {
      const user = authStore.getUser;
      $bus.$emit('loading',true)
      const { data, status,message } = await $fetch(`${config.public.baseUrl}housekeeping/create-checklist-room`, {
          method: "POST",
          headers: {
              Authorization: "Bearer " + authStore.getToken,
          },
          body: {
              tanggal: checkListRoom.value.tanggal,
              room_id: checkListRoom.value.room_id,
              item_ids: itemChecked.value,
              housekeeper_id: user.id,
          },
      });
      $bus.$emit('loading',false)
      if(status == 1){
          console.log("Redirect to checklist room")
          router.push({
                path: '/housekeeping/checklist-room'
          })
      }else{
          $swal.fire(message)
      }
  };
  
  const toggleSelector = (e) => {
      let checked = e.target.checked;
      if(checked){
          checklistItems.value.map((item)=>{
              itemChecked.value.push(item.id);
          })
      }else{
          itemChecked.value = [];
      }
      console.log(itemChecked.value);
  };
  
  
  
  </script>
  
  <style>
  
  .bg-gray{
      background-color:#f4f4f4;
  }
  </style>