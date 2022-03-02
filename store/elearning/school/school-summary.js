import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import Summary from "~/services/elearning/school/Summary";

/**
 * initial state
 */
const state = () => ({
  elearningSchoolSummary: {}
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_SCHOOL_SUMMARY.LIST]({ commit }, options) {
    try {
      const result = await new Summary(this.$axios)[actionTypes.BASE.LIST](options);
      commit(
        mutationTypes.ELEARNING_SCHOOL_SUMMARY
          .SET_ELEARNING_SCHOOL_SUMMARY_LIST,
        result.data
      );
    } catch (error) {
      console.log(error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_SCHOOL_SUMMARY.SET_ELEARNING_SCHOOL_SUMMARY_LIST](
    state,
    data
  ) {
    state.elearningSchoolSummary = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
