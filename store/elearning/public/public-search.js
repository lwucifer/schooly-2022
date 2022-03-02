import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Search from "~/services/elearning/public/Search";
import Elearning from "~/services/elearning/public/Elearnings";

/**
 * initial state
 */
const state = () => ({
  Lessons: [],
  Elearnings: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_PUBLIC_SEARCH.DETAIL]({ commit }, id) {
    try {
      const result = await new Search(this.$axios)['getIDWithPayload'](
        id.userId, {params: {size: 9999}}
      );
      commit(
        mutationTypes.ELEARNING_PUBLIC_SEARCH
          .SET_ELEARNING_PUBLIC_SEARCH_DETAIL,
        result
      );
      return result;
    } catch (error) {
      //
    }
    return null;
  },
 
  async [actionTypes.ELEARNING_PUBLIC_ELEARNING.LIST]({ commit }, options) {
    try {
      const result = await new Elearning(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      commit(
        mutationTypes.ELEARNING_PUBLIC_ELEARNING
          .SET_PUBLIC_ELEARNING,
        result
      );
      return result;
    } catch (error) {
      //
    }
    return null;
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_PUBLIC_SEARCH
    .SET_ELEARNING_PUBLIC_SEARCH_DETAIL](state, lessons) {
    state.Lessons = lessons;
  },
  [mutationTypes.ELEARNING_PUBLIC_ELEARNING
    .SET_PUBLIC_ELEARNING](state, list) {
    state.Elearnings = list;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
