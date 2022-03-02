import { get } from "lodash";
import StudyGroup from "~/services/elearning/student/StudyGroup";
import * as actionTypes from "~/utils/action-types";
import { optionSelectSubject, allOptionSelect } from "~/utils/common";
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as APIs from "~/utils/endpoints";
import { COMMON_CLASS, COMMON_CLASS_ASSIGNMENT, TEACHING_OLCLASS_STAFFS, ELEARNING_COMMON_PARTICIPANTS, ELEARNING_COMMON_STUDENTS } from "~/utils/endpoints";
import * as mutationTypes from "~/utils/mutation-types";

/**
 * initial state
 */
const state = () => ({
  groups: [],
  classes: [],
  teacher: [],
  students: [],
  participants: [],
  detailGroup: null,
  groupClasses: null,
});

/**
 * initial getters
 */
const getters = {
  classesOpt(state) {
    return optionSelectSubject(state.classes, "lớp");
  },
  groupsOpt(state) {
    const tmp = state.groups
      ? state.groups.content.map(g => {
          return {
            value: g.id,
            text: g.name,
          };
        })
      : [];

    // return tmp;
    return allOptionSelect(tmp, "nhóm");
  },
  groupClassOpt(state) {
    const tmp = state.groupClasses
      ? state.groupClasses.content.map(g => {
          return {
            value: g.id,
            text: g.name,
          };
        })
      : [];

    // return tmp;
    return allOptionSelect(tmp, "lớp/ nhóm học tập");
  }
};

/**
 * initial actions
 */
const actions = {
  async getParticipants({ commit }, params = {}) {
    try {
      const res = await this.$axios({
        url: ELEARNING_COMMON_PARTICIPANTS,
        method: "GET",
        params
      });
      if (get(res, "data.success", false)) {
        const data = get(res, "data.data", []);
        commit("participants", data);
        return;
      }
      commit("participants", []);
    } catch (error) {
      commit("participants", []);
    }
  },

  async getStudents({ commit }, params = {}) {
    try {
      const res = await this.$axios({
        url: ELEARNING_COMMON_STUDENTS,
        method: "GET",
        params
      });
      if (get(res, "data.success", false)) {
        const data = get(res, "data.data", []);
        commit("students", data);
        return;
      }
      commit("students", []);
    } catch (error) {
      commit("students", []);
    }
  },

  async getClasses({ commit }, params = {}) {
    try {
      const res = await this.$axios({
        url: COMMON_CLASS,
        method: "GET",
        params
      });
      console.log("[getClasses]", res.data);
      if (get(res, "data.success", false)) {
        const data = get(res, "data.data", []);
        commit("classes", data);
        return;
      }
      commit("classes", []);
    } catch (error) {
      commit("classes", []);
    }
  },

  async getClassesAssignment({ commit }, params = {}) {
    try {
      const res = await this.$axios({
        url: COMMON_CLASS_ASSIGNMENT,
        method: "GET",
        params
      });
      console.log("[getClasses]", res.data);
      if (get(res, "data.success", false)) {
        const data = get(res, "data.data", []);
        commit("classes", data);
        return;
      }
      commit("classes", []);
    } catch (error) {
      commit("classes", []);
    }
  },

  async getTeacher({ commit }, params = {}) {
    try {
      const res = await this.$axios({
        url: TEACHING_OLCLASS_STAFFS,
        method: "GET",
        params
      });
      console.log("[getTeacher]", res.data);
      if (get(res, "data.success", false)) {
        const data = get(res, "data.data", []);
        commit("teacher", data);
        return;
      }
      commit("teacher", []);
    } catch (error) {
      commit("teacher", []);
    }
  },

  async [actionTypes.STUDY_GROUP.LIST_GROUP_CLASS]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(APIs.STUDY_GROUP_CLASS, {
        params: payload
      });
      // console.log("[STUDY_GROUP.LIST_GROUP_CLASS]", data.data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.STUDY_GROUP.SET_LIST_GROUP_CLASS, data.data);
      }
      return data;
    } catch (error) {
      console.log("[LIST_GROUP_CLASS] error", error);
    }
  },

  async [actionTypes.STUDY_GROUP.LIST]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(APIs.ELEARNING_TEACHING_GROUPS, {
        params: payload
      });
      console.log("[STUDY_GROUP.LIST]", data.data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.STUDY_GROUP.SET_LIST, data.data);
      }
      return data;
    } catch (error) {
      console.log("[STUDY_GROUP.LIST] error", error);
    }
  },

  async [actionTypes.STUDY_GROUP.DETAIL]({ commit }, payload) {
    try {
      const result = await new StudyGroup(this.$axios)[actionTypes.BASE.DETAIL](
        payload
      );
      console.log("[STUDY_GROUP.DETAIL]", result.data);
      if (result.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.STUDY_GROUP.SET_DETAIL, result.data);
      }
      return result;
    } catch (error) {
      console.log("[STUDY_GROUP.DETAIL] error", error);
    }
  },

  async [actionTypes.STUDY_GROUP.ADD]({ commit }, payload) {
    try {
      const result = await new StudyGroup(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      console.log("[STUDY_GROUP.ADD]", result.data);
      return result;
    } catch (error) {
      console.log("[STUDY_GROUP.ADD] error", error);
    }
  },

  async [actionTypes.STUDY_GROUP.EDIT]({ commit }, payload) {
    try {
      const { data } = await this.$axios.put(
        APIs.ELEARNING_TEACHING_GROUP,
        payload
      );
      console.log("[STUDY_GROUP.EDIT]", data.data);
      return data;
    } catch (error) {
      console.log("[STUDY_GROUP.EDIT] error", error);
    }
  },

  async [actionTypes.STUDY_GROUP.DELETE]({ commit }, payload) {
    try {
      const result = await new StudyGroup(this.$axios)[
        actionTypes.BASE.DELETE_PAYLOAD
      ](payload);
      console.log("[STUDY_GROUP.DELETE]", result.data);
      return result;
    } catch (error) {
      console.log("[STUDY_GROUP.DELETE] error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  participants(state, data) {
    state.participants = data;
  },

  students(state, data) {
    state.students = data;
  },

  classes(state, data) {
    state.classes = data;
  },

  teacher(state, data) {
    state.teacher = data;
  },

  [mutationTypes.STUDY_GROUP.SET_LIST](state, data) {
    state.groups = data;
    console.log('SET_LIST',data)
  },

  [mutationTypes.STUDY_GROUP.SET_LIST_GROUP_CLASS](state, data) {
    console.log("[SET_LIST_GROUP_CLASS]", data);
    state.groupClasses = data;
  },

  [mutationTypes.STUDY_GROUP.SET_DETAIL](state, data) {
    state.detailGroup = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
