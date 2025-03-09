import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  if (process.client) {
    import("~/assets/libs/simplebar/simplebar.min.js").then(() => {

      document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll("[data-simplebar]").forEach((el) => {
          new (window as any).SimpleBar(el);
        });
      });
    });
  }
});