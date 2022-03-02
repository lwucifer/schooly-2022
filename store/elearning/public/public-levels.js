import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Level from "~/services/elearning/public/Level";

/**
 * initial state
 */
const state = () => ({
  levels: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING.LEVEL]({ commit }, options) {
    try {
      const result = await new Level(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      commit(mutationTypes.ELEARNING.SET_ELEARNING_PUBLIC_LEVEL, result.data);
    } catch (error) {
      console.log("[Elearning Subject] list.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING.SET_ELEARNING_PUBLIC_LEVEL](state, levels) {
    state.levels = levels;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
