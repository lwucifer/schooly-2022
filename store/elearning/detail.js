import * as Service from "~/services/elearning/Detail";
import { get } from "lodash";
import VoteService from "~/services/elearning/public/Vote.js";

/**
 * initial state
 */
const state = () => ({
  info: null,
  lectures_of_teacher: null,
  lectures_related: null,
  teacher: null,
  program: null,
  reviews: null,
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async getReviews({ commit }, options) {
    try {
      const res = await new VoteService(this.$axios)["list"](options);
      if (get(res, "success", false)) {
        commit("reviews", res.data);
        return;
      }
      commit("reviews", null);
    } catch (error) {
      commit("reviews", null);
    }
  },

  async getTeacher({ commit, state }, options = {}) {
    if (get(state, "info.teacher.id", "")) {
      const payload = {
        params: {
          teacher_id: get(state, "info.teacher.id", ""),
        },
      };
      const res = await Service.getTeacher(this.$axios, payload);
      return commit("teacher", res);
    }
    commit("teacher", null);
  },

  async getProgram({ commit, state }, options = {}) {
    if (get(state, "info.id", "")) {
      const payload = {
        params: {
          elearning_id: get(state, "info.id", ""),
          token: "true",
        },
      };
      const res = await Service.getProgram(this.$axios, payload);
      return commit("program", res);
    }
    commit("program", null);
  },

  async getInfo({ commit, state }, options = {}) {
    const res = await Service.getInfo(this.$axios, options);
    commit("info", res);
  },

  async getLectureOfTeacher({ commit, state }, options = {}) {
    if (get(state, "info.teacher.id", "")) {
      const payload = {
        params: {
          teacher_id: get(state, "info.teacher.id", ""),
        },
      };
      const res = await Service.getLecturesOfTeacher(this.$axios, payload);
      return commit("lectures_of_teacher", res);
    }
    commit("lectures_of_teacher", null);
  },

  async getLecturesRelated({ commit, state }, options = {}) {
    if (get(state, "info.id", "")) {
      const payload = {
        params: {
          elearning_id: get(state, "info.id", ""),
          token: "true",
        },
      };
      const res = await Service.getLecturesRelated(this.$axios, payload);
      return commit("lectures_related", res);
    }
    commit("lectures_related", null);
  },
};

/**
 * initial mutations
 */
const mutations = {
  reviews(state, data) {
    state.reviews = data;
  },

  teacher(state, data) {
    state.teacher = data;
  },

  program(state, data) {
    state.program = data;
  },

  info(state, data) {
    state.info = data;
  },

  lectures_of_teacher(state, data) {
    state.lectures_of_teacher = data;
  },

  lectures_related(state, data) {
    state.lectures_related = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
