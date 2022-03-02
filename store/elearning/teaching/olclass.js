import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import OlClass from "~/services/elearning/teaching/Olclass";
import Invites from "~/services/elearning/teaching/OlclassInvites";
import Block from "~/services/elearning/teaching/OlclassBlock";
import Attendances from "~/services/elearning/teaching/OlclassAttendances";
import BaseLesson from "~/services/elearning/teaching/OlclassLesson";
import BaseOlclass from "~/services/elearning/teaching/OlclassBase";
import Lessons from "~/services/elearning/teaching/OlclassLessons";
import Sessions from "~/services/elearning/teaching/OlclassLessonSessions";
import OlStudents from "~/services/elearning/teaching/OlclassStudents";
import OlSchedules from "~/services/elearning/teaching/OlclassSchedules";
import * as APIs from "~/utils/endpoints";

/**
 * initial state
 */
const state = () => ({
  OnlineClass: [],
  OnlineClassInfo: {},
  Attendances: [],
  AttendantSummary: [],
  Invites: [],
  Lessons: [],
  LessonInfo: [],
  LessonSessions: [],
  Students: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.TEACHING_OLCLASSES.LIST]({ commit }, options) {
    try {
      const result = await new OlClass(this.$axios)[actionTypes.BASE.LIST](options);
      commit(
        mutationTypes.TEACHING_OLCLASSES.SET_TEACHING_OLCLASS_LIST,
        result
      );
      return result;
    } catch (error) {
      console.log("[TEACHING Olclass] list.error", error);
    }
  },

  async [actionTypes.TEACHING_OLCLASSES.ADD]({ commit }, payload) {
    try {
      const result = await new OlClass(this.$axios)["postWithRawJson"](payload);
      return result;
    } catch (error) {
      console.log("[TEACHING Olclass] add.error", error);
    }
  },

  async [actionTypes.TEACHING_OLCLASSES.EDIT]({ commit }, payload) {
    try {
      const result = await new OlClass(this.$axios)['putWithRawJson'](payload);
      return result;
    } catch (error) {
      console.log("[TEACHING Olclass] edit.error", error);
    }
  },

  async [actionTypes.TEACHING_OLCLASSES.DELETE]({ commit }, payload) {
    try {
      // const result = await new OlClass(this.$axios)["deleteWithRawJson"](options);
      const result = await this.$axios({
        url: `${APIs.TEACHING_OLCLASSES}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });
      return result.data;
    } catch (error) {
      console.log("[TEACHING Olclass] delete.error", error);
    }
  },

  async [actionTypes.TEACHING_OLCLASSES.INFO]({ commit }, id) {
    try {
      const result = await new OlClass(this.$axios)[actionTypes.BASE.DETAIL](
        id
      );
      commit(
        mutationTypes.TEACHING_OLCLASSES
          .SET_TEACHING_OLCLASS_INFO,
        result
      );
      return result;
    } catch (error) {
      console.log("[TEACHING Olclass] list.error", error);
    }
  },

  async [actionTypes.TEACHING_OLCLASS_LESSON_SESSIONS.LIST]({ commit }, options) {
    try {
      const result = await new Sessions(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      commit(
        mutationTypes.TEACHING_OLCLASS_LESSON_SESSIONS.SET_TEACHING_OLCLASS_LESSON_SESSIONS_LIST,
        result
      );
      return result;
    } catch (error) {
      console.log("[TEACHING Olclass] list.error", error);
    }
  },

  // Invites
  async [actionTypes.TEACHING_OLCLASS_INVITES.LIST]({ commit }, options) {
    try {
      const result = await new Invites(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      commit(
        mutationTypes.TEACHING_OLCLASS_INVITES
          .SET_TEACHING_OLCLASS_INVITES_LIST,
        result
      );
      return result;
    } catch (error) {
      console.log("[TEACHING Olclass] list.error", error);
    }
  },

  async [actionTypes.TEACHING_OLCLASS_INVITES.ADD]({ commit }, options) {
    try {
      const result = await new Invites(this.$axios)['postWithRawJson'](
        options
      );
      return result;
    } catch (error) {
      console.log("[TEACHING Olclass] list.error", error);
    }
  },

  async [actionTypes.TEACHING_OLCLASSES.BLOCK]({ commit }, options) {
    try {
      const result = await new Block(this.$axios)['postWithRawJson'](
        options
      );
      return result;
    } catch (error) {
      console.log("[TEACHING Olclass] list.error", error);
    }
  },

  async [actionTypes.TEACHING_OLCLASSES.UNBLOCK]({ commit }, options) {
    try {
      const result = await new Block(this.$axios)[actionTypes.BASE.DELETE_PAYLOAD](
        options
      );
      return result;
    } catch (error) {
      console.log("[TEACHING Olclass] list.error", error);
    }
  },

  // Lesson
  async [actionTypes.TEACHING_OLCLASS_LESSONS.LIST]({ commit }, options) {
    try {
      const result = await new Lessons(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      commit(
        mutationTypes.TEACHING_OLCLASS_LESSONS
          .SET_TEACHING_OLCLASS_LESSONS_LIST,
        result
      );
      return result;
    } catch (error) {
      console.log("[TEACHING Olclass] list.error", error);
    }
  },

  async [actionTypes.TEACHING_OLCLASS_LESSONS.INFO]({ commit }, id) {
    try {
      const result = await new BaseLesson(this.$axios)[actionTypes.BASE.DETAIL](
        id
      );
      commit(
        mutationTypes.TEACHING_OLCLASS_LESSONS
          .SET_TEACHING_OLCLASS_LESSON_INFO,
        result
      );
      return result;
    } catch (error) {
      console.log("[TEACHING Olclass] list.error", error);
    }
  },
  // ATTENDANCES
  async [actionTypes.TEACHING_OLCLASS_LESSON_ATTENDANCES.LIST]({ commit }, options) {
    try {
      const result = await new BaseLesson(this.$axios)["getWithMiddleID"](
        options, options.id, options.after
      );
      commit(
        mutationTypes.TEACHING_OLCLASS_LESSON_ATTENDANCES
          .SET_TEACHING_OLCLASS_LESSON_ATTENDANCES_LIST,
        result
      );
      return result;
    } catch (error) {
      console.log("[TEACHING Olclass] list.error", error);
    }
  },

  async [actionTypes.TEACHING_OLCLASS_LESSON_ATTENDANCES.EDIT]({ commit }, options) {
    try {
      const result = await new Attendances(this.$axios)['putWithRawJson'](
        options
      );
      return result;
    } catch (error) {
      console.log("[TEACHING Olclass] list.error", error);
    }
  },

  async [actionTypes.TEACHING_OLCLASS_LESSON_ATTENDANCES.SUMMARY]({ commit }, options) {
    try {
      const result = await new BaseOlclass(this.$axios)["getWithMiddleID"](
        options, options.id, options.after
      );
      commit(
        mutationTypes.TEACHING_OLCLASS_LESSON_ATTENDANCES
          .SET_TEACHING_OLCLASS_LESSON_ATTENDANCES_SUMMARY,
        result
      );
      return result;
    } catch (error) {
      console.log("[TEACHING Olclass] list.error", error);
    }
  },

  // Lesson sessions
  async [actionTypes.TEACHING_OLCLASS_LESSON_SESSIONS.LIST]({ commit }, options) {
    try {
      const result = await new Sessions(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      commit(
        mutationTypes.TEACHING_OLCLASS_LESSON_SESSIONS
          .SET_TEACHING_OLCLASS_LESSON_SESSIONS_LIST,
        result
      );
      return result;
    } catch (error) {
      console.log("[TEACHING Olclass] list.error", error);
    }
  },

  // Students
  async [actionTypes.TEACHING_OLCLASS_STUDENTS.LIST]({ commit }, options) {
    try {
      const result = await new OlStudents(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      commit(
        mutationTypes.TEACHING_OLCLASS_STUDENTS
          .SET_TEACHING_OLCLASS_STUDENTS_LIST,
        result
      );
      return result;
    } catch (error) {
      console.log("[TEACHING Students] list.error", error);
    }
  },

  // Schedules
  async [actionTypes.TEACHING_SCHEDULES.DELETE]({ commit }, payload) {
    try {
      // const result = await new OlSchedules(this.$axios)["deleteWithRawJson"](options);
      const result = await this.$axios({
        url: `${APIs.TEACHING_SCHEDULES}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });
      return result.data;
    } catch (error) {
      console.log("[TEACHING schedules] delete.error", error);
    }
  },

};


/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.TEACHING_OLCLASSES.SET_TEACHING_OLCLASS_LIST](state, _OnlineClass) {
    state.OnlineClass = _OnlineClass;
  },
  [mutationTypes.TEACHING_OLCLASSES.SET_TEACHING_OLCLASS_INFO](state, _OnlineClass) {
    state.OnlineClassInfo = _OnlineClass;
  },
  [mutationTypes.TEACHING_OLCLASS_INVITES.SET_TEACHING_OLCLASS_INVITES_LIST](state, _Invites) {
    state.Invites = _Invites;
  },
  [mutationTypes.TEACHING_OLCLASS_LESSON_ATTENDANCES.SET_TEACHING_OLCLASS_LESSON_ATTENDANCES_LIST](state, _Attendances) {
    state.Attendances = _Attendances;
  },
  [mutationTypes.TEACHING_OLCLASS_LESSONS.SET_TEACHING_OLCLASS_LESSONS_LIST](state, _Lessons) {
    state.Lessons = _Lessons;
  },
  [mutationTypes.TEACHING_OLCLASS_LESSON_SESSIONS.SET_TEACHING_OLCLASS_LESSON_SESSIONS_LIST](state, _sessions) {
    state.LessonSessions = _sessions;
  },
  [mutationTypes.TEACHING_OLCLASS_LESSON_ATTENDANCES.SET_TEACHING_OLCLASS_LESSON_ATTENDANCES_SUMMARY](state, _summary) {
    state.AttendantSummary = _summary;
  },
  [mutationTypes.TEACHING_OLCLASS_LESSON_SESSIONS.SET_TEACHING_OLCLASS_LESSON_SESSIONS_LIST](state, _sessions) {
    state.LessonSessions = _sessions;
  },
  [mutationTypes.TEACHING_OLCLASS_LESSONS.SET_TEACHING_OLCLASS_LESSON_INFO](state, _info) {
    state.LessonInfo = _info;
  },
  [mutationTypes.TEACHING_OLCLASS_STUDENTS.SET_TEACHING_OLCLASS_STUDENTS_LIST](state, _list) {
    state.Students = _list;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
