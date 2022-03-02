import Exercises from "~/services/elearning/study/Exercises";
import * as actionTypes from "~/utils/action-types";
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as mutationTypes from "~/utils/mutation-types";

/**
 * initial state
 */
const state = () => ({
  exercises: [],
});

/**
 * initial getters
 */
const getters = {
};

const actions = {
  async [actionTypes.TEACHING_STUDENT_EXERCISES.LIST]({ commit }, payload) {
    try {
      const result = await new Exercises(this.$axios)[
        actionTypes.BASE.LIST
      ](payload);
      if (result.success == RESPONSE_SUCCESS) {
        commit(
          mutationTypes.TEACHING_STUDENT_EXERCISES.SET_TEACHING_STUDENT_EXERCISES_LIST,
          result.data
        );
      }
      return result;
    } catch (error) {
      //
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.TEACHING_STUDENT_EXERCISES.SET_TEACHING_STUDENT_EXERCISES_LIST](
    state,
    _list
  ) {
    state.exercises = _list;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
