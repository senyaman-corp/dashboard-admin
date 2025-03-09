import { defineNuxtPlugin } from "#app";
import { defineAsyncComponent } from "vue";
import "vue3-easy-data-table/dist/style.css";

export default defineNuxtPlugin((nuxtApp) => {
  const EasyDataTable = defineAsyncComponent(() => import("vue3-easy-data-table"));
  nuxtApp.vueApp.component("EasyDataTable", EasyDataTable);
});