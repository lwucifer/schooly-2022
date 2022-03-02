import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import ForYou from "~/services/elearning/public/ForYou";

/**
 * initial state
 */
const state = () => ({
  forYou: {},
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_PUBLIC_FOR_YOU.LIST]({ commit }, params) {
    try {
      const result = await new ForYou(this.$axios)[actionTypes.BASE.LIST](
        params
      );

      commit(
        mutationTypes.ELEARNING_PUBLIC_FOR_YOU.SET_FOR_YOU,
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
  [mutationTypes.ELEARNING_PUBLIC_FOR_YOU.SET_FOR_YOU](state, forYou) {
    state.forYou = forYou;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
