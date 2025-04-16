<template>
  <div class="card">
    <div class="card-body">
        <div class="row">
            <div class="col-md-5 mb-3">
                <div class="px-3 py-5">
                    <apexchart
                        width="100%"
                        height="400"
                        type="bar"
                        :options="chartTypeOptions"
                        :series="typeSeries"
                    ></apexchart>
                </div>
            </div>
            <div class="col-md-7 mb-3">
                <div class="px-3 py-5">
                    <apexchart
                        width="100%"
                        height="400"
                        type="line"
                        :options="monthOptions"
                        :series="monthSeries"
                    ></apexchart>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4 mb-3"></div>
            <div class="col-md-4 mb-3"></div>
            <div class="col-md-4 mb-3"></div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
const authStore = useAuthStore();
const config = useRuntimeConfig();
const chartTypeOptions = ref({});
const typeSeries = ref({});
const monthOptions = ref({});
const monthSeries = ref({});
const selectedYear = ref(new Date().getFullYear());

const { data, status, statusCode } = await $fetch(
    `${config.public.baseUrl}dashboard/data`,
    {
      method: "POST",
      lazy: true,
      headers: {
        Authorization: "Bearer " + authStore.getToken,
      },
      body: {
        
      },
    }
);
if(status == 1){
    chartTypeOptions.value = {
        title: {
            text: `Data Room Type Booking ${selectedYear.value}`,
            align: 'center',
            floating: true
        },
        xaxis: { categories : data.by_type.labels}
    }
    typeSeries.value = data.by_type.datasets;
    monthOptions.value = {
        title: {
            text: `Data Room Booking ${selectedYear.value}`,
            align: 'center',
            floating: true
        },
        xaxis: { categories : data.by_month.labels}
    }
    monthSeries.value = data.by_month.datasets;
    console.log("Month",data.by_month.datasets);
}


</script>
<style>

</style>