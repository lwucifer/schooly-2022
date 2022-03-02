import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import VotedElearning from "~/services/elearning/public/VotedElearning";

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
  async [actionTypes.ELEARNING_PUBLIC_VOTED_ELEARNING.LIST](
    { commit },
    options
  ) {
    try {
      const result = await new VotedElearning(this.$axios)[
        actionTypes.BASE.LIST
      ](options);
      // set to mutation
      commit(
        mutationTypes.ELEARNING_PUBLIC_VOTED_ELEARNING.SET_ELEARNING_PUBLIC_VOTED_ELEARNING_LIST,
        result
      );
    } catch (error) {
      console.log("[Elearning Voted Elearning] list.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_PUBLIC_VOTED_ELEARNING
    .SET_ELEARNING_PUBLIC_VOTED_ELEARNING_LIST](state, data) {
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
