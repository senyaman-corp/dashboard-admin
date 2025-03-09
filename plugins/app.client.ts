import { defineNuxtPlugin } from "#app";
import { useAsyncData } from "#imports";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default defineNuxtPlugin(() => {
  useAsyncData(async () => {
    // Navbar Scroll Shadow
    document.addEventListener("scroll", () => {
      const topbar = document.getElementById("page-topbar");
      if (topbar) {
        if (document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50) {
          topbar.classList.add("topbar-shadow");
        } else {
          topbar.classList.remove("topbar-shadow");
        }
      }
    });

    // Sidebar Toggle
    const sidebarBtn = document.getElementById("sidebar-btn");
    sidebarBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.toggle("sidebar-enable");
      if (window.innerWidth >= 992) {
        document.body.classList.toggle("sidebar-collpsed");
      } else {
        document.body.classList.remove("sidebar-collpsed");
      }
    });

    // Hide Sidebar When Clicking Outside
    document.body.addEventListener("click", (event) => {
      const target = event.target as Element;
      if (!target.closest(".vertical-menu") && !target.closest("#sidebar-btn")) {
        document.body.classList.remove("sidebar-enable");
      }
    });

    // Bootstrap Tooltips & Popovers
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((tooltipTrigger) => {
      new (window as any).bootstrap.Tooltip(tooltipTrigger);
    });

    document.querySelectorAll('[data-bs-toggle="popover"]').forEach((popoverTrigger) => {
      new (window as any).bootstrap.Popover(popoverTrigger);
    });

    // Hide Preloader
    setTimeout(() => {
      document.getElementById("preloader")?.classList.add("hidden");
    }, 350);
  });
});
