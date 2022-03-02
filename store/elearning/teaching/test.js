import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Test from "~/services/elearning/teaching/Test";

/**
 * initial state
 */
const state = () => ({
  tests: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_TEACHING_TEST.LIST]({ commit }, payload) {
    try {
      const result = await new Test(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      // set to mutation
      commit(mutationTypes.ELEARNING_TEACHING_TEST.SET_TEACHING_TEST_LIST, result);
    } catch (error) {
      console.log("[Teaching tests] list.error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_TEACHING_TEST.SET_TEACHING_TEST_LIST](state, data) {
    console.log("SET_ELEARNING_TEACHING_TEST_LIST", data);
    state.tests = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
