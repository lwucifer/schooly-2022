import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";

/**
 * initial state
 */
const state = () => ({
  Elearnings: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async myElearnings(
    { commit },
    options
  ) {
    try {
      const { data } = await this.$axios.get(
        `elearning/study/elearnings`,
        options
      );
      commit(
        'STUDY_ELEARNINGS_LIST',
        data.data
      );
      console.log(
        "[STUDY_ELEARNINGS_LIST]",
        data
      );
      return data;
    } catch (error) {
      console.log(
        "[STUDY_ELEARNINGS_LIST] list.error",
        error
      );
    }
  }

};

/**
 * initial mutations
 */
const mutations = {
  STUDY_ELEARNINGS_LIST(state, _sessions) {
    state.Elearnings = _sessions;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
