import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Subject from "~/services/elearning/public/Subject";
import { allOptionSelect } from "~/utils/common";

/**
 * initial state
 */
const state = () => ({
  subjects: []
});

/**
 * initial getters
 */
const getters = {
  subjectsAllOpts(state) {
    const tmp = state.subjects ? state.subjects.map((g) => {
      return {
        value: g.id,
        text: g.name,
        type: g.type,
      };
    }) : [];

    // return tmp;
    return allOptionSelect(tmp, 'môn học');
  },
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING.SUBJECT]({ commit }, options) {
    try {
      const result = await new Subject(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      commit(mutationTypes.ELEARNING.SET_ELEARNING_SUBJECT, result.data);
    } catch (error) {
      console.log("[Elearning Subject] list.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING.SET_ELEARNING_SUBJECT](state, subjects) {
    state.subjects = subjects;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
