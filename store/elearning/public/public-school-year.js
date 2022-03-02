import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import SchoolYear from "~/services/elearning/public/SchoolYear";
import { get } from "lodash";

/**
 * initial state
 */
const state = () => ({
  years: []
});

/**
 * initial getters
 */
const getters = {
  years(state) {
    return state.years;
  },
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_PUBLIC_SCHOOL_YEAR.LIST]({ commit }, params) {
    try {
      const options = { params };
      const result = await new SchoolYear(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      // set to mutation
      if (result.success) {
        commit(
          mutationTypes.ELEARNING_PUBLIC_SCHOOL_YEAR
            .SET_ELEARNING_PUBLIC_SCHOOL_YEAR_LIST,
          get(result, 'data', [])
        );
        return result
      }
    } catch (error) {
      console.log("[Elearning School Year] list.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_PUBLIC_SCHOOL_YEAR.SET_ELEARNING_PUBLIC_SCHOOL_YEAR_LIST](
    state,
    data
  ) {
    state.years = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
