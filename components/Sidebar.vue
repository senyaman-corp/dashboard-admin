<template>
    <div class="sidebar-left">
        <div data-simplebar class="h-100">
            <div id="sidebar-menu">
                <ul class="left-menu list-unstyled">
                    <li class="nav-item">
                        <a href="javascript:void(0);" class="nav-link has-arrow active" data-bs-toggle="collapse" data-bs-target="#menu-rooms" :aria-expanded="page == 'Room'">
                            <i class="fas fa-house-user"></i>
                            <span>Rooms</span>
                        </a>
                        <ul class="sub-menu collapse" :class="{show:page=='Room'}" id="menu-rooms">
                            <li :class="{ active:subpage == 'Index Room'}"><NuxtLink to="/room">Index</NuxtLink></li>
                            <li :class="{ active:subpage == 'Index Property'}"><NuxtLink to="/property">Property</NuxtLink></li>
                            <li :class="{ active:subpage == 'Index Price'}"><NuxtLink to="/price">Price</NuxtLink></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="javascript:void(0);" class="nav-link has-arrow" data-bs-toggle="collapse" data-bs-target="#menu-customer" aria-expanded="false">
                            <i class="fas fa-user-friends"></i>
                            <span>Customer</span>
                        </a>
                        <ul class="sub-menu collapse" id="menu-customer">
                            <li><NuxtLink to="/guests">Guests</NuxtLink></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="javascript:void(0);" class="nav-link has-arrow" data-bs-toggle="collapse" data-bs-target="#menu-reservation" :aria-expanded="page == 'Reservation'">
                            <i class="fas fa-file-alt"></i>
                            <span>Reservation</span>
                        </a>
                        <ul class="sub-menu collapse" :class="{show:page=='Reservation'}" id="menu-reservation">
                            <li :class="{ active:subpage == 'Index Reservation'}"><NuxtLink to="/reservation">Reservation</NuxtLink></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="javascript:void(0);" class="nav-link has-arrow" data-bs-toggle="collapse" data-bs-target="#menu-booking" :aria-expanded="page == 'Booking'">
                            <i class="fas fa-address-book"></i>
                            <span>Booking</span>
                        </a>
                        <ul class="sub-menu collapse" :class="{show:page=='Booking'}" id="menu-booking">
                            <li :class="{ active:subpage == 'Index Booking'}"><NuxtLink to="/booking">Booking</NuxtLink></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="javascript:void(0);" class="nav-link has-arrow" data-bs-toggle="collapse" data-bs-target="#menu-roles" aria-expanded="false">
                            <i class="fas fa-user-cog"></i>
                            <span>User Roles</span>
                        </a>
                        <ul class="sub-menu collapse" id="menu-roles">
                            <li><NuxtLink to="/user-role">User Role</NuxtLink></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script setup>
//import { onMounted } from "vue";
const { $bus} = useNuxtApp();
const page = ref('');
const subpage = ref('')
    onMounted(() => {
        document.getElementById("sidebar-menu")?.addEventListener("click", () => {
            document.body.classList.toggle("sidebar-enable");
        });
        $bus.$on('pagechange', (data) => {
            console.log("Page Change" ,data);
            page.value = data.page;
            subpage.value = data.subpage;
        })
    });
</script>
