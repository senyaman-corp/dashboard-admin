export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app:{
    head: {
      htmlAttrs: {
        lang: "id",
        translate: "no",
        "data-id": "Senyaman"
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1 shrink-to-fit=no" },
        { "http-equiv": "X-UA-Compatible", content: "ie=edge" },
        { name: "theme-color", content: "#38c66c"},
        { name: "msapplication-TileColor", content: "#38c66c" },
        { name: "description", content: "'Senyaman Corporation'" },
       // { hid: "description", name: "description", content: "" },
        { name: "format-detection", content: "telephone=no" }
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.png" },
        { rel: 'mask-icon', href:"/safari-pinned-tab.svg", color:"#0ed3cf"},
        { rel: "sitemap", type: "application/xml", title: "Sitemap", href: "/sitemap.xml"},
      ],
    }
  },
  css: [
    '~/assets/css/bootstrap.min.css',
    '~/assets/libs/simplebar/simplebar.min.css',
    '~/assets/css/app.min.css',
    '~/assets/css/override.css',
    'sweetalert2/dist/sweetalert2.min.css'
  ],

  plugins: [
    '~/plugins/app.client.ts',
    '~/plugins/metisMenu.client.ts',
    '~/plugins/simplebar.client.ts',
    '~/plugins/datatables.client.ts',
    '~/plugins/vue-multiselect.ts',
    '~/plugins/autonumeric.ts',
    '~/plugins/loading.client.ts',
  ],

  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/image',
  ],
  runtimeConfig:{
    public:{
      baseUrl:process.env.BASE_URL + "api/v1/",
      storageUrl:process.env.BASE_URL + "storage/",
      baseAppUrl:process.env.BASE_APP_URL,
      dashboardUrl:process.env.BASE_URL,
    }
  },
})