import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Answer from "~/services/elearning/creating/Answer";

/**
 * initial state
 */
const state = () => ({
  answers: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_CREATING_ANSWER.LIST]({ commit }, payload) {
    try {
      const result = await new Answer(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      // set to mutation
      commit(mutationTypes.ELEARNING_CREATING_ANSWER.SET_ELEARNING_CREATING_ANSWER_LIST, result);
    } catch (error) {
      console.log("[Creating answers] list.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_ANSWER.ADD]({ commit }, payload) {
    try {
      const result = await new Answer(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      // set to mutation
      // commit(mutationTypes.CREATING_ANSWER.SET_CREATING_ANSWER_ADD, result);
    } catch (error) {
      console.log("[Creating answers] add.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_ANSWER.EDIT]({ commit }, payload) {
    try {
      const result = await new Answer(this.$axios)[actionTypes.BASE.EDIT](
        payload
      );
      // set to mutation
      // commit(mutationTypes.CREATING_ANSWER.SET_CREATING_ANSWER_EDIT, result);
    } catch (error) {
      console.log("[Creating answers] edit.error", error);
    }
  },
  
  async [actionTypes.ELEARNING_CREATING_ANSWER.DELETE]({ commit }, payload) {
    try {
      const result = await new Answer(this.$axios)[actionTypes.BASE.DELETE](
        payload
      );
      // set to mutation
      // commit(mutationTypes.CREATING_ANSWER.SET_CREATING_ANSWER_DELETE, result);
    } catch (error) {
      console.log("[Creating answers] delete.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_CREATING_ANSWER.SET_ELEARNING_CREATING_ANSWER_LIST](state, _answers) {
    console.log("SET_ELEARNING_CREATING_ANSWER_LIST", _answers);
    state.answers = _answers;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
