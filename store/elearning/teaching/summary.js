import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import TeachingSummary from "~/services/elearning/teaching/Summary";

/**
 * initial state
 */
const state = () => ({
  teachingInfo: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.TEACHING_SUMMARY.INFO]({ commit }, params) {
    try {
      const options = { params };
      const result = await new TeachingSummary(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      // set to mutation
      commit(mutationTypes.TEACHING_SUMMARY.SET_TEACHING_SUMMARY_INFO, result.data);
    } catch (error) {
      console.log("[Teaching Info] info.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.TEACHING_SUMMARY.SET_TEACHING_SUMMARY_INFO](state, _teachingInfo) {
    state.teachingInfo = _teachingInfo;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
