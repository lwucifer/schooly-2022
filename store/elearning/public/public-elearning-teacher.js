import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import ElearningTeacher from "~/services/elearning/public/ElearningTeacher";
import { get } from "lodash";

/**
 * initial state
 */
const state = () => ({
  teacher: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_PUBLIC_ELEARNING_TEACHER.LIST](
    { commit },
    options
  ) {
    try {
      const result = await new ElearningTeacher(this.$axios)[
        actionTypes.BASE.LIST
      ](options);
      // set to mutation
      commit(
        mutationTypes.ELEARNING_PUBLIC_ELEARNING_TEACHER
          .SET_ELEARNING_PUBLIC_ELEARNING_TEACHER_LIST,
        result.data
      );
    } catch (error) {
      console.log("[Elearning Summary] list.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_PUBLIC_ELEARNING_TEACHER
    .SET_ELEARNING_PUBLIC_ELEARNING_TEACHER_LIST](state, teacher) {
    state.teacher = teacher;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
