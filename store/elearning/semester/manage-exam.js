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
  listSemester: null,
  detailSemester: null
});

/**
 * initial getters
 */
const getters = {
  semesterContent(state){
    return !state.listSemester ? [] : state.listSemester.content;
  },
  semesterPagination(state){
    return !state.listSemester ? {} : state.listSemester.page;
  }
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.SEMESTER.LIST]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(APIs.MANAGE_EXAMS_LIST, {
        params: payload
      });
      console.log("[SEMESTER.LIST]", data.data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.SEMESTER.SET_LIST, data.data);
      }
      return data;
    } catch (error) {
      console.log("[SEMESTER.LIST] error", error);
    }
  },

  async [actionTypes.SEMESTER.DETAIL]({ commit }, payload) {
    try {
      const result = await new ManageExam(this.$axios)[actionTypes.BASE.LIST](
        {params: payload}
      );
      console.log("[SEMESTER.DETAIL]", result.data);
      if (result.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.SEMESTER.SET_DETAIL, result.data);
      }
      return result;
    } catch (error) {
      console.log("[SEMESTER.DETAIL] error", error);
    }
  },

  async [actionTypes.SEMESTER.ADD]({ commit }, payload) {
    try {
      const result = await new ManageExam(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      console.log("[SEMESTER.ADD]", result.data);
      return result;
    } catch (error) {
      console.log("[SEMESTER.ADD] error", error);
    }
  },

  async [actionTypes.SEMESTER.EDIT]({ commit }, payload) {
    try {
      const result = await new ManageExam(this.$axios)[actionTypes.BASE.EDIT](
        payload
      );
      console.log("[SEMESTER.EDIT]", result.data);
      return result;
    } catch (error) {
      console.log("[SEMESTER.EDIT] error", error);
    }
  },

  async [actionTypes.SEMESTER.DELETE]({ commit }, payload) {
    try {
      const result = await new ManageExam(this.$axios)[actionTypes.BASE.DELETE](
        payload.id
      );
      console.log("[SEMESTER.DELETE]", result.data);
      return result;
    } catch (error) {
      console.log("[SEMESTER.DELETE] error", error);
    }
  },

  async [actionTypes.SEMESTER.PUBLISH]({ commit }, payload) {
    try {
      const result = await this.$axios.post(`${APIs.MANAGE_EXAM_PUBLISH}`, payload);
      console.log("[SEMESTER.PUBLISH]", result);
      return result;
    } catch (error) {
      console.log("[SEMESTER.PUBLISH] error", error);
    }
  },

  async [actionTypes.SEMESTER.ENABLE]({ commit }, payload) {
    try {
      const  result  = await this.$axios.post(`${APIs.MANAGE_EXAM_ENABLE}`, payload);
      console.log("[SEMESTER.ENABLE]", result.data);
      return result.data;
    } catch (error) {
      console.log("[SEMESTER.ENABLE] error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.SEMESTER.SET_LIST](state, _data) {
    state.listSemester = _data;
  },
  [mutationTypes.SEMESTER.SET_DETAIL](state, _data) {
    state.detailSemester = _data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
