import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Standalone from "~/services/elearning/school/Standalone";

/**
 * initial state
 */
const state = () => ({
  standaloneSchools: {},
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_SCHOOL_STANDALONE.LIST]({ commit }, options) {
    try {
      const result = await new Standalone(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      commit(
        mutationTypes.ELEARNING_SCHOOL_STANDALONE.SET_ELEARNING_SCHOOL_STANDALONE_LIST,
        result.data
      );
    } catch (error) {
      console.log(error);
    }
  },

};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_SCHOOL_STANDALONE.SET_ELEARNING_SCHOOL_STANDALONE_LIST](
    state,
    data
  ) {
    console.log("[SET_ELEARNING_SCHOOL_STANDALONE_LIST]", data)
    state.standaloneSchools = data;
  },

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
