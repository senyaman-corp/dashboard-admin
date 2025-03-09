export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  css: [
    '~/assets/css/bootstrap.min.css',
    '~/assets/libs/simplebar/simplebar.min.css',
    '~/assets/css/app.min.css',
  ],

  plugins: [
    '~/plugins/app.client.ts',
    '~/plugins/metisMenu.client.ts',
    '~/plugins/simplebar.client.ts',
    '~/plugins/easy-datatables.client.ts',
  ],

  modules: ['@pinia/nuxt'],
})