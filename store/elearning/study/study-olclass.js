import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";

/**
 * initial state
 */
const state = () => ({
  LessonSessions: [],
  OnlineClasses: [],
  Session: {},
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.STUDY_ELEARNING_OLCLASSES.LIST](
    { commit },
    options
  ) {
    try {
      const { data } = await this.$axios.get(
        APIs.STUDY_ELEARNING_OLCLASSES,
        options
      );
      commit(
        mutationTypes.STUDY_ELEARNING_OLCLASSES
          .STUDY_ELEARNING_OLCLASSES_LIST,
        data.data
      );
      return data;
    } catch (error) {
      console.log(
        "[STUDY_ELEARNING_OLCLASSES_LIST] list.error",
        error
      );
    }
  },

  async [actionTypes.STUDY_OLCLASS_SESSION.INFO](
    { commit },
    id
  ) {
    try {
      const { data } = await this.$axios.get(
        `${APIs.STUDY_OLCLASS_SESSION}/${id}/session`
      );
      commit(
        mutationTypes.STUDY_OLCLASS_SESSION
          .STUDY_OLCLASS_SESSION_INFO,
        data.data
      );
      return data;
    } catch (error) {
      console.log(
        "[STUDY_ELEARNING_OLCLASSES_LIST] list.error",
        error
      );
    }
  },
  
  async [actionTypes.ELEARNING_STUDY_OLCLASS_LESSON_SESSIONS.LIST](
    { commit },
    options
  ) {
    try {
      const { data } = await this.$axios.get(
        APIs.STUDY_OLCLASS_LESSON_SESSIONS,
        options
      );
      commit(
        mutationTypes.ELEARNING_STUDY_OLCLASS_LESSON_SESSIONS
          .SET_ELEARNING_STUDY_OLCLASS_LESSON_SESSIONS_LIST,
        data.data
      );
      return data;
    } catch (error) {
      console.log(
        "[ELEARNING_STUDY_OLCLASS_LESSON_SESSIONS] list.error",
        error
      );
    }
  },

  async [actionTypes.ELEARNING_STUDY_OLCLASS_LESSON_SESSIONS.ATTENDANCE](
    { commit },
    payload
  ) {
    try {
      const { data } = await this.$axios.post(
        APIs.STUDY_OLCLASS_LESSION_ATTENDANCE,
        payload
      );
      console.log("[ATTENDANCE]", data);
      return data;
    } catch (error) {
      console.log(
        "[STUDY_OLCLASS_LESSION_ATTENDANCE] list.error",
        error
      );
    }
  }

};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_STUDY_OLCLASS_LESSON_SESSIONS
    .SET_ELEARNING_STUDY_OLCLASS_LESSON_SESSIONS_LIST](state, _sessions) {
    state.LessonSessions = _sessions;
  },
  
  [mutationTypes.STUDY_OLCLASS_SESSION
    .STUDY_OLCLASS_SESSION_INFO](state, _sessions) {
    state.Session = _sessions;
  },
  
  [mutationTypes.STUDY_ELEARNING_OLCLASSES
    .STUDY_ELEARNING_OLCLASSES_LIST](state, _data) {
    state.OnlineClasses = _data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
