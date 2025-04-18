<template>
  <CardBaseCard title="Detail Booking">
    <div class="row g-4">
      <!-- Hotel Images -->
      <div class="col-lg-8">
        <div class="mb-3">
          <img src="/assets/images/room/bedroom.jpg" class="img-fluid rounded-4" alt="Hotel Image" />
        </div>
        <div class="d-flex gap-2 overflow-auto">
          <img v-for="i in 8" :key="i" :src="`/assets/images/room/room2.jpg`" class="img-thumbnail rounded-3" style="width: 100px; height: 75px;" />
      
        </div>
      </div>

      <!-- Booking Card -->
      <div class="col-lg-4">
        <div class="card shadow-sm rounded-4">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div>
                <span class="fs-4 fw-semibold">Rp. {{$formatAngka(booking.booking.total_price)}}</span><span class="text-muted"></span>
              </div>
            </div>

            <div class="my-3">
                <h6>Check-In</h6>
                <div>
                    <label>{{ $formatDateTime(booking.checkin_date, 'DD MMM YYYY, HH:mm') }}</label>
                </div>

                <h6 class="mt-2">Check-Out</h6>
                <div>
                    <label>{{ $formatDateTime(booking.checkout_date, 'DD MMM YYYY, HH:mm') }}</label>
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Guests</label>
                <div>
                    {{ booking.noofadult }} Adult(s), {{ booking.noofchildren }} Children
                </div>
            </div>


            <div class="mb-3">
              <h6>Extra Features</h6>
              <div class="form-check" v-for="(feature, index) in extraFeatures" :key="index">
                <input class="form-check-input" type="checkbox" :id="feature.name" />
                <label class="form-check-label" :for="feature.name">
                  {{ feature.name }} <span class="text-muted">(${{ feature.price }})</span>
                </label>
              </div>
            </div>

            <div class="mb-3">
                <h6>Price</h6>
                <ul class="list-unstyled">
                    <li v-for="(price, index) in booking.booking_room_price" :key="'price'+index">
                    {{ $formatDateTime(price.tanggal, 'DD MMM') }}: Rp {{$formatAngka(price.price)}}
                    </li>
                    <li v-for="(add, index) in booking.additional_charges" :key="'charge'+index">
                    {{ add.name }}: Rp {{$formatAngka(add.total_amount)}}
                    </li>
                    <li>Discount: -Rp {{$formatAngka(booking.booking.discount)}}</li>
                </ul>
                <hr />
                <h5>Total: Rp {{$formatAngka(booking.booking.total_price)}}</h5>
            </div>

            <button class="btn btn-primary w-100">Extend Room</button>
            <small class="text-muted d-block text-center mt-2">You will not get charged yet.</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Hotel Description -->
    <div class="row mt-3">
      <div class="col">
        <h3>{{ booking.room.name }} - {{ booking.room.type }}</h3>
        <p class="text-muted">Floor {{ booking.room.floor_number }} | View: {{ booking.room.view }}</p>
        <p>
        Room size: {{ booking.room.size }} m²
        </p>

        <div class="d-flex gap-4 mt-3">
          <span><i class="bi bi-wifi"></i> Wi-Fi</span>
          <span><i class="bi bi-house"></i> Kings Bed</span>
          <span><i class="bi bi-bathtub"></i> Bathtub</span>
          <span><i class="bi bi-cup-straw"></i> Breakfast</span>
        </div>
      </div>
    </div>
  </CardBaseCard>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
import { useNavigatorStore } from "~/stores/navigator";
const navStore = useNavigatorStore();
const authStore = useAuthStore();
const config = useRuntimeConfig();
const { $bus ,$formatDateTime,$formatAngka} = useNuxtApp();
navStore.setPage("Booking");
navStore.setSubpage("Index Booking");
const route = useRoute();
const booking = ref();

const extraFeatures = [
  { name: 'Allow to bring pet', price: 13 },
  { name: 'Breakfast a day per person', price: 10 },
  { name: 'Parking a day', price: 6 },
  { name: 'Extra pillow', price: 0 },
]

const { data, status} = await $fetch(config.public.baseUrl + 'bookings/detail/7',{
    method: "POST",
    headers: {
        Authorization: "Bearer " + authStore.getToken,
    },
    // body:{
    //     id:route.params.id
    // }
})
if(status == 1){
  booking.value = data;
  console.log('data', booking.value);
}

</script>

<style scoped>
img {
  object-fit: cover;
}
</style>