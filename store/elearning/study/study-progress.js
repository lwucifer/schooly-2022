import ProgressService from "~/services/elearning/study/Progress";
import * as actionTypes from "~/utils/action-types";
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";

/**
 * initial state
 */
const state = () => ({
  progress: null,
  currentSession: null,
  programs: [],
});

/**
 * initial getters
 */
const getters = {
};

const actions = {
  async [actionTypes.ELEARNING_STUDY_PROGRESS.LIST]({ commit }, payload) {
    try {
      const result = await new ProgressService(this.$axios)[
        actionTypes.BASE.LIST
      ](payload);
      if (result.success == RESPONSE_SUCCESS) {
        commit(
          mutationTypes.ELEARNING_STUDY_PROGRESS.SET_STUDY_PROGRESS_LIST,
          result.data
        );
      }
      return result;
    } catch (error) {
      console.log("[ELEARNING_STUDY_PROGRESS.LIST] error", error);
    }
  },

  async [actionTypes.ELEARNING_STUDY_PROGRESS.LIST_PROGRAM]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(APIs.TEACHING_ELEARNING_PROGRAMS, {params: payload});
      if (data.success == RESPONSE_SUCCESS) {
        commit(
          mutationTypes.ELEARNING_STUDY_PROGRESS.SET_STUDY_PROGRESS_PROGRAM_LIST,
          data.data
        );
      }
      return data;
    } catch (error) {
      console.log("[ELEARNING_STUDY_PROGRESS.LIST] error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_STUDY_PROGRESS.SET_STUDY_PROGRESS_LIST](
    state,
    _list
  ) {
    state.progress = _list;
  },

  [mutationTypes.ELEARNING_STUDY_PROGRESS.SET_STUDY_PROGRESS_CURRENT_SESSION](
    state,
    _currSession
  ) {
    console.log("[SET_STUDY_PROGRESS_CURRENT_SESSION]", _currSession);
    state.currentSession = _currSession;
  },

  [mutationTypes.ELEARNING_STUDY_PROGRESS.SET_STUDY_PROGRESS_PROGRAM_LIST](
    state,
    _list
  ) {
    state.programs = _list;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
