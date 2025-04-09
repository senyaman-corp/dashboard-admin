<template>
  <div class="sidebar-left">
    <div data-simplebar class="h-100">
      <div id="sidebar-menu">
        <ul class="left-menu list-unstyled" v-if="isAuthorized('front_office')">
          <li class="nav-item">
            <a
              href="javascript:void(0);"
              class="nav-link has-arrow active"
              data-bs-toggle="collapse"
              data-bs-target="#menu-rooms"
              :aria-expanded="page == 'Room'"
            >
              <i class="fas fa-house-user"></i>
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
          <li class="nav-item" :class="{ active: page == 'Guests' }">
            <NuxtLink to="/guests"><i class="fas fa-user-friends"></i> Guests</NuxtLink>
          </li>
          <li class="nav-item">
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
          <li class="nav-item">
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
          <li class="nav-item">
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
          <li class="nav-item">
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
              <li :class="{ active: subpage == 'Index Housekeeping' }"><NuxtLink to="/housekeeping">Housekeeping</NuxtLink></li>
            </ul>
          </li>
          <li class="nav-item">
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
  const authStore = useAuthStore();
  return authStore.isAuthorized(page);

}
</script>
