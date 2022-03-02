
import * as APIs from "~/utils/endpoints";
import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";

const state = () => ({
  searchSocialUserList: [],
  searchSocialPostList: []
});


const getters = {};

const actions = {
  async [actionTypes.SOCIAL_SEARCH.SEARCH_USER_SOCIAL_LIST]({ commit }, params) {
    try {
      return this.$axios
        .get(APIs.SOCIAL_USERS, { params })
        .then((res) => res.data)
        .then((result) => {
          console.log("SEARCH_USER_SOCIAL_LIST", result);
          commit(mutationTypes.SOCIAL_POST.SET_SEARCH_USER, result.data);
          return result;
        });
    } catch (err) {
      console.log("[SEARCH_USER_SOCIAL_LIST] err", err);
      return err;
    }
  },

  async [actionTypes.SOCIAL_SEARCH.SEARCH_POST_SOCIAL_LIST]({ commit }, params) {
    try {
      return this.$axios
        .get(APIs.POSTS, { params })
        .then((res) => res.data)
        .then((result) => {
          console.log("SEARCH_POST_SOCIAL_LIST", result);
          commit(mutationTypes.SOCIAL_POST.SET_POST, result.data);
          return result;
        });
    } catch (err) {
      console.log("[SEARCH_POST_SOCIAL_LIST] err", err);
      return err;
    }
  },
};

const mutations = {
  [mutationTypes.SOCIAL_POST.SET_SEARCH_USER](state, _data) {
    state.searchSocialUserList = _data;
  },
  [mutationTypes.SOCIAL_POST.SET_POST](state, _data) {
    state.searchSocialPostList = _data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
