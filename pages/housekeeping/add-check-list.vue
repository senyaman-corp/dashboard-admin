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
                            :min-date="new Date()"
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
                                    :value="item.id"
                                    :checked="itemChecked.includes(item.id)"
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
const date = ref(new Date());
const roomId = ref('');
const router = useRouter();
const route = useRoute();
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
        id: room.room?.id,
        label: `${room.room?.room_number} - ${room.room?.name}`,
        value: room.room?.id,
        type: room.room?.type,
        view: room.room?.view,
        name: room.room?.name,
        selected:false
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
        navigateTo('/housekeeping/checklist-room')
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
    //itemChecked.value = !itemChecked.value;
};

watch(itemChecked,(newValue)=>{
    console.log(newValue)
})

onMounted(() => {
    $bus.$emit("pagechange", { page: "Housekeeping", subpage: "Checklist Room" });
    const id = route.query.id;
    roomOptions.value.map((room)=>{
        if(room.id == id){
            room.selected = true;
            roomId.value = room.id;
        }
    })
});

definePageMeta({
    middleware: ["auth"],
});

</script>

<style>

.bg-gray{
    background-color:#f4f4f4;
}
</style>