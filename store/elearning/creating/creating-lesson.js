import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Lesson from "~/services/elearning/creating/Lesson";

/**
 * initial state
 */
const state = () => ({
  lessons: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_CREATING_LESSONS.LIST]({ commit }, options) {
    try {
      const result = await new Lesson(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      commit(
        mutationTypes.ELEARNING_CREATING_LESSONS
          .SET_ELEARNING_CREATING_LESSONS_LIST,
        result.data
      );
      return result;
    } catch (error) {
      console.log("[Creating Lesson] list.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_LESSONS.DETAIL]({ commit }, lesson_id) {
    try {
      const result = await new Lesson(this.$axios)[actionTypes.BASE.DETAIL](
        lesson_id
      );
      return result;
    } catch (error) {
      //
    }
    return null;
  },

  async [actionTypes.ELEARNING_CREATING_LESSONS.ADD]({ commit }, payload) {
    try {
      const result = await new Lesson(this.$axios)["postWithFormData"](payload);
      return result;
      // set to mutation
      // commit(mutationTypes.CREATING_ANSWER.SET_CREATING_ANSWER_ADD, result);
    } catch (error) {
      console.log("[Creating Lesson] add.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_LESSONS.EDIT]({ commit }, payload) {
    try {
      const result = await new Lesson(this.$axios)[actionTypes.BASE.EDIT](
        payload
      );
      // set to mutation
      // commit(mutationTypes.CREATING_ANSWER.SET_CREATING_ANSWER_EDIT, result);
    } catch (error) {
      console.log("[Creating Lesson] edit.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_LESSONS.DELETE]({ commit }, options) {
    try {
      const result = await new Lesson(this.$axios)["deleteLesson"](options);
      return result;
    } catch (error) {
      console.log("[Creating Lesson] delete.error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_CREATING_LESSONS
    .SET_ELEARNING_CREATING_LESSONS_LIST](state, lessons) {
    console.log("SET_ELEARNING_CREATING_LESSONS_LIST");
    state.lessons = lessons;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
