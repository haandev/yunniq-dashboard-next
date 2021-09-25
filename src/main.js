import "core-js/stable";
import Vue from "vue";
import App from "./App";
import router from "./router";
import CoreuiVue from "@coreui/vue";
import { iconsSet as icons } from "./assets/icons/icons.js";
import store from "./store";
import axios from "axios";
import "@babel/polyfill";
import VueMoment from "vue-moment";
import { BASE_URL } from "./const";

Vue.config.performance = true;
Vue.use(CoreuiVue);
Vue.use(VueMoment);
Vue.prototype.$log = console.log.bind(console);

store.commit("localStorageToState");

new Vue({
  el: "#app",
  router,
  store,
  icons,
  template: "<App/>",
  components: {
    App
  }
});
import axiosInstance from "./axiosInstance";
Vue.prototype.$axios = axiosInstance;
