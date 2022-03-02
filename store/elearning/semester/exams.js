import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import ManageExam from "~/services/elearning/semester/ManageExam";
import { get } from "lodash";
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as APIs from "~/utils/endpoints";

/**
 * initial state
 */
const state = () => ({
  studyExams: [],
  detailExam: null,
  studentJoins: null
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
  async [actionTypes.STUDY_EXAM.LIST]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(`${APIs.STUDY_EXAMS}`, {
        params: payload
      });
      console.log("[STUDY_EXAM.LIST]", data.data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.STUDY_EXAM.SET_LIST, data.data);
      }
      return data;
    } catch (error) {
      console.log("[STUDY_EXAM.LIST] error", error);
    }
  },

  async [actionTypes.STUDY_EXAM.DETAIL]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(
        `${APIs.STUDY_EXAMS}/${payload.exam_id}`
      );
      console.log("[STUDY_EXAM.DETAIL]", data.data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.STUDY_EXAM.SET_DETAIL, data.data);
      }
      return data;
    } catch (error) {
      console.log("[STUDY_EXAM.DETAIL] error", error);
    }
  },

  async [actionTypes.STUDY_EXAM.JOIN]({ commit }, payload) {
    try {
      const { data } = await this.$axios.post(`${APIs.STUDY_EXAMS}`, payload);
      console.log("[STUDY_EXAM.DETAIL]", data.data);
      return data;
    } catch (error) {
      console.log("[STUDY_EXAM.DETAIL] error", error);
    }
  },

  async [actionTypes.STUDY_EXAM.LIKE]({ commit }, payload) {
    try {
      const { data } = await this.$axios.post(`${APIs.STUDY_EXAM_LIKE}`, payload);
      console.log("[STUDY_EXAM.LIKE]", data.data);
      return data;
    } catch (error) {
      console.log("[STUDY_EXAM.LIKE] error", error);
    }
  },

  async [actionTypes.SEMESTER.GET_STUDENT_JOIN]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(
        `${APIs.SETTING_EXAMS_JOIN}/${payload.exam_id}`
      );
      console.log("[SEMESTER.GET_STUDENT_JOIN]", data.data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.SEMESTER.SET_STUDENT_JOIN, data.data);
      }
      return data;
    } catch (error) {
      console.log("[SEMESTER.GET_STUDENT_JOIN] error", error);
    }
  }

};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.STUDY_EXAM.SET_LIST](state, _data) {
    state.studyExams = _data;
  },
  [mutationTypes.STUDY_EXAM.SET_DETAIL](state, _data) {
    state.detailExam = _data;
  },

  [mutationTypes.SEMESTER.SET_STUDENT_JOIN](state, _data) {
    state.studentJoins = _data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
