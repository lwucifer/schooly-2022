import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import VotedSubjects from "~/services/elearning/public/VotedSubjects";

/**
 * initial state
 */
const state = () => ({
  votedSubjects: {},
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_PUBLIC_VOTED_SUBJECTS.LIST]({ commit }, params) {
    try {
      const result = await new VotedSubjects(this.$axios)[actionTypes.BASE.LIST](
        params
      );

      commit(
        mutationTypes.ELEARNING_PUBLIC_VOTED_SUBJECTS.SET_VOTED_SUBJECTS,
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
  [mutationTypes.ELEARNING_PUBLIC_VOTED_SUBJECTS.SET_VOTED_SUBJECTS](state, votedSubjects) {
    state.votedSubjects = votedSubjects;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
