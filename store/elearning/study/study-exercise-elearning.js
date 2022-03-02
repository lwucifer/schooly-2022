import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { RESPONSE_SUCCESS } from "~/utils/config";
import ExerciseElearning from "~/services/elearning/study/ExerciseElearning";
import { get } from "lodash";

/**
 * initial state
 */
const state = () => ({
  exerciseElearnings: {},
});

/**
 * initial getters
 */
const getters = {
  //
};

const actions = {
  /**
   * Get elearnings that have exercise/test of student
   *
   */
  async [actionTypes.ELEARNING_STUDY_EXERCISE_ELEARNING.LIST](
    { commit },
    payload
  ) {
    try {
      const result = await new ExerciseElearning(this.$axios)[
        actionTypes.BASE.LIST
        ](payload);
      if (result.success == RESPONSE_SUCCESS) {
        commit(
          mutationTypes.ELEARNING_STUDY_EXERCISE_ELEARNING
            .SET_ELEARNING_STUDY_EXERCISE_ELEARNING_LIST,
          result.data
        );
      }
    } catch (error) {
      console.log(
        "[Elearning ELEARNING_STUDY_EXERCISE_ELEARNING] LIST_ELEARNING.error",
        error
      );
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_STUDY_EXERCISE_ELEARNING.SET_ELEARNING_STUDY_EXERCISE_ELEARNING_LIST](state, data) {
    console.log("SET_ELEARNING_EXERCISE_ELEARNING_LIST", data);
    state.exerciseElearnings = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
