import { get } from "lodash";
import {
  STUDY_EXAM_TESTS,
  STUDY_EXAM_VOTE,
  STUDY_EXAM_VOTES,
  STUDY_EXAM_COMMENTS,
  STUDY_EXAM,
} from "~/utils/endpoints";

/**
 * initial state
 */
const state = () => ({
  exam: null,
  comments: null,
  votes: null,
  exam_vote_info: null,
  tests: null,
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async getTests({ commit }, params) {
    try {
      const res = await this.$axios({
        url: STUDY_EXAM_TESTS,
        method: "GET",
        params,
      });
      if (get(res, "data.success", false)) {
        commit("tests", res.data.data);
        return;
      }
      commit("tests", null);
    } catch (error) {
      commit("tests", null);
    }
  },

  async getExamVoteInfo({ commit }, params) {
    try {
      const res = await this.$axios({
        url: STUDY_EXAM_VOTE,
        method: "GET",
        params,
      });
      if (get(res, "data.success", false)) {
        commit("exam_vote_info", res.data.data);
        return;
      }
      commit("exam_vote_info", null);
    } catch (error) {
      commit("exam_vote_info", null);
    }
  },

  async getVotes({ commit }, params) {
    try {
      const res = await this.$axios({
        url: STUDY_EXAM_VOTES,
        method: "GET",
        params,
      });
      if (get(res, "data.success", false)) {
        commit("votes", res.data.data);
        return;
      }
      commit("votes", null);
    } catch (error) {
      commit("votes", null);
    }
  },

  async getComments({ commit }, params) {
    try {
      const res = await this.$axios({
        url: STUDY_EXAM_COMMENTS,
        method: "GET",
        params,
      });
      if (get(res, "data.success", false)) {
        commit("comments", res.data.data);
        return;
      }
      commit("comments", null);
    } catch (error) {
      commit("comments", null);
    }
  },

  async getExam({ commit }, params) {
    try {
      const res = await this.$axios({
        url: STUDY_EXAM,
        method: "GET",
        params,
      });
      if (get(res, "data.success", false)) {
        commit("exam", res.data.data);
        return;
      }
      commit("exam", null);
    } catch (error) {
      commit("exam", null);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  tests(state, data) {
    state.tests = data;
  },
  exam_vote_info(state, data) {
    state.exam_vote_info = data;
  },
  exam(state, data) {
    state.exam = data;
  },
  comments(state, data) {
    state.comments = data;
  },
  votes(state, data) {
    state.votes = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
