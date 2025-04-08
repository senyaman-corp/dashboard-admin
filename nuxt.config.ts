export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

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