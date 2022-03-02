import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";
import StudentPrivate from "~/services/elearning/teaching/StudentPrivate";
import { RESPONSE_SUCCESS } from "~/utils/config";

/**
 * initial state
 */
const state = () => ({
  studentPrivates: [],
  studentExport: {}
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.TEACHING_STUDENTS_PRIVATE.LIST]({ commit }, payload) {
    try {
      const result = await new StudentPrivate(this.$axios)[
        actionTypes.BASE.LIST
      ](payload);
      console.log("StudentPrivate", result);
      // set to mutation
      commit(
        mutationTypes.TEACHING_STUDENTS_PRIVATE.SET_TEACHING_STUDENTS_LIST,
        result.data
      );
      return result;
    } catch (error) {
      console.log("[Request] list.error", error);
    }
  },

  async [actionTypes.TEACHING_STUDENTS_PRIVATE.EXPORT]({ commit }, payload) {
    try {
      const { data } = await this.$axios.post(
        APIs.TEACHING_STUDENT_EXPORT,
        payload,
        { responseType: "arraybuffer" }
      );
      console.log("[TEACHING_STUDENTS_PRIVATE.LIST]", data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(
          mutationTypes.TEACHING_STUDENTS_PRIVATE.SET_TEACHING_STUDENTS_EXPORT,
          data
        );
      }
      return data;
    } catch (error) {
      console.log("[TEACHING_STUDENTS_PRIVATE.LIST] list.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.TEACHING_STUDENTS_PRIVATE.SET_TEACHING_STUDENTS_LIST](
    state,
    data
  ) {
    state.studentPrivates = data;
  },
  [mutationTypes.TEACHING_STUDENTS_PRIVATE.SET_TEACHING_STUDENTS_EXPORT](
    state,
    data
  ) {
    state.studentExport = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
