import Vue from "vue";
import Vuex from "vuex";
import jwt from "jsonwebtoken";
import { TOKEN_KEY } from "./const";
Vue.use(Vuex);
import axiosInstance from "./axiosInstance";

const state = {
  sidebarShow: true,
  sidebarMinimize: false,
  token: null,
  user: null
};
const actions = {
  login(context, payload) {
    return new Promise((res, rej) => {
      axiosInstance
        .post("/auth/login", payload)
        .then(({ data }) => {
          context.commit("setToken", data.token);
          context.commit("setUser", data);
          res();
        })
        .catch(err => {
          rej(err);
        });
    });
  },
  logout(context) {
    context.commit("logout");
  }
};

const getters = {
  isLoggedIn(state) {
    return !!state.token;
  }
};
const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setToken(state, token) {
    state.token = token;
    axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
    localStorage.setItem("token", token);
  },
  logout(state) {
    state.token = null;
    state.user = null;
    axiosInstance.defaults.headers.common["Authorization"] = null;
    localStorage.clear();
  },
  toggleSidebarDesktop(state) {
    const sidebarOpened = [true, "responsive"].includes(state.sidebarShow);
    state.sidebarShow = sidebarOpened ? false : "responsive";
  },
  toggleSidebarMobile(state) {
    const sidebarClosed = [false, "responsive"].includes(state.sidebarShow);
    state.sidebarShow = sidebarClosed ? true : "responsive";
  },
  set(state, [variable, value]) {
    state[variable] = value;
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
