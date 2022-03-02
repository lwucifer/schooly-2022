import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";
import Participant from "~/services/elearning/teaching/Participant";

/**
 * initial state
 */
const state = () => ({
  participants: [],
  submissionFile: ""
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_TEACHING_EXERCISE_PARTICIPANT.LIST]({ commit }, payload) {
    try {
      const result = await new Participant(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      // set to mutation
      commit(
        mutationTypes.ELEARNING_TEACHING_EXERCISE_PARTICIAPANT.SET_TEACHING_EXERCISE_PARTICIPANT_LIST,
        result
      );
    } catch (error) {
      console.log("[Teaching exercise participants] list.error", error);
    }
  },
  async [actionTypes.ELEARNING_TEACHING_EXERCISE_PARTICIPANT.SUBMISSION_FILES]({ commit }, id) {
    try {
      const result = await this.$axios.get(
        `${APIs.ELEARNING_TEACHING_SUBMISSIONS_EXPORT}/${id}`,
        { responseType: "arraybuffer" }
      );
      // set to mutation
      commit(
        mutationTypes.ELEARNING_TEACHING_EXERCISE_PARTICIAPANT.SET_TEACHIHG_SUBMISSIONS_EXPORT_FILE,
        result.data
      );
      return result;
    } catch (error) {
      console.log("[Teaching exercise participants] list.error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_TEACHING_EXERCISE_PARTICIAPANT.SET_TEACHING_EXERCISE_PARTICIPANT_LIST](state, data) {
    console.log("SET_ELEARNING_TEACHING_EXERCISE_PARTICIPANT_LIST", data);
    state.participants = data;
  },
  [mutationTypes.ELEARNING_TEACHING_EXERCISE_PARTICIAPANT.SET_TEACHIHG_SUBMISSIONS_EXPORT_FILE](state, data) {
    state.submissionFile = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
