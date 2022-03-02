import { get } from "lodash";
import {
  ELEARNING_PUBLIC_VOTED_SUBJECTS,
  STUDY_EXAMS,
  COMMON_GRADES,
} from "~/utils/endpoints";

/**
 * initial state
 */
const state = () => ({
  exams: null,
  public_vote_subjects: null,
  grades: null,
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async getGrades({ commit }, params) {
    try {
      const res = await this.$axios({
        url: COMMON_GRADES,
        method: "GET",
        params,
      });
      if (get(res, "data.success", false)) {
        commit("grades", res.data.data);
        return;
      }
      commit("grades", null);
    } catch (error) {
      commit("grades", null);
    }
  },

  async getPublicVoteSubjects({ commit }, params) {
    try {
      const res = await this.$axios({
        url: ELEARNING_PUBLIC_VOTED_SUBJECTS,
        method: "GET",
        params,
      });
      if (get(res, "data.success", false)) {
        commit("public_vote_subjects", res.data.data);
        return;
      }
      commit("public_vote_subjects", null);
    } catch (error) {
      commit("public_vote_subjects", null);
    }
  },

  async getExams({ commit }, params) {
    try {
      const res = await this.$axios({
        url: STUDY_EXAMS,
        method: "GET",
        params,
      });
      if (get(res, "data.success", false)) {
        commit("exams", res.data.data);
        return;
      }
      commit("exams", null);
    } catch (error) {
      commit("exams", null);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  grades(state, data) {
    state.grades = data;
  },
  public_vote_subjects(state, data) {
    state.public_vote_subjects = data;
  },
  exams(state, data) {
    state.exams = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
