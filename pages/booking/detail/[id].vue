<template>
    <div class="card">
        <div class="card-body">
            <div class="row" v-if="booking != null">
                <div class="col-md-12">
                    <h4 class="mb-2">Detail Booking</h4>
                    <div class="row">
                        <div class="col-md-7">
                            <div class="row">
                                <div class="col-md-8">
                                    <div class="mb-3 t-bold text-18">Guest</div>
                                    <div class="form-group row">
                                        <label class="form-label col-lg-3 t-bold">Nama</label>
                                        <div class="col-lg-9">{{booking?.booking?.guest?.name}}</div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="form-label col-lg-3 t-bold">No Telp</label>
                                        <div class="col-lg-9">{{booking?.booking?.guest?.no_telp}}</div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="form-label col-lg-3 t-bold">Email</label>
                                        <div class="col-lg-9">{{booking?.booking?.guest?.email}}</div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="form-label col-lg-3 t-bold">Alamat</label>
                                        <div class="col-lg-9">{{booking?.booking?.guest?.alamat}}</div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="form-label col-lg-3 t-bold">Gender</label>
                                        <div class="col-lg-9">{{booking?.booking?.guest?.gender}}</div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="form-label col-lg-3 t-bold">Umur</label>
                                        <div class="col-lg-9">{{booking?.booking?.guest?.umur}}</div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3 t-bold text-18">&nbsp;</div>
                                    <div class="form-group">
                                        <label class="t-bold">KTP</label>
                                        <div>
                                            <img v-if="booking?.booking?.guest?.ktp" :src="config.public.storageUrl +booking?.booking?.guest?.ktp" alt="" class="img-fluid">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="mb-3 t-bold text-18">Room</div>
                            <div class="form-group row">
                                <label class="form-label col-lg-3 t-bold">Room Name</label>
                                <div class="col-lg-9">{{booking?.room?.name}}</div>
                            </div>
                            <div class="form-group row">
                                <label class="form-label col-lg-3 t-bold">Room Number</label>
                                <div class="col-lg-9">{{booking?.room?.room_number}}</div>
                            </div>
                            <div class="form-group row">
                                <label class="form-label col-lg-3 t-bold">View</label>
                                <div class="col-lg-9">{{booking?.room?.view}}</div>
                            </div>
                            <div class="form-group row">
                                <label class="form-label col-lg-3 t-bold">Type</label>
                                <div class="col-lg-9">{{booking?.room?.type}}</div>
                            </div>
                            <div class="form-group row">
                                <label class="form-label col-lg-3 t-bold">Lantai</label>
                                <div class="col-lg-9">{{booking?.room?.floor_number}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="t-bold text-18">Booking</div>
                    <div class="table-responsive">
                        <client-only>
                            <DataTable :options="options" :columns="columns" :data="[booking]" class="table table-bordered table-hover" />
                        </client-only>
                    </div>
                    <div class="mt-3 t-bold text-18">Additional Charges</div>
                    <div class="table-responsive">
                        <client-only>
                            <DataTable :options="optionCharges" :columns="columnCharges" :data="booking?.additional_charges" class="table table-bordered table-hover" />
                        </client-only>
                    </div>
                    <div class="my-3">&nbsp;</div>
                    <div class="row justify-content-end">
                        <div class="col-md-1">
                            <h6>Room Rental</h6>
                        </div>
                        <div class="col-md-1 text-end">
                        <h6>{{ new Intl.NumberFormat('ID',{
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            }).format(calculateRoomRental) }}</h6>
                        </div>
                    </div>
                    <div class="row justify-content-end">
                        <div class="col-md-1">
                            <h6>Additional Charges</h6>
                        </div>
                        <div class="col-md-1 text-end">
                            <h6>{{ new Intl.NumberFormat('ID',{
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            }).format(calculateAdditionalCharges) }}</h6>
                        </div>
                    </div>
                    <div class="row justify-content-end">
                        <div class="col-md-1">
                            <h6>TAX</h6>
                        </div>
                        <div class="col-md-1 text-end">
                            <h6>{{ new Intl.NumberFormat('ID',{
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            }).format(booking?.booking?.taxamount) }}</h6>
                        </div>
                    </div>
                    <div class="row justify-content-end">
                        <div class="col-md-1">
                            <h6>Total</h6>
                        </div>
                        <div class="col-md-1 text-end">
                            <h6>{{ new Intl.NumberFormat('ID',{
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            }).format(parseInt(calculateRoomRental) + parseInt(calculateAdditionalCharges) + parseInt(booking?.booking?.taxamount)) }}</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="min-vh-65">
                <div class="d-flex justify-content-center align-items-center min-vh-80">
                    <div class="text-center">
                        <h1 class="display-1 fw-bold">404</h1>
                        <p class="fs-3"> <span class="text-danger">Opps!</span> Page not found.</p>
                        <p class="lead"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {
        useAuthStore
    } from "~/stores/auth";
    import {
        useNavigatorStore
    } from "~/stores/navigator";
    const navStore = useNavigatorStore();
    const authStore = useAuthStore();
    const {
        $bus,
        $swal,
        $isAuthorized,
        $moment
    } = useNuxtApp();
    navStore.setPage("Booking");
    navStore.setSubpage("Detail Booking");
    const config = useRuntimeConfig();
    const booking = ref(null);
    const route = useRoute();
    const {
        data,
        status
    } = await $fetch(config.public.baseUrl + 'bookings/detail/' + route.params.id, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + authStore.getToken
        }
    }).catch((error) => {
        $swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Internal Server Error",
        })
        console.log(error);
    });
    console.log(data);
    if (status == 1) {
        booking.value = data;
    } else {
        $swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.message,
        })
    }

    const options = {
        responsive: true,
        ordering: false,
        bPaginate: false,
        bLengthChange: false,
        bFilter: false,
        bInfo: false,
        bAutoWidth: true,
        columnDefs: [{
            targets: [0, 1],
            className: 'text-start'
        }]
    }
    const columns = [{
            title: 'Checkin',
            data: 'checkin_date'
        },
        {
            title: 'Checkout',
            data: 'checkout_date'
        },
        {
            title: 'Package',
            data: 'booking_package'
        },
        {
            title: 'Booking Type',
            data: 'booking_type'
        },
        {
            title: 'Dewasa',
            data: 'noofadult'
        },
        {
            title: 'Anak-anak',
            data: 'noofchildren'
        },
        {
            title: 'Status',
            data: 'status'
        },


    ]

    const optionCharges = {
        responsive: true,
        ordering: false,
        bPaginate: false,
        bLengthChange: false,
        bFilter: false,
        bInfo: false,
        bAutoWidth: true,
        columnDefs: [{
                targets: [0, 1],
                className: 'text-start'
            },
            {
                targets: [3, 4, 5],
                render: (data, type) => {
                    if (type == 'sort') {
                        return data;
                    }
                    return new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                    }).format(data);
                },
                className: 'text-end'
            }
        ]
    }
    const columnCharges = [{
            title: 'Tanggal',
            data: 'tanggal'
        },
        {
            title: 'Name',
            data: 'name'
        },
        {
            title: 'QTY',
            data: 'quantity'
        },
        {
            title: 'Price',
            data: 'base_price'
        },
        {
            title: 'Tax',
            data: 'tax'
        },
        {
            title: 'Total',
            data: 'total_amount'
        },

    ]

    const calculateRoomRental = computed(() => {
        let total = 0;
        booking.value.booking_room_price.forEach(element => {
            total += parseInt(element.price) - parseInt(element.discount);
        });
        return total;
    })
    const calculateAdditionalCharges = computed(() => {
        let total = 0;
        booking.value.additional_charges.forEach(element => {
            total += parseInt(element.base_price) - parseInt(element.discount);
        });
        return total;
    })
</script>

<style>

</style>