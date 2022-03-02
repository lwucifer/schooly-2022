import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Vote from "~/services/elearning/public/Vote";

/**
 * initial state
 */
const state = () => ({
  votes: null
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_PUBLIC_VOTE.LIST]({ commit }, options) {
    try {
      const result = await new Vote(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      commit(
        mutationTypes.ELEARNING_PUBLIC_VOTE.SET_ELEARNING_PUBLIC_VOTE_LIST,
        result.data
      );
    } catch (error) {
      console.log("[Elearning] info.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_PUBLIC_VOTE.SET_ELEARNING_PUBLIC_VOTE_LIST](
    state,
    votes
  ) {
    state.votes = votes;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
