import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Chapter from "~/services/elearning/creating/Chapter";

/**
 * initial state
 */
const state = () => ({
  chapters: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_CREATING_CHAPTER.LIST]({ commit }, options) {
    commit(
      mutationTypes.ELEARNING_CREATING_CHAPTER
        .SET_ELEARNING_CREATING_CHAPTER_LIST,
      []
    );
    try {
      const result = await new Chapter(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      commit(
        mutationTypes.ELEARNING_CREATING_CHAPTER
          .SET_ELEARNING_CREATING_CHAPTER_LIST,
        result
      );
    } catch (error) {
      console.log("[Creating chapters] list.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_CHAPTER.ADD]({ commit }, payload) {
    try {
      const result = await new Chapter(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      return result;
    } catch (error) {
      console.log("[Creating chapters] add.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_CHAPTER.EDIT]({ commit }, payload) {
    try {
      const result = await new Chapter(this.$axios)[actionTypes.BASE.EDIT_PAYLOAD](
        payload
      );
        return result;
      // set to mutation
      // commit(mutationTypes.CREATING_ANSWER.SET_CREATING_ANSWER_EDIT, result);
    } catch (error) {
      console.log("[Creating chapters] edit.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_CHAPTER.DELETE]({ commit }, options) {
    try {
      const result = await new Chapter(this.$axios)[
        actionTypes.BASE.DELETE_PAYLOAD
      ](options);
      return result;
    } catch (error) {
      console.log("[Creating chapters] delete.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_CREATING_CHAPTER
    .SET_ELEARNING_CREATING_CHAPTER_LIST](state, chapters) {
    state.chapters = chapters;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
