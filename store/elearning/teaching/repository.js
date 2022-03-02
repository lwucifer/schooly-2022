import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Repository from "~/services/elearning/teaching/Repository";

/**
 * initial state
 */
const state = () => ({
  info: {}
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_TEACHING_REPOSITORY.INFO]({ commit }, payload) {
    try {
      const result = await new Repository(this.$axios)[
        actionTypes.REPOSITORY.INFO
      ](payload);
      commit(
        mutationTypes.ELEARNING_TEACHING_REPOSITORY
          .SET_TEACHING_REPOSITORY_INFO,
        result
      );
      return result;
    } catch (error) {
      console.log("[Info repository] info.error", error);
    }
  },

};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_TEACHING_REPOSITORY
    .SET_TEACHING_REPOSITORY_INFO](state, info) {
    state.info = info;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
