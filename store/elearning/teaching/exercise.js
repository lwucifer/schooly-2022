import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Exercise from "~/services/elearning/teaching/Exercise";
import * as APIs from "~/utils/endpoints";

/**
 * initial state
 */
const state = () => ({
  exercises: [],
  currentExercise: {},
  currentElearningForCreating: {}
});

/**
 * initial getters
 */
const getters = {
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_TEACHING_EXERCISE.LIST]({ commit }, payload) {
    try {
      const result = await new Exercise(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      // set to mutation
      commit(mutationTypes.ELEARNING_TEACHING_EXERCISE.SET_TEACHING_EXERCISE_LIST, result);
    } catch (error) {
      console.log("[Teaching exercises] list.error", error);
    }
  },
  
  async [actionTypes.ELEARNING_TEACHING_EXERCISE.DETAIL]({ commit }, id) {
    try {
      const result = await this.$axios({
        url: `${APIs.ELEARNING_CREATING_EXERCISE}/${id}`,
        method: "GET",
        // params,
      });
      commit(mutationTypes.ELEARNING_TEACHING_EXERCISE.SET_TEACHING_EXERCISE_DETAIL, result.data)
      return result;
    } catch (error) {
      console.log("[Teaching exercise] detail.error", error);
    }
  },
  async [actionTypes.ELEARNING_TEACHING_EXERCISE.DELETE]({ commit }, payload) {
    try {
      const result = await this.$axios({
        url: `${APIs.BANK_EXAM_POST}`,
        method: "DELETE",
        data: payload
      });
      return result.data;
    } catch (error) {
      console.log("[Teaching exercise] detail.error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_TEACHING_EXERCISE.SET_TEACHING_EXERCISE_LIST](state, data) {
    console.log("SET_ELEARNING_TEACHING_EXERCISES_LIST", data);
    state.exercises = data;
  },
  [mutationTypes.ELEARNING_TEACHING_EXERCISE.SET_TEACHING_EXERCISE_DETAIL](state, data) {
    console.log("SET_ELEARNING_TEACHING_EXERCISES_DETAIL", data);
    state.currentExercise = data;
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
