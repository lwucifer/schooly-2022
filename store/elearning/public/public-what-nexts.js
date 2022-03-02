import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import WhatNexts from "~/services/elearning/public/WhatNexts";

/**
 * initial state
 */
const state = () => ({
  whatNexts: {},
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_PUBLIC_WHAT_NEXTS.LIST]({ commit }, params) {
    try {
      const result = await new WhatNexts(this.$axios)[actionTypes.BASE.LIST](
        params
      );

      commit(
        mutationTypes.ELEARNING_PUBLIC_WHAT_NEXTS.SET_WHAT_NEXTS,
        result.data
      );

      return result;
    } catch (error) {
      return error;
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_PUBLIC_WHAT_NEXTS.SET_WHAT_NEXTS](state, whatNexts) {
    state.whatNexts = whatNexts;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
