import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Statistic from "~/services/elearning/teaching/Statistic";

/**
 * initial state
 */
const state = () => ({
  teacherStatistic: {},
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.TEACHING_ELEARNING_STATISTIC.LIST]({ commit }) {
    try {
      const result = await new Statistic(this.$axios)[actionTypes.BASE.LIST]();
      // set to mutation
      commit(mutationTypes.TEACHING_ELEARNING_STATISTIC.SET_TEACHING_ELEARNING_STATISTIC, result);
    } catch (error) {
      console.log("[Teaching Statictic] list.error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.TEACHING_ELEARNING_STATISTIC.SET_TEACHING_ELEARNING_STATISTIC](state, data) {
    state.teacherStatistic = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
