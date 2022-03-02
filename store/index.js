import auth from './auth.js'
import { getTokenFromCookie } from '~/utils/auth.js';

const state = () => ({
  authUser: null,
  desktopView: false
});

const actions = {
  async nuxtServerInit({ commit }, { req } ) {
    // console.log("[nuxtServerInit] context", req.headers.cookie);
    const userCookies = getTokenFromCookie(req);
    // console.log("[userCookies]", userCookies);
    if(userCookies) {
      commit("auth/setToken", userCookies);
      commit("auth/setAccessToken", userCookies.access_token);
    }
  },

  onAuthStateChanged({ commit }) {
    console.log("[onAuthStateChanged]")
  }


};

const getters = {};

const mutations = {
  // setUser(state, user) {
  //   state.authUser = user;
  // },
  setDesktopView(state, desktopView) {
    state.desktopView = desktopView
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
