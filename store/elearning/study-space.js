import { get } from "lodash";
import StudyStudent from "~/services/elearning/study/StudyStudent";
import Statistic from "~/services/elearning/study/Statistic";
import Archive from "~/services/elearning/study/Archive";
import Favourite from "~/services/elearning/study/Favourite";

/**
 * initial state
 */
const state = () => ({
  unfinished_lecture: null,
  finished_lecture: null,
  statistic: null,
  archive: null,
  favourite: null,
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async getFinished({ commit }, options = {}) {
    try {
      const result = await new StudyStudent(this.$axios)["list"](options);
      if (get(result, "success", false)) {
        const data = get(result, "data", null);
        commit("finished_lecture", data);
        return;
      }
      commit("finished_lecture", null);
      return;
    } catch (error) {
      commit("finished_lecture", null);
    }
  },

  async getUnFinished({ commit }, options = {}) {
    try {
      const result = await new StudyStudent(this.$axios)["list"](options);
      if (get(result, "success", false)) {
        const data = get(result, "data", null);
        commit("unfinished_lecture", data);
        return;
      }
      commit("unfinished_lecture", null);
      return;
    } catch (error) {
      commit("unfinished_lecture", null);
    }
  },

  // async getStudying({ commit }, options = {}) {
  //   try {
  //     if (options.params.completed) {
  //       const result = await new StudyStudent(this.$axios)["list"](options);
  //       if (get(result, "success", false)) {
  //         const data = get(result, "data", null);
  //         commit("finished_lecture", data);
  //         return;
  //       }
  //       commit("finished_lecture", null);
  //       return;
  //     }

  //     if (!options.params.completed) {
  //       const result = await new StudyStudent(this.$axios)["list"](options);
  //       if (get(result, "success", false)) {
  //         const data = get(result, "data", null);
  //         commit("unfinished_lecture", data);
  //         return;
  //       }
  //       commit("unfinished_lecture", null);
  //       return;
  //     }
  //   } catch (error) {
  //     commit("finished_lecture", null);
  //     commit("unfinished_lecture", null);
  //   }
  // },

  async getStatistic({ commit }, options = {}) {
    try {
      const result = await new Statistic(this.$axios)["list"](options);
      if (get(result, "success", false)) {
        commit("statistic", get(result, "data", null));
        return;
      }
      commit("statistic", null);
    } catch (error) {
      commit("statistic", null);
    }
  },

  async getArchive({ commit }, options = {}) {
    try {
      const result = await new StudyStudent(this.$axios)["list"](options);
      if (get(result, "success", false)) {
        const data = get(result, "data", null);
        commit("archive", data);
        return;
      }
      commit("archive", null);
      return;
    } catch (error) {
      commit("archive", null);
    }
    // try {
    //   const result = await new Archive(this.$axios)["list"](options);
    //   if (get(result, "success", false)) {
    //     commit("archive", get(result, "data", null));
    //     return;
    //   }
    //   commit("archive", null);
    // } catch (error) {
    //   commit("archive", null);
    // }
  },

  async getFavourite({ commit }, options = {}) {
    try {
      const result = await new Favourite(this.$axios)["list"](options);
      if (get(result, "success", false)) {
        commit("favourite", get(result, "data", null));
        return;
      }
      commit("favourite", null);
    } catch (error) {
      commit("favourite", null);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  finished_lecture(state, data) {
    state.finished_lecture = data;
  },
  unfinished_lecture(state, data) {
    state.unfinished_lecture = data;
  },
  statistic(state, data) {
    state.statistic = data;
  },
  archive(state, data) {
    state.archive = data;
  },
  favourite(state, data) {
    state.favourite = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
