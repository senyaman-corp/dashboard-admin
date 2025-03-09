import { defineNuxtPlugin } from "#app";
import MetisMenu from "metismenujs";

export default defineNuxtPlugin(() => {
  if (process.client) {
    const initializeMetisMenu = () => {
      const sidebarMenu = document.getElementById("sidebar-menu");

      if (sidebarMenu) {
        sidebarMenu.innerHTML = sidebarMenu.innerHTML;

        new MetisMenu(sidebarMenu);
      }
    };

    document.addEventListener("DOMContentLoaded", initializeMetisMenu);

    window.addEventListener("load", initializeMetisMenu);
    document.addEventListener("turbo:load", initializeMetisMenu);
  }
});