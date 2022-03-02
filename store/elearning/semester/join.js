import * as actionTypes from "~/utils/action-types";
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as APIs from "~/utils/endpoints";
import * as mutationTypes from "~/utils/mutation-types";

/**
 * initial state
 */
const state = () => ({
  studentJoins: null,
  submission: null
});

/**
 * initial getters
 */
const getters = {
  studentJoinContent(state){
    return !state.studentJoins ? [] : state.studentJoins.content;
  },
  studentJoinPagination(state){
    return !state.studentJoins ? {} : state.studentJoins.page;
  }
};

/**
 * initial actions
 */
const actions = {

  async [actionTypes.ELEARNING_TEACHING_TEST_PARTICIPANTS.LIST]({ commit }, payload) {
    console.log('payload', payload)
    try {
      const { data } = await this.$axios.get(
        `${APIs.TEACHING_TEST_PARTICIPANTS}`, {params: payload}
      );
      console.log("[TEACHING_TEST_PARTICIPANTS.LIST]", data.data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.ELEARNING_TEACHING_TEST_PARTICIPANTS.SET_TEACHING_TEST_PARTICIPANTS, data.data);
      }
      return data;
    } catch (error) {
      console.log("[ELEARNING_TEACHING_TEST_PARTICIPANTS.LIST] error", error);
    }
  },

  async [actionTypes.ELEARNING_TEACHING_TEST_SUBMISSION.LIST]({ commit }, payload) {
    console.log('payload', payload)
    try {
      const { data } = await this.$axios.get(
        `${APIs.TEACHING_TEST_SUBMISSION}`, {params: payload}
      );
      console.log("[ELEARNING_TEACHING_TEST_SUBMISSION.LIST]", data.data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.ELEARNING_TEACHING_TEST_SUBMISSION.SET_TEACHING_TEST_SUBMISSION, data.data);
      }
      return data;
    } catch (error) {
      console.log("[ELEARNING_TEACHING_TEST_SUBMISSION.LIST] error", error);
    }
  }

};

/**
 * initial mutations
 */
const mutations = {

  [mutationTypes.ELEARNING_TEACHING_TEST_PARTICIPANTS.SET_TEACHING_TEST_PARTICIPANTS](state, _data) {
    state.studentJoins = _data;
  },

  [mutationTypes.ELEARNING_TEACHING_TEST_SUBMISSION.SET_TEACHING_TEST_SUBMISSION](state, _data) {
    state.submission = _data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
