import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { get } from "lodash";
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as APIs from "~/utils/endpoints";

/**
 * initial state
 */
const state = () => ({
  studentExams: [],
})

/**
 * initial getters
 */
const getters = {
  myStudentExamsContent(state){
    return !state.studentExams ? [] : state.studentExams.content;
  },
  myStudentExamsPagination(state){
    return !state.studentExams ? {} : state.studentExams.page;
  }
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.STUDENT_EXAMS.LIST]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(`${APIs.STUDY_STUDENT_EXAMS}`, {
        params: payload
      });
      console.log("[STUDY_EXAM.LIST]", data.data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.STUDENT_EXAMS.SET_LIST, data.data);
      }
      return data;
    } catch (error) {
      console.log("[STUDENT_EXAMS.LIST] error", error);
    }
  },

};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.STUDENT_EXAMS.SET_LIST](state, _data) {
    state.studentExams = _data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
