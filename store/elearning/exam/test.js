import { get } from "lodash";
import {
  STUDY_EXAM_TEST,
  STUDY_EXAM_COMMENTS,
  STUDY_EXAM_VOTES,
  STUDY_EXAM_VOTE,
  STUDY_EXAM_TESTS
} from "~/utils/endpoints";

/**
 * initial state
 */
const state = () => ({
  test: null,
  comments: null,
  votes: null,
  test_vote_info: null,
  tests: null,
});

/**
 * initial getters
 */
const getters = {
  examsContent(state) {
    return !state.exams ? [] : state.exams.content;
  },
  examsPagination(state) {
    return !state.exams ? {} : state.exams.page;
  },
};

/**
 * initial actions
 */
const actions = {
  async getTest({ commit }, test_id) {
    try {
      const res = await this.$axios({
        url: `${STUDY_EXAM_TEST}/${test_id}`,
        method: "GET",
      });
      if (get(res, "data.success", false)) {
        commit("test", res.data.data);
        return;
      }
      commit("test", null);
    } catch (error) {
      commit("test", null);
    }
  },

  async getTestVoteInfo({ commit }, params) {
    try {
      const res = await this.$axios({
        url: STUDY_EXAM_VOTE,
        method: "GET",
        params,
      });
      if (get(res, "data.success", false)) {
        commit("test_vote_info", res.data.data);
        return;
      }
      commit("test_vote_info", null);
    } catch (error) {
      console.log(error);
      commit("test_vote_info", null);
    }
  },

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
};

/**
 * initial mutations
 */
const mutations = {
  test(state, data) {
    state.test = data;
  },
  comments(state, data) {
    state.comments = data;
  },
  test_vote_info(state, data) {
    state.test_vote_info = data;
  },
  votes(state, data) {
    state.votes = data;
  },
  tests(state, data) {
    state.tests = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
