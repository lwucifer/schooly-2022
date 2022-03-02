import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";
import { Exercise } from "~/services/elearning/creating/Exercise";

/**
 * initial state
 */
const state = () => ({
  excercises: [],
  exercise: {}, // current exercise detail that is being editted
  currentElearningForCreating: {}
});

/**
 * initial getters
 */
const getters = {
  exerciseDetail: (state) => {
    return state.exercise && state.exercise.data ? state.exercise.data : {};
  }
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_CREATING_EXERCISES.LIST]({ commit }, payload) {
    try {
      console.log('payload', payload)
      const result = await new Exercise(this.$axios)[actionTypes.BASE.LIST](
        { params: payload }
      );
      commit(
        mutationTypes.ELEARNING_CREATING_EXERCISES
          .SET_ELEARNING_CREATING_EXERCISES_LIST,
        result.data
      );
      return result;
    } catch (error) {
      console.log("[Creating exercises] list.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_EXERCISES.ADD]({ commit }, payload) {
    try {
      const result = await new Exercise(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      return result;
    } catch (error) {
      console.log("[Creating exercises] add.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_EXERCISES.EDIT]({ commit }, payload) {
    try {
      const result = await new Exercise(this.$axios)[actionTypes.BASE.EDIT](
        payload
      );
      // set to mutation
      // commit(mutationTypes.CREATING_ANSWER.SET_CREATING_ANSWER_EDIT, result);
    } catch (error) {
      console.log("[Creating exercises] edit.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_EXERCISES.EDIT_PAYLOAD]({ commit }, payload) {
    try {
      const result = await new Exercise(this.$axios)[actionTypes.BASE.EDIT_PAYLOAD](
        payload
      );
      // set to mutation
      // commit(mutationTypes.CREATING_ANSWER.SET_CREATING_ANSWER_EDIT, result);
      return result
    } catch (error) {
      console.log("[Creating exercises] edit.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_EXERCISES.DELETE_PAYLOAD](
    { commit },
    payload
  ) {
    try {
      const result = await new Exercise(this.$axios)[actionTypes.BASE.DELETE_PAYLOAD](
        payload
      );
      return result;
      // set to mutation
      // commit(mutationTypes.CREATING_ANSWER.SET_CREATING_ANSWER_DELETE, result);
    } catch (error) {
      console.log("[Creating exercises] delete.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_EXERCISES.DELETE](
    { commit },
    payload
  ) {
    try {
      const result = await new Exercise(this.$axios)[actionTypes.BASE.DELETE](
        payload
      );
      return result;
      // set to mutation
      // commit(mutationTypes.CREATING_ANSWER.SET_CREATING_ANSWER_DELETE, result);
    } catch (error) {
      console.log("[Creating exercises] delete.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_EXERCISES.DETAIL](
    { commit },
    id
  ) {
    try {
      const result = await new Exercise(this.$axios)[actionTypes.BASE.DETAIL](
        id
      );
      commit(mutationTypes.ELEARNING_CREATING_EXERCISES.SET_ELEARNING_CREATING_EXERCISES_DETAIL, result);
      return result;
    } catch (error) {
      console.log("[Detail exercises] detail.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_EXERCISES.UPDATE](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.post(`${APIs.ELEARNING_CREATING_EXERCISE}`, payload);
      return result.data;
    } catch (error) {
      console.log("[Update exercises] update.error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_CREATING_EXERCISES
    .SET_ELEARNING_CREATING_EXERCISES_LIST](state, excercises) {
    state.excercises = excercises;
  },
  [mutationTypes.ELEARNING_CREATING_EXERCISES
    .SET_ELEARNING_CREATING_EXERCISES_DETAIL](state, data) {
    state.exercise = data;
  },
  setCurrentElearningForCreating(state, data) {
    state.currentElearningForCreating = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
