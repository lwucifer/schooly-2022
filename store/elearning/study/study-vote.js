import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import Vote from "~/services/elearning/study/Vote";

/**
 * initial state
 */
const state = () => ({
  elearningStudyVotes: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_STURY_VOTE.LIST]({ commit }, payload) {
    try {
      const result = await new Vote(this.$axios)[actionTypes.BASE.LIST](payload);
      commit(
        mutationTypes.ELEARNING_STUDY_VOTE.SET_ELEARNING_STUDY_VOTE_LIST,
        result
      );
    } catch (error) {
      console.log(error);
    }
  },
  async [actionTypes.ELEARNING_STURY_VOTE.ADD]({ commit }) {
    try {
      const result = await new Vote(this.$axios)[actionTypes.BASE.ADD]();
      commit(
        mutationTypes.ELEARNING_STUDY_VOTE.SET_ELEARNING_STUDY_VOTE_ADD,
        result
      );
    } catch (error) {
      console.log(error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_STUDY_VOTE.SET_ELEARNING_STUDY_VOTE_LIST](
    state,
    elearningStudyVotes
  ) {
    state.elearningStudyVotes = elearningStudyVotes;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
