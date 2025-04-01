<template>
  <div>
    <client-only>
      <EasyDataTable
        id="data-table"
        :headers="headers"
        :items="items"
        alternating
        table-class="table table-hover table-bordered table-striped"
        v-model:server-options="serverOptions"
      />
    </client-only>
  </div>
</template>

<script setup>
const props = defineProps({
    headers: {
        type: Array,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
});
const {$bus} = useNuxtApp();
const serverOptions = ref({
    page: 1,
    perPage: 10,
    sortBy: "id",
    sortDesc: false,
    search: "",
});
watch(
      serverOptions,
      (value) => {
        $bus.$emit("paginate", serverOptions.value);
      },
      { deep: true }
    );

    
</script>