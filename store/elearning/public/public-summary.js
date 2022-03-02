import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";
import Summary from "~/services/elearning/public/Summary";
import { get } from "lodash";

/**
 * initial state
 */
const state = () => ({
  elearnings: null,
  statistic: null
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_PUBLIC_SUMMARY.LIST]({ commit }, params) {
    try {
      const options = { params };
      const result = await new Summary(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      // set to mutation
      commit(
        mutationTypes.ELEARNING_PUBLIC_SUMMARY
          .SET_ELEARNING_PUBLIC_SUMMARY_LIST,
        result
      );
    } catch (error) {
      commit(
        mutationTypes.ELEARNING_PUBLIC_SUMMARY
          .SET_ELEARNING_PUBLIC_SUMMARY_LIST,
        null
      );
      console.log("[Elearning Summary] list.error", error);
    }
  },

  async [actionTypes.ELEARNING_PUBLIC_SUMMARY.STATISTIC]({ commit }, params) {
    try {
      const { data } = await this.$axios.get(APIs.ELEARNING_PUBLIC_STATISTIC, {
        params
      });
      // set to mutation
      commit(
        mutationTypes.ELEARNING_PUBLIC_SUMMARY
          .SET_ELEARNING_PUBLIC_SUMMARY_STATISTIC,
        data.data
      );
    } catch (error) {
      commit(
        mutationTypes.ELEARNING_PUBLIC_SUMMARY
          .SET_ELEARNING_PUBLIC_SUMMARY_STATISTIC,
        null
      );
      console.log("[ELEARNING_PUBLIC_SUMMARY.STATISTIC] list.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_PUBLIC_SUMMARY.SET_ELEARNING_PUBLIC_SUMMARY_LIST](
    state,
    elearnings
  ) {
    state.elearnings = get(elearnings, "data", null);
  },
  [mutationTypes.ELEARNING_PUBLIC_SUMMARY
    .SET_ELEARNING_PUBLIC_SUMMARY_STATISTIC](state, _data) {
    state.statistic = _data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
