import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";
import Elearnings from "~/services/elearning/teaching/Elearnings";
import ElearningHides from "~/services/elearning/teaching/ElearningHides";

/**
 * initial state
 */
const state = () => ({
  elearnings: null,
  elearningsOfTeacher: null
});

/**
 * initial getters
 */
const getters = {
  elearningContent(state){
    return !state.elearnings.data ? [] : state.elearnings.data.content;
  },
  elearningPagination(state){
    return !state.elearnings.data ? {} : state.elearnings.data.page;
  },
  elearningsTeacher(state){
    return !state.elearningsOfTeacher.data ? [] : state.elearningsOfTeacher.data;
  }
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.TEACHING_ELEARNINGS.LIST]({ commit }, payload) {
    try {
      const result = await new Elearnings(this.$axios)["postWithRawJson"](
        payload
      );
      commit(mutationTypes.TEACHING_ELEARNINGS.SET_TEACHING_ELEARNINGS_LIST, result);
      return result;
    } catch (error) {
      console.log("[Teaching elearning] list.error", error);
    }
  },

  async [actionTypes.TEACHING_ELEARNINGS.DELETE]({ commit }, payload) {
    try {
      const result = await new Elearnings(this.$axios)[actionTypes.BASE.DELETE_PAYLOAD2](
        payload
      );
      return result;
    } catch (error) {
      console.log("[TEACHING elearning] list.error", error);
    }
  },

  async [actionTypes.TEACHING_ELEARNINGS.HIDE]({ commit }, payload) {
    try {
      const result = await new ElearningHides(this.$axios)["postWithRawJson"](
        payload
      );
      return result;
    } catch (error) {
      console.log("[Teaching elearning] list.error", error);
    }
  },
  async [actionTypes.TEACHING_ELEARNINGS.OWNER_ELEARNINGS_LIST]({ commit }, payload = {}) {
    try {
      const result = await new this.$axios({
        url: `${APIs.TEACHING_ELEARNINGS_OF_TEACHER}`,
        method: "GET",
        params: payload
      });
      commit(mutationTypes.TEACHING_ELEARNINGS.SET_TEACHING_ELEARNINGS_OF_TEACHER, result.data);
      return result;
    } catch (error) {
      console.log("[Teaching elearning] list.error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.TEACHING_ELEARNINGS.SET_TEACHING_ELEARNINGS_LIST](state, data) {
    console.log("[SET_TEACHING_ELEARNINGS_LIST]", data);
    state.elearnings = {...data};
  },
  [mutationTypes.TEACHING_ELEARNINGS.SET_TEACHING_ELEARNINGS_OF_TEACHER](state, data) {
    console.log("[SET_TEACHING_ELEARNINGS_OF_TEACHER_LIST]", data);
    state.elearningsOfTeacher = {...data};
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
