import AutoNumeric from 'autonumeric';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('autoNumeric', AutoNumeric);
});
