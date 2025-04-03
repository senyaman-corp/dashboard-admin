<template>
    <div>
        <CardBaseCard title="Tambah Booking">
            <FormBaseForm @submit="handleSubmit">
                <!-- Guest Information -->
                <InputBaseInput v-model="formData.name" label="Nama Lengkap" placeholder="Masukkan Nama Tamu" />
                <InputBaseInput v-model="formData.no_telp" label="Nomor Telepon" placeholder="Masukkan No Telepon" />
                <InputBaseUpload v-model="formData.ktp" label="Foto KTP" :accept="'.jpg,.jpeg,.png'" />

                <!-- Booking Dates -->
                <div class="grid grid-cols-2 gap-4">
                    <InputBaseInput 
                        type="date" 
                        v-model="formData.check_in" 
                        label="Check In" 
                        :min="today"
                        @change="updateAvailableRooms"
                    />
                    <InputBaseInput 
                        type="date" 
                        v-model="formData.check_out" 
                        label="Check Out" 
                        :min="formData.check_in"
                        @change="updateAvailableRooms"
                    />
                </div>

                <!-- Room Selection -->
                <div class="space-y-4">
                    <div v-for="(roomSelection, index) in formData.selectedRooms" :key="index" class="border p-4 rounded-lg">
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="font-medium">Room {{ index + 1 }}</h3>
                            <ButtonBaseButton 
                                v-if="index > 0" 
                                @click="removeRoom(index)" 
                                variant="danger"
                                type="button"
                            >
                                Remove Room
                            </ButtonBaseButton>
                        </div>
                        <InputWithCombobox 
                            v-model="formData.room_id" 
                            label="Select Room" 
                            placeholder="Select Room" 
                            :options="roomOptions" 
                            multiple
                        />
                        <!-- <InputWithCombobox
                            v-model="roomSelection.room_id"
                            :options="availableRooms"
                            label="Select Room"
                            :id="'room-' + index"
                            :option-label="room => `${room.room_number} - ${room.name} (${formatPrice(room.default_price)})`"
                            :option-value="room => room.id"
                        /> -->
                    </div>
                </div>

                <div class="flex justify-between items-center mt-4">
                    <ButtonBaseButton 
                        @click="addRoom" 
                        variant="secondary"
                        type="button"
                    >
                        Add Another Room
                    </ButtonBaseButton>

                    <div class="text-right">
                        <div class="text-lg font-bold">Total: {{ formatPrice(calculateTotal) }}</div>
                        <div class="text-sm text-gray-600">{{ getTotalNights }} night(s)</div>
                    </div>
                </div>

                <ButtonBaseButton type="submit" variant="primary" class="mt-4">Submit Booking</ButtonBaseButton>
            </FormBaseForm>
        </CardBaseCard>
    </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
const config = useRuntimeConfig();
const authStore = useAuthStore();

const formData = ref({
    name: '',
    no_telp: '',
    ktp: null,
    check_in: '',
    check_out: '',
    selectedRooms: [{ room_id: null }]
});

const roomOptions = ref([]);

const fetchRooms = async () => {
  try {
    const response = await $fetch(`${config.public.baseUrl}rooms/list`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + authStore.getToken,
      },
    });
    console.log("API Response:", response);
    if (response.status === 1 && Array.isArray(response.data)) {
      roomOptions.value = response.data.map((room) => ({
        label: `${room.room_number} - ${room.name} - ${room.type}`,
        value: String(room.id),
      }));
    } else {
      console.error("Error fetching rooms:", response);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
};

const availableRooms = ref([]);
const today = ref(new Date().toISOString().split('T')[0]);

// Computed property for total nights
const getTotalNights = computed(() => {
    if (!formData.value.check_in || !formData.value.check_out) return 0;
    const checkIn = new Date(formData.value.check_in);
    const checkOut = new Date(formData.value.check_out);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
});

// Computed property for total price
const calculateTotal = computed(() => {
    let total = 0;
    formData.value.selectedRooms.forEach(selection => {
        const room = availableRooms.value.find(r => r.id === selection.room_id);
        if (room) {
            total += room.default_price * getTotalNights.value;
        }
    });
    return total;
});

// Format price with currency
const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(price);
};

// Add another room selection
const addRoom = () => {
    console.log('Adding room');
    formData.value.selectedRooms.push({ room_id: null });
};

// Remove a room selection
const removeRoom = (index) => {
    formData.value.selectedRooms.splice(index, 1);
};

// Update available rooms based on date selection
const updateAvailableRooms = async () => {
    if (!formData.value.check_in || !formData.value.check_out) return;

    try {
        const { data, status, statusCode } = await $fetch(`${config.public.baseUrl}rooms/list`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authStore.getToken
            },
            body: {
                check_in: formData.value.check_in,
                check_out: formData.value.check_out
            }
        });

        if (status === 1) {
            availableRooms.value = data;
        } else if (statusCode === 403) {
            // Handle unauthorized access
        }
    } catch (error) {
        console.error('Error fetching available rooms:', error);
    }
};

// Handle form submission
const handleSubmit = async () => {
    try {
        const bookingData = {
            ...formData.value,
            total_price: calculateTotal.value,
            total_nights: getTotalNights.value
        };

        const response = await $fetch(`${config.public.baseUrl}bookings/create`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authStore.getToken
            },
            body: bookingData
        });

        // Handle successful booking
        console.log('Booking created:', response);
    } catch (error) {
        console.error('Error creating booking:', error);
    }
};

onMounted(() => {
    updateAvailableRooms();
    fetchRooms();
});

definePageMeta({
    middleware: ["auth"]
});
</script>

<style scoped>
.room-selection {
    border: 1px solid #e2e8f0;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
}
</style>