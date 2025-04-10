<template>
  <div>
    <div class="card">
        <div class="card-body">
            <form @submit.prevent="submit">
                <div class="row justify-content-between align-items-center">
                    <h3 class="col-md-3 flex-grow-1">Tambah Room Checklist</h3>
                    <div class="col-md-2">
                        <VueDatePicker
                            v-model="date"
                            auto-apply
                            :format="'yyyy-MM-dd'"
                            class="mb-3"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <InputWithCombobox
                            v-model="roomId"
                            label="Select Room"
                            placeholder="Select Room"
                            :options="roomOptions"
                            :searchable="true"
                            :multiple="false"
                        />
                    </div>    
                </div>
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
const roomOptions = ref([]);
const checklistItems = ref([]);
const itemChecked = ref([]);
const date = ref('');
const roomId = ref('');
const router = useRouter();
const { data, status } = await $fetch(`${config.public.baseUrl}housekeeping/dirty-room`, {
    method: "POST",
    headers: {
        Authorization: "Bearer " + authStore.getToken,
    },
    body: {
        date: null,
    },
});
if (status == 1) {
    roomOptions.value = data.rooms.map((room) => ({
        label: `${room.room_number} - ${room.name}`,
        value: room.id,
        type: room.type,
        view: room.view,
        name: room.name,
    }));
    checklistItems.value = data.items
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
            tanggal: date.value,
            room_id: roomId.value,
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
    console.log(e.target.checked);
    let checked = e.target.checked;
    if(checked){
        checklistItems.value.map((item)=>{
            itemChecked.value.push(item.value);
        })
    }else{
        itemChecked.value = [];
    }
    //itemChecked.value = !itemChecked.value;
};



</script>

<style>

.bg-gray{
    background-color:#f4f4f4;
}
</style>