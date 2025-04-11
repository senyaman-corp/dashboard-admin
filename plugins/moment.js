import moment from 'moment';
import 'moment/locale/id';
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('moment', moment);
});