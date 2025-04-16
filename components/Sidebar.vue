<template>
  <div class="sidebar-left">
    <div data-simplebar class="h-100">
      <div id="sidebar-menu">
        <ul class="left-menu list-unstyled">
          <li class="nav-item">
           <p>&nbsp;</p>
          </li>
          <li class="nav-item" :class="{ active: page == 'Home' }">
            <NuxtLink to="/" class="nav-link"><i class="fas fa-home"></i><span>Home</span></NuxtLink>
          </li>
          <li class="nav-item" :class="{ active: page == 'Room' }" v-if="isAuthorized('Front Office')">
            <NuxtLink to="/room" class="nav-link"><i class="fas fa-hotel"></i><span>Room</span></NuxtLink>
          </li>
          <!-- 
          <li class="nav-item" v-if="isAuthorized('Front Office')">
            <a
              href="javascript:void(0);"
              class="nav-link has-arrow"
              data-bs-toggle="collapse"
              data-bs-target="#menu-rooms"
              :aria-expanded="page == 'Room'"
            >
              <i class="fas fa-hotel"></i>
              <span>Rooms</span>
            </a>
            <ul
              class="sub-menu collapse"
              :class="{ show: page == 'Room' }"
              id="menu-rooms"
            >
              <li :class="{ active: subpage == 'Index Room' }">
                <NuxtLink to="/room">Index</NuxtLink>
              </li>
              
            </ul>
          </li>
           -->
          <li class="nav-item" :class="{ active: page == 'Guests' }" v-if="isAuthorized('Front Office')">
            <NuxtLink to="/guests" class="nav-link"><i class="fas fa-user-friends"></i><span>Guests</span></NuxtLink>
          </li>
          <li class="nav-item" :class="{ active: page == 'Reservation' }" v-if="isAuthorized('Front Office')">
            <NuxtLink to="/reservation" class="nav-link"><i class="fas fa-file-alt"></i><span>Reservation</span></NuxtLink>
          </li>
          <li class="nav-item" :class="{ active: page == 'Booking' }" v-if="isAuthorized('Front Office')">
            <NuxtLink to="/booking" class="nav-link"><i class="fas fa-address-book"></i><span>Booking</span></NuxtLink>
          </li>
          <li class="nav-item" :class="{ active: page == 'PreBuy' }" v-if="isAuthorized('Front Office')">
            <NuxtLink to="/pre-buy" class="nav-link"><i class="fas fa-shopping-bag"></i><span>PreBuy</span></NuxtLink>
          </li>
          <!-- 
          <li class="nav-item" v-if="isAuthorized('Front Office')">
            <a
              href="javascript:void(0);"
              class="nav-link has-arrow"
              data-bs-toggle="collapse"
              data-bs-target="#menu-reservation"
              :aria-expanded="page == 'Reservation'"
            >
              <i class="fas fa-file-alt"></i>
              <span>Reservation</span>
            </a>
            <ul
              class="sub-menu collapse"
              :class="{ show: page == 'Reservation' }"
              id="menu-reservation"
            >
              <li :class="{ active: subpage == 'Index Reservation' }">
                <NuxtLink to="/reservation">Reservation</NuxtLink>
              </li>
            </ul>
          </li>
          
          <li class="nav-item" v-if="isAuthorized('Front Office')">
            <a
              href="javascript:void(0);"
              class="nav-link has-arrow"
              data-bs-toggle="collapse"
              data-bs-target="#menu-booking"
              :aria-expanded="page == 'Booking'"
            >
              <i class="fas fa-address-book"></i>
              <span>Booking</span>
            </a>
            <ul
              class="sub-menu collapse"
              :class="{ show: page == 'Booking' }"
              id="menu-booking"
            >
              <li :class="{ active: subpage == 'Index Booking' }">
                <NuxtLink to="/booking">Booking</NuxtLink>
              </li>
            </ul>
          </li>
          
          <li class="nav-item" v-if="isAuthorized('Front Office')">
            <a
              href="javascript:void(0);"
              class="nav-link has-arrow"
              data-bs-toggle="collapse"
              data-bs-target="#menu-prebuy"
              :aria-expanded="page == 'PreBuy'"
            >
              <i class="fas fa-address-book"></i>
              <span>Pre Buy</span>
            </a>
            <ul
              class="sub-menu collapse"
              :class="{ show: page == 'PreBuy' }"
              id="menu-prebuy"
            >
              <li :class="{ active: subpage == 'Index PreBuy' }">
                <NuxtLink to="/pre-buy">List Pre Buy</NuxtLink>
              </li>
            </ul>
          </li>
           -->
          <li class="nav-item" v-if="isAuthorized('Housekeeping')">
            <a
              href="javascript:void(0);"
              class="nav-link has-arrow"
              data-bs-toggle="collapse"
              data-bs-target="#menu-housekeeping"
              :aria-expanded="page == 'Housekeeping'"
            >
              <i class="fas fa-user-cog"></i>
              <span>House Keeping</span>
            </a>
            <ul class="sub-menu collapse" :class="{ show: page == 'Housekeeping' }" id="menu-housekeeping">
              <li :class="{ active: subpage == 'Rooms' }"><NuxtLink to="/housekeeping/rooms">Rooms</NuxtLink></li>
              <li :class="{ active: subpage == 'Checklist Room' }"><NuxtLink to="/housekeeping/checklist-room">Checklist Room</NuxtLink></li>
              <li :class="{ active: subpage == 'Index Housekeeping' }"><NuxtLink to="/housekeeping" v-if="isSupervisor" >Housekeeping</NuxtLink></li>
            </ul>
          </li>
          <li class="nav-item" v-if="isAuthorized('Admin')">
            <a
              href="javascript:void(0);"
              class="nav-link has-arrow"
              data-bs-toggle="collapse"
              data-bs-target="#menu-setting"
              :aria-expanded="page == 'Setting'"
            >
              <i class="fas fa-cog"></i>
              <span>Data</span>
            </a>
            <ul
              class="sub-menu collapse"
              :class="{ show: page == 'Setting' }"
              id="menu-setting"
            >
            <li :class="{ active: subpage == 'Index Price' }">
                <NuxtLink to="/price">Price</NuxtLink>
              </li>
              <li :class="{ active: subpage == 'Room Type' }">
                <NuxtLink to="/room/type">Room Type</NuxtLink>
              </li>
              <li :class="{ active: subpage == 'Additional Charges' }">
                <NuxtLink to="/room/additional-charges">Additional Charges</NuxtLink>
              </li>
            </ul>
          </li>
          <li class="nav-item" v-if="isAuthorized('Admin')">
            <a
              href="javascript:void(0);"
              class="nav-link has-arrow"
              data-bs-toggle="collapse"
              data-bs-target="#menu-roles"
              :aria-expanded="page == 'User_roles'"
            >
              <i class="fas fa-user-cog"></i>
              <span>User & Roles</span>
            </a>
            <ul class="sub-menu collapse" :class="{ show: page == 'User_roles' }" id="menu-roles">
              <li :class="{ active: subpage == 'Index User' }"><NuxtLink to="/user-role">Users</NuxtLink></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
const { $bus } = useNuxtApp();
import { useNavigatorStore } from "~/stores/navigator";
import { useAuthStore } from "~/stores/auth";
const authStore = useAuthStore();
const navStore = useNavigatorStore();
const page = ref("");
const subpage = ref("");
page.value = navStore.page;
subpage.value = navStore.subpage;
onMounted(() => {
  document.getElementById("sidebar-menu")?.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-enable");
  });
  $bus.$on("pagechange", (data) => {
    page.value = data.page;
    subpage.value = data.subpage;
  });
});

const isAuthorized = (page) =>{
  return authStore.isAuthorized(page);

}
const isSupervisor = authStore.isSupervisor();
</script>
