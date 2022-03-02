import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import HightlightTeachers from "~/services/elearning/public/HighlightTeachers.js";

/**
 * initial state
 */
const state = () => ({
  highlightTeachers: {}
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_PUBLIC_HIGHLIGHT_TEACHERS.LIST]({ commit }, params) {
    try {
      const result = await new HightlightTeachers(this.$axios)[actionTypes.BASE.LIST](
        params
      );

      commit(
        mutationTypes.ELEARNING_PUBLIC_HIGHLIGHT_TEACHERS.SET_HIGHLIGHT_TEACHERS,
        result.data
      );

      return result;
    } catch (error) {
      return error;
    }
  },

};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_PUBLIC_HIGHLIGHT_TEACHERS.SET_HIGHLIGHT_TEACHERS](state, highlightTeachers) {
    state.highlightTeachers = highlightTeachers;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
