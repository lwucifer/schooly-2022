import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Newest from "~/services/elearning/public/Newest";

/**
 * initial state
 */
const state = () => ({
  newestLecture: {},
  newestCourse: {},
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_PUBLIC_NEWEST.LIST_LECTURE]({ commit }, params) {
    try {
      const result = await new Newest(this.$axios)[actionTypes.BASE.LIST](
        params
      );

      commit(
        mutationTypes.ELEARNING_PUBLIC_NEWEST.SET_NEWEST_LECTURE,
        result.data
      );

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ELEARNING_PUBLIC_NEWEST.LIST_COURSE]({ commit }, params) {
    try {
      const result = await new Newest(this.$axios)[actionTypes.BASE.LIST](
        params
      );

      commit(
        mutationTypes.ELEARNING_PUBLIC_NEWEST.SET_NEWEST_COURSE,
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
  [mutationTypes.ELEARNING_PUBLIC_NEWEST.SET_NEWEST_LECTURE](state, newestLecture) {
    state.newestLecture = newestLecture;
  },
  [mutationTypes.ELEARNING_PUBLIC_NEWEST.SET_NEWEST_COURSE](state, newestCourse) {
    state.newestCourse = newestCourse;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
