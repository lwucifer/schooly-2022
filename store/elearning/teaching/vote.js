import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Vote from "~/services/elearning/teaching/Vote";

/**
 * initial state
 */
const state = () => ({
  votes: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_TEACHING_VOTE.LIST]({ commit }, payload) {
    try {
      const result = await new Vote(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      // set to mutation
      commit(mutationTypes.ELEARNING_TEACHING_VOTE.SET_TEACHING_VOTE_LIST, result);
    } catch (error) {
      console.log("[Teaching votes] list.error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_TEACHING_VOTE.SET_TEACHING_VOTE_LIST](state, votes) {
    console.log("SET_ELEARNING_TEACHING_VOTE_LIST", votes);
    state.votes = votes;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
