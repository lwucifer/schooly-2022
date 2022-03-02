import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import TeacherEls from "~/services/elearning/public/TeacherEls";
import { get } from "lodash";

/**
 * initial state
 */
const state = () => ({
  elearnings: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_PUBLIC_TEACHER_ELS.LIST](
    { commit },
    options
  ) {
    try {
      const result = await new TeacherEls(this.$axios)[
        actionTypes.BASE.LIST
      ](options);
      // set to mutation
      commit(
        mutationTypes.ELEARNING_PUBLIC_TEACHER_ELS
          .SET_ELEARNING_PUBLIC_ELEARNING_TEACHER_ELS_LIST,
        result.data
      );
      return result;
    } catch (error) {
      console.log("[Elearning public els] list.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_PUBLIC_TEACHER_ELS
    .SET_ELEARNING_PUBLIC_ELEARNING_TEACHER_ELS_LIST](state, data) {
    state.elearnings = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
