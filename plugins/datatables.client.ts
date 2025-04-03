import { defineNuxtPlugin } from "#app";
import DataTables from "datatables.net-vue3";
import DataTablesBs5 from "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

export default defineNuxtPlugin((nuxtApp) => {
  DataTables.use(DataTablesBs5);
  nuxtApp.vueApp.component("DataTable", DataTables);
});
