import { get } from "lodash";
import StudyGroupMember from '~/services/elearning/student/StudyGroupMember';
import * as actionTypes from "~/utils/action-types";
import { RESPONSE_SUCCESS } from "~/utils/config";
import { COMMON_CLASS, ELEARNING_COMMON_PARTICIPANTS, ELEARNING_COMMON_STUDENTS } from "~/utils/endpoints";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";


/**
 * initial state
 */
const state = () => ({
  memberGroups: null,
  detailMemberGroup: null,
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {

  async [actionTypes.STUDY_GROUP_MEMBER.LIST]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(APIs.ELEARNING_TEACHING_GROUP_MEMBERS, { params: payload });
      console.log("[STUDY_GROUP_MEMBER.LIST]", data.data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.STUDY_GROUP_MEMBER.SET_LIST, data.data);
      }
      return data;
    } catch (error) {
      console.log("[STUDY_GROUP_MEMBER.LIST", error);
    }
  },

  async [actionTypes.STUDY_GROUP_MEMBER.DETAIL]({ commit }, payload) {
    try {
      const result = await new StudyGroupMember(this.$axios)[actionTypes.BASE.DETAIL](
        payload
      );
      console.log("[STUDY_GROUP_MEMBER.DETAIL]", result.data);
      if (result.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.STUDY_GROUP_MEMBER.SET_DETAIL, result.data);
      }
      return result;
    } catch (error) {
      console.log("[STUDY_GROUP_MEMBER.DETAIL] error", error);
    }
  },

  async [actionTypes.STUDY_GROUP_MEMBER.ADD]({ commit }, payload) {
    try {
      const result = await new StudyGroupMember(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      console.log("[STUDY_GROUP_MEMBER.ADD]", result.data);
      return result;
    } catch (error) {
      console.log("[STUDY_GROUP_MEMBER.ADD] error", error);
    }
  },

  async [actionTypes.STUDY_GROUP_MEMBER.EDIT]({ commit }, payload) {
    try {
      const result = await new StudyGroupMember(this.$axios)[actionTypes.BASE.ADD](
        payload.id,
        payload
      );
      console.log("[STUDY_GROUP_MEMBER.EDIT]", result.data);
      return result;
    } catch (error) {
      console.log("[STUDY_GROUP_MEMBER.EDIT] error", error);
    }
  },

  async [actionTypes.STUDY_GROUP_MEMBER.DELETE]({ commit }, payload) {
    try {
      const result = await new StudyGroupMember(this.$axios)[actionTypes.BASE.DELETE_PAYLOAD](
        payload
      );
      console.log("[STUDY_GROUP_MEMBER.DELETE]", result.data);
      return result;
    } catch (error) {
      console.log("[STUDY_GROUP_MEMBER.DELETE] error", error);
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

  [mutationTypes.STUDY_GROUP_MEMBER.SET_LIST](state, data) {
    state.memberGroups = data;
  },

  [mutationTypes.STUDY_GROUP_MEMBER.SET_DETAIL](state, data) {
    state.detailMemberGroup = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
